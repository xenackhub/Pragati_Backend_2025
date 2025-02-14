const TEMPLATE_ANNOUNCEMENT = (announcement) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pragati 2025 Announcement</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                background: #004aad;
                color: white;
                padding: 15px 0;
                font-size: 24px;
                font-weight: bold;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
                font-size: 16px;
                color: #333333;
                line-height: 1.6;
            }
            .footer {
                text-align: center;
                padding: 10px;
                font-size: 14px;
                color: #777777;
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
    </html>`;
};

export default TEMPLATE_ANNOUNCEMENT;
