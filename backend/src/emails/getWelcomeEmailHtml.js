// welcomeTemplate.js

export const getWelcomeEmailHtml = (name) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; padding: 30px; max-width: 600px; margin: auto; border-radius: 12px; border: 1px solid #e0e0e0;">
    <h2 style="color: #4caf50; text-align: center;">🎉 Welcome to LogicVerse, ${name}!</h2>
    <p>Hi ${name},</p>
    <p>We're excited to have you on board. LogicVerse is your space to solve real coding challenges, boost your skills, and compete with a global community of developers.</p>
    <div style="background-color: #f1f8e9; padding: 16px; border-radius: 8px; margin: 20px 0;">
      ✅ Solve algorithm and system design challenges<br>
      ✅ Track your progress and growth<br>
      ✅ Climb the leaderboard<br>
      ✅ Prepare for interviews
    </div>
    <p>Start your journey now!</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="https://yourdomain.com/dashboard" style="background-color: #4caf50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Go to Dashboard →
      </a>
    </div>
    <p>Welcome again,<br><strong>💻 The LogicVerse Team</strong></p>
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #888;">If you have questions, just reply to this email. We’re always here to help.</p>
  </div>
`;
