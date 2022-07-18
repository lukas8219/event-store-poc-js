import { EventStoreDBClient, streamNameFilter } from "@eventstore/db-client";
import { Db } from "mongodb";
import { UUID } from "bson";
import { handleCourseSignupEvents } from "../handlers/course-signup-handlers.js";

export interface CourseModel {
  id?: string;
  name: string;
  maxEnrollment: number;
  enrolledStudents: number[];
}

export class CourseRepository {
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

  async getCourseById(id: UUID): Promise<CourseModel> {
    const eventsStream = this.eventStoreClient.readStream(`course-${id}`);

    let model: Partial<CourseModel> = {
      enrolledStudents: [],
    };

    for await (const event of eventsStream) {
      model = handleCourseSignupEvents(event, model);
    }

    return model as CourseModel;
  }
}
