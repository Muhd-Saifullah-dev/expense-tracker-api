const budgetExceededTemplate = (
  name,
  category,
  budget,
  spent,
) => {
  const exceeded = spent - budget;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Budget Exceeded</title>
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
background:#DC2626;
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
Your monthly budget has been exceeded. Here is your spending summary.
</p>

<table
width="100%"
cellpadding="14"
cellspacing="0"
style="
margin:30px 0;
border:1px solid #E5E7EB;
border-radius:12px;
overflow:hidden;
">

<tr style="background:#F9FAFB;">
<td><strong>Category</strong></td>
<td align="right">${category}</td>
</tr>

<tr>
<td><strong>Budget</strong></td>
<td align="right">Rs ${budget}</td>
</tr>

<tr style="background:#F9FAFB;">
<td><strong>Total Spent</strong></td>
<td align="right" style="color:#DC2626;font-weight:bold;">
Rs ${spent}
</td>
</tr>

<tr>
<td><strong>Exceeded By</strong></td>
<td align="right" style="color:#DC2626;font-weight:bold;">
Rs ${exceeded}
</td>
</tr>

</table>

<div
style="
background:#FEF2F2;
border-left:5px solid #DC2626;
padding:18px;
border-radius:10px;
">

<p
style="
margin:0;
color:#991B1B;
font-size:15px;
line-height:26px;
">
⚠️ You have exceeded your budget for the
<strong>${category}</strong> category.
Please review your spending and adjust your expenses for the rest of the month.
</p>

</div>

<p
style="
margin-top:35px;
color:#6B7280;
line-height:26px;
">
Keeping your expenses within budget helps you achieve your financial goals.
Open the Expense Tracker app to review your transactions.
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

module.exports = budgetExceededTemplate;