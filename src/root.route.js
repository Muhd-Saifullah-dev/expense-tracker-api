const authRouter = require("./modules/auth/auth.route");
const userRouter = require("./modules/users/user.route");

const rootRouter = require("express").Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userRouter);
// 404 route
rootRouter.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = rootRouter;
