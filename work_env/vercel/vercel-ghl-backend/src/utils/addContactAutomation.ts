import axios from "axios";
import { getCompanyAccessToken,  } from "./companyAutomation";
import UserModel from "../model/user.model";
import dbConnect from "../config/dbConnect";
import mongoose from "mongoose";

// const processNewUser = async (user: any) => {
//   // Your logic to process the new user
//   console.log("Processing user:", user);

//   // Example operation
//   try {
//     // Fetch company authorization and access tokens


//     const optionsForAgent = {
//       method: "GET",
//       url: "https://services.leadconnectorhq.com/locations/search",
//       headers: {
//         Authorization: `Bearer ${companyAccessToken}`,
//         Version: "2021-07-28",
//         Accept: "application/json",
//       },
//     };

//     let locations: any[];
//     try {
//       const { data } = await axios.request(optionsForAgent);
//       locations = data.locations;
//     } catch (error) {
//       console.error("Error fetching locations:", error);
//       throw new Error("Failed to fetch locations");
//     }

//     // Iterate over each location
//     for (const location of locations) {
//       const authorizationCode = await getAuthorizationCode(location.id);
//       const tokenData = await getCompanyAccessToken(authorizationCode);
//       const GHLtoken = tokenData.access_token;

//       const externalApiOptions = {
//         method: "POST",
//         url: "https://services.leadconnectorhq.com/contacts/",
//         headers: {
//           Authorization: `Bearer ${GHLtoken}`,
//           Version: "2021-07-28",
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         data: {
//           firstName: user.firstName || "",
//           lastName: user.lastName || "",
//           fullName: user.fullName,
//           name: `${user.firstName} ${user.lastName}`,
//           email: user.email,
//           locationId: location.id,
//           gender: user.gender,
//           phone: user.phone,
//           address1: user.address,
//           city: user.city,
//           state: user.state,
//           inboundDndSettings: {
//             all: {
//               status: "active",
//               message: "string",
//             },
//           },
//           source: "public api",
//         },
//       };

//       try {
//         const { data } = await axios.request(externalApiOptions);
//         // Update user's locationIds array
//         await UserModel.updateOne(
//           { _id: user._id },
//           {
//             $push: {
//               locationIds: {
//                 locationId: location.id,
//                 contactId: data.contact.id,
//               },
//             },
//           }
//         );
//       } catch (error: any) {
//         console.error(
//           "Error occurred while sending data to external API: ",
//           error.response?.data || error.message
//         );

//         // Rollback: Delete the created user
//         await UserModel.deleteOne({ _id: user._id });

//         return { success: false, message: error.message };
//       }
//     }

//     return { success: true, message: "User processed successfully" };
//   } catch (error) {
//     console.error("Error processing user:", error);
//     return { success: false, message: "Error processing user", error };
//   }
// };

// MongoDB URI and Database/Collection Names

// const monitorNewUsers = async (req:Request,res:Response) => {
//   try {
//     const collection = mongoose.connection.collection("users");
//     const changeStream = collection.watch([{ $match: { operationType: "insert" } }]);

//     changeStream.on("change", async (change: { fullDocument: any }) => {
//       const newUser = change.fullDocument;
//       console.log("New user added:", newUser);

//       const result = await processNewUser(newUser);
//       console.log("Processing result:", result);
//     });

//     console.log("Change stream is now watching for new user inserts.");
//   } catch (error) {
//     console.error("Error setting up change stream:", error);
//   }
// };

