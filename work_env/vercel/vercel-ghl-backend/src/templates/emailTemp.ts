const otpTemplate = (otp: string) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>OTP Verification Email</title>
	  <style>
		  body {
			  background-color: #f4f4f4;
			  font-family: 'Arial', sans-serif;
			  font-size: 16px;
			  line-height: 1.5;
			  color: #333;
			  margin: 0;
			  padding: 0;
		  }
		  .container {
			  max-width: 600px;
			  margin: 50px auto;
			  padding: 20px;
			  background-color: #ffffff;
			  border-radius: 10px;
			  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			  text-align: center;
		  }
		  .logo {
			  max-width: 150px;
			  margin-bottom: 30px;
		  }
		  .message {
			  font-size: 22px;
			  font-weight: bold;
			  margin-bottom: 20px;
		  }
		  .body {
			  font-size: 16px;
			  margin-bottom: 30px;
		  }
		  .otp {
			  display: inline-block;
			  padding: 10px 20px;
			  background-color: #ffd60a;
			  color: #000;
			  font-size: 20px;
			  font-weight: bold;
			  border-radius: 5px;
			  margin: 20px 0;
		  }
		  .support {
			  font-size: 14px;
			  color: #999;
			  margin-top: 20px;
		  }
		  .support a {
			  color: #007bff;
			  text-decoration: none;
		  }
	  </style>
  </head>
  <body>
	  <div class="container">
		  <img src="your-logo-url.png" alt="Company Logo" class="logo">
		  <div class="message">OTP Verification Email</div>
		  <div class="body">
			  <p>Dear User,</p>
			  <p>Thank you for registering with Our Real Estate Business. To complete your registration, please use the following OTP (One-Time Password) to verify your account:</p>
			  <div class="otp">${otp}</div>
			  <p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email. Once your account is verified, you will have access to our platform and its features.</p>
		  </div>
		  <div class="support">
			  If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>. We are here to help!
		  </div>
	  </div>
  </body>
  </html>`;
};

export default otpTemplate;
