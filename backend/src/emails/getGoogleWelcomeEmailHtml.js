export const getGoogleWelcomeEmailHtml = (name, password) => `
  <div style="
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #ffffff;
    padding: 40px;
    max-width: 600px;
    margin: auto;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    color: #374151;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  ">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://codesaga.com/logo.png" alt="CodeSaga" style="height: 50px; margin-bottom: 20px;">
      <h1 style="
        color: #2563eb;
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 10px;
      ">
        🔐 Your CodeSaga Account
      </h1>
      <p style="color: #6b7280; font-size: 16px;">
        Welcome ${name}! Here's your account details
      </p>
    </div>

    <p style="margin-bottom: 20px; line-height: 1.6; color: #4b5563;">
      You've successfully created a CodeSaga account using Google authentication. 
      We've generated a secure password for you in case you want to login with 
      email/password later.
    </p>

    <div style="
      background: #f9fafb;
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #3b82f6;
      margin: 25px 0;
    ">
      <p style="margin: 0; font-weight: 600; color: #2563eb;">Your Temporary Password:</p>
      <div style="
        background: #ffffff;
        padding: 12px;
        border-radius: 6px;
        margin-top: 10px;
        font-family: monospace;
        font-size: 16px;
        letter-spacing: 1px;
        text-align: center;
        border: 1px dashed #d1d5db;
        color: #1e40af;
        font-weight: 600;
      ">
        ${password}
      </div>
    </div>

    <p style="margin-bottom: 25px; line-height: 1.6; color: #4b5563;">
      For security reasons, we recommend changing this password after your first login.
      You can continue using Google Login for faster access.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://codesaga.com/change-password" style="
        background: #3b82f6;
        color: white;
        padding: 14px 28px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        display: inline-block;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      ">
        Change Password Now
      </a>
    </div>

    <hr style="border: none; height: 1px; background-color: #e5e7eb; margin: 30px 0;" />

    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      © ${new Date().getFullYear()} CodeSaga. All rights reserved.<br>
      If you didn't request this account, please <a href="mailto:security@codesaga.com" style="color: #3b82f6;">contact our security team</a> immediately.
    </p>
  </div>
`;