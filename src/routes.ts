import { jsonEvent } from "@eventstore/db-client";
import express from "express";
import { EventStore } from "./db/eventstore.db.js";
import { CourseSignup } from "./enums/course-signup-enum.js";
import { once } from "events";

interface SignupRequest {
  courseId: String;
  userId: number;
}

const router = express.Router();

router.post("/api/signup", async (req, res) => {
  const data: SignupRequest = req.body;
  await EventStore.appendToStream(
    `signup-course-user-${data.userId}`,
    jsonEvent({
      type: CourseSignup.REQUEST,
      data: JSON.parse(JSON.stringify(data)),
    }),
    {
      expectedRevision: "no_stream",
    }
  );
  return res.status(201).json(data);
});

router.delete("/api/signup/:id", async (req, res) => {
  const userId = 1;

  await EventStore.appendToStream(
    `signup-course-user-${userId}`,
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
  return res.end();
});

router.get("/api/signup/status/:id", async (req, res) => {
  const events = EventStore.readStream(`signup-course-user-${req.params.id}`, {
    fromRevision: "end",
    maxCount: 1,
    direction: "backwards",
  });

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
