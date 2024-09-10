import mongoose, { model, Schema } from "mongoose";

export type SaveSearchType = {
  userId: mongoose.Schema.Types.ObjectId;
  priceRange: { min: number; max: number };
  sqftRange: { min: number; max: number };
  beds: number;
  baths: number;
  yearAge?: number;
  locations: {
    city: string;
    state: string;
    zip: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    range?: number;
  }[];
  alertPreference: "Email" | "Text";
  alertFrequency: "Immediately" | "Daily" | "Weekly" | "Monthly";
  lastAlertSent?: Date;
};

const saveSearchSchema = new Schema<SaveSearchType>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    priceRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    sqftRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    beds: { type: Number, default: 0 },
    baths: { type: Number, default: 0 },
    yearAge: { type: Number },
    locations: [
      {
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        coordinates: {
          latitude: { type: Number, required: true },
          longitude: { type: Number, required: true },
        },
        range: { type: Number, default: 50 },
      },
    ],
    alertPreference: {
      type: String,
      enum: ["email", "text"],
    },
    alertFrequency: {
      type: String,
      enum: ["Immediately", "Daily", "Weekly", "Monthly"],
    },
    lastAlertSent: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const saveSearchModel = model<SaveSearchType>("SaveSearch", saveSearchSchema);

export { saveSearchModel };
