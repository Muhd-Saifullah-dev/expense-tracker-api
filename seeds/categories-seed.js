

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      {
        name: "Food",
        icon: "utensils",
        color: "#EF4444",
      },
      {
        name: "Transport",
        icon: "car",
        color: "#3B82F6",
      },
      {
        name: "Shopping",
        icon: "shopping-bag",
        color: "#A855F7",
      },
      {
        name: "Bills",
        icon: "receipt",
        color: "#F97316",
      },
      {
        name: "Entertainment",
        icon: "film",
        color: "#EC4899",
      },
      {
        name: "Health",
        icon: "heart-pulse",
        color: "#10B981",
      },
      {
        name: "Education",
        icon: "graduation-cap",
        color: "#6366F1",
      },
      {
        name: "Travel",
        icon: "plane",
        color: "#06B6D4",
      },
      {
        name: "Gift",
        icon: "gift",
        color: "#EAB308",
      },
      {
        name: "Other",
        icon: "circle-help",
        color: "#6B7280",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Categories seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });