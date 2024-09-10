import { Schema, model, Document } from "mongoose";

enum SubscriptionStatus {
  Active = "active",
  Inactive = "inactive",
  Cancelled = "cancelled",
}

// Define the Payment type
export interface Payment extends Document {
  agentId: Schema.Types.ObjectId;
  subscriptionId: string;
  subscriptionPlan: string;
  subscriptionStatus: SubscriptionStatus;
}

const paymentSchema = new Schema<Payment>({
  agentId: {
    type: Schema.Types.ObjectId,
    ref: "Agent",
    required: true,
  },
  subscriptionId: {
    type: String,
    required: true,
  },
  subscriptionPlan: {
    type: String,
    required: true,
  },
  subscriptionStatus: {
    type: String,
    enum: Object.values(SubscriptionStatus),
    required: true,
  },
});

const PaymentModel = model<Payment>("Payment", paymentSchema);
export default PaymentModel;
