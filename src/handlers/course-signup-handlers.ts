import { EventType, ResolvedEvent } from "@eventstore/db-client";
import { CourseSignup } from "../enums/course-signup-enum";
import { CourseModel } from "../repositories/course-repository";

export function handleCourseSignupEvents(
  event: ResolvedEvent<EventType>,
  model: CourseModel
): CourseModel {
  const eventType = event.event?.type;
  const data = event.event?.data || {};
  return {
    [CourseSignup.ACCEPTED]: handleACCEPTED,
    [CourseSignup.REQUEST]: () => {
      return model;
    },
    [CourseSignup.DECLINED]: () => {
      return model;
    },
    [CourseSignup.CANCELED]: handleCANCELED,
  }[eventType as CourseSignup](model, data);
}

function handleACCEPTED(model: CourseModel, eventData: any): CourseModel {
  return {
    ...model,
    enrolledStudents: [...model.enrolledStudents, eventData.userId],
  };
}
function handleCANCELED(model: CourseModel, eventData: any): CourseModel {
  return {
    ...model,
    enrolledStudents: model.enrolledStudents.filter(
      (id) => id !== eventData.userId
    ),
  };
}
