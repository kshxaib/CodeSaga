export const getForgotPasswordHtml = (name, code) => `
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
        🔄 Password Reset Request
      </h1>
      <p style="color: #94a3b8; font-size: 16px;">
        Hi ${name}, here's your verification code
      </p>
    </div>

    <p style="margin-bottom: 20px; line-height: 1.6;">
      We received a request to reset the password for your CodeSaga account. 
      Please use the following verification code:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <div style="
        background: rgba(56, 189, 248, 0.1);
        padding: 20px;
        border-radius: 12px;
        border: 1px solid rgba(56, 189, 248, 0.3);
        display: inline-block;
      ">
        <div style="
          background: rgba(15, 23, 42, 0.7);
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 5px;
          color: #38bdf8;
          font-family: monospace;
        ">
          ${code}
        </div>
      </div>
    </div>

    <p style="margin-bottom: 25px; line-height: 1.6; text-align: center;">
      This code is valid for <strong style="color: #38bdf8;">15 minutes</strong>.<br>
      If you didn't request this password reset, please ignore this email.
    </p>

    <hr style="border: none; height: 1px; background-color: #334155; margin: 30px 0;" />

    <p style="font-size: 12px; color: #64748b; text-align: center;">
      © ${new Date().getFullYear()} CodeSaga. All rights reserved.<br>
      Need help? Contact us at <a href="mailto:support@codesaga.com" style="color: #38bdf8;">support@codesaga.com</a>
    </p>
  </div>
`;