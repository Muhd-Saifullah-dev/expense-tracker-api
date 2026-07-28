const { connectDB } = require("./db.config");
const { connectRedis } = require("./redis.config");
module.exports = {
  connectDB,
  connectRedis,
};
