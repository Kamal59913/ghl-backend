import express from "express";
import { listPlans } from "../controller/stripePayement.controller";

const router = express.Router();

router.get("/getlist", listPlans);

export default router;
