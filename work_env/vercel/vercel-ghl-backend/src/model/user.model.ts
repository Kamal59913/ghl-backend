import { model, Schema } from "mongoose";

export type userType = {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  locationIds: { locationId: string; contactId?: string }[];
  gender: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  image: string;
  opportunities: {
    opportunityId: string;
    propertyId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
  conversation: string[];
  isAgent: boolean;
};

const userSchema = new Schema<userType>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    fullName: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    locationIds: [
      {
        locationId: {
          type: String,
          required: true,
        },
        contactId: {
          type: String,
        },
      },
    ],
    gender: {
      type: String,
    },
    phone: {
      required: true,
      type: String,
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
    postalCode: {
      type: String,
    },
    country: {
      type: String,
    },
    image: {
      type: String,
    },
    isAgent: {
      type: Boolean,
      required: true,
      default: false
    },
    opportunities: [
      {
        opportunityId: {
          type: String,
          required: true,
        },
        propertyId: {
          type: String,
        },
        status: {
          type: String,
        },

        createdAt: {
          type: String,
        },
        updatedAt: {
          type: String,
        },
      },
    ],
    
  },
  {
    timestamps: true,
  }
);

const UserModel = model("user", userSchema);
export default UserModel;
