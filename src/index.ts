import app from "./app.js";
import { setupSubs } from "./subscriptions/course-signup-subscription.js";

const PORT = 8001;

try {
  setupSubs();
  app.listen(PORT, () => {
    console.log("LISTENING", PORT);
  });
} catch (err) {
  console.error("An error occure when trying to append to stream", err);
}
