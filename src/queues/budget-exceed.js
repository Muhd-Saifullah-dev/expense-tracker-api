const { bullmqRedis } = require("@/shared");
const { Queue } = require("bullmq");


const BudgetQueue = new Queue("budget-exceeded", {
  connection:bullmqRedis,
});

module.exports = BudgetQueue;