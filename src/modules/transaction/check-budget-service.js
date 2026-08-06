

const BudgetQueue = require("@/queues/budget-exceed");
const { prisma } = require("@/shared");

const check_budget_limit = async ({ userId, categoryId, date }) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const budget = await prisma.budget.findFirst({
    where: {
      userId,
      categoryId,
      month,
      year,
    },
    include: {
      category: true,
    },
  });

  if (!budget) return;

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const expense = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      userId,
      categoryId,
      type: "EXPENSE",
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  const spent = Number(expense._sum.amount || 0);
  const limit = Number(budget.amount);

  if (spent <= limit) return;

  // duplicate notification check
  const alreadyNotified = await prisma.notification.findFirst({
    where: {
      userId,
      title: "Budget Exceeded",
      message: {
        contains: budget.category.name,
      },
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  if (alreadyNotified) return;

  // notification
  await prisma.notification.create({
    data: {
      userId,
      title: "Budget Exceeded",
      message: `Your ${budget.category.name} budget has been exceeded. Budget: Rs ${limit}, Spent: Rs ${spent}.`,
    },
  });

  // user email
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return;

  // BullMQ Email Job
  await BudgetQueue.add("budget-exceeded", {
    email: user.email,
    name: user.name,
    category: budget.category.name,
    budget: limit,
    spent,
  });
};

module.exports = {
  check_budget_limit,
};
