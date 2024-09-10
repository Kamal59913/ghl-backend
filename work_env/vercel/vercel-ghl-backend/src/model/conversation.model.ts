import { model, Schema } from "mongoose";

export type conversationType = {
  conversationId: string;
  locationId: string;
  dateAdded: string;
  dateUpdated: string;
  lastmessage: string;
  contactId: string;
  fullName: string;
  contactName: string;
  messages: {
    messageId: string;
    locationId: string;
    contactId: string;
    messageBody: string;
  }[];
};

const conversationSchema = new Schema<conversationType>(
  {
    conversationId: {
      type: String,
    },
    locationId: {
      type: String,
    },
    dateAdded: {
      type: String,
    },
    dateUpdated: {
      type: String,
    },
    lastmessage: {
      type: String,
    },
    contactId: {
      type: String,
    },
    fullName: {
      type: String,
    },
    contactName: {
      type: String,
    },
    messages: [
      {
        messageId: {
          type: String,
        },
        locationId: {
          type: String,
        },
        contactId: {
          type: String,
        },
        messageBody: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const conversationModel = model("conversations", conversationSchema);
export default conversationModel;
