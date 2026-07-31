// queues/welcome.queue.js

const { bullmqRedis } = require("@/shared");
const { Queue } = require("bullmq");

const welcomeQueue = new Queue("welcome-email", {
  connection: bullmqRedis,
});

module.exports = welcomeQueue;
