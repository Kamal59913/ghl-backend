import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) {
      console.log("No file path provided");
      return null;
    }

    // Check if the file exists before attempting to upload
    if (!fs.existsSync(localFilePath)) {
      console.log(`File not found: ${localFilePath}`);
      return null;
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Delete the local file after successful upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error: any) {
    console.error("Error uploading file to Cloudinary:", error.message);

    // Ensure the file is deleted even if an error occurs
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };
