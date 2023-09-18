const goodbyeEmailTemplate = (userToDelete) =>
  `<h1>Saying Goodbye, but not Farewell! 👋</h1>
<p>We're truly sorry to see you go from <span style="color: #15ed19;">DataDash</span>, <strong>${userToDelete.firstName}</strong>. Your presence has been an important part of our community.</p>
<p>We hope that this isn't a final goodbye, but rather a "see you later". If you ever decide to come back, our virtual doors will always be open to you.</p>
<p>Remember, our community will always be here to welcome you back with open arms!</p>

<h2>Stay Connected:</h2>
<p>Should you ever want to rejoin our vibrant community and share your thoughts once again, please don't hesitate to sign up again.</p>

<p>Wishing you all the best in your future endeavors!</p>

<p>Warm regards,<br><span style="color: #15ed19;">DataDash Team</span></p>`;

module.exports = goodbyeEmailTemplate;
