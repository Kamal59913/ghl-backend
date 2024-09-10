import { string } from "joi";
import { Schema, model } from "mongoose";

export type agency = {
  refresh_token: string;
  access_token: string;
  companyId: string;
};

const agencyToken = new Schema<agency>(
  {
    refresh_token: {
      type: String,
    },
    access_token: {
      type: String,
    },
    companyId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const agencyAccessToken = model("agencytoken", agencyToken);

export default agencyAccessToken;
