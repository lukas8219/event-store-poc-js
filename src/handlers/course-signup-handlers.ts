import { EventType, ResolvedEvent } from "@eventstore/db-client";
import { CourseModel } from "../repositories/course-repository.js";

export function handleCourseSignupEvents(
  event: ResolvedEvent<EventType>,
  model: Partial<CourseModel>
): Partial<CourseModel> {
  const eventType = event.event?.type;
  const data = event.event?.data || {};
  return {
    [CourseEvents.STUDENT_ENROLLED]: handleSTUDENT_ENROLLED,
    [CourseEvents.CREATED]: handleCREATED,
    [CourseEvents.STUDENT_DISENROLLED]: handleSTUDENT_DISENROLLED,
  }[eventType as CourseEvents](model, data);
}

export enum CourseEvents {
  STUDENT_ENROLLED = "student-enrolled",
  STUDENT_DISENROLLED = "student-disenrolled",
  CREATED = "course-created",
}

function handleSTUDENT_DISENROLLED(
  model: Partial<CourseModel>,
  eventData: any
): Partial<CourseModel> {
  return {
    ...model,
    enrolledStudents: (model?.enrolledStudents || []).filter(
      (id) => id !== eventData.userId
    ),
  };
}

function handleCREATED(
  model: Partial<CourseModel>,
  eventData: any
): Partial<CourseModel> {
  return {
    ...eventData,
  };
}

function handleSTUDENT_ENROLLED(
  model: Partial<CourseModel>,
  eventData: any
): Partial<CourseModel> {
  return {
    ...model,
    enrolledStudents: [...(model.enrolledStudents || []), eventData.userId],
  };
}
