// workers/budget-exceeded.worker.js

const {
  send_mail,
  budgetExceededTemplate,
  bullmqRedis,
} = require("@/shared");

const { Worker } = require("bullmq");

new Worker(
  "budget-exceeded",
  async (job) => {
    const {
      email,
      name,
      category,
      budget,
      spent,
    } = job.data;

    await send_mail({
      toEmail: email,
      subject: "Budget Exceeded Alert",
      html: budgetExceededTemplate(
        name,
        category,
        budget,
        spent
      ),
    });

    console.log(`Budget alert sent to ${email}`);
  },
  {
    connection: bullmqRedis,
  },
);