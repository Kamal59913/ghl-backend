import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import dbConnect from "./src/config/dbConnect.ts";
// import mailSender from "./src/utils/mailSender.js";
import agentRoute from "./src/routes/agent.route.ts";
import messageRoute from "./src/routes/message.route.ts";
import contactRoute from "./src/routes/contact.route.ts";
import offerRouter from "./src/routes/offer.route.ts";
import authRouter from "./src/routes/auth.route.ts";
// import {
//   getCompanyAccessToken,
//   getCompanyAuthorizationCode,
// } from "./src/utils/companyAutomation.ts";
import cookieParser from "cookie-parser";
import likesRoute from "./src/routes/likes.route.ts";
import searchRoute from "./src/routes/search.route.ts";
import reviewRoute from "./src/routes/ratingAndReview.route.ts";
import filterRoute from "./src/routes/filter.route.ts";
import alertRoute from "./src/routes/alert.route.ts";
import path from "path";
import fs from "fs";
// import { monitorNewUsers } from "./src/utils/addContactAutomation.ts";
import paymentRoute from "./src/routes/stripePayment.route.ts";
import cron from "node-cron";
import { saveSearchModel } from "./src/model/saveSearch.model.ts";
import { checkAndSendAlertById } from "./src/controller/saveSearch.controller.ts";
config();

import bodyParser from "body-parser";
import axios from "axios";
import { getCompanyAccessToken } from "./src/utils/companyAutomation.ts";
import { getLocationToken } from "./src/utils/tokenAutomation.ts";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// Middleware to catch JSON parsing errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && err.message.includes("Unexpected")) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON syntax",
    });
  }
  next();
});

app.use(
  cors({
    origin: true, // Allow specific origin
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true, // Allow cookies if needed
  })
);

dbConnect();

app.use("/api/auth", authRouter);
app.use("/api/agents", agentRoute);
app.use("/api", messageRoute);
app.use("/api", contactRoute);
app.use("/api/offer", offerRouter);
app.use("/api/user", likesRoute);
app.use("/api", searchRoute);
app.use("/api", reviewRoute);
app.use("/api", paymentRoute);
app.use("/api", filterRoute);
app.use("/api", alertRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API working properly",
  });
});
//cron-jobs

// Run every hour
cron.schedule("* * * * *", async () => {
  const alerts = await saveSearchModel.find();
  console.log("cron started");
  alerts.forEach(async (alert) => {
    if (alert.alertFrequency === "Immediately") {
      const lastAlertSent = alert.lastAlertSent || new Date(0);
      if (new Date().getTime() - new Date(lastAlertSent).getTime() >= 1 * 60 * 1000) {
        await checkAndSendAlertById(alert);
      }
    }
  });
});

// Endpoint to receive messages from GoHighLevel
app.post("/message", (req, res) => {
  console.log("Message received:", req.body);
  // Here, you can process the message and send a response if needed
  // For now, just acknowledge the receipt
  res.sendStatus(200);
});

// Route to send a normal email
// app.post("/send-email", async (req, res) => {
//   const { to, subject, text } = req.body;
//   try {
//     const response = await mailSender(to, subject, text);
//     res.status(200).json({ message: "Email sent successfully", response });
//   } catch (error) {
//     res.status(500).json({ message: "Error sending email", error });
//   }
// });

app.post("/testing/v1", async (req, res) => {
  const location = req.body.locationId;

  try {
    const {access_token} = await getLocationToken(location);
    //const companyTokenData = await getCompanyAccessToken();
    // console.log(companyTokenData);
    console.log(access_token);

    res.json(access_token);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

function getCountryData() {
  const data = fs.readFileSync("./src/utils/country.json", "utf-8");
  return JSON.parse(data);
}

// API to get all states by country name
app.get("/states/:countryName", (req, res) => {
  const { countryName } = req.params;
  const countryData = getCountryData();
  const country = countryData.find(
    (country: { countryName: string }) => country.countryName === countryName
  );

  if (country) {
    res.status(200).json({
      states: country.states.map((state: { stateName: any }) => state.stateName),
    });
  } else {
    res.status(404).json({ message: "Country not found" });
  }
});

// API to get all cities by state name
app.get("/cities/:stateName", (req, res) => {
  const { stateName } = req.params;
  const countryData = getCountryData();
  let stateFound = false;
  let cities: never[] = [];

  countryData.forEach((country: { states: any[] }) => {
    const state = country.states.find(
      (state: { stateName: string }) => state.stateName === stateName
    );
    if (state) {
      stateFound = true;
      cities = state.cities;
    }
  });

  if (stateFound) {
    res.status(200).json({ cities });
  } else {
    res.status(404).json({ message: "State not found" });
  }
});

// app.get("/automate", (req, res) => {
//   monitorNewUsers;
// });

app.listen(process.env.PORT, () => {
  console.log(`App is running on ${process.env.PORT}`);
});
