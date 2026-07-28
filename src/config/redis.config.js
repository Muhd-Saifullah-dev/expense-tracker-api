const redis = require("@/shared/redis-client");

const connectRedis = async () => {
  try {
    await redis.ping();

    console.log("✅ Redis server is ready");
  } catch (error) {
    console.error("❌ Redis connection failed");
    console.error(error.message);

    process.exit(1);
  }
};

module.exports = {
  connectRedis,
};
