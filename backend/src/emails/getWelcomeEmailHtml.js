export const getWelcomeEmailHtml = (name) => `
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
        🚀 Welcome to CodeSaga, ${name}!
      </h1>
      <p style="color: #94a3b8; font-size: 16px;">
        Your journey to coding mastery begins now
      </p>
    </div>

    <p style="margin-bottom: 20px; line-height: 1.6;">
      Hi ${name},<br><br>
      We're thrilled to have you join <strong>CodeSaga</strong>, where developers sharpen their skills 
      through real-world coding challenges and competitions.
    </p>

    <div style="
      background: rgba(30, 41, 59, 0.5);
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #38bdf8;
      margin: 25px 0;
    ">
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <span style="color: #38bdf8; margin-right: 10px;">✦</span>
        <span>Solve algorithm and system design challenges</span>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <span style="color: #38bdf8; margin-right: 10px;">✦</span>
        <span>Track your progress with detailed analytics</span>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <span style="color: #38bdf8; margin-right: 10px;">✦</span>
        <span>Compete on our global leaderboard</span>
      </div>
      <div style="display: flex; align-items: center;">
        <span style="color: #38bdf8; margin-right: 10px;">✦</span>
        <span>Prepare for technical interviews</span>
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://codesaga.com/dashboard" style="
        background: linear-gradient(90deg, #38bdf8 0%, #818cf8 100%);
        color: white;
        padding: 14px 28px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        display: inline-block;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
      ">
        Launch Your Dashboard →
      </a>
    </div>

    <p style="margin-bottom: 5px;">Happy coding,</p>
    <p style="margin-top: 0; font-weight: 600;">
      <span style="color: #38bdf8;">&lt;/&gt;</span> The CodeSaga Team
    </p>

    <hr style="border: none; height: 1px; background-color: #334155; margin: 30px 0;" />

    <p style="font-size: 12px; color: #64748b; text-align: center;">
      © ${new Date().getFullYear()} CodeSaga. All rights reserved.<br>
      Need help? Contact us at <a href="mailto:support@codesaga.com" style="color: #38bdf8;">support@codesaga.com</a>
    </p>
  </div>
`;