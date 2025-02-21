const TEMPLATE_ANNOUNCEMENT = (announcement) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pragati 2025 Announcement</title>
        <style>
            body {
                background-color: #ffffff;
                color: #2c3e50;
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
            .content {
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
                text-align: left;
            }
            .footer {
                font-size: 12px;
                color: #777;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="header">Pragati 2025 Announcement</div>
            <div class="content">
                <p>${announcement}</p>
            </div>
            <div class="footer">
                &copy; 2025 Pragati. All rights reserved.
            </div>
        </div>
    </body>
    
    </html>
    `;
};

export default TEMPLATE_ANNOUNCEMENT;
