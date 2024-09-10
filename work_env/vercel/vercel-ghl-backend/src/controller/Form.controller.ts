import { Request, Response } from "express";
import axios from "axios";
import PropertyFormModel from "../model/property.model";
import mongoose from "mongoose";
import { geocodeAddress } from "../utils/customfunction";
import csvToJson from "../utils/csvToJson";
import AgentModel from "../model/agent.model";

//const formId = "nBKx0rMKQBLqFtRTr9tI"
interface FormData {
  property_id: any;
  property_name: any;
  state: any;
  city: any;
  postal_code: any;
  country: any;
  address: any;
  bedrooms: any;
  space_for_cars: any;
  email: any;
  bathrooms: any;
  size: any;
  price: any;
  image: any[];
  year_built: any;
  est_rent: any;
  roof: any;
  price_sqft: any;
  hvac: any;
  taxes: any;
  prop_type: any;
  hoa_fees: any;
  lot_size: any;
  desc_title: any;
  desc_detail: any;
  property_documents: any[];
  location: {
    type: string;
    coordinates: [number, number];
  };
}

interface Location {
  lat: number;
  lng: number;
}
// const getAllForms = async (req: Request, res: Response): Promise<Response> => {
//   const SubmissionUrl = process.env.FORM_SUBMISSION_URL;
//   const location = "WrgnE3LhBalGiPX24ndh";
//   const authorizationCode = await getAuthorizationCode(location);
//   const tokenData = await getAccessToken(authorizationCode);
//   const GHLtoken = tokenData.access_token;

//   const options = {
//     method: "GET",
//     url: SubmissionUrl,
//     params: {
//       locationId: location,
//       limit: "100",
//       formId: "nBKx0rMKQBLqFtRTr9tI",
//     },
//     headers: {
//       Authorization: `Bearer ${GHLtoken}`,
//       Version: "2021-07-28",
//       Accept: "application/json",
//     },
//   };

//   try {
//     const { data } = await axios.request(options);
//     const allForms = data.submissions;

//     if (!allForms || allForms.length === 0) {
//       res.status(404).json({
//         success: false,
//         message: "No forms found",
//       });
//       return;
//     }

//     const existingForms = await PropertyFormModel.find({
//       property_id: { $in: allForms.map((form: any) => form.id) },
//     });

//     const existingFormIds = existingForms.map((form: any) => form.property_id);
//     const newForms = allForms.filter((form: any) => !existingFormIds.includes(form.id));

//     const responseForms = [];

//     for (const form of allForms) {
//       let propertyImage: any[] = [];
//       let propertyDocument: any[] = [];

//       const location = await geocodeAddress(
//         form.others?.state,
//         form.others?.city,
//         form.others?.postal_code,
//         form.others?.country,
//         form.others?.address
//       );

//       if (!location) {
//        return res.status(400).json({
//           success: false,
//           message: "Geocoding failed. Could not determine the property's location.",
//         });
//       }

//       const { lat, lng } = location;

//       const propertyDetailData = form?.others?.["xV2QNtzSqU27idB4qbLz"];
//       if (propertyDetailData) {
//         propertyDocument = Object.values(propertyDetailData).map((data: any) => ({
//           document: data.url,
//           meta: {
//             originalname: data.meta.originalname,
//             mimetype: data.meta.mimetype,
//           },
//         }));
//       }

//       const imageData = form?.others?.["dHX8KK8VdSAbEkvIBIwy"];
//       if (imageData) {
//         propertyImage = Object.values(imageData).map((data: any) => data.url);
//       }

