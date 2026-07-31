const { REDIS_HOST, REDIS_PORT } = require("@/config/env.config");
const Redis = require("ioredis");

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (error) => {
  console.error("❌ Redis error:", error.message);
});

module.exports = redis;
