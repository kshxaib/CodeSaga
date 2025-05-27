export const getForgotPasswordHtml = (name, code) => `
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
        🔄 Password Reset Request
      </h1>
      <p style="color: #6b7280; font-size: 16px;">
        Hi ${name}, here's your verification code
      </p>
    </div>

    <p style="margin-bottom: 20px; line-height: 1.6; color: #4b5563;">
      We received a request to reset the password for your CodeSaga account. 
      Please use the following verification code:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <div style="
        background: #f0f9ff;
        padding: 20px;
        border-radius: 12px;
        border: 1px solid #bfdbfe;
        display: inline-block;
      ">
        <div style="
          background: #ffffff;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 5px;
          color: #2563eb;
          font-family: monospace;
          border: 1px solid #dbeafe;
        ">
          ${code}
        </div>
      </div>
    </div>

    <p style="margin-bottom: 25px; line-height: 1.6; text-align: center; color: #4b5563;">
      This code is valid for <strong style="color: #2563eb;">15 minutes</strong>.<br>
      If you didn't request this password reset, please ignore this email.
    </p>

    <hr style="border: none; height: 1px; background-color: #e5e7eb; margin: 30px 0;" />

    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      © ${new Date().getFullYear()} CodeSaga. All rights reserved.<br>
      Need help? Contact us at <a href="mailto:support@codesaga.com" style="color: #3b82f6;">support@codesaga.com</a>
    </p>
  </div>
`;