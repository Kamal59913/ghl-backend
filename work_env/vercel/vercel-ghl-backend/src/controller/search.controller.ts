import { Request, Response } from "express";
import PropertyFormModel from "../model/property.model";
const escapeRegExp = (string: string): string => {
  // Escape special characters for use in the regular expression
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const searchControl = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { searchWord, offset = 0, limit = 10 } = req.body;

    if (!searchWord) {
      return res.status(400).json({
        success: false,
        message: "Search word is required",
      });
    }

    const offsetNumber = Number(offset);
    const limitNumber = Number(limit);

    if (
      isNaN(offsetNumber) ||
      isNaN(limitNumber) ||
      offsetNumber < 0 ||
      limitNumber <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid offset or limit values",
      });
    }

    const normalizedSearchWord = escapeRegExp(
      searchWord.trim().toLowerCase().replace(/-/g, " ")
    );
    const searchPattern = new RegExp(normalizedSearchWord.split("").join(".*?"), "i");

    // Perform the search with pagination
    const propertyList = await PropertyFormModel.find({
      $or: [
        { property_name: { $regex: searchPattern } },
        { address: { $regex: searchPattern } },
        { city: { $regex: searchPattern } },
        { desc_title: { $regex: searchPattern } },
        // { is_delete: { $rejex: false } },
      ],
    })
      .skip(offsetNumber)
      .limit(limitNumber);

    // Get the total count of search results (without pagination)
    const totalItems = await PropertyFormModel.countDocuments({
      $or: [
        { property_name: { $regex: searchPattern } },
        { address: { $regex: searchPattern } },
        { city: { $regex: searchPattern } },
        { desc_title: { $regex: searchPattern } },
        // { is_delete: { $rejex: false } },
      ],
    });

    if (totalItems === 0) {
      return res.status(200).json({
        success: true,
        message: "No properties found",
        data: [],
        pagination: {
          totalItems,
          offset: offsetNumber,
          limit: limitNumber,
          totalPages: 0,
        },
      });
    }

    // Return search results with pagination info
    return res.status(200).json({
      success: true,
      data: propertyList,
      pagination: {
        totalItems,
        offset: offsetNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalItems / limitNumber),
      },
    });
  } catch (err: any) {
    console.error("Error during property search:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while searching for properties",
    });
  }
};

export { searchControl };