//       const LowercaseEmail = form.others?.email?.toLowerCase();
//       const formData: any = {
//         property_id: form.id || 0,
//         property_name: form.name || form.others?.lTlpSH35nT5aAmqSJYfG,
//         state: form.others?.state,
//         city: form.others?.city,
//         postal_code: form.others?.postal_code,
//         country: form.others?.country,
//         address: form.others?.address,
//         bedrooms: form?.others?.Ersl2MXx6TBL40BjyJ2m,
//         space_for_cars: form.others?.bjXKo7tDQhHqcOLT7dLG,
//         email: LowercaseEmail,
//         bathrooms: form.others?.TVB6WjRjv4zdv5Hd7VF0,
//         size: form.others?.XPcOEWq5Z2cB7vu15Sfz,
//         price: form.others?.KPCBnghPEviQvd6KrQFI,
//         image: propertyImage,
//         year_built: form.others?.LJ9gqPSvurvRYEIJFNnq || 0,
//         est_rent: form.others?.FgXTnrpbtQK9PSLCA4oX || 0,
//         roof: form.others?.vrIeBR9KVIu89HiY39Z4 || 0,
//         price_sqft: form.others?.lphOze4qFsNUvFsiD7pm || 0,
//         hvac: form.others?.uof4yh6wNqaH0arV5UyP || 0,
//         taxes: form.others?.Crqj5BDagoASxEIGFqaZ || 0,
//         prop_type: form.others?.K9AIZ68esBq7DP1H2636 || 0,
//         hoa_fees: form.others?.LGhD3O4ftbOLXFJR6YaX || 0,
//         lot_size: form.others?.d6Y21KBnkxzCC22mUUvc || 0,
//         desc_title: form.others?.["9zfiNpGzBJmg7FYjyPl8"] || 0,
//         desc_detail: form.others?.C8LrSeXqksUo6qSHO0XG || 0,
//         property_documents: propertyDocument,
//         video_link: form.others?.Pbbu0HZOFMEWseFqYHSn,
//         location: {
//           type: "Point",
//           coordinates: [lng, lat],
//         },
//       };

//       const existingForm = existingForms.find(
//         (existingForm: any) => existingForm.property_id === form.id
//       );

//       const checkFormWithExistingAgent = await AgentModel.find({
//         email: formData.email,
//       });

//       if (checkFormWithExistingAgent.length === 0) {
//         console.log(
//           "Email does not match any agent's email. Form will not be added or updated."
//         );
//         res.status(404).json({
//           success: false,
//           message:
//             "Email does not match any agent's email. Form will not be added or updated.",
//         });
//       }

//       if (existingForm) {
//         const isDifferent = Object.keys(formData).some(
//           (key) => (formData as any)[key] !== (existingForm as any)[key]
//         );

//         if (isDifferent) {
//           await PropertyFormModel.updateOne({ property_id: form.id }, { $set: formData });
//           responseForms.push({ ...existingForm.toObject(), ...formData });
//         }
//       } else {
//         if (propertyImage.length > 0) {
//           const newForm = await PropertyFormModel.create(formData);
//           responseForms.push(newForm);
//         }
//       }
//     }

//     res.status(200).json({
//       success: true,
//       message: "Forms fetched and updated successfully",
//       forms: responseForms,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Error while fetching forms",
//     });
//   }
// };

