const express = require("express");
const reqResInspector = require("express-req-res-inspector");

const prismaErrorHandler = require("./middleware/prisma-error-middleware");

const globalErrorMiddleware = require("./middleware/globalErrorMiddleware");
const rootRouter = require("./root.route");
const redis_rate_limit = require("./middleware/redis-rate-limit.middleware");
const app = express();

app.use(express.json());

app.use(reqResInspector());

app.get("/health-check", (req, res) => {
  return res.status(200).json({ success: true, message: "server running up" });
});

app.use(redis_rate_limit(20, 60));
app.use("/api/v1", rootRouter);
app.use(prismaErrorHandler);
app.use(globalErrorMiddleware);

module.exports = app;
