import express from "express";
import {
  getCurrentUser,
  resetConfirmOtp,
  resetPassword,
  resetPasswordToken,
  signin,
  signUp,
  validateOtpAndCreateUser,
} from "../controller/Auth.controller";
import { auth } from "../middleware/auth.middleware";
import { otpVerification } from "../middleware/otpverification.middleware";
const router = express.Router();

router.post("/signup", signUp);
router.post("/validateOtp", otpVerification, validateOtpAndCreateUser);
router.post("/signin", signin);

router.post("/forget_password_token", resetPasswordToken);
router.post("/resetConfirmOtp", otpVerification, resetConfirmOtp);
router.post("/forget_password", resetPassword);

router.get("/current-user", auth, getCurrentUser);

// router.post("/get-agent", getAgent);

export default router;
