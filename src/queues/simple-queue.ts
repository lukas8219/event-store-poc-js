import Queue from "bull";

const simpleQueue = new Queue("simple-queue", {
  redis: {
    host: "redis",
    port: 6379,
  },
});

simpleQueue.process((data, done) => {
  console.log(data.data), done();
});

export default simpleQueue;
