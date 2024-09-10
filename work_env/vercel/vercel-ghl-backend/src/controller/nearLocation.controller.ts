import { Request, Response } from "express";
import PropertyFormModel from "../model/property.model";

const nearLocation = async (req: Request, res: Response): Promise<void> => {
  const { longitude, latitude, distance } = req.body;

  if (!longitude || !latitude || !distance) {
    res.status(400).json({
      success: false,
      error: "Missing required query parameters: longitude, latitude, distance",
    });
    return;
  }

  try {
    const lon = parseFloat(longitude as string);
    const lat = parseFloat(latitude as string);
    const dist = parseFloat(distance as string);

    if (
      isNaN(lon) ||
      isNaN(lat) ||
      isNaN(dist) ||
      lon < -180 ||
      lon > 180 ||
      lat < -90 ||
      lat > 90
    ) {
      res.status(400).json({
        success: false,
        error:
          "Invalid query parameter values. Latitude must be between -90 and 90. Longitude must be between -180 and 180.",
      });
      return;
    }

    const nearbyProperties = await PropertyFormModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lon, lat],
          },
          distanceField: "distance",
          maxDistance: dist * 1609.34,
          spherical: true,
        },
      },
      {
        $match: {
          distance: { $gt: 0 },
        },
      },
      {
        $project: {
          property_id: 1,
          property_name: 1,
          state: 1,
          city: 1,
          postal_code: 1,
          country: 1,
          address: 1,
          bedrooms: 1,
          space_for_cars: 1,
          email: 1,
          bathrooms: 1,
          size: 1,
          price: 1,
          image: 1,
          year_built: 1,
          est_rent: 1,
          roof: 1,
          price_sqft: 1,
          hvac: 1,
          taxes: 1,
          prop_type: 1,
          hoa_fees: 1,
          lot_size: 1,
          desc_title: 1,
          desc_detail: 1,
          property_documents: 1,
          location: 1,
          distance: { $round: [{ $divide: ["$distance", 1000] }, 2] },
        },
      },
    ]);

    if (nearbyProperties.length === 0) {
      res.status(404).json({
        success: true,
        message: "No properties found at the specified location",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "All properties found at the specified location",
      totalPropertyNearLocation: nearbyProperties.length,
      properties: nearbyProperties,
    });
  } catch (error) {
    console.error("Error finding nearby properties:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export { nearLocation };
