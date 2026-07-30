const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

console.log(process.env.PORT);
module.exports = {
  PORT: process.env.PORT,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  EMAIL: process.env.EMAIL,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};
