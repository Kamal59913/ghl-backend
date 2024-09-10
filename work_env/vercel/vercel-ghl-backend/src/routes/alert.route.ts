import express from "express";
import { createSaveSearch, editSaveSearch } from "../controller/saveSearch.controller";

const router = express.Router();

router.post("/savealert", createSaveSearch);
router.post("/editalert", editSaveSearch);

export default router;
