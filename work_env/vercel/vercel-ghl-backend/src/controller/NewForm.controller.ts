import { Request, Response } from "express";
import { uploadOnCloudinary } from "../utils/imageUploader";
import { geocodeAddress } from "../utils/customfunction";
import PropertyFormModel from "../model/property.model";
import mongoose from "mongoose";

interface FormData {
  property_id: any;
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
  image: any[];
  year_built: number;
  est_rent: number;
  roof: string;
  price_sqft: number;
  hvac: string;
  taxes: number;
  prop_type: string;
  hoa_fees: number;
  lot_size: number;
  desc_title: string;
  desc_detail: string;
  property_documents: any[];
  image360: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

const uploadFiles = async (files: Express.Multer.File[]): Promise<string[]> => {
  const urls: string[] = [];
  for (const file of files) {
    const imagePath = file.path;
    const uploadedFile = await uploadOnCloudinary(imagePath);
    if (uploadedFile) {
      urls.push(uploadedFile.url);
    }
  }
  return urls;
};

const addProperty = async (req: Request, res: Response): Promise<Response> => {
  try {
    let files = req.files as Express.Multer.File[] | undefined;

    const { state, city, postal_code, country, address } = req.body as FormData;
    const { property_name } = req.body;
    const image360 = files?.find((file) => file.fieldname === "image360");
    const video = files?.find((file) => file.fieldname === "video_link");


    console.log("Here are the video file", files)

    const requiredFields = [
      "property_name",
      "state",
      "city",
      "postal_code",
      "country",
      "address",
      "bedrooms",
      "space_for_cars",
      "email",
      "bathrooms",
      "size",
      "price",
      "year_built",
      "est_rent",
      "roof",
      "price_sqft",
      "hvac",
      "taxes",
      "prop_type",
      "hoa_fees",
      "lot_size",
      "desc_title",
      // "desc_detail",
    ];

    // Check if all required fields are present in the request body
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const existingProperty = await PropertyFormModel.findOne({
      $and: [{ property_name }, { city }],
    });

    if (existingProperty) {
      return res.status(400).json({
        success: false,
        message: "Property with the same name or city already exists",
      });
    }

    if (!files) {
      files = [];
    }

    // Separate images and documents
    const images = files.filter((file) => file.mimetype.startsWith("image/"));
    const documents = files.filter((file) => file.mimetype.startsWith("application/"));

    // Handle 3D image separately
    let threeDImageUrl = "";
    if (image360) {
      //console.log(image360);
      const uploadedImage: any = await uploadOnCloudinary(image360.path);
      console.log(uploadedImage.url);
      if (uploadedImage) {
        threeDImageUrl = uploadedImage.url; // Access URL only if uploadedImage is not null
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to upload 360 image",
        });
      }
    }
    //upload video
    let videoUrl = "";
    if (video) {
      //console.log(video);
      const uploadedVideo: any = await uploadOnCloudinary(video.path);
      console.log(uploadedVideo.url);
      if (uploadedVideo) {
        videoUrl = uploadedVideo.url;
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to upload video",
        });
      }
    }

    // Upload images and documents
    const imageUrls = await uploadFiles(images);
    const documentUrls = await uploadFiles(documents);

    // Prepare property documents data
    const propertyDocuments = documentUrls.map((file) => ({
      document: file,
    }));

    // Geocode address to get latitude and longitude
    const location = await geocodeAddress(state, city, postal_code, country, address);

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Geocoding failed. Could not determine the property's location.",
      });
    }

    const { lat, lng } = location;

    const newProperty = new PropertyFormModel({
      ...req.body,
      image: imageUrls,
      property_documents: propertyDocuments,
      image360: threeDImageUrl,
      video_link: videoUrl,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    // Save the new property
    await newProperty.save();

    return res.status(201).json({
      success: true,
      message: "Property added successfully",
      property: newProperty,
    });
  } catch (err) {
    let message = "An error occurred while adding the property.";
    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(500).json({
      success: false,
      message,
    });
  }
};

const editProperty = async (req: Request, res: Response): Promise<Response> => {  
  try {
    const { property_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(property_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID format",
      });
    }
    const { state, city, postal_code, country, address, property_name } =
      req.body as FormData;

    let files = req.files as Express.Multer.File[] | undefined;

    // Validate required fields
    const requiredFields = [
      "property_name",
      "state",
      "city",
      "postal_code",
      "country",
      "address",
      "bedrooms",
      "space_for_cars",
      "email",
      "bathrooms",
      "size",
      "price",
      "year_built",
      "est_rent",
      "roof",
      "price_sqft",
      "hvac",
      "taxes",
      "prop_type",
      "hoa_fees",
      "lot_size",
      "desc_title",
      // "desc_detail",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Find the existing property
    const existingProperty = await PropertyFormModel.findById(property_id);

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Separate images and documents
    let imageUrls: string[] = [];
    let propertyDocuments: { document: string }[] = [];

    if (files) {
      const images = (files as Express.Multer.File[]).filter((file) =>
        file.mimetype.startsWith("image/")
      );
      const documents = (files as Express.Multer.File[]).filter((file) =>
        file.mimetype.startsWith("application/")
      );

      // Upload new images and documents
      imageUrls = await uploadFiles(images);
      const documentUrls = await uploadFiles(documents);

      propertyDocuments = documentUrls.map((file) => ({
        document: file,
      }));
    }

    // Geocode address to get latitude and longitude
    const location = await geocodeAddress(state, city, postal_code, country, address);

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Geocoding failed. Could not determine the property's location.",
      });
    }

    const { lat, lng } = location;

    // Update property details
    existingProperty.set({
      ...req.body,
      image: imageUrls.length > 0 ? imageUrls : existingProperty.image,
      property_documents:
        propertyDocuments.length > 0
          ? propertyDocuments
          : existingProperty.property_documents,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    // Save the updated property
    await existingProperty.save();

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: existingProperty,
    });
  } catch (err) {
    let message = "An error occurred while updating the property.";
    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(500).json({
      success: false,
      message,
    });
  }
};

