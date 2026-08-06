const authenticated = require("./middleware/auth.middleware");
const authRouter = require("./modules/auth/auth.route");
const budgetRouter = require("./modules/budget/budget.routes");
const categoryRoute = require("./modules/category/category.route");
const dashboardRouter = require("./modules/dashboard/dashboard.route");
const transactionRouter = require("./modules/transaction/transaction.route");
const userRouter = require("./modules/users/user.route");

const rootRouter = require("express").Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/user", authenticated, userRouter);
rootRouter.use("/transactions", authenticated, transactionRouter);
rootRouter.use("/categories", authenticated, categoryRoute);
rootRouter.use("/budgets", authenticated, budgetRouter);
rootRouter.use("/dashboard", authenticated, dashboardRouter);
// 404 route
rootRouter.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = rootRouter;
