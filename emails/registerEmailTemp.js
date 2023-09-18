const registerEmailTemplate = (user) =>
  `<h1>Welcome to <span style="color: #15ed19;">DataDash</span> ${user.firstName}! 🎉</h1>
    <p>Congratulations on joining our vibrant community. We're thrilled to have you on board! 🚀</p>
    
    <p>We're excited to see what you'll bring to our community!</p>
    
    <p>Ready to dive in?</p>
    
    <p>Best regards,<br><span style="color: #15ed19;">DataDash Team</span></p>`;

module.exports = registerEmailTemplate;
