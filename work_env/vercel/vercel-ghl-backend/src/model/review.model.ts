import { model, Schema } from "mongoose";

export type reviewType = {
  user_id: object;
  agent_id: object;
  reviewBody: string;
  dateofReview: Date;
  rating: number;
  readingTime: string;
};

const reviewSchema = new Schema<reviewType>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  agent_id: {
    type: Schema.Types.ObjectId,
    ref: "agent",
    required: true,
  },
  reviewBody: {
    type: String,
    required: true,
  },
  dateofReview: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  readingTime: {
    type: String,
  },
});

const reviewModel = model("Review", reviewSchema);

export default reviewModel;
