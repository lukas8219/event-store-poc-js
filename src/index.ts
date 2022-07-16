import app from "./app.js";

try {
  app.listen(8001, () => {
    console.log("LISTENING");
  });
} catch (err) {
  console.error("An error occure when trying to append to stream", err);
}
