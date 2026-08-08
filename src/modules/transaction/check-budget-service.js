const BudgetQueue = require("@/queues/budget-exceed");
const { prisma } = require("@/shared");

const check_budget_limit = async ({
  userId,
  categoryId,
  date,
}) => {
  console.log("========== BUDGET CHECK ==========");
  console.log("userId:", userId);
  console.log("categoryId:", categoryId);
  console.log("date:", date);

  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  console.log("month:", month);
  console.log("year:", year);

const budgets = await prisma.budget.findMany({
  where: {
    userId,
  },
  include: {
    category: true,
  },
});

console.log(
  "========== ALL USER BUDGETS =========="
);

console.log(
  JSON.stringify(budgets, null, 2)
);

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

console.log("========== MATCHING BUDGET ==========");
console.log(
  JSON.stringify(budget, null, 2)
);

  console.log("budget:", budget);

  if (!budget) {
    console.log("❌ NO BUDGET FOUND");
    return;
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  console.log("startDate:", startDate);
  console.log("endDate:", endDate);

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

  console.log("expense:", expense);

  const spent = Number(expense._sum.amount || 0);
  const limit = Number(budget.amount);

  console.log("💰 LIMIT:", limit);
  console.log("💸 SPENT:", spent);

  if (spent <= limit) {
    console.log("❌ Budget NOT exceeded");
    return;
  }

  console.log("🚨 BUDGET EXCEEDED");

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

  console.log("alreadyNotified:", alreadyNotified);

  if (alreadyNotified) {
    console.log("⚠️ Already notified");
    return;
  }

  const notification = await prisma.notification.create({
    data: {
      userId,
      title: "Budget Exceeded",
      message: `Your ${budget.category.name} budget has been exceeded. Budget: Rs ${limit}, Spent: Rs ${spent}.`,
    },
  });

  console.log("✅ Notification created:", notification);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  console.log("user:", user);

  if (!user) {
    console.log("❌ User not found");
    return;
  }

  const job = await BudgetQueue.add("budget-exceeded", {
    email: user.email,
    name: user.name,
    category: budget.category.name,
    budget: limit,
    spent,
  });

  console.log("✅ BullMQ job added:", job.id);
};

module.exports = {
  check_budget_limit,
};