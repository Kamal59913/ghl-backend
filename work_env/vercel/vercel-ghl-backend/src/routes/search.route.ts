import express from "express";
import { searchControl } from "../controller/search.controller";
import { nearLocation } from "../controller/nearLocation.controller";
const router = express.Router();

router.post("/search", searchControl);
router.post("/nearLocation", nearLocation);

export default router;
