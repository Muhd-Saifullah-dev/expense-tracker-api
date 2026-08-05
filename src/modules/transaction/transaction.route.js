const {
  create_transaction,
  get_transactions,
  delete_transaction,
  update_transaction,
  get_single_transaction,
} = require("./transaction.controller");

const transactionRouter = require("express").Router();

transactionRouter.post("/", create_transaction);
transactionRouter.get("/", get_transactions);
transactionRouter.delete("/:id", delete_transaction);
transactionRouter.patch("/:id", update_transaction);

transactionRouter.get("/:id",get_single_transaction)
module.exports = transactionRouter;
