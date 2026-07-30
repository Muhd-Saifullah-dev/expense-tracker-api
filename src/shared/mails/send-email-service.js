const { EMAIL } = require("@/config/env.config");
const  transporter = require("./transporter");

const send_mail = async ({ toEmail, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from:EMAIL ,
      to:toEmail,
      subject,
      html,
    });

    console.log(`✅ Email sent: ${info.messageId}`);

    return info;
  } catch (error) {
    console.error("❌ Failed to send email");
    console.error(error);
    transporter.close()
    return
  }
};

module.exports = {
  send_mail,
};