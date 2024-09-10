import axios from "axios";
import { Request, Response } from "express";
import UserModel from "../model/user.model";
import OfferModel, { OfferType } from "../model/offer.modal";
import AgentModel from "../model/agent.model";
import mongoose from "mongoose";

// const Addoffer = async (req: Request, res: Response): Promise<void> => {
//   const {
//     locationId,
//     emdAmount,
//     emdAmountDue,
//     coe,
//     offer,
//     username,
//     contactId,
//     propertyId,
//   } = req.body;
//   try {
//     const authorizationCode: any = await getAuthorizationCode(locationId);
//     const tokenData = await getAccessToken(authorizationCode);
//     const token = tokenData.access_token;

//     //  const contactId = "adZI7bKJidZdllWrFm8w";

//     // Fetch pipelines
//     const pipelineResponse = await axios.get(
//       `https://services.leadconnectorhq.com/opportunities/pipelines`,
//       {
//         params: { locationId: locationId },
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Version: "2021-07-28",
//           Accept: "application/json",
//         },
//       }
//     );

//     const pipelines = pipelineResponse.data.pipelines;
//     if (pipelines.length === 0) {
//       res.status(404).json({
//         success: false,
//         message: "No pipelines found",
//       });
//       return;
//     }

//     // the first pipeline and its first stage
//     const firstPipeline = pipelines[0];
//     const firstStageId =
//       firstPipeline.stages.length > 0 ? firstPipeline.stages[0].id : null;
//     const pipelineId = firstPipeline.id;

//     if (!firstStageId) {
//       res.status(400).json({
//         success: false,
//         message: "No stages found in the pipeline",
//       });
//       return;
//     }

//     const customData = await axios.get(
//       `https://services.leadconnectorhq.com/locations/${locationId}/customFields`,
//       {
//         params: { model: "opportunity" },
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Version: "2021-07-28",
//           Accept: "application/json",
//         },
//       }
//     );
//     const customFields = customData.data.customFields;
//     // Create a mapping of field names to IDs
//     const idMapping = customFields.reduce((map: any, field: any) => {
//       map[field.name] = field.id;
//       return map;
//     }, {});

//     // Create opportunity
//     const opportunityResponse = await axios.post(
//       `https://services.leadconnectorhq.com/opportunities/`,
//       {
//         pipelineId: pipelineId,
//         locationId: locationId,
//         name: username,
//         pipelineStageId: firstStageId,
//         status: "open",
//         monetaryValue: `${offer}`,
//         contactId: contactId,
//         customFields: [
//           {
//             id: idMapping["EMD Amount"],
//             field_value: emdAmount,
//           },
//           {
//             id: idMapping["EMD Account Due"],
//             field_value: emdAmountDue,
//           },
//           {
//             id: idMapping["Est. Coe"],
//             field_value: coe,
//           },
//           {
//             id: idMapping["Your Offer"],
//             field_value: offer,
//           },
//         ],
//       },

//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Version: "2021-07-28",
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//       }
//     );

//     if (opportunityResponse.status === 201) {
//       // Checking for successful creation
//       const opportunityId = opportunityResponse.data.opportunity.id;
//       // First, try to update an existing opportunity
//       let updatedContact = await UserModel.findOneAndUpdate(
//         {
//           "locationIds.contactId": contactId,
//           "opportunities.opportunityId": opportunityId,
//         },
//         {
//           $set: {
//             "opportunities.$.propertyId": propertyId,
//             "opportunities.$.status": opportunityResponse.data.opportunity.status,
//             "opportunities.$.createdAt": opportunityResponse.data.opportunity.createdAt,
//             "opportunities.$.updatedAt": opportunityResponse.data.opportunity.updatedAt,
//           },
//         },
//         { new: true }
//       );

//       // If no match was found, push a new opportunity
//       if (!updatedContact) {
//         updatedContact = await UserModel.findOneAndUpdate(
//           { "locationIds.contactId": contactId },
//           {
//             $push: {
//               opportunities: {
//                 opportunityId: opportunityId,
//                 propertyId: propertyId,
//                 status: opportunityResponse.data.opportunity.status,
//                 createdAt: opportunityResponse.data.opportunity.createdAt,
//                 updatedAt: opportunityResponse.data.opportunity.updatedAt,
//               },
//             },
//           },
//           { new: true }
//         );
//       }

//       res.status(200).json({
//         success: true,
//         message: "Successfully updated contacts",
//         contact: updatedContact,
//       });
//     } else {
//       res.status(401).json({
//         success: false,
//         message: "Failed to create opportunity",
//       });
//     }
//   } catch (err: any) {
//     console.error(err);
//     res.status(400).json({
//       success: false,
//       message: err,
//     });
//   }
// };

// const GetOffer = async (req: Request, res: Response): Promise<void> => {
//   const { locationId } = req.body;
//   try {
//     const authorizationCode: any = await getAuthorizationCode(locationId);
//     const tokenData = await getAccessToken(authorizationCode);
//     const token = tokenData.access_token;
//     const oppId = "dUfStWlghPoszmJqlZNT";

