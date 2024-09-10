import { Request, Response } from "express";
import { Likes } from "../model/like.model";
import mongoose from "mongoose";

const likeController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId, userId } = req.body;

    // Check if the like already exists
    const existingLike = await Likes.findOne({
      property: propertyId,
      likedBy: userId,   
    });

    if (existingLike) {
      await Likes.deleteOne({ _id: existingLike._id });
      res.status(200).json({
        success: true,
        message: "Like removed",
      });
    } else {
      const newLike = new Likes({
        property: propertyId,
        likedBy: userId,
      });
      await newLike.save();
      res.status(200).json({
        success: true,
        message: "Like added",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllLikes = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body;
  try {
    const likedByuser = await Likes.find({ likedBy: userId });
    if (likedByuser) {
      res.status(200).json({
        success: true,
        likedBy: likedByuser,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const likedPropertyList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.body;

    const listAggregate = await Likes.aggregate([
      // Pipeline 1: Lookup PropertyForm
      {
        $lookup: {
          from: "propertyforms",
          localField: "property",
          foreignField: "_id",
          as: "likedProperty",
        },
      },
      // Pipeline 2: Lookup User
      {
        $lookup: {
          from: "users",
          localField: "likedBy",
          foreignField: "_id",
          as: "user",
        },
      },
      // Pipeline 3: Match
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(userId),
        },
      },
      // Pipeline 4: Unwind likedProperty to extract properties
      {
        $unwind: {
          path: "$likedProperty",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Pipeline 5: Unwind user to extract user details
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Pipeline 6: Project the required fields
      {
        $project: {
          property_id: "$likedProperty._id",
          property_name: "$likedProperty.property_name",
          state: "$likedProperty.state",
          city: "$likedProperty.city",
          postal_code: "$likedProperty.postal_code",
          country: "$likedProperty.country",
          address: "$likedProperty.address",
          bedrooms: "$likedProperty.bedrooms",
          space_for_cars: "$likedProperty.space_for_cars",
          email: "$likedProperty.email",
          bathrooms: "$likedProperty.bathrooms",
          size: "$likedProperty.size",
          price: "$likedProperty.price",
          image: "$likedProperty.image",
          is_available: "$likedProperty.is_available",
          is_delete: "$likedProperty.is_delete",
          year_built: "$likedProperty.year_built",
          list_date: "$likedProperty.list_date",
          est_rent: "$likedProperty.est_rent",
          roof: "$likedProperty.roof",
          price_sqft: "$likedProperty.price_sqft",
          hvac: "$likedProperty.hvac",
          taxes: "$likedProperty.taxes",
          prop_type: "$likedProperty.prop_type",
          hoa_fees: "$likedProperty.hoa_fees",
          lot_size: "$likedProperty.lot_size",
          desc_title: "$likedProperty.desc_title",
          desc_detail: "$likedProperty.desc_detail",
          property_documents: "$likedProperty.property_documents",
          user: {
            user_id: "$user._id",
            user_name: "$user.fullName",
          },
        },
      },
    ]);

    if (!listAggregate || listAggregate.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No properties found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      properties: listAggregate,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while fetching properties",
    });
  }
};

const likePagination = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, offset, limit } = req.body;

    if (typeof userId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const offsetNumber = Number(offset);
    const limitNumber = Number(limit);

    if (
      isNaN(offsetNumber) ||
      isNaN(limitNumber) ||
      offsetNumber < 0 ||
      limitNumber <= 0
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid offset or limit values",
      });
      return;
    }

    const likedPropertyList = await Likes.aggregate([
      // Pipeline 2: Lookup PropertyForm to get property details
      {
        $lookup: {
          from: "propertyforms",
          localField: "property",
          foreignField: "_id",
          as: "likedProperty",
        },
      },
      // Pipeline 3: Lookup User to get user details
      {
        $lookup: {
          from: "users",
          localField: "likedBy",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(userId),
        },
      },
      // Pipeline 4: Unwind likedProperty to extract properties
      {
        $unwind: {
          path: "$likedProperty",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Pipeline 5: Unwind user to extract user details
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Pipeline 6: Project the required fields
      {
        $project: {
          property_id: "$likedProperty._id",
          property_name: "$likedProperty.property_name",
          state: "$likedProperty.state",
          city: "$likedProperty.city",
          postal_code: "$likedProperty.postal_code",
          country: "$likedProperty.country",
          address: "$likedProperty.address",
          bedrooms: "$likedProperty.bedrooms",
          space_for_cars: "$likedProperty.space_for_cars",
          email: "$likedProperty.email",
          bathrooms: "$likedProperty.bathrooms",
          size: "$likedProperty.size",
          price: "$likedProperty.price",
          image: "$likedProperty.image",
          is_available: "$likedProperty.is_available",
          is_delete: "$likedProperty.is_delete",
          year_built: "$likedProperty.year_built",
          list_date: "$likedProperty.list_date",
          est_rent: "$likedProperty.est_rent",
          roof: "$likedProperty.roof",
          price_sqft: "$likedProperty.price_sqft",
          hvac: "$likedProperty.hvac",
          taxes: "$likedProperty.taxes",
          prop_type: "$likedProperty.prop_type",
          hoa_fees: "$likedProperty.hoa_fees",
          lot_size: "$likedProperty.lot_size",
          desc_title: "$likedProperty.desc_title",
          desc_detail: "$likedProperty.desc_detail",
          property_documents: "$likedProperty.property_documents",
          user: {
            user_id: "$user._id",
            user_name: "$user.fullName",
          },
        },
      },
      // Pipeline 7: Skip and limit for pagination
      {
        $skip: offsetNumber,
      },
      {
        $limit: limitNumber,
      },
    ]).exec();

    const totalLikedProperties = await Likes.countDocuments({
      likedBy: userId,
    }).exec();

    res.status(200).json({
      success: true,
      message: "Successfully fetched data for the given page",
      data: likedPropertyList,
      pagination: {
        total: totalLikedProperties,
        offset: offsetNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalLikedProperties / limitNumber),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching paginated data",
    });
  }
};

export { likeController, getAllLikes, likedPropertyList, likePagination };
