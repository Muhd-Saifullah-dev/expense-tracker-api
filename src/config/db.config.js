const { prisma } = require("@shared/index");

const connectDB = async () => {
  try {
    await prisma.$connect();

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error)
    console.error(error.message);

    process.exit(1);
  }
};

module.exports={
  connectDB
}
