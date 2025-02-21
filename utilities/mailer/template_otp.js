const TEMPLATE_OTP = (otp, userName) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pragati 2025</title>
    <style>
        body {
            background-color: #ffffff;
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
        }
        .otp {
            font-size: 32px;
            font-weight: bold;
            color: #5d4037;
            background-color: #f2d7b3;
            padding: 10px 20px;
            border-radius: 10px;
            display: inline-block;
            margin: 20px 0;
            letter-spacing: 4px;
        }
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
        <div class="header">Pragati 2025</div>
        <div class="sub-header">Voyage Through the Neo-Renaissance</div>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>Welcome to Pragati 2025! We’re excited to have you on board.</p>
        <p>Please use the following code to verify your account:</p>

        <div class="otp">${otp}</div>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p class="footer">Best regards, <br>Team Pragati 2025</p>
    </div>
</body>
</html>
`;
};

export default TEMPLATE_OTP;
