import { jsonEvent } from "@eventstore/db-client";
import express from "express";
import { EventStore } from "./db/eventstore.db.js";
import { CourseSignup } from "./enums/course-signup-enum.js";
import { once } from "events";
import { v4 } from "uuid";
import { CourseRepository } from "./repositories/course-repository.js";
import Mongo from "./db/mongo-client.js";
import { UUID } from "bson";
import { CourseEvents } from "./handlers/course-signup-handlers.js";

interface SignupRequest {
  courseId: String;
  userId: number;
}

const repo = new CourseRepository(Mongo.db("courses"), EventStore);

const router = express.Router();

router.post("/api/signup", async (req, res) => {
  const data: SignupRequest = req.body;
  await EventStore.appendToStream(
    `signup-course-${data.courseId}-user-${data.userId}`,
    jsonEvent({
      type: CourseSignup.REQUEST,
      data: JSON.parse(JSON.stringify(data)),
    })
  );
  return res.status(201).json({
    ...data,
    status: "REQUESTED",
  });
});

router.delete("/api/signup/:id", async (req, res) => {
  const userId = Number(req.query.user);
  await EventStore.appendToStream(
    `signup-course-${req.params.id}-user-${userId}`,
    jsonEvent({
      type: CourseSignup.CANCELED,
      data: {
        courseId: req.params.id,
        userId,
      },
    }),
    {
      expectedRevision: "stream_exists",
    }
  );

  await EventStore.appendToStream(
    `course-${req.params.id}`,
    jsonEvent({
      type: CourseEvents.STUDENT_DISENROLLED,
      data: {
        userId,
      },
    }),
    {
      expectedRevision: "stream_exists",
    }
  );

  return res.end();
});

router.post("/api/course/", async (req, res) => {
  const id = v4();

  await EventStore.appendToStream(
    `course-${id}`,
    jsonEvent({
      type: "course-created",
      data: { id, ...req.body },
    })
  );
  return res.json({
    id,
    ...req.body,
  });
});

router.get("/api/courses/:id", async (req, res) => {
  const id = req.params.id;

  if (!UUID.isValid(req.params.id)) {
    return res.status(500).json({
      error: "invalid id",
    });
  }

  const model = await repo.getCourseById(new UUID(id));

  return res.json(model);
});

router.get("/api/signup/status/:id", async (req, res) => {
  const events = EventStore.readStream(
    `signup-course-${req.params.id}-user-${req.query.user}`,
    {
      fromRevision: "end",
      maxCount: 1,
      direction: "backwards",
    }
  );

  const [data] = await once(events, "data");

  const status = {
    [CourseSignup.REQUEST]: "REQUESTED",
    [CourseSignup.CANCELED]: "CANCELED",
    [CourseSignup.ACCEPTED]: "ACCEPTED",
    [CourseSignup.DECLINED]: "DECLINED",
  }[data.event.type as CourseSignup];

  return res.json({
    status,
    at: data.event.created,
  });
});

router.get("api/signup/dashboard", (req, res) => {
  return res.end();
});

export default router;
