export const getGoogleWelcomeEmailHtml = (name, password) => `
  <div style="
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    padding: 40px;
    max-width: 600px;
    margin: auto;
    border-radius: 16px;
    border: 1px solid #334155;
    color: #e2e8f0;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  ">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="
        color: transparent;
        background: linear-gradient(90deg, #38bdf8 0%, #818cf8 100%);
        -webkit-background-clip: text;
        background-clip: text;
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 10px;
      ">
        🔐 Your CodeSaga Account
      </h1>
      <p style="color: #94a3b8; font-size: 16px;">
        Welcome ${name}! Here's your account details
      </p>
    </div>

    <p style="margin-bottom: 20px; line-height: 1.6;">
      You've successfully created a CodeSaga account using Google authentication. 
      We've generated a secure password for you in case you want to login with 
      email/password later.
    </p>

    <div style="
      background: rgba(30, 41, 59, 0.5);
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #818cf8;
      margin: 25px 0;
    ">
      <p style="margin: 0; font-weight: 600; color: #38bdf8;">Your Temporary Password:</p>
      <div style="
        background: rgba(15, 23, 42, 0.7);
        padding: 12px;
        border-radius: 6px;
        margin-top: 10px;
        font-family: monospace;
        font-size: 16px;
        letter-spacing: 1px;
        text-align: center;
        border: 1px dashed #334155;
      ">
        ${password}
      </div>
    </div>

    <p style="margin-bottom: 25px; line-height: 1.6;">
      For security reasons, we recommend changing this password after your first login.
      You can continue using Google Login for faster access.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://codesaga.com/change-password" style="
        background: linear-gradient(90deg, #38bdf8 0%, #818cf8 100%);
        color: white;
        padding: 14px 28px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        display: inline-block;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
      ">
        Change Password Now
      </a>
    </div>

    <hr style="border: none; height: 1px; background-color: #334155; margin: 30px 0;" />

    <p style="font-size: 12px; color: #64748b; text-align: center;">
      © ${new Date().getFullYear()} CodeSaga. All rights reserved.<br>
      If you didn't request this account, please <a href="mailto:security@codesaga.com" style="color: #38bdf8;">contact our security team</a> immediately.
    </p>
  </div>
`;