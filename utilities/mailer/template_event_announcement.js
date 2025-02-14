const TEMPLATE_EVENT_ANNOUNCEMENT = (eventName, announcement) => {
    return `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                background: #ffffff;
                margin: 20px auto;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: #004080;
                color: #ffffff;
                padding: 15px;
                text-align: center;
                font-size: 24px;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
                font-size: 16px;
                color: #333;
                line-height: 1.6;
            }
            .footer {
                text-align: center;
                padding: 15px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">${eventName} - Announcement</div>
            <div class="content">
                <p>${announcement}</p>
            </div>
            <div class="footer">
                &copy; 2025 Event Team. All Rights Reserved.
            </div>
        </div>
    </body>
    </html>
    `;
}

export default TEMPLATE_EVENT_ANNOUNCEMENT;