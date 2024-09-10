import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { Request, Response, NextFunction } from "express";
import UserModel from "../model/user.model";
import AgentModel from "../model/agent.model";

config();

interface AuthRequest extends Request {
  user?: any;
}

class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header("Authorization");
    const token =
      req.cookies?.token ||
      req.body?.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : undefined);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token missing",
      });
      return;
    }

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { id: string };

      if (!decodedToken || !decodedToken.id) {
        throw new ApiError(401, "Invalid access token");
      }

      const user = await UserModel.findById(decodedToken.id).select(
        "-password"
      );

      if(user) {
      const agent = await AgentModel.findOne({email: user.email});
      if (agent) {
        user.isAgent = true;
        await user.save(); 
      }
    }

      if (!user) {
        throw new ApiError(401, "Invalid access token");
      }

      req.user = user;
      next();
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || "Invalid access token",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      error: "Something went wrong during token validation",
    });
  }
};

export { auth };