const listingProperties = async (req: Request, res: Response) => {
  try {
    const listAggregate = await PropertyFormModel.aggregate([
      /* Pipeline 1: Lookup */
      {
        $lookup: {
          from: "agents",
          localField: "email",
          foreignField: "email",
          as: "agentDetails",
        },
      },
      /* Pipeline 2: Unwind */
      {
        $unwind: {
          path: "$agentDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      /* Pipeline 3: Group */
      {
        $group: {
          _id: "$_id",
          property_id: { $first: "$property_id" },
          property_name: { $first: "$property_name" },
          state: { $first: "$state" },
          city: { $first: "$city" },
          postal_code: { $first: "$postal_code" },
          country: { $first: "$country" },
          address: { $first: "$address" },
          bedrooms: { $first: "$bedrooms" },
          space_for_cars: { $first: "$space_for_cars" },
          email: { $first: "$email" },
          bathrooms: { $first: "$bathrooms" },
          size: { $first: "$size" },
          price: { $first: "$price" },
          image: { $first: "$image" },
          is_available: { $first: "$is_available" },
          is_delete: { $first: "$is_delete" },
          year_built: { $first: "$year_built" },
          list_date: { $first: "$list_date" },
          est_rent: { $first: "$est_rent" },
          roof: { $first: "$roof" },
          price_sqft: { $first: "$price_sqft" },
          hvac: { $first: "$hvac" },
          taxes: { $first: "$taxes" },
          prop_type: { $first: "$prop_type" },
          hoa_fees: { $first: "$hoa_fees" },
          lot_size: { $first: "$lot_size" },
          desc_title: { $first: "$desc_title" },
          desc_detail: { $first: "$desc_detail" },
          property_documents: { $first: "$property_documents" },
          agentDetails: { $first: "$agentDetails" },
        },
      },
      /* Pipeline 4: Sort */
      {
        $sort: {
          list_date: -1,
        },
      },
      /* Pipeline 5: Project */
      {
        $project: {
          _id: 1,
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
          is_available: 1,
          is_delete: 1,
          year_built: 1,
          list_date: 1,
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
          agentDetails: {
            agentId: 1,
            name: 1,
            address: 1,
            city: 1,
            state: 1,
            country: 1,
            postalCode: 1,
            website: 1,
            phone: 1,
            email: 1,
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

    res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      properties: listAggregate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error while fetching properties",
    });
  }
};

const PropertyDetails = async (req: Request, res: Response) => {
  const propertyId = req.params.id;

  try {
    const existingProperty = await PropertyFormModel.findById(propertyId);
    if (!existingProperty) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const listAggregate = await PropertyFormModel.aggregate([
      /* Pipeline 1: Match Property */
      {
        $match: {
          _id: new mongoose.Types.ObjectId(propertyId),
        },
      },

      /* Pipeline 2: Lookup Agent Details */
      {
        $lookup: {
          from: "agents",
          localField: "email",
          foreignField: "email",
          as: "agentDetails",
        },
      },

      /* Pipeline 3: Unwind Agent Details */
      {
        $unwind: {
          path: "$agentDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      /* Pipeline 4: Group by Property ID */
      {
        $group: {
          _id: "$_id",
          property_id: { $first: "$property_id" },
          property_name: { $first: "$property_name" },
          state: { $first: "$state" },
          city: { $first: "$city" },
          postal_code: { $first: "$postal_code" },
          country: { $first: "$country" },
          address: { $first: "$address" },
          bedrooms: { $first: "$bedrooms" },
          space_for_cars: { $first: "$space_for_cars" },
          email: { $first: "$email" },
          bathrooms: { $first: "$bathrooms" },
          size: { $first: "$size" },
          price: { $first: "$price" },
          image: { $first: "$image" },
          is_available: { $first: "$is_available" },
          is_delete: { $first: "$is_delete" },
          year_built: { $first: "$year_built" },
          list_date: { $first: "$list_date" },
          est_rent: { $first: "$est_rent" },
          roof: { $first: "$roof" },
          price_sqft: { $first: "$price_sqft" },
          hvac: { $first: "$hvac" },
          taxes: { $first: "$taxes" },
          prop_type: { $first: "$prop_type" },
          hoa_fees: { $first: "$hoa_fees" },
          lot_size: { $first: "$lot_size" },
          desc_title: { $first: "$desc_title" },
          desc_detail: { $first: "$desc_detail" },
          property_documents: { $first: "$property_documents" },
          agentDetails: { $first: "$agentDetails" },
          video_link: {$first: "$video_link"},
          image360 : {$first: "$image360"},
          matterport : {$first: "$matterport"},
          location: {
            $first: "$location",
          },
        },
      },

      /* Pipeline 5: Project */
      {
        $project: {
          _id: 1,
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
          is_available: 1,
          is_delete: 1,
          year_built: 1,
          list_date: 1,
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
          video_link: 1,
          image360: 1, 
          matterport: 1,
          agentDetails: {
            _id: 1,
            agentId: 1,
            imageUrl: 1,
            name: 1,
            address: 1,
            city: 1,
            state: 1,
            country: 1,
            postalCode: 1,
            website: 1,
            phone: 1,
            email: 1,
          },
        },
      },
    ]);

    if (listAggregate.length === 0) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json({
      message: "Successfully fetched property details",
      property: listAggregate[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error while getting property details",
    });
  }
};

const propertyPagination = async (req: Request, res: Response): Promise<Response> => {
  try {
    const offset = parseInt(req.body.offset, 10) || 0;
    const limit = parseInt(req.body.limit, 10) || 10;

    if (offset < 0 || limit <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid offset or limit values. Offset must be non-negative and limit must be positive.",
      });
    }

    const [paginatedProperties, totalProperties] = await Promise.all([
      PropertyFormModel.aggregate([
        {
          $lookup: {
            from: "agents",
            localField: "email",
            foreignField: "email",
            as: "agentDetails",
          },
        },
        {
          $unwind: {
            path: "$agentDetails",
            preserveNullAndEmptyArrays: true,
          },
        }, // Unwind the agent details
        {
          $group: {
            _id: "$_id",
            property_id: { $first: "$property_id" },
            property_name: { $first: "$property_name" },
            state: { $first: "$state" },
            city: { $first: "$city" },
            postal_code: { $first: "$postal_code" },
            country: { $first: "$country" },
            address: { $first: "$address" },
            bedrooms: { $first: "$bedrooms" },
            space_for_cars: { $first: "$space_for_cars" },
            email: { $first: "$email" },
            bathrooms: { $first: "$bathrooms" },
            size: { $first: "$size" },
            price: { $first: "$price" },
            image: { $first: "$image" },
            is_available: { $first: "$is_available" },
            is_delete: { $first: "$is_delete" },
            year_built: { $first: "$year_built" },
            list_date: { $first: "$list_date" },
            est_rent: { $first: "$est_rent" },
            roof: { $first: "$roof" },
            price_sqft: { $first: "$price_sqft" },
            hvac: { $first: "$hvac" },
            taxes: { $first: "$taxes" },
            prop_type: { $first: "$prop_type" },
            hoa_fees: { $first: "$hoa_fees" },
            lot_size: { $first: "$lot_size" },
            desc_title: { $first: "$desc_title" },
            desc_detail: { $first: "$desc_detail" },
            property_documents: { $first: "$property_documents" },
            agentDetails: { $first: "$agentDetails" },
            location: { $first: "$location"}
          },
        },
        { $sort: { list_date: -1 } }, // Sort by latest list_date
        { $skip: offset },
        { $limit: limit },
        {
          $project: {
            _id: 1,
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
            is_available: 1,
            is_delete: 1,
            year_built: 1,
            list_date: 1,
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
            agentDetails: {
              agentId: 1,
              name: 1,
              address: 1,
              city: 1,
              state: 1,
              country: 1,
              postalCode: 1,
              website: 1,
              phone: 1,
              email: 1,
            },
          },
        },
      ]),
      PropertyFormModel.countDocuments({ is_delete: false }),
    ]);



    return res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      data: paginatedProperties,
      pagination: {
        total: totalProperties,
        offset,
        limit,
        totalPages: Math.ceil(totalProperties / limit),
      },
    });
  } catch (error: any) {
    console.error("Error during property pagination:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching properties.",
      error: error.message || "Internal Server Error",
    });
  }
};

const generateRandomCoordinatesUSA = () => {
  // USA approximate bounding box coordinates
  const minLat = 24.396308; // Southernmost point
  const maxLat = 49.384358; // Northernmost point
  const minLon = -125.0;    // Westernmost point
  const maxLon = -66.93457; // Easternmost point

  const latitude = Math.random() * (maxLat - minLat) + minLat;
  const longitude = Math.random() * (maxLon - minLon) + minLon;

  return [longitude, latitude];
}; 

const updateCoordinates = async (req: Request, res: Response) => {
  try {
      // Fetch all properties
      const properties = await PropertyFormModel.find();

      for (const property of properties) {
          // Generate random coordinates within the USA
          const randomCoordinates: any = generateRandomCoordinatesUSA();

          // Update the location field with the new random coordinates
          property.location = {
              type: 'Point',
              coordinates: randomCoordinates,
          };

          // Save the updated property
          await property.save();
      }

      // Send a success response
      res.status(200).send('Coordinates updated successfully for all properties');
  } catch (error) {
      console.error('Error updating coordinates:', error);
      res.status(500).send('Error updating coordinates');
  }
};

// const uploadCsvData = async (req: Request, res: Response) => {
//   const SubmissionUrl = process.env.FORM_SUBMISSION_URL;
//   const location = "WrgnE3LhBalGiPX24ndh";
//   const authorizationCode = await getAuthorizationCode(location);
//   const tokenData = await getAccessToken(authorizationCode);
//   const GHLtoken = tokenData.access_token;

//   const options = {
//     method: "GET",
//     url: SubmissionUrl,
//     params: {
//       locationId: location,
//       limit: "100",
//       formId: "AKKJvpahnAhx1Mo3rGky",
//     },
//     headers: {
//       Authorization: `Bearer ${GHLtoken}`,
//       Version: "2021-07-28",
//       Accept: "application/json",
//     },
//   };

//   try {
//     const { data } = await axios.request(options);

//     const allForms = data.submissions || [];

//     // Sort forms by timestamp in descending order
//     allForms.sort(
//       (a: any, b: any) =>
//         new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//     );

//     let latestDocumentUrls: string[] = [];

//     if (allForms.length > 0) {
//       const latestForm = allForms[0];
//       const othersData = latestForm?.others?.["X6oaXORgOfeAT5YZwQZI"];
//       const agentemail = latestForm.email;
//       if (othersData) {
//         latestDocumentUrls = Object.values(othersData).map((data: any) => data.url);
//       }
//     }

//     // Function to fetch CSV data and convert to JSON
//     const fetchAndConvertCsvData = async (url: string) => {
//       try {
//         return await csvToJson(url);
//       } catch (error) {
//         console.error(`Error fetching or converting CSV from ${url}:`, error);
//         return [];
//       }
//     };

//     // Convert CSV files to JSON
//     const bulkDataPromises = latestDocumentUrls.map(fetchAndConvertCsvData);
//     const bulkData = await Promise.all(bulkDataPromises);

//     // Flatten the array if necessary
//     const flattenedBulkData = bulkData.flat();

//     const savedData: any[] = [];
//     const duplicateData: any[] = [];

//     for (const propertyData of flattenedBulkData) {
//       try {
//         // Add location data
//         const { lat, lng } = await geocodeAddress(
//           propertyData.state,
//           propertyData.city,
//           propertyData.postal_code,
//           propertyData.country,
//           propertyData.address
//         );

//         // Add location
//         propertyData.location = {
//           type: "Point",
//           coordinates: [lng, lat],
//         };
//         propertyData.property_documents = {
//           document: propertyData.document,
//           meta: {
//             originalname: propertyData.originalname,
//             mimetype: propertyData.mimetype,
//           },
//         };

//         // Check for existing property
//         const existingForm = await PropertyFormModel.findOne({
//           property_name: propertyData.property_name,
//           address: propertyData.address,
//         });

//         if (!existingForm) {
//           // Create a new form if no match is found
//           const newForm = await PropertyFormModel.create(propertyData);
//           savedData.push(newForm);
//         } else {
//           // Track duplicates
//           duplicateData.push(propertyData);
//         }
//       } catch (error) {
//         console.error("Error processing property data:", error);
//       }
//     }

//     // Respond with the results
//     res.status(200).json({
//       success: true,
//       latestDocumentUrls,
//       savedData,
//       duplicateData,
//     });
//   } catch (err) {
//     console.error("Error during property data upload:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error while adding properties from CSV",
//     });
//   }
// };

const singleAgentListing = async (req: Request, res: Response) => {
  try {
    const { email, offset = 0, limit = 10 } = req.body;

    // Convert offset and limit to numbers
    const offsetNumber = Number(offset);
    const limitNumber = Number(limit);

    // Validate offset and limit
    if (
      isNaN(offsetNumber) ||
      isNaN(limitNumber) ||
      offsetNumber < 0 ||
      limitNumber <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid offset or limit values. Offset must be non-negative and limit must be positive.",
      });
    }

    // Fetch properties with aggregation pipeline
    const properties = await PropertyFormModel.aggregate([
      { $match: { email } },
      {
        $lookup: {
          from: "agents",
          localField: "email",
          foreignField: "email",
          as: "agentDetails",
        },
      },
      {
        $unwind: {
          path: "$agentDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "offers",
          localField: "_id",
          foreignField: "propertyId",
          as: "offersDetails",
        },
      },
      {
        $addFields: {
          totalOffers: { $size: "$offersDetails" },
        },
      },
      {
        $group: {
          _id: "$_id",
          property_id: { $first: "$property_id" },
          property_name: { $first: "$property_name" },
          state: { $first: "$state" },
          city: { $first: "$city" },
          postal_code: { $first: "$postal_code" },
          country: { $first: "$country" },
          address: { $first: "$address" },
          bedrooms: { $first: "$bedrooms" },
          space_for_cars: { $first: "$space_for_cars" },
          email: { $first: "$email" },
          bathrooms: { $first: "$bathrooms" },
          size: { $first: "$size" },
          price: { $first: "$price" },
          image: { $first: "$image" },
          is_available: { $first: "$is_available" },
          is_delete: { $first: "$is_delete" },
          year_built: { $first: "$year_built" },
          list_date: { $first: "$list_date" },
          est_rent: { $first: "$est_rent" },
          roof: { $first: "$roof" },
          price_sqft: { $first: "$price_sqft" },
          hvac: { $first: "$hvac" },
          taxes: { $first: "$taxes" },
          prop_type: { $first: "$prop_type" },
          hoa_fees: { $first: "$hoa_fees" },
          lot_size: { $first: "$lot_size" },
          desc_title: { $first: "$desc_title" },
          desc_detail: { $first: "$desc_detail" },
          property_documents: { $first: "$property_documents" },
          agentDetails: { $first: "$agentDetails" },
          totalOffers: { $first: "$totalOffers" }, // Include totalOffers field
        },
      },
      { $sort: { list_date: -1 } },
      {
        $project: {
          _id: 1,
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
          is_available: 1,
          is_delete: 1,
          year_built: 1,
          list_date: 1,
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
          agentDetails: {
            agentId: "$agentDetails.agentId",
            name: "$agentDetails.name",
            address: "$agentDetails.address",
            city: "$agentDetails.city",
            state: "$agentDetails.state",
            country: "$agentDetails.country",
            postalCode: "$agentDetails.postalCode",
            website: "$agentDetails.website",
            phone: "$agentDetails.phone",
            email: "$agentDetails.email",
          },
          totalOffers: 1,
        },
      },
      { $skip: offsetNumber },
      { $limit: limitNumber },
    ]);

    if (properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No properties found",
      });
    }

    // Total count for pagination
    const totalProperties = await PropertyFormModel.countDocuments({ email });

    res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      properties,
      pagination: {
        total: totalProperties,
        offset: offsetNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalProperties / limitNumber),
      },
    });
  } catch (err) {
    console.error("Error while fetching properties:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching properties.",
    });
  }
};

export { listingProperties, PropertyDetails, propertyPagination, singleAgentListing, updateCoordinates };
