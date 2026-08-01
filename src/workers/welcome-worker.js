const { Worker } = require("bullmq");

const { welcomeTemplate, bullmqRedis, send_mail } = require("@/shared");
new Worker(
  "welcome-email",
  async (job) => {
    const { email, name } = job.data;

    await send_mail({
      toEmail: email,
      subject: "Welcome to Expense Tracker 🎉",
      html: welcomeTemplate(name),
    });

    console.log("Welcome email sent");
  },
  {
    connection: bullmqRedis,
  },
);
