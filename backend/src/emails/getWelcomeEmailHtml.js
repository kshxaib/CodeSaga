export const getWelcomeEmailHtml = (name) => `
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
        🚀 Welcome to CodeSaga, ${name}!
      </h1>
      <p style="color: #6b7280; font-size: 16px;">
        Your journey to coding mastery begins now
      </p>
    </div>

    <p style="margin-bottom: 20px; line-height: 1.6; color: #4b5563;">
      Hi ${name},<br><br>
      We're thrilled to have you join <strong style="color: #2563eb;">CodeSaga</strong>, where developers sharpen their skills 
      through real-world coding challenges and competitions.
    </p>

    <div style="
      background: #f9fafb;
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #3b82f6;
      margin: 25px 0;
    ">
      <div style="display: flex; align-items: center; margin-bottom: 12px; color: #4b5563;">
        <span style="color: #3b82f6; margin-right: 10px;">✦</span>
        <span>Solve algorithm and system design challenges</span>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 12px; color: #4b5563;">
        <span style="color: #3b82f6; margin-right: 10px;">✦</span>
        <span>Track your progress with detailed analytics</span>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 12px; color: #4b5563;">
        <span style="color: #3b82f6; margin-right: 10px;">✦</span>
        <span>Compete on our global leaderboard</span>
      </div>
      <div style="display: flex; align-items: center; color: #4b5563;">
        <span style="color: #3b82f6; margin-right: 10px;">✦</span>
        <span>Prepare for technical interviews</span>
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://codesaga.com/dashboard" style="
        background: #3b82f6;
        color: white;
        padding: 14px 28px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        display: inline-block;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: background-color 0.2s;
      ">
        Launch Your Dashboard →
      </a>
    </div>

    <p style="margin-bottom: 5px; color: #4b5563;">Happy coding,</p>
    <p style="margin-top: 0; font-weight: 600; color: #1e40af;">
      <span style="color: #3b82f6;">&lt;/&gt;</span> The CodeSaga Team
    </p>

    <hr style="border: none; height: 1px; background-color: #e5e7eb; margin: 30px 0;" />

    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      © ${new Date().getFullYear()} CodeSaga. All rights reserved.<br>
      Need help? Contact us at <a href="mailto:support@codesaga.com" style="color: #3b82f6;">support@codesaga.com</a>
    </p>
  </div>
`;