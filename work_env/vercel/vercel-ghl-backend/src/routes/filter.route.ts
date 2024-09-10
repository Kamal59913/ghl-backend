import express from "express";
import {
  bedbathFilter,
  priceFilter,
  multiFilter,
  newestFilter,
} from "../controller/filter.controller";
const router = express.Router();

router.post("/pricefilter", priceFilter);
router.post("/bedbathFilter", bedbathFilter);
router.post("/multi-filter", multiFilter);
router.get("/newest_filter", newestFilter);

export default router;
