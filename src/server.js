require("module-alias/register");
require("./workers/otp-worker");
require("./workers/welcome-worker");
require("./workers/budget-worker");
const app = require("./app");
const { connectDB, connectRedis } = require("@config/index");

const { PORT } = require("@config/env.config");

(async () => {
  await connectDB();
  await connectRedis();
  app.listen(PORT,"0.0.0.0", () => console.log(`✅ server is running : ${PORT}`));
})();
