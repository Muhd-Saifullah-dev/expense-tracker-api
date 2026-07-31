// workers/otp.worker.js

const { send_mail, otpTemplate, bullmqRedis } = require("@/shared");
const { Worker } = require("bullmq");

new Worker(
  "otp-email",
  async (job) => {
    const { email, name, otp } = job.data;

    await send_mail({
      toEmail: email,
      subject: "Password Reset OTP",
      html: otpTemplate(name, otp),
    });

    console.log("OTP Email Sent");
  },
  {
    connection: bullmqRedis,
  },
);
