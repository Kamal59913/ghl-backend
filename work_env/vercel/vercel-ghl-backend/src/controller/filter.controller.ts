import { Request, Response } from "express";
import PropertyFormModel from "../model/property.model";

const priceFilter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { minPrice, maxPrice, offset = 0, limit = 10 } = req.body;

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
        message:
          "Invalid offset or limit values. Offset must be non-negative and limit must be positive.",
      });
      return;
    }

    if (typeof minPrice !== "number" || typeof maxPrice !== "number") {
      res.status(400).json({
        success: false,
        message: "minPrice and maxPrice should be numbers",
      });
      return;
    }

    const properties = await PropertyFormModel.find({
      price: { $gte: minPrice, $lte: maxPrice },
    })
      .skip(offsetNumber)
      .limit(limitNumber);

    if (properties.length === 0) {
      res.status(404).json({
        success: false,
        message: "No properties found within the specified price range",
      });
      return;
    }

    res.status(200).json({
      success: true,
      totalFilteredData: properties.length,
      data: properties,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while filtering by price",
      error: err.message,
    });
  }
};

const bedbathFilter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bed, bath, offset = 0, limit = 10 } = req.body;
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
        message:
          "Invalid offset or limit values. Offset must be non-negative and limit must be positive.",
      });
      return;
    }

    if (typeof bed !== "number" || typeof bath !== "number") {
      res.status(400).json({
        success: false,
        message: "Bed and bath should be numbers",
      });
      return;
    }

    const filterAggregate = await PropertyFormModel.aggregate([
      {
        $match: {
          bedrooms: { $gte: bed },
          bathrooms: { $gte: bath },
        },
      },
      {
        $skip: offsetNumber,
      },
      {
        $limit: limitNumber,
      },
    ]);

    if (filterAggregate.length === 0) {
      res.status(404).json({
        success: false,
        message: "No properties found matching the criteria",
      });
      return;
    }

    res.status(200).json({
      success: true,
      totalFilteredData: filterAggregate.length,
      data: filterAggregate,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while filtering by bed and bath",
      error: err.message,
    });
  }
};

const multiFilter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { offset = 0, limit = 10, ...filters } = req.body;

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
        message:
          "Invalid offset or limit values. Offset must be non-negative and limit must be positive.",
      });
      return;
    }

    const filterQuery: any = {};
    if (filters.minPrice) {
      filterQuery.price = {
        $gte: parseInt(filters.minPrice.replace("$", "").replace(",", "")),
      };
    }

    if (filters.maxPrice) {
      filterQuery.price = {
        ...filterQuery.price,
        $lte: parseInt(filters.maxPrice.replace(/[$,]/g, "")),
      };
    }

    if (filters.bedrooms) filterQuery.bedrooms = parseInt(filters.bedrooms);
    if (filters.bathrooms) filterQuery.bathrooms = parseInt(filters.bathrooms);

    if (filters.squareFeetMin !== "0") {
      if (filters.squareFeetMin != undefined) {
        const squareFeetMin = parseInt(filters.squareFeetMin);
        filterQuery.price_sqft = { $gte: squareFeetMin };
      }
    }

    if (filters.squareFeetMax !== "0") {
      if (filters.squareFeetMin != undefined) {
        const squareFeetMax = parseInt(filters.squareFeetMax);
        filterQuery.price_sqft = { ...filterQuery.price_sqft, $lte: squareFeetMax };
      }
    }

    if (filters.yearBuiltMin !== "0") {
      if (filters.yearBuiltMin != undefined) {
        const yearBuiltMin = parseInt(filters.yearBuiltMin);
        filterQuery.year_built = { $gte: yearBuiltMin };
      }
    }

    if (filters.yearBuiltMax !== "0") {
      if (filters.yearBuiltMin != undefined) {
        const yearBuiltMax = parseInt(filters.yearBuiltMax);
        filterQuery.year_built = { ...filterQuery.year_built, $lte: yearBuiltMax };
      }
    }
    if (filters.lotSizeMin !== "0") {
      if (filters.lotSizeMin != undefined) {
        const lotSizeMin = filters.lotSizeMin;
        filterQuery.lot_size = { $gte: lotSizeMin };
      }
    }

    if (filters.lotSizeMax !== "0") {
      if (filters.lotSizeMax != undefined) {
        const lotSizeMax = filters.lotSizeMax;
        filterQuery.lot_size = { ...filterQuery.lot_size, $lte: lotSizeMax };
      }
    }

    if (filters.parkingSpots !== "0") {
      if (filters.parkingSpots != undefined) {
        const parkingSpots = filters.parkingSpots;
        filterQuery.space_for_cars = { $gte: parkingSpots };
      }
    }

    if (filters.propType !== undefined) filterQuery.prop_type = filters.propType;
    if (filters.isAvailable !== undefined) filterQuery.is_available = filters.isAvailable;
    // if (filters.isDelete !== undefined) filterQuery.is_delete = filters.isDelete;
    // if (filters.isDelete !== undefined) filterQuery.is_delete = filters.isDelete;

    // Query the database
    const totalFilteredData = await PropertyFormModel.countDocuments(filterQuery);

    const data = await PropertyFormModel.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(offsetNumber)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total: totalFilteredData,
        offset: offsetNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalFilteredData / limitNumber),
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while filtering data",
      error: err.message,
    });
  }
};

const newestFilter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { newProperty, oldProperty } = req.body;
    if (newProperty) {
      const newest = await PropertyFormModel.aggregate([{ $sort: { created_at: -1 } }]);

      res.status(200).json({
        success: true,
        message: "Successfully fetched newest data",
        newest,
      });
    }
    if (oldProperty) {
      const oldest = await PropertyFormModel.aggregate([{ $sort: { created_at: 1 } }]);

      res.status(200).json({
        success: true,
        message: "Successfully fetched newest data",
        oldest,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while filtering data",
      error: err.message,
    });
  }
};

export { priceFilter, bedbathFilter, multiFilter, newestFilter };
