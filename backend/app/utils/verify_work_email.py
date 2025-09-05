def verify_work_email(name, otp):
    return f"""<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Verify Your Work Email</title>
        <style>
            body {{
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                    Oxygen, Ubuntu, Cantarell, sans-serif;
                color: #1a1a1a;
                background-color: #f5f5f5;
                line-height: 1.6;
            }}

            .container {{
                margin: 10px auto;
                width: 100%;
                max-width: 400px;
                background-color: #ffffff;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }}

            .logo {{
                margin-bottom: 32px;
                font-size: 24px;
                font-weight: 700;
                color: #2563eb;
            }}

            .content {{
                color: #374151;
            }}

            .otp {{
                background-color: #2563eb;
                color: #ffffff;
                font-size: 32px;
                font-weight: 700;
                letter-spacing: 4px;
                padding: 16px 32px;
                margin: 32px 0;
                border-radius: 8px;
                text-align: center;
            }}

            .notice {{
                font-size: 14px;
                color: #6b7280;
                background-color: #f3f4f6;
                padding: 16px;
                border-radius: 6px;
                margin: 24px 0;
            }}

            .footer {{
                margin-top: 48px;
                padding-top: 24px;
                border-top: 1px solid #e5e7eb;
                font-size: 13px;
                color: #6b7280;
                line-height: 1.5;
            }}

            .footer a {{
                color: #2563eb;
                text-decoration: none;
            }}

            .footer a:hover {{
                text-decoration: underline;
            }}

            .company-info {{
                text-align: center;
                margin-top: 24px;
                font-size: 12px;
                color: #9ca3af;
            }}
        </style>
    </head>

    <body>
        <div class="container">
            <div class="logo">Gradhunt</div>

            <div class="content">
                <p>Hello, {name}</p>

                <p>
                    Please verify your work email address by entering the following
                    verification code:
                </p>

                <div class="otp">{otp}</div>

                <div class="notice">
                    <strong>Important:</strong>
                    <ul style="margin: 8px 0; padding-left: 20px">
                        <li>This code will expire in 10 minutes</li>
                        <li>If you didn't request this code, please ignore this email</li>
                        <li>Do not share this code with anyone</li>
                    </ul>
                </div>

                <p>If you have any questions, please contact our support team.</p>
            </div>

            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>
                    To ensure delivery to your inbox, please add
                    <a href="mailto:no-reply@gradhunt.cc">no-reply@gradhunt.cc</a> to your
                    contacts.
                </p>
            </div>
        </div>

        <div class="company-info">
            <p>&copy; 2024 Gradhunt. All rights reserved.</p>
        </div>
    </body>
</html>"""