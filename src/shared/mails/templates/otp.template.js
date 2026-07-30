const otpTemplate = (name, otp) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Expense Tracker OTP</title>
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
Hello ${name},
</h2>

<p style="color:#4B5563;font-size:16px;line-height:28px;">
We received a request to reset your password.
Use the verification code below.
</p>

<div
style="
margin:35px auto;
width:220px;
background:#4F46E5;
border-radius:12px;
padding:18px;
text-align:center;
box-shadow:0 8px 20px rgba(79,70,229,.25);
">

<span
style="
font-size:34px;
font-weight:bold;
letter-spacing:8px;
color:#FFFFFF;
">
${otp}
</span>

</div>

<p style="color:#6B7280;">
This OTP will expire in
<strong>5 minutes.</strong>
</p>

<p style="color:#6B7280;">
If you didn't request this, you can safely ignore this email.
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

module.exports = otpTemplate;