import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { Request, Response } from "express";
import axios from "axios";
import AgentModel from "../model/agent.model";
import mongoose from "mongoose";
// import {
//   getCompanyAccessToken,
//   getCompanyAuthorizationCode,
// } from "../utils/companyAutomation";
import sendVerificationEmail from "../utils/OTP";
import { uploadOnCloudinary } from "../utils/imageUploader";

import agencyAccessToken from "../model/agencyToken.model";
import { getLocationToken } from "../utils/tokenAutomation";

// const getImageUrl = async (id: any) => {
//   //  token automation
//   const CompanyAuthCode = await getCompanyAuthorizationCode();
//   const companyTokenData = await getCompanyAccessToken(CompanyAuthCode);
//   const tokenAccess = companyTokenData.access_token;
//   let imageUrl = "";

//   await axios
//     .get(`https://services.leadconnectorhq.com/locations/${id}`, {
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${tokenAccess}`,
//         Version: "2021-07-28",
//       },
//     })
//     .then((response) => {
//       imageUrl = response.data.location.logoUrl;
//     })
//     .catch((error) => {
//       console.log(error);
//     });

//   return imageUrl;
// };

const getAllAgents = async (req: Request, res: Response): Promise<void> => {
  const agentUrl: string = process.env.ALL_AGENTS_URL || "";

  try {
    const tokens = await agencyAccessToken.find();
    const accessToken = tokens[0].access_token;
    // console.log(accessToken);
    const response: any = await axios.get(agentUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        Version: "2021-07-28",
      },
    });

    const agentsData = response.data.locations;
    const agentIdsFromAPI = agentsData.map((agent: { id: any }) => agent.id);

    // Find existing agents in the database
    const existingAgents = await AgentModel.find({
      agentId: { $in: agentIdsFromAPI },
    });

    const existingAgentsMap = new Map(
      existingAgents.map((agent) => [agent.agentId, agent])
    );

    const agentsToUpdate = [];
    const agentsToInsert = [];

    for (const agent of agentsData) {
      const existingAgent = existingAgentsMap.get(agent.id);

      if (existingAgent) {
        const isDataMismatch =
          existingAgent.name !== agent.name ||
          existingAgent.address !== agent.address ||
          existingAgent.city !== agent.city ||
          existingAgent.state !== agent.state ||
          existingAgent.social.facebookUrl !== agent.social.facebookUrl ||
          existingAgent.social.linkedIn !== agent.social.linkedIn ||
          existingAgent.social.twitter !== agent.social.twitter ||
          existingAgent.social.instagram !== agent.social.instagram ||
          existingAgent.settings.allowDuplicateContact !==
            agent.settings.allowDuplicateContact ||
          existingAgent.settings.allowDuplicateOpportunity !==
            agent.settings.allowDuplicateOpportunity ||
          existingAgent.settings.allowFacebookNameMerge !==
            agent.settings.allowFacebookNameMerge ||
          existingAgent.settings.disableContactTimezone !==
            agent.settings.disableContactTimezone;

        if (isDataMismatch) {
          existingAgent.name = agent.name;
          existingAgent.address = agent.address;
          existingAgent.city = agent.city;
          existingAgent.state = agent.state;
          existingAgent.country = agent.country;
          existingAgent.postalCode = agent.postalCode;
          existingAgent.website = agent.website;
          existingAgent.timezone = agent.timezone;
          existingAgent.firstName = agent.firstName;
          existingAgent.lastName = agent.lastName;
          existingAgent.email = agent.email;
          existingAgent.phone = agent.phone;
          existingAgent.social.facebookUrl = agent.social.facebookUrl;
          existingAgent.social.linkedIn = agent.social.linkedIn;
          existingAgent.social.twitter = agent.social.twitter;
          existingAgent.social.instagram = agent.social.instagram;
          existingAgent.settings.allowDuplicateContact =
            agent.settings.allowDuplicateContact;
          existingAgent.settings.allowDuplicateOpportunity =
            agent.settings.allowDuplicateOpportunity;
          existingAgent.settings.allowFacebookNameMerge =
            agent.settings.allowFacebookNameMerge;
          existingAgent.settings.disableContactTimezone =
            agent.settings.disableContactTimezone;

          agentsToUpdate.push(existingAgent);
        }
      } else {
        const newAgent = new AgentModel({
          agentId: agent.id,
          name: agent.name,
          address: agent.address,
          city: agent.city,
          state: agent.state,
          country: agent.country,
          postalCode: agent.postalCode,
          website: agent.website,
          timezone: agent.timezone,
          firstName: agent.firstName,
          lastName: agent.lastName,
          email: agent.email,
          phone: agent.phone,
          social: {
            facebookUrl: agent.social.facebookUrl,
            linkedIn: agent.social.linkedIn,
            twitter: agent.social.twitter,
            instagram: agent.social.instagram,
          },
          settings: {
            allowDuplicateContact: agent.settings.allowDuplicateContact,
            allowDuplicateOpportunity: agent.settings.allowDuplicateOpportunity,
            allowFacebookNameMerge: agent.settings.allowFacebookNameMerge,
            disableContactTimezone: agent.settings.disableContactTimezone,
          },
        });

        agentsToInsert.push(newAgent);
      }
    }

    // Delete agents in DB that are no longer in the fetched data
    const agentsToDelete = await AgentModel.find({
      agentId: { $nin: agentIdsFromAPI },
    });

    if (agentsToDelete.length > 0) {
      const deleteIds = agentsToDelete.map((agent) => agent._id);
      await AgentModel.deleteMany({ _id: { $in: deleteIds } });
    }

    // Batch update existing agents
    if (agentsToUpdate.length > 0) {
      for (const agent of agentsToUpdate) {
        await agent.save();
      }
    }

    // Batch insert new agents
    if (agentsToInsert.length > 0) {
      await AgentModel.insertMany(agentsToInsert);
    }

    res.status(200).json({
      success: true,
      message: "Agents fetched, updated, and cleaned up successfully",
      agentsData,
    });
  } catch (err) {
    console.error("Error while fetching agents", err);
    res.status(500).json({
      success: false,
      message: "Error while fetching agents",
    });
  }
};

const agentsDetails = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(404).json({
        success: false,
        message: "missing id ",
      });
    }
    const listAggregate = await AgentModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "propertyforms",
          localField: "email",
          foreignField: "email",
          as: "propertyDetails",
        },
      },
      {
        $addFields: {
          agentDetails: {
            agentId: "$_id",
            name: "$name",
            address: "$address",
            city: "$city",
            state: "$state",
            country: "$country",
            postalCode: "$postalCode",
            website: "$website",
            phone: "$phone",
            image: "$imageUrl",
            email: "$email",
            specialization: "$specialization",
            experience: "$experience",
            market_served: "$market_served",
            bio: "$bio",
          },
        },
      },
      {
        $project: {
          agentDetails: 1,
          propertyDetails: {
            _id: 1,
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
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Listing successfully",
      listAggregate,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error while fetching agent details",
      error: err.message,
    });
  }
};

const sendOtpForAgent = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;

  try {
    const existingAgent = await AgentModel.findOne({ email: email });

    if (!existingAgent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    const generatedOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Send OTP in email
    await sendVerificationEmail(email, generatedOtp);

    // Create JWT token with OTP
    const tokenPayload = {
      email,
      otp: generatedOtp,
    };

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      token: token,
    });
  } catch (err: any) {
    console.error("Error while fetching agent details: ", err.message || err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};

const verifyOtpAgent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token, otp } = req.body;

    if (!token || !otp) {
      return res.status(400).json({
        success: false,
        message: "Token and OTP are required",
      });
    }

    // Verify the token
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Check if the OTP matches
    if (decodedToken.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Fetch agent details using email  token
    const agent = await AgentModel.findOne({ email: decodedToken.email });

    const tokenPayload = {
      _id: agent?._id,
      agentId: agent?.agentId,
      name: agent?.name,
      address: agent?.address,
      email: agent?.email,
    };

    const agenttoken = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      agenttoken: agenttoken,
    });
  } catch (err: any) {
    console.error(
      "Error while verifying OTP or fetching agent details: ",
      err.message || err
    );
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};

const resendOtp = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;

  try {
    const generatedOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Send OTP in email
    await sendVerificationEmail(email, generatedOtp);

    // Create JWT token with
    const tokenPayload = {
      email,
      otp: generatedOtp,
    };

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      token: token,
    });
  } catch (err: any) {
    console.error("Error while fetching agent details: ", err.message || err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};

const getCurrentAgent = async (req: any, res: Response): Promise<Response> => {
  const user = req.user;

  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user,
  });
};

const editAgentDetails = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, specialization, experience, market_served, bio, locationId } =
      req.body;

    const {
      name,
      phone,
      address,
      city,
      state,
      country,
      postalCode,
      website,
      facebookUrl,
      linkedIn,
      twitter,
      instagram,
    } = req.body;

    const file = req.file;

    const existingAgent = await AgentModel.findOne({ email });

    if (!existingAgent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found.",
      });
    }
    const { access_token } = await getLocationToken(locationId);

    let data = JSON.stringify({
      name: name, //
      phone: phone, //
      companyId: "odiRn6WL4UdGMZurAK01",
      address: address, //
      city: city, //
      state: state, //
      country: country, //
      postalCode: postalCode, //
      website: website, //
      timezone: "US/Central",
      prospectInfo: {
        email: email, //
      },

      social: {
        facebookUrl: facebookUrl,
        linkedIn: linkedIn,
        twitter: twitter,
        instagram: instagram,
      },
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `https://services.leadconnectorhq.com/locations/${locationId}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token} `,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

    let imageUrl = existingAgent.imageUrl;

    // If an image file is uploaded
    if (file) {
      const uploadedImage = await uploadOnCloudinary(file.path);
      if (uploadedImage) {
        imageUrl = uploadedImage.url;
      }
    }

    // Update the agent details
    const updatedAgent = await AgentModel.findOneAndUpdate(
      { email },
      {
        specialization,
        experience,
        market_served,
        bio,
        imageUrl,
        name,
        phone,
        address,
        city,
        state,
        country,
        postalCode,
        website,
        email,
        facebookUrl,
        linkedIn,
        twitter,
        instagram,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Agent details successfully updated.",
      agent: updatedAgent,
    });
  } catch (err) {
    console.error("Error while editing agent details:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while editing agent details.",
    });
  }
};

const getAgent = async (req: any, res: Response): Promise<Response> => {
  const { agentMail } = req.body;

  const user = await AgentModel.findOne({ email: agentMail });

  return res.status(200).json({
    success: true,
    message: "User fetced successfully",
    user,
  });
};

export {
  getAllAgents,
  agentsDetails,
  sendOtpForAgent,
  verifyOtpAgent,
  editAgentDetails,
  getCurrentAgent,
  resendOtp,
  getAgent,
};
