export const getGoogleWelcomeEmailHtml = (name, password) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
      <h2 style="color: #2d3748;">Welcome ${name}!</h2>
      <p>Your account has been created successfully via Google.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p>We've generated a password for you in case you want to login with email/password later:</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>
      
      <p>For security reasons, we recommend changing this password after login.</p>
      
      <div style="margin: 25px 0;">
        <a href="${process.env.FRONTEND_URL}/change-password" 
           style="background-color: #4299e1; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Change Password Now
        </a>
      </div>
      
      <p>You can also continue using Google Login for faster access.</p>
      
      <div style="margin-top: 30px; font-size: 14px; color: #718096;">
        <p>If you didn't request this account, please contact our support team immediately.</p>
      </div>
    </div>
  `;
}