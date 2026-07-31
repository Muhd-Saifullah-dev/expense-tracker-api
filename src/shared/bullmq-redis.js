const { REDIS_HOST, REDIS_PORT } = require("@/config/env.config");
const Redis = require("ioredis");

const bullmqRedis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,

  // BullMQ recommendation
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

bullmqRedis.on("connect", () => {
  console.log("🚀 BullMQ Redis Connected");
});

bullmqRedis.on("error", (error) => {
  console.error("❌ BullMQ Redis Error:", error.message);
});

module.exports = bullmqRedis;