//     // Fetch opportunity details
//     const response = await axios.get(
//       `https://services.leadconnectorhq.com/opportunities/${oppId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Version: "2021-07-28",
//           Accept: "application/json",
//         },
//       }
//     );
//     const pipelineStageId = response.data.opportunity.pipelineStageId;

//     // Fetch pipelines and stages
//     const pipelineResponse = await axios.get(
//       `https://services.leadconnectorhq.com/opportunities/pipelines`,
//       {
//         params: { locationId: locationId },
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Version: "2021-07-28",
//           Accept: "application/json",
//         },
//       }
//     );

//     const pipelines = pipelineResponse.data.pipelines;
//     if (pipelines.length === 0) {
//       res.status(404).json({
//         success: false,
//         message: "No pipelines found",
//       });
//       return;
//     }

//     // Find matching stage name
//     let stageName = null;
//     pipelines.forEach((pipeline: any) => {
//       pipeline.stages.forEach((stage: any) => {
//         if (stage.id === pipelineStageId) {
//           stageName = stage.name;
//         }
//       });
//     });

//     if (!stageName) {
//       res.status(404).json({
//         success: false,
//         message: "Stage not found",
//       });
//       return;
//     }

//     res.status(200).json({
//       success: true,
//       stageName: stageName,
//       status: response.data.opportunity.status,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({
//       success: false,
//       message: "Something went wrong while retrieving the offer",
//     });
//   }
// };

const createOffer = async (req: Request, res: Response) => {
  try {
    const {
      propertyId,
      agentId,
      askingPrice,
      offerPrice,
      fundingType,
      emdAmount,
      userId,
      emdDueDate,
      coeDate,
    } = req.body;


    if (
      !propertyId ||
      !agentId ||
      !askingPrice ||
      !offerPrice ||
      !fundingType ||
      !emdAmount ||
      !userId ||
      !emdDueDate ||
      !coeDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "propertyId, agentId, askingPrice, offerPrice, fundingType, emdAmount, emdDueDate, coeDate, and userId are all required",
      });
    }

    // Check if the agent exists
    const existingAgent = await AgentModel.findById(agentId);
    if (!existingAgent) {
      return res.status(400).json({
        success: false,
        message: "Agent not found",
      });
    }

    // Check if the user exists
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if an offer already exists for this property by this user
    const existingOffer = await OfferModel.findOne({ propertyId, userId });
    if (existingOffer) {
      return res.status(400).json({
        success: false,
        message: "Already made offer for this property",
      });
    }

    const buyerName = existingUser.fullName;
    const offer_date = new Date();

    // Create the offer
    const newOffer = new OfferModel({
      propertyId,
      askingPrice,
      offerPrice,
      fundingType,
      emdAmount,
      emdDueDate,
      coeDate,
      offer_date,
      userId,
      buyerName,
      agentId,
    });

    // Save the offer to the database
    const savedOffer = await newOffer.save();

    res.status(201).json({
      success: true,
      savedOffer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating offer",
      error,
    });
  }
};

// Get all offers

const getOffers = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Agent Email Required",
    });
  }

  try {
    const agent = await AgentModel.findOne({ email: email });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    const offers = await OfferModel.aggregate([
      {
        $match: {
          agentId: new mongoose.Types.ObjectId(agent._id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "agents",
          localField: "agentId",
          foreignField: "_id",
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
          from: "propertyforms",
          localField: "propertyId",
          foreignField: "_id",
          as: "propertyDetails",
        },
      },
      {
        $unwind: {
          path: "$propertyDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          address: 1,
          askingPrice: 1,
          offerPrice: 1,
          fundingType: 1,
          emdAmount: 1,
          emdDueDate: 1,
          coeDate: 1,
          offer_date: 1,
          status: 1,
          buyerName: 1,
          "userDetails.fullName": 1,
          "userDetails.email": 1,
          "agentDetails.name": 1,
          "agentDetails.email": 1,
          "propertyDetails.property_name": 1,
          "propertyDetails.address": 1,
        },
      },
    ]);

    if (!offers.length) {
      return res.status(404).json({
        success: false,
        message: "No offers found for this agent",
      });
    }

    res.status(200).json({
      success: true,
      offers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching offers",
      error: error.message || error,
    });
  }
};

const updateStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, offerID, status } = req.body;

    if (!email || !offerID || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: email, offerID, or status",
      });
    }

    const existingAgent = await AgentModel.findOne({ email: email });
    if (!existingAgent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    // Update the offer status
    const updatedOfferStatus = await OfferModel.findByIdAndUpdate(
      offerID,
      { status: status },
      { new: true }
    );

    if (!updatedOfferStatus) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    return res.status(200).json({
      success: true,
      updatedOfferStatus,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Error updating offer status",
      error: err.message,
    });
  }
};

export { createOffer, getOffers, updateStatus };
