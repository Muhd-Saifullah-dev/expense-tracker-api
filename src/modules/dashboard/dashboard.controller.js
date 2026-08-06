const { prisma, responses } = require("@/shared");

const get_dashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const currentDate = new Date();

    const selectedMonth = Number(month) || currentDate.getMonth() + 1;
    const selectedYear = Number(year) || currentDate.getFullYear();

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 1);

    const [
      income,
      expense,
      expenseCategories,
      recentTransactions,
      transactions,
      lastSixMonthsTransactions,
    ] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId,
          type: "INCOME",
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
      }),

      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId,
          type: "EXPENSE",
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
      }),

      prisma.transaction.groupBy({
        by: ["categoryId"],
        where: {
          userId,
          type: "EXPENSE",
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
        take: 5,
      }),

      prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        orderBy: {
          date: "asc",
        },
      }),

      prisma.transaction.findMany({
        where: {
          userId,
          date: {
            gte: new Date(selectedYear, selectedMonth - 6, 1),
            lt: endDate,
          },
        },
        orderBy: {
          date: "asc",
        },
      }),
    ]);

    const totalIncome = Number(income._sum.amount || 0);
    const totalExpense = Number(expense._sum.amount || 0);

    const balance = totalIncome - totalExpense;

    const categoryIds = expenseCategories
      .map((item) => item.categoryId)
      .filter(Boolean);

    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
    });

    const donut = expenseCategories.map((item) => {
      const category = categories.find((c) => c.id === item.categoryId);

      return {
        id: category?.id,
        name: category?.name,
        color: category?.color,
        icon: category?.icon,
        amount: Number(item._sum.amount),
      };
    });

    let runningBalance = 0;

    const balanceTrend = transactions.map((transaction) => {
      if (transaction.type === "INCOME") {
        runningBalance += Number(transaction.amount);
      } else {
        runningBalance -= Number(transaction.amount);
      }

      return {
        label: transaction.date.getDate().toString(),
        value: runningBalance,
      };
    });

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyMap = {};

    lastSixMonthsTransactions.forEach((transaction) => {
      const date = new Date(transaction.date);

      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          month: monthNames[date.getMonth()],
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "INCOME") {
        monthlyMap[key].income += Number(transaction.amount);
      } else {
        monthlyMap[key].expense += Number(transaction.amount);
      }
    });

    const incomeExpenseChart = Object.values(monthlyMap);

    return res.status(200).json(
      responses.ok_response(
        {
          balance: {
            income: totalIncome,
            expense: totalExpense,
            balance,
          },

          incomeExpenseChart,

          balanceTrend,

          expenseCategories: donut,

          recentTransactions,
        },
        "Dashboard fetched successfully.",
      ),
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get_dashboard,
};