const editPropertySingleItem = async (req: Request, res: Response): Promise<Response> => {  
  try {
    console.log("reached here at least")
    let files = req.files as Express.Multer.File[] | undefined;

    const { property_id } = req.params;
    const { state, city, postal_code, country, address, matterport } = req.body as any;
    const image360 = files?.find((file) => file.fieldname === "image360");
    const video = files?.find((file) => file.fieldname === "video_link");

    if (!mongoose.Types.ObjectId.isValid(property_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID format",
      });
    }
 



    // Find the existing property
    const existingProperty = await PropertyFormModel.findById(property_id);

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (!files) {
      files = [];
    }


      // Separate images and documents
      const images = files.filter((file) => file.mimetype.startsWith("image/"));
      const documents = files.filter((file) => file.mimetype.startsWith("application/"));
  
      // Handle 3D image separately
      let threeDImageUrl = "";
      if (image360) {
        //console.log(image360);
        const uploadedImage: any = await uploadOnCloudinary(image360.path);
        console.log(uploadedImage.url);
        if (uploadedImage) {
          threeDImageUrl = uploadedImage.url; // Access URL only if uploadedImage is not null
        } else {
          return res.status(500).json({
            success: false,
            message: "Failed to upload 360 image",
          });
        }
      }
      //upload video
      let videoUrl = "";
      if (video) {
        //console.log(video);
        const uploadedVideo: any = await uploadOnCloudinary(video.path);
        console.log(uploadedVideo.url);
        if (uploadedVideo) {
          videoUrl = uploadedVideo.url;
        } else {
          return res.status(500).json({
            success: false,
            message: "Failed to upload video",
          });
        }
      }
  
      // Upload images and documents
      const imageUrls = await uploadFiles(images);
      const documentUrls = await uploadFiles(documents);
  
      // Prepare property documents data
      const propertyDocuments = documentUrls.map((file) => ({
        document: file,
      }));
  
      // Geocode address to get latitude and longitude
      const location = await geocodeAddress(state, city, postal_code, country, address);
  
      if (!location) {
        return res.status(400).json({
          success: false,
          message: "Geocoding failed. Could not determine the property's location.",
        });
      }
  
      const { lat, lng } = location;
  
      existingProperty.set({
        ...req.body,
        image: imageUrls,
        property_documents: propertyDocuments,
        image360: threeDImageUrl,
        video_link: videoUrl,
        matterport: matterport,
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
      });
  
      // Save the new property
      await existingProperty.save();
  
    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: existingProperty,
    });
  } catch (err) {
    let message = "An error occurred while updating the property.";
    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(500).json({
      success: false,
      message,
    });
  }
};

const saveCompController = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log("reached here blah blah");
    
    const { property_id } = req.params;
    const { comparable } = req.body;

    console.log(property_id, comparable);

    // Find the existing property
    const existingProperty = await PropertyFormModel.findById(property_id);

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Update the comps array of the existing property
    existingProperty.comps = comparable.map((comp: any) => ({
      full_address: comp.fullAddress,
      square_feet: comp.squareFeet,
      bedrooms: comp.compbedrooms,
      bathrooms: comp.compbathrooms,
      sale_price: comp.saleprice,
      sale_date: comp.saleDate,
      distance: comp.distance,
    }));

    // Save the updated property with new comps
    await existingProperty.save();

    return res.status(200).json({
      success: true,
      message: "Property comps updated successfully",
      property: existingProperty, // Return updated property data
    });
  } catch (err) {
    let message = "An error occurred while updating the property comps.";
    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(500).json({
      success: false,
      message,
    });
  }
};




const deleteProperty = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { property_id, fullAddress,
      squareFeet,
        compbedrooms,
        compbathrooms,
        saleprice,
        saleDate,
        distance } = req.body;

    const existingProperty = await PropertyFormModel.findById(property_id);
    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const updatedProperty = await PropertyFormModel.findByIdAndUpdate(
      property_id,
      { is_delete: true },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Property successfully deleted",
      data: updatedProperty,
    });
  } catch (err) {
    let message = "An error occurred while updating the property.";
    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(500).json({
      success: false,
      message,
    });
  }
};

const changeStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        mssg: "Property ID is missing",
      });
    }

    // Update the property status
    const updateProperty = await PropertyFormModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updateProperty) {
      return res.status(404).json({
        success: false,
        mssg: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      mssg: "Property status updated successfully",
      data: updateProperty,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      success: false,
      mssg: "An error occurred while updating the property status",
    });
  }
};

export { addProperty, editProperty, deleteProperty, changeStatus, editPropertySingleItem, saveCompController };
