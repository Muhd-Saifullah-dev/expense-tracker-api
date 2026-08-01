
const welcomeTemplate = (name) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Welcome to Expense Tracker</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">

<table
width="600"
cellpadding="0"
cellspacing="0"
style="
background:#ffffff;
border-radius:16px;
overflow:hidden;
box-shadow:0 8px 25px rgba(0,0,0,.08);
">

<tr>
<td
align="center"
style="
background:#4F46E5;
padding:32px;
color:white;
font-size:28px;
font-weight:bold;
">
Expense Tracker
</td>
</tr>

<tr>
<td style="padding:40px;">

<h2 style="margin-top:0;color:#111827;">
Welcome, ${name}! 🎉
</h2>

<p style="color:#4B5563;font-size:16px;line-height:28px;">
Thank you for joining <strong>Expense Tracker</strong>. We're excited to have you on board!
</p>

<p style="color:#4B5563;font-size:16px;line-height:28px;">
Your account has been created successfully. You can now start tracking your daily expenses, manage your income, create budgets, and gain valuable insights into your spending habits—all in one place.
</p>

<div
style="
margin:35px auto;
background:#4F46E5;
border-radius:12px;
padding:22px;
text-align:center;
box-shadow:0 8px 20px rgba(79,70,229,.25);
">

<p
style="
margin:0;
font-size:20px;
font-weight:bold;
color:#FFFFFF;
">
💰 Take Control of Your Finances
</p>

<p
style="
margin:12px 0 0;
font-size:15px;
color:#E0E7FF;
line-height:24px;
">
Track every expense, stay within budget, and achieve your financial goals with confidence.
</p>

</div>

<p style="color:#6B7280;font-size:16px;line-height:28px;">
We're committed to making personal finance simple, organized, and stress-free.
</p>

<p style="color:#6B7280;font-size:16px;line-height:28px;">
Thank you for choosing <strong>Expense Tracker</strong>. We wish you success on your financial journey!
</p>

<p style="margin-top:32px;color:#111827;font-weight:bold;">
Happy Tracking! 🚀
</p>

</td>
</tr>

<tr>
<td
align="center"
style="
padding:25px;
background:#F9FAFB;
color:#6B7280;
font-size:14px;
">
© 2026 Expense Tracker. All rights reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

module.exports = welcomeTemplate;
