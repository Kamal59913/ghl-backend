import { string } from "joi";
import { Schema, model } from "mongoose";

export type Location = {
  agentId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  timezone: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  chatId: string;
  social: {
    linkedIn: any;
    facebookUrl: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  settings: {
    allowDuplicateContact: boolean;
    allowDuplicateOpportunity: boolean;
    allowFacebookNameMerge: boolean;
    disableContactTimezone: boolean;
  };

  imageUrl: string;
  experience: string;
  bio: string;
  specialization: string;
  market_served: string;
  status: string;
  access_token: string;
};

const UserLocationSchema = new Schema<Location>(
  {
    agentId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    chatId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    website: {
      type: String,
    },
    timezone: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    social: {
      facebookUrl: {
        type: String,
      },
      linkedIn: {
        type: String,
      },
      twitter: {
        type: String,
      },
      instagram: {
        type: String,
      },
    },
    settings: {
      allowDuplicateContact: {
        type: Boolean,
        required: true,
      },
      allowDuplicateOpportunity: {
        type: Boolean,
        required: true,
      },
      allowFacebookNameMerge: {
        type: Boolean,
        required: true,
      },
      disableContactTimezone: {
        type: Boolean,
        required: true,
      },
    },
    imageUrl: {
      type: String,
      required: false,
    },
    experience: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    specialization: {
      type: String,
      default: "",
    },
    market_served: {
      type: String,
      default: "",
    },
    access_token: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const AgentModel = model("agent", UserLocationSchema);

export default AgentModel;
