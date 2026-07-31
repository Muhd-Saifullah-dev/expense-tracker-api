// queues/otp.queue.js

const { bullmqRedis } = require("@/shared");
const { Queue } = require("bullmq");


const otpQueue = new Queue("otp-email", {
  connection:bullmqRedis,
});

module.exports = otpQueue;