
export const getForgotPasswordHtml = (name, code) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9ff; padding: 30px; max-width: 600px; margin: auto; border-radius: 12px; border: 1px solid #ddd;">
    <h2 style="color: #4a90e2; text-align: center;">🔐 Reset Your Password</h2>
    <p>Hi ${name},</p>
    <p>We received a request to reset the password for your LogicVerse account. Please use the following verification code:</p>
    <div style="text-align: center; margin: 24px 0;">
      <span style="background-color: #e0f7fa; padding: 16px 32px; font-size: 24px; font-weight: bold; color: #00796b; border-radius: 6px; display: inline-block; letter-spacing: 3px;">
        ${code}
      </span>
    </div>
    <p>This code is valid for <strong>15 minutes</strong>. If you didn't initiate this request, you can safely ignore this email.</p>
    <p>Stay sharp,<br><strong>🚀 The LogicVerse Team</strong></p>
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #888;">Need help? Contact us at support@logicverse.com</p>
  </div>
`;
