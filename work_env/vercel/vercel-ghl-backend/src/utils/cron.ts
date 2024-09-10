import cron from "node-cron";
import { checkAndSendAlertById } from "../controller/saveSearch.controller";
import { saveSearchModel } from "../model/saveSearch.model";

  // Run every hour
  cron.schedule("0 * * * *", async () => {
    const alerts = await saveSearchModel.find();
    alerts.forEach(async (alert) => {
      if (alert.alertFrequency === "Immediately") {
        const lastAlertSent = alert.lastAlertSent || new Date(0);
        if (new Date().getTime() - new Date(lastAlertSent).getTime() >= 1 * 60 * 1000) {
          await checkAndSendAlertById(alert);
        }
      }
    });
  });

  // Run daily at midnight
  cron.schedule("0 0 * * *", async () => {
    const alerts = await saveSearchModel.find();
    alerts.forEach(async (alert) => {
      if (alert.alertFrequency === "Daily") {
        const lastAlertSent = alert.lastAlertSent || new Date(0);
        if (
          new Date().getTime() - new Date(lastAlertSent).getTime() >=
          24 * 60 * 60 * 1000
        ) {
          await checkAndSendAlertById(alert);
        }
      }
    });
  });

  // Run weekly at midnight on Sundays
  cron.schedule("0 0 * * 0", async () => {
    const alerts = await saveSearchModel.find();
    alerts.forEach(async (alert) => {
      if (alert.alertFrequency === "Weekly") {
        const lastAlertSent = alert.lastAlertSent || new Date(0);
        if (
          new Date().getTime() - new Date(lastAlertSent).getTime() >=
          7 * 24 * 60 * 60 * 1000
        ) {
          await checkAndSendAlertById(alert);
        }
      }
    });
  });

  // Run monthly at midnight on the first day of the month
  cron.schedule("0 0 1 * *", async () => {
    const alerts = await saveSearchModel.find();
    alerts.forEach(async (alert) => {
      if (alert.alertFrequency === "Monthly") {
        const lastAlertSent = alert.lastAlertSent || new Date(0);
        if (
          new Date().getTime() - new Date(lastAlertSent).getTime() >=
          30 * 24 * 60 * 60 * 1000
        ) {
          await checkAndSendAlertById(alert);
        }
      }
    });
  });


