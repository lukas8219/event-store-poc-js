import app from "./app.js";
import { setupSubs } from "./subscriptions/course-signup-subscription.js";

try {
  setupSubs();
  app.listen(8001, () => {
    console.log("LISTENING");
  });
} catch (err) {
  console.error("An error occure when trying to append to stream", err);
}
