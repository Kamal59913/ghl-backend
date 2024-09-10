const alertTemplate = (
  properties: Array<{ title: string; details: string }>,
  alertFrequency: string
) => {
  const propertyList = properties
    .map(
      (property) => `
      <div class="property">
        <h2>${property.title}</h2>
        <p>${property.details}</p>
      </div>
    `
    )
    .join("");

  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Property Alert Notification</title>
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
        .property {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        .property:last-child {
          border-bottom: none;
        }
        .footer {
          font-size: 14px;
          color: #999;
          margin-top: 20px;
        }
        .footer a {
          color: #007bff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="your-logo-url.png" alt="Company Logo" class="logo">
        <div class="message">Property Alert Notification</div>
        <div class="body">
          <p>Dear User,</p>
          <p>Here are the latest property listings based on your saved search preferences:</p>
          ${propertyList}
          <p>This alert is sent to you based on your selected frequency: ${alertFrequency}. If you have any questions or wish to modify your alert preferences, please let us know.</p>
        </div>
        <div class="footer">
          If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>. We are here to help!
        </div>
      </div>
    </body>
    </html>`;
};

export default alertTemplate;
