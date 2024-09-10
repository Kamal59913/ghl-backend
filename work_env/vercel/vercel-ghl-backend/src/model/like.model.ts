import { Schema, model, Document } from "mongoose";

interface ILike extends Document {
  property: Schema.Types.ObjectId;
  likedBy: Schema.Types.ObjectId;
}

const likeSchema = new Schema<ILike>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "PropertyForm",
      required: true,
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);


export const Likes = model<ILike>("Likes", likeSchema);
