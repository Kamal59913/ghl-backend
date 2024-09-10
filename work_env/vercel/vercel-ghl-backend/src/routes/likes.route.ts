import express from "express";
import {
  getAllLikes,
  likeController,
  likedPropertyList,
  likePagination,
} from "../controller/Likes.controller";

const router = express.Router();

router.post("/likedbyuser", likeController);
router.post("/all_likes", getAllLikes);
router.post("/liked-property", likedPropertyList);
router.post("/liked_pagination", likePagination);

export default router;
