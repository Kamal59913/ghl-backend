import mongoose, { Document, Schema } from "mongoose";

interface IMessage extends Document {
  id: string;
  direction: "inbound" | "outbound";
  status:
    | "pending"
    | "scheduled"
    | "sent"
    | "delivered"
    | "read"
    | "undelivered"
    | "connected"
    | "failed"
    | "opened";
  type: number;
  locationId: string;
  body: string;
  contactId: string;
  contentType: string;
  conversationId: string;
  dateAdded: Date;
  source: string;
  messageType: string;
  userId?: string;
  attachments?: any[];
}

const messageSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    required: true,
    enum: ["inbound", "outbound"],
  },
  status: {
    type: String,
    required: true,
    enum: [
      "pending",
      "scheduled",
      "sent",
      "delivered",
      "read",
      "undelivered",
      "connected",
      "failed",
      "opened",
    ],
  },
  type: {
    type: Number,
    required: true,
  },
  locationId: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  contactId: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  conversationId: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    required: true,
  },
  userId: { type: String },
  attachments: {
    type: Array,
    default: [],
  },
});

interface IMessages extends Document {
  lastMessageId: string;
  nextPage: boolean;
  messages: IMessage[];
}

const messagesSchema: Schema = new Schema({
  lastMessageId: { type: String, required: true },
  nextPage: { type: Boolean, required: true },
  messages: [messageSchema],
});

const MessageModal = mongoose.model<IMessages>("messages", messagesSchema);

export default MessageModal;
