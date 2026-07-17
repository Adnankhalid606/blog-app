export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
export const getOtpHtml = (otp) => {
  //Now, we will create HTML Part with styles (CSS) for our OTP.
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Your Verification Code</title>
  <style>
    /* Reset styles for email clients */
    body, table, td, a { text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f4f7f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    table { border-collapse: collapse !important; }
    a { color: #1a73e8; text-decoration: none; }
    
    /* Responsive styles */
    @media screen and max-width (600px) {
      .container { width: 100% !important; padding: 10px !important; }
      .content { padding: 20px !important; }
      .otp-code { letter-spacing: 6px !important; font-size: 28px !important; }
    }
  </style>
</head>
<body>

  <!-- Background Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f7f6; padding: 40px 0;">
    <tr>
      <td align="center">
        
        <!-- Email Container -->
        <table role="presentation" width="550" cellspacing="0" cellpadding="0" border="0" class="container" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
          
          <!-- Header Banner (Optional Brand Color Accent) -->
          <tr>
            <td style="background-color: #1a73e8; height: 6px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td class="content" style="padding: 40px 30px; text-align: left;">
              
              <!-- Logo / Brand Header -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td>
                    <div style="font-size: 22px; font-weight: 700; color: #1a73e8; letter-spacing: -0.5px;">YourBrand</div>
                  </td>
                </tr>
              </table>

              <!-- Greeting & Context -->
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111111; line-height: 26px;">Verify your identity</h1>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 24px; color: #444444;">Hello,</p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 24px; color: #444444;">Please use the one-time password (OTP) below to complete your verification request. This code is confidential and secure.</p>

              <!-- OTP Code Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td align="center" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px 0;">
                    <!-- Replace '123456' with your backend variable dynamically (e.g., {{otp_code}}) -->
                    <span class="otp-code" style="font-size: 32px; font-weight: 700; color: #1a73e8; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">${otp}</span>
                  </td>
                </tr>
              </table>

              <!-- Expiry Notification -->
              <p style="margin: 0 0 32px 0; font-size: 14px; line-height: 22px; color: #666666; font-style: italic;">
                ⏱ This verification code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
              </p>

              <!-- Security Disclaimer -->
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0 0 20px 0;" />
              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #888888;">
                If you did not request this verification code, please ignore this email safely. Your account security remains intact.
              </p>

            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="background-color: #fafbfc; padding: 24px 30px; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8;">&copy; 2026 YourBrand Inc. All rights reserved.</p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                <a href="https://example.com" style="color: #64748b; text-decoration: underline;">Help Center</a> &bull; 
                <a href="https://example.com" style="color: #64748b; text-decoration: underline;">Privacy Policy</a>
              </p>
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
