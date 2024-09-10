import { Decimal128 } from "mongoose";
import mongoose, { model, Schema, Document } from "mongoose";

export interface OfferType extends Document {
  address: string;
  buyerName: string;
  askingPrice: number;
  offerPrice: Decimal128;
  fundingType: "cash" | "finance";
  emdAmount: Decimal128;
  emdDueDate: Date;
  coeDate: Date;
  offer_date: Date;
  status?: "accepted" | "rejected" | "pending";
  userId: Schema.Types.ObjectId;
  agentId: Schema.Types.ObjectId;
  propertyId: Schema.Types.ObjectId;
}

const offerSchema = new Schema<OfferType>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  agentId: {
    type: Schema.Types.ObjectId,
    ref: "agent",
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "propertyform",
  },
  buyerName: {
    type: String,
    required: true,
  },
  askingPrice: {
    type: Number,
    required: true,
  },
  offerPrice: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  fundingType: {
    type: String,
    enum: ["cash", "finance"],
    required: true,
  },
  emdAmount: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  emdDueDate: {
    type: Date,
    required: true,
  },
  coeDate: {
    type: Date,
    required: true,
  },
  offer_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["accepted", "rejected", "pending"],
    default: "pending",
  },
});

const OfferModel = model<OfferType>("Offer", offerSchema);

export default OfferModel;
