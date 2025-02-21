const TEMPLATE_EVENT_REGISTRATION_OTP = (
    userName,
    eventName,
    transactionId,
    totalMembers,
  ) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pragati 2025 | Event Registration Confirmation</title>
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
            .details {
                font-size: 16px;
                color: #333;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                margin: 10px 0;
            }
            .footer {
                font-size: 12px;
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
            <div class="sub-header">Event Registration Confirmation</div>
            <p>Dear <strong>${userName}</strong>,</p>
            <p>You have successfully registered for the event:</p>
            <div class="details">
                <p><strong>Event Name:</strong> ${eventName}</p>
                <p><strong>Total Members:</strong> ${totalMembers}</p>
                <p><strong>Transaction ID:</strong> ${transactionId}</p>
            </div>
            <p>We look forward to seeing you at the event!</p>
            <p class="footer">Best regards,<br>Team Pragati 2025</p>
        </div>
    </body>
    
    </html>
    `;
  };
  
  export default TEMPLATE_EVENT_REGISTRATION_OTP;
  