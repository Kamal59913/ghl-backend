import { Response, Request } from "express";
import { geocodeAddress } from "../utils/customfunction";
import { saveSearchModel } from "../model/saveSearch.model";
import PropertyFormModel from "../model/property.model";
import sendSaveSearchEmail from "../utils/saveSearchMail";

const createSaveSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, priceRange, sqftRange, beds, baths, yearAge, locations } = req.body;

    // Validate if locations is an array
    if (!Array.isArray(locations)) {
      res.status(400).json({ error: "Locations should be an array" });
      return;
    }

    // Process and geocode each location
    const processedLocations = await Promise.all(
      locations.map(async (location: [any, any, any]) => {
        const [state, city, zip] = location;

        try {
          // Geocode the location to get coordinates

          const location = await geocodeAddress(state, city, zip);

          if (!location) {
            return res.status(400).json({
              success: false,
              message: "Geocoding failed. Could not determine the property's location.",
            });
          }

          const { lat, lng } = location;

          // Ensure lat and lng are defined, else use default values
          return {
            city,
            state,
            zip,
            coordinates: {
              latitude: lat !== undefined ? lat : null,
              longitude: lng !== undefined ? lng : null,
            },
            range: 50, // Default range value
          };
        } catch (error) {
          // Handle geocoding errors and use default values
          return {
            city,
            state,
            zip,
            coordinates: {
              latitude: null,
              longitude: null,
            },
            range: 50, // Default range value
          };
        }
      })
    );

    // Create a new PropertyAlert document
    const alert = new saveSearchModel({
      userId,
      priceRange,
      sqftRange,
      beds,
      baths,
      yearAge,
      locations: processedLocations,
    });

    // Save the alert to the database
    await alert.save();

    res.status(201).json({
      success: true,
      message: "Alert created successfully",
      alert,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Error creating alert",
      details: error.message,
    });
  }
};

const editSaveSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { alertId, alertPreference, alertFrequency } = req.body;

    // Fetch the alert from the database
    const alert = await saveSearchModel.findById(alertId);

    if (!alert) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }

    // Update the alert
    const updatedAlert = await saveSearchModel.findByIdAndUpdate(
      alertId,
      {
        alertPreference,
        alertFrequency,
      },
      { new: true }
    );

    // Check if the alert was updated
    if (!updatedAlert) {
      res.status(404).json({ error: "Failed to update alert" });
      return;
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Alert updated successfully",
      updatedAlert,
    });
  } catch (err: any) {
    console.error("Error editing save search:", err.message);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const checkAndSendAlertById = async (alertId: any): Promise<void> => {
  try {
    // Fetch the alert from the database
    const alert: any = await saveSearchModel.findById(alertId).populate("userId").exec();
    if (!alert) {
      console.error("Alert not found");
      return;
    }

    // Fetch properties that match the alert criteria
    try {
      const properties: any = await findPropertiesMatchingAlert(
        alert.locations,
        alert.priceRange,
        alert.sqftRange,
        alert.beds,
        alert.baths,
        alert.yearAge
      );
      if (properties.length > 0) {
        if (alert.alertPreference === "email") {
          sendSaveSearchEmail(alert.userId.email, properties);
        } else if (alert.alertPreference === "Text") {
          // Uncomment this line when the sendText function is implemented
          // sendText(alert.userId.phone, properties);
        }

        // Update the lastAlertSent field
        alert.lastAlertSent = new Date();
        await alert.save();
      }
    } catch (error: any) {
      console.error("Error checking alert by ID:", error.message);
    }
  } catch (error: any) {
    console.error("Error checking alert by ID:", error.message);
  }
};

// Function to find properties matching alert criteria
const findPropertiesMatchingAlert = async (
  locations: any[],
  priceRange: { min: number; max: number },
  sqftRange: { min: number; max: number },
  beds: number,
  baths: number,
  yearAge?: number
): Promise<any[]> => {
  let matchingProperties: any[] = [];
  for (const location of locations) {
    const longitude = location.coordinates.longitude;
    const latitude = location.coordinates.latitude;
    const properties = await PropertyFormModel.find({
      price: { $gte: priceRange.min, $lte: priceRange.max },
      size: { $gte: sqftRange.min, $lte: sqftRange.max },
      bedrooms: { $gte: beds },
      bathrooms: { $gte: baths },
      year_built: { $gte: yearAge },
      "location.coordinates": {
        $geoWithin: {
          $centerSphere: [
            [longitude, latitude],
            location.range / 6378.1, // Convert range to radians
          ],
        },
      },
    });

    matchingProperties = [...matchingProperties, ...properties];
  }
  //console.log("matching proprty:m ", matchingProperties);
  return matchingProperties;
};

//edit save search
const deleteSeacrchStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { alertId } = req.body;

    // Fetch the alert from the database
    const alert = await saveSearchModel.findById(alertId);

    if (!alert) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }
    const deleteAlert = await saveSearchModel.findByIdAndDelete(alertId);

    // Check if the alert was updated
    if (!deleteAlert) {
      res.status(404).json({ error: "Failed to delete alert" });
      return;
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Alert Deleted successfully",
      deleteAlert,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      mssg: "An error occurred while Deleteing the property status",
    });
  }
};

export { createSaveSearch, editSaveSearch, checkAndSendAlertById, deleteSeacrchStatus };
