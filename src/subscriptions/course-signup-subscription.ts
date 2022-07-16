import { eventTypeFilter } from "@eventstore/db-client";
import { EventStore } from "../db/eventstore.db.js";
import { CourseSignup } from "../enums/course-signup-enum.js";

export async function setupSubs() {
  setupCourseSignupRequestSub();
}

function setupCourseSignupRequestSub() {
  const subscription = EventStore.subscribeToAll({
    fromPosition: "end",
    filter: eventTypeFilter({
      prefixes: [CourseSignup.REQUEST],
    }),
  });

  subscription.on("data", (data) => {
    /*
    Validate if theres room for one more student to signup
    if valid, emit ACCEPTED event
    if invalid emit DECLINED event
    */
  });
}
