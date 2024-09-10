import express from "express";
import {
  addReviewAndRating,
  editReviewAndRating,
  getUserReview,
  showAllReviewAndRating,
} from "../controller/review.controller";
import { auth } from "../middleware/auth.middleware";
const router = express.Router();

router.post("/addrating", auth, addReviewAndRating);
router.get("/showallrating", showAllReviewAndRating);
router.post("/editReview", auth, editReviewAndRating);
router.get("/user_review", auth, getUserReview);

export default router;
