import express from "express";
import {
 // Addoffer,
  createOffer,
//  GetOffer,
  getOffers,
  updateStatus,
} from "../controller/offer.controller";
import { auth } from "../middleware/auth.middleware";

const router = express.Router();

// router.post("/addoffer", Addoffer);
// router.post("/viewoffer", auth, GetOffer);
router.post("/create_offer", createOffer);
router.post("/get_offers", getOffers);
router.post("/update_status", updateStatus);

export default router;
