const {Worker} =require("bullmq")
const {send_mail}=require("@shared")
new Worker(
  "welcome-email",
  async (job) => {
    const { email, name } = job.data;

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


