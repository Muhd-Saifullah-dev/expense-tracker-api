const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const now = new Date();

const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

const previousMonth =
  currentMonth === 0 ? 11 : currentMonth - 1;

const previousYear =
  currentMonth === 0
    ? currentYear - 1
    : currentYear;
async function main() {
 

  const categories = await prisma.category.findMany();

 const transactions = [
  // ---------- Current Month ----------
  {
    title: "Salary",
    amount: 80000,
    type: "INCOME",
    note: "Monthly salary",
    date: new Date(currentYear, currentMonth, 1),
  },
  {
    title: "Freelance",
    amount: 18000,
    type: "INCOME",
    note: "Website project",
    date: new Date(currentYear, currentMonth, 6),
  },
  {
    title: "Burger",
    amount: 900,
    type: "EXPENSE",
    category: "Food",
    date: new Date(currentYear, currentMonth, 2),
  },
  {
    title: "Petrol",
    amount: 2600,
    type: "EXPENSE",
    category: "Transport",
    date: new Date(currentYear, currentMonth, 4),
  },
  {
    title: "Electric Bill",
    amount: 6400,
    type: "EXPENSE",
    category: "Bills",
    date: new Date(currentYear, currentMonth, 9),
  },
  {
    title: "Shopping",
    amount: 4200,
    type: "EXPENSE",
    category: "Shopping",
    date: new Date(currentYear, currentMonth, 12),
  },
  {
    title: "Netflix",
    amount: 1200,
    type: "EXPENSE",
    category: "Entertainment",
    date: new Date(currentYear, currentMonth, 15),
  },
  {
    title: "Medicine",
    amount: 1700,
    type: "EXPENSE",
    category: "Health",
    date: new Date(currentYear, currentMonth, 18),
  },
  {
    title: "Course",
    amount: 3500,
    type: "EXPENSE",
    category: "Education",
    date: new Date(currentYear, currentMonth, 22),
  },
  {
    title: "Trip",
    amount: 8500,
    type: "EXPENSE",
    category: "Travel",
    date: new Date(currentYear, currentMonth, 27),
  },

  // ---------- Previous Month ----------
  {
    title: "Salary",
    amount: 78000,
    type: "INCOME",
    note: "Monthly salary",
    date: new Date(previousYear, previousMonth, 1),
  },
  {
    title: "Bonus",
    amount: 12000,
    type: "INCOME",
    note: "Performance bonus",
    date: new Date(previousYear, previousMonth, 5),
  },
  {
    title: "Pizza",
    amount: 1400,
    type: "EXPENSE",
    category: "Food",
    date: new Date(previousYear, previousMonth, 3),
  },
  {
    title: "Fuel",
    amount: 2200,
    type: "EXPENSE",
    category: "Transport",
    date: new Date(previousYear, previousMonth, 7),
  },
  {
    title: "Internet Bill",
    amount: 3000,
    type: "EXPENSE",
    category: "Bills",
    date: new Date(previousYear, previousMonth, 10),
  },
  {
    title: "Shoes",
    amount: 5000,
    type: "EXPENSE",
    category: "Shopping",
    date: new Date(previousYear, previousMonth, 14),
  },
  {
    title: "Cinema",
    amount: 1000,
    type: "EXPENSE",
    category: "Entertainment",
    date: new Date(previousYear, previousMonth, 18),
  },
  {
    title: "Doctor",
    amount: 2500,
    type: "EXPENSE",
    category: "Health",
    date: new Date(previousYear, previousMonth, 21),
  },
  {
    title: "Books",
    amount: 2200,
    type: "EXPENSE",
    category: "Education",
    date: new Date(previousYear, previousMonth, 25),
  },
  {
    title: "Birthday Gift",
    amount: 1800,
    type: "EXPENSE",
    category: "Gift",
    date: new Date(previousYear, previousMonth, 28),
  },
];

  for (const item of transactions) {
    let categoryId = null;

    if (item.type === "EXPENSE") {
      const category = categories.find(
        (c) => c.name === item.category
      );

      categoryId = category?.id ?? null;
    }

    await prisma.transaction.create({
      data: {
        title: item.title,
        amount: item.amount,
        note: item.note ?? null,
        type: item.type,
        date: item.date,
        userId: 3,
        categoryId,
      },
    });
  }

  console.log("Transactions seeded successfully.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });