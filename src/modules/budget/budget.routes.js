const { create_budget, get_budgets, update_budget, delete_budget, single_budget } = require("./budget.controller");

const budgetRouter = require("express").Router();

budgetRouter.post("/", create_budget);
budgetRouter.get("/", get_budgets);
budgetRouter.patch("/:id", update_budget);
budgetRouter.delete("/:id", delete_budget);
budgetRouter.get("/:id",single_budget)
module.exports = budgetRouter;
