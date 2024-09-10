import formData from "form-data";
import Mailgun from "mailgun.js";
import nodemailer from "nodemailer";

import { config } from "dotenv";
import { Response } from "express";
config();
const mailSender = async (
  email: string,
  title: string,
  body: string
): Promise<Response> => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false, 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
    }

    });

    let info = await transporter.sendMail({
      from: `"Real Estate Admin Niraj Kr" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log(info);

    return {
      status: "success",
      info: info,
    } as unknown as Response;
  } catch (error: any) {
    console.log("mailSender issue", error.message);

    return {
      status: "error",
      message: error.message,
    } as unknown as Response;
  }
};
export default mailSender;

// const mailgun = new Mailgun(formData);

// const mg = mailgun.client({
//   username: "api",
//   key: process.env.MAILGUN_API_KEY || "key-yourkeyhere",
// });

// const mailSender = async (
//   to: string,
//   subject: string,
//   text: string,
//   html: string
// ) => {
//   try {
//     const msg = await mg.messages.create("sandbox-123.mailgun.org", {
//       from: "Excited User <mailgun@" + process.env.MAILGUN_DOMAIN + ">",
//       to,
//       subject,
//       text,
//       html,
//     });
//     return msg;
//   } catch (error: any) {
//     console.error("Error:", error);
//     if (error.response) {
//       console.error("Response:", error.response);
//       console.error("Response Body:", error.response.body);
//     }
//     throw error;
//   }
// };
