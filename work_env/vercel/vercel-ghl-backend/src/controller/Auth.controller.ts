import { Request, Response } from "express";
import Joi from "joi";
import UserModel from "../model/user.model";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendVerificationEmail from "../utils/OTP";

import axios from "axios";

import AgentModel from "../model/agent.model";

interface UserDetails {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  otp: string;
}

const signUpSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required().lowercase(),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
  gender: Joi.string().valid("male", "female", "other"),
  phone: Joi.string().required(),
  address: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  postalCode: Joi.string(),
  country: Joi.string(),
});
const otpTokenSchema = Joi.object({
  otp: Joi.string().length(6).required(),
  token: Joi.string(),
});

const signUp = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error } = signUpSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { fullName, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "User already exists! Please login",
      });
    }

    // Generate OTP
    const generatedOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Send OTP email
    await sendVerificationEmail(email, generatedOtp);

    // Generate token with user details and OTP
    const tokenPayload = {
      fullName,
      email,
      password,
      phone,
      otp: generatedOtp,
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    // Set cookies with the token and OTP
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    res.cookie("otp", generatedOtp, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      token: token,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User registration failed, please try again",
    });
  }
};

const validateOtpAndCreateUser = async (req: any, res: Response): Promise<Response> => {
  try {
    // Validate request body
    // const { error } = otpTokenSchema.validate(req.body);

    // if (error) {
    //   return res.status(400).json({
    //     success: false,
    //     message: error.details[0].message,
    //   });
    //}

    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Missing token or OTP in request body",
      });
    }

    // Validate OTP
    if (otp !== req.user.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // // Hash the password
    const hashPassword = await bcrypt.hash(req.user.password, 10);
    const existingUser = await UserModel.findOne({ email: req.user.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists, please sign in",
      });
    }

    // // Create user in your system without locationId
    const user = await UserModel.create({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      fullName: req.user.fullName,
      email: req.user.email,
      password: hashPassword,
      gender: req.user.gender,
      phone: req.user.phone,
      address: req.user.address,
      city: req.user.city,
      state: req.user.state,
      country: req.user.country,
      postalCode: req.user.postalCode,
      locationIds: [],
    });

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      user,
      message: "User registered successfully",
      token,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred",
    });
  }
};

const signInSchema = Joi.object({
  email: Joi.string().email().required().lowercase().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

const signin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { error, value } = signInSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((detail) => ({ msg: detail.message })),
      });
    }

    const { email, password } = value;

    const signUser = await UserModel.findOne({ email });
    if (!signUser) {
      return res.status(400).json({
        success: false,
        message: "User not found! Please SignUp first",
      });
    }

    // Compare password and signIn
    if (await bcrypt.compare(password, signUser.password)) {
      const token = jwt.sign(
        {
          email: signUser.email,
          id: signUser._id,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "7d",
        }
      );

      const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options);

      return res.status(200).json({
        success: true,
        token,
        user: signUser,
        message: "User Login Success",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password incorrect, please try again!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User Login failed, please try again",
    });
  }
};

const resendOtp = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, fullName, password, confirmPassword, phone } = req.body;

    // Validate all required fields
    if (!email || !fullName || !password || !confirmPassword || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "Email, full name, password, confirm password, and phone are all required",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Generate a new OTP
    const newOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Send the new OTP via email
    await sendVerificationEmail(email, newOtp);

    // Generate a new token with the updated OTP
    const tokenPayload = {
      fullName,
      email,
      password,
      phone,
      otp: newOtp,
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    // Update cookies with the new token and OTP
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    res.cookie("otp", newOtp, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      token,
    });
  } catch (error: any) {
    console.error("Error in resending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP, please try again",
    });
  }
};

const getCurrentUser = async (req: any, res: Response): Promise<Response> => {
  const user = req.user;

  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user,
  });
};

const resetPasswordToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // Generate an OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Send the OTP via email
    await sendVerificationEmail(email, otp);

    // Create a token payload
    const tokenPayload = {
      email,
      otp,
    };

    // Generate a reset token with the payload
    const resetToken = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Send response back to the client
    return res.status(200).json({
      success: true,
      message: "Password reset token sent to your email",
      resetToken,
    });
  } catch (err: any) {
    console.error("Error resetting password:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting the password",
    });
  }
};

const resetConfirmOtp = async (req: any, res: Response): Promise<Response> => {
  try {
    const { otpCode } = req.body;
    const { email, otp } = req.user;
    console.log("Here is the things", email, otpCode, otp)
    if (!otpCode) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all details.",
      });
    }

    // Verify the OTP
    if (otpCode !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist.",
      });
    }

    const id = existingUser._id;
    const tokenPayload = { email, id };

    const newToken = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      success: true,
      newToken,
      message: "OTP verified successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying the OTP.",
    });
  }
};

const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { password, confirmPassword, email } = req.body;

    // Validate that all required fields are provided
    if (!password || !confirmPassword || !email) {
      return res.status(400).json({
        success: false,
        message: "OTP, email, password, and confirmPassword are required.",
      });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // Find the user by email
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist.",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    existingUser.password = hashPassword;
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (err: any) {
    console.error("Error resetting password:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting the password.",
    });
  }
};

export {
  signUp,
  validateOtpAndCreateUser,
  signin,
  getCurrentUser,
  resendOtp,
  resetPasswordToken,
  resetPassword,
  resetConfirmOtp,
};
