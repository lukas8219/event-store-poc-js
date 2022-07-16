import { EventStoreDBClient } from "@eventstore/db-client";
import { Db } from "mongodb";
import { handleCourseSignupEvents } from "../handlers/course-signup-handlers";

export interface CourseModel {
  id?: string;
  enrolledStudents: number[];
}

class CourseRepository {
  private readonly COURSE_DASHBOARD_COLLECTION = "courses-dashboard";

  constructor(
    private readonly mongoclient: Db,
    private readonly eventStoreClient: EventStoreDBClient
  ) {}

  async getCourseStatisticsById(id: number) {
    return this.mongoclient
      .collection(this.COURSE_DASHBOARD_COLLECTION)
      .findOne({
        $where: {
          id,
        },
      });
  }

  async saveCourseStatistic(dashboard: any) {
    return this.mongoclient
      .collection(this.COURSE_DASHBOARD_COLLECTION)
      .insertOne(dashboard);
  }

  async getCourseById(id: number): Promise<CourseModel> {
    const eventsStream = this.eventStoreClient.readStream(`course-${id}`);

    let model: CourseModel = {
      enrolledStudents: [],
    };

    for await (const event of eventsStream) {
      model = handleCourseSignupEvents(event, model);
    }

    return model;
  }
}
