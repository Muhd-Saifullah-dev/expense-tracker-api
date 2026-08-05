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
    // ---------- More Current Month ----------
  {
    title: "Coffee",
    amount: 450,
    type: "EXPENSE",
    category: "Food",
    date: new Date(currentYear, currentMonth, 3),
  },
  {
    title: "Bus Card",
    amount: 800,
    type: "EXPENSE",
    category: "Transport",
    date: new Date(currentYear, currentMonth, 5),
  },
  {
    title: "Mobile Bill",
    amount: 2500,
    type: "EXPENSE",
    category: "Bills",
    date: new Date(currentYear, currentMonth, 7),
  },
  {
    title: "Jacket",
    amount: 6000,
    type: "EXPENSE",
    category: "Shopping",
    date: new Date(currentYear, currentMonth, 11),
  },
  {
    title: "Spotify",
    amount: 600,
    type: "EXPENSE",
    category: "Entertainment",
    date: new Date(currentYear, currentMonth, 13),
  },
  {
    title: "Gym",
    amount: 3000,
    type: "EXPENSE",
    category: "Health",
    date: new Date(currentYear, currentMonth, 16),
  },
  {
    title: "Online Course",
    amount: 4500,
    type: "EXPENSE",
    category: "Education",
    date: new Date(currentYear, currentMonth, 20),
  },
  {
    title: "Hotel",
    amount: 12000,
    type: "EXPENSE",
    category: "Travel",
    date: new Date(currentYear, currentMonth, 24),
  },
  {
    title: "Gift Box",
    amount: 2500,
    type: "EXPENSE",
    category: "Gift",
    date: new Date(currentYear, currentMonth, 26),
  },
  {
    title: "Side Project",
    amount: 15000,
    type: "INCOME",
    note: "Freelance work",
    date: new Date(currentYear, currentMonth, 28),
  },

  // ---------- More Previous Month ----------
  {
    title: "Freelance Payment",
    amount: 20000,
    type: "INCOME",
    note: "Client payment",
    date: new Date(previousYear, previousMonth, 4),
  },
  {
    title: "Lunch",
    amount: 1200,
    type: "EXPENSE",
    category: "Food",
    date: new Date(previousYear, previousMonth, 6),
  },
  {
    title: "Rickshaw",
    amount: 500,
    type: "EXPENSE",
    category: "Transport",
    date: new Date(previousYear, previousMonth, 9),
  },
  {
    title: "Water Bill",
    amount: 1800,
    type: "EXPENSE",
    category: "Bills",
    date: new Date(previousYear, previousMonth, 12),
  },
  {
    title: "Watch",
    amount: 7000,
    type: "EXPENSE",
    category: "Shopping",
    date: new Date(previousYear, previousMonth, 15),
  },
  {
    title: "Game Purchase",
    amount: 2000,
    type: "EXPENSE",
    category: "Entertainment",
    date: new Date(previousYear, previousMonth, 17),
  },
  {
    title: "Lab Test",
    amount: 3500,
    type: "EXPENSE",
    category: "Health",
    date: new Date(previousYear, previousMonth, 20),
  },
  {
    title: "Exam Fee",
    amount: 5000,
    type: "EXPENSE",
    category: "Education",
    date: new Date(previousYear, previousMonth, 23),
  },
  {
    title: "Flight Ticket",
    amount: 18000,
    type: "EXPENSE",
    category: "Travel",
    date: new Date(previousYear, previousMonth, 26),
  },
  {
    title: "Wedding Gift",
    amount: 4000,
    type: "EXPENSE",
    category: "Gift",
    date: new Date(previousYear, previousMonth, 29),
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