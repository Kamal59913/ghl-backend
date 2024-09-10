import { Request, Response } from "express";
import UserModel from "../model/user.model";
import reviewModel from "../model/review.model";
import mongoose from "mongoose";
import AgentModel from "../model/agent.model";

const calculateReadingTime = (text: string): string => {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const readingTimeInMinutes = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTimeInMinutes} min read`;
};

const addReviewAndRating = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user_id, agent_id, reviewBody, rating } = req.body;

    if (!user_id || !agent_id || !reviewBody || !rating) {
      return res.status(400).json({
        success: false,
        message: "Please make sure all fields are submitted.",
      });
    }

    const existingUser = await UserModel.findById(user_id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const existingReview = await reviewModel.findOne({ user_id, agent_id });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this agent.",
      });
    }

    const readingTime = calculateReadingTime(reviewBody);

    const newReview = new reviewModel({
      user_id,
      agent_id,
      reviewBody,
      rating,
      readingTime,
    });

    await newReview.save();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data: newReview,
    });
  } catch (err) {
    console.error("Error in adddReviewAndRating:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding the review.",
    });
  }
};

const showAllReviewAndRating = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { agentId } = req.body;
    
    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: "Agent ID is required.",
      });
    }

    const reviewAggregate = await reviewModel.aggregate([
      {
        $match: { agent_id: new mongoose.Types.ObjectId(agentId) },
      },
      {
        $lookup: {
          from: "agents",
          localField: "agent_id",
          foreignField: "_id",
          as: "agentDetails",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },

      {
        $unwind: {
          path: "$agentDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          agent: {
            agent_id: "$agentDetails._id",
            agent_name: "$agentDetails.name",
          },
          user: {
            user_id: "$userDetails._id",
            user_name: "$userDetails.fullName",
          },
        },
      },

      {
        $group: {
          _id: "$agentId",
          reviews: { $push: "$$ROOT" },
          averageRating: { $avg: { $toDouble: "$rating" } },
        },
      },

      {
        $addFields: {
          overallRating: {
            $round: ["$averageRating", 1],
          },
        },
      },

      {
        $project: {
          _id: 0,
          reviews: {
            reviewBody: 1,
            rating: 1,
            readingTime: 1,
            dateofReview: 1,
            user: 1,
            agent: 1,
          },
          overallRating: 1,
        },
      },
    ]);
    const totalReviews = reviewAggregate.reduce(
      (acc, group) => acc + group.reviews.length,
      0
    );
    return res.status(200).json({
      success: true,
      message: "Total Reviews with Overall Rating.",
      data: reviewAggregate,
      totalReviews: totalReviews,
    });
  } catch (err) {
    console.error("Error in showAllReviewAndRating:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the reviews.",
    });
  }
};

const editReviewAndRating = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { reviewId, reviewBody, rating } = req.body;

    if (!reviewId || !reviewBody || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide the review ID, review body, and rating.",
      });
    }

    const updatedReview = await reviewModel.findByIdAndUpdate(
      reviewId,
      { reviewBody, rating },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully edited review and rating.",
      data: updatedReview,
    });
  } catch (err) {
    console.error("Error in editReviewAndRating:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while editing the review.",
    });
  }
};

const getUserReview = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user_id, agent_id } = req.query;

    // Validate input
    if (!user_id || !agent_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide both user ID and agent ID.",
      });
    }

    const review = await reviewModel.findOne({ user_id, agent_id });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review retrieved successfully.",
      data: review,
    });
  } catch (err) {
    console.error("Error in getUserReview:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving the review.",
    });
  }
};

export {
  addReviewAndRating,
  showAllReviewAndRating,
  editReviewAndRating,
  getUserReview,
};
