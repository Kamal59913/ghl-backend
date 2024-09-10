import { string } from "joi";
import { Schema, model } from "mongoose";

export type formType = {
  property_id: string;
  property_name: string;
  state: string;
  city: string;
  postal_code: string;
  country: string;
  address: string;
  bedrooms: number;
  space_for_cars: number;
  email: string;
  bathrooms: number;
  size: number;
  price: number;
  image: string[];
  is_available: boolean;
  is_delete: boolean;
  agents: Schema.Types.ObjectId;
  year_built: number;
  list_date: Date;
  est_rent: string;
  roof: string;
  price_sqft: string;
  hvac: string;
  taxes: string;
  prop_type: string;
  hoa_fees: string;
  lot_size: string;
  desc_title: string;
  desc_detail: string;
  property_documents: {
    document: string;
    meta: {
      originalname: string;
      mimetype: string;
    };
  }[];
  image360: string;
  matterport: string;
  video_link: string;
  location: {
    type: string;
    coordinates: [number, number]; 
  };
  status: string;
  
  comps: [{
    full_address: string;
    square_feet: string;
    bedrooms: string;
    bathrooms: string;
    sale_price: string;
    sale_date: string;
    distance: string;
  }];
};

const PropertyFormSchema = new Schema<formType>(
  {
    property_id: {
      type: String,
    },
    property_name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "sold"],
      default: "active",
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: false,
    },
    postal_code: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    space_for_cars: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    image360: {
      type: String,
    },
    matterport: {
      type: String,
    },
    is_available: {
      type: Boolean,
      required: true,
      default: true,
    },
    is_delete: {
      type: Boolean,
      required: true,
      default: false,
    },
    agents: {
      type: Schema.Types.ObjectId,
      ref: "agent",
    },
    year_built: {
      type: Number,
    },
    list_date: {
      type: Date,
      default: Date.now,
    },
    est_rent: {
      type: String,
    },
    roof: {
      type: String,
    },
    price_sqft: {
      type: String,
    },
    hvac: {
      type: String,
    },
    taxes: {
      type: String,
    },
    prop_type: {
      type: String,
    },
    hoa_fees: {
      type: String,
    },
    lot_size: {
      type: String,
    },
    desc_title: {
      type: String,
      required: true,
    },
    desc_detail: {
      type: String,
      // required: true,
    },
    video_link: {
      type: String,
      default: "",
    },
    property_documents: [
      {
        document: {
          type: String,
        },
        meta: {
          originalname: {
            type: String,
          },
          mimetype: {
            type: String,
          },
        },
      },
    ],

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    comps:[{
      full_address: { type: String },
      square_feet: { type: String },
      bedrooms: { type: String },
      bathrooms: { type: String },
      sale_price: { type: String },
      sale_date: { type: String },
      distance: { type: String },
    }],
  },
  {
    timestamps: true,
  }
);

// Create a 2dsphere index on the location field for geospatial queries

PropertyFormSchema.index({ location: "2dsphere" });
PropertyFormSchema.index({ list_date: 1 });
PropertyFormSchema.index({ is_delete: 1 });
const PropertyFormModel = model("PropertyForm", PropertyFormSchema);

export default PropertyFormModel;
