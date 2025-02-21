const TEMPLATE_WELCOME = (userName) => {
    return `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pragati 2025 Invitation</title>
    <style>
        body {
            background-color: #f2d7b3;
            color: #333;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 5px;
            text-align: center;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .sub-header {
            font-size: 18px;
            font-style: italic;
            color: #666;
            margin-bottom: 20px;
        
        .footer {
            font-size: 14px;
            color: #777;
            margin-top: 20px;
        }
        p {
            margin: 10px 0;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>You're Invited to Pragati 2025!</h2>
        <p>Dear ${userName},</p>
        <p>We are excited to invite you to <strong>Pragati 2025</strong> at Amrita School of Business, Coimbatore.</p>
        <p class="details">📅 March 3rd & 4th, 2025</p>
        <p>Join us for competitions, networking, and learning.</p>
        <p>We look forward to your participation!</p>
        <div class="footer">
            <p>Best Regards,</p>
            <p>Team Pragati</p>
            <p><a href="https://pragati.amrita.edu/" target="_blank">Visit Website</a></p>
        </div>
    </div>
</body>
</html>
  `;
};

export default TEMPLATE_WELCOME;
