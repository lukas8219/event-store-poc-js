import { eventTypeFilter, jsonEvent } from "@eventstore/db-client";
import { UUID } from "bson";
import { EventStore } from "../db/eventstore.db.js";
import Mongo from "../db/mongo-client.js";
import { CourseSignup } from "../enums/course-signup-enum.js";
import { CourseRepository } from "../repositories/course-repository.js";

export async function setupSubs() {
  setupCourseSignupRequestSub();
}

const repo = new CourseRepository(Mongo.db("courses"), EventStore);

function setupCourseSignupRequestSub() {
  const subscription = EventStore.subscribeToAll({
    fromPosition: "end",
    filter: eventTypeFilter({
      prefixes: [CourseSignup.REQUEST],
    }),
  });

  subscription.on("data", async (data) => {
    const eventData = data.event?.data as any;

    const model = await repo.getCourseById(new UUID(eventData.courseId));

    if (
      model.enrolledStudents?.length &&
      model.maxEnrollment <= model.enrolledStudents?.length
    ) {
      //emit declined event
      await EventStore.appendToStream(
        `signup-course-${eventData.courseId}-user-${eventData.userId}`,
        jsonEvent({
          type: CourseSignup.DECLINED,
          data: {},
        })
      );
    } else {
      await EventStore.appendToStream(
        `signup-course-${eventData.courseId}-user-${eventData.userId}`,
        jsonEvent({
          type: CourseSignup.ACCEPTED,
          data: {},
        })
      );

      await EventStore.appendToStream(
        `course-${eventData.courseId}`,
        jsonEvent({
          type: "student-enrolled",
          data: {
            userId: eventData.userId,
          },
        })
      );
    }
  });
}
