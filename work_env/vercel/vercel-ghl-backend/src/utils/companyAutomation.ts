import agencyAccessToken from "../model/agencyToken.model";
import UserModel from "../model/user.model";

const axios = require("axios");

const getCompanyAccessToken = async () => {
  try {
    // Fetch token from the database
    const [tokenRecord] = await agencyAccessToken.find();

    if (!tokenRecord) {
      throw new Error("No tokens found");
    }

    const refreshToken = tokenRecord.refresh_token;

    // Prepare URL-encoded params for the request
    const encodedParams = new URLSearchParams({
      client_id: process.env.CLIENT_ID || "",
      client_secret: process.env.SECRET_ID || "",
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      user_type: "Company",
    });

    // Make the request to get a new access token
    const { data } = await axios.post(
      "https://services.leadconnectorhq.com/oauth/token",
      encodedParams.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );
    console.log("Access Token Data:", data);

    // Update the access token and refresh token in the database
    const updatedAgency = await agencyAccessToken.findOneAndUpdate(
      { companyId: "odiRn6WL4UdGMZurAK01" },
      {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      },
      { new: true } // Return the updated document
    );

    return updatedAgency;
  } catch (error: any) {
    // Handle error and log the response if available
    throw new Error(
      `Error requesting access token: ${
        error.response ? JSON.stringify(error.response.data) : error.message
      }`
    );
  }
};

export { getCompanyAccessToken };

// const processNewUsers = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     // Fetch new users from MongoDB who need to be processed
//     const newUsers = await UserModel.find({ status: "new" }); // Adjust the query as needed

//     if (newUsers.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No new users to process",
//       });
//     }

//     // Fetch company authorization and access tokens
//     const CompanyAuthCode = await getCompanyAuthorizationCode();
//     const companyTokenData = await getCompanyAccessToken(CompanyAuthCode);
//     const companyAccessToken = companyTokenData.access_token;

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

//     // Iterate over each new user
//     for (const user of newUsers) {
//       for (const location of locations) {
//         const authorizationCode = await getAuthorizationCode(location.id);
//         const tokenData = await getCompanyAccessToken(authorizationCode);
//         const GHLtoken = tokenData.access_token;

//         const externalApiOptions = {
//           method: "POST",
//           url: "https://services.leadconnectorhq.com/contacts/",
//           headers: {
//             Authorization: `Bearer ${GHLtoken}`,
//             Version: "2021-07-28",
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           data: {
//             firstName: user.firstName || "",
//             lastName: user.lastName || "",
//             fullName: user.fullName,
//             name: `${user.firstName} ${user.lastName}`,
//             email: user.email,
//             locationId: location.id,
//             gender: user.gender,
//             phone: user.phone,
//             address1: user.address,
//             city: user.city,
//             state: user.state,
//             inboundDndSettings: {
//               all: {
//                 status: "active",
//                 message: "string",
//               },
//             },
//             source: "public api",
//           },
//         };

//         try {
//           const { data } = await axios.request(externalApiOptions);
//           // Update user's locationIds array
//           await UserModel.updateOne(
//             { _id: user._id },
//             {
//               $push: {
//                 locationIds: {
//                   locationId: location.id,
//                   contactId: data.contact.id,
//                 },
//               },
//             }
//           );
//         } catch (error: any) {
//           console.error(
//             "Error occurred while sending data to external API: ",
//             error.response?.data || error.message
//           );

//           // Rollback: Delete the created user
//           await UserModel.deleteOne({ _id: user._id });

//           return res.status(500).json({
//             success: false,
//             message: error.message,
//           });
//         }
//       }
//     }

//    return res.status(200).json({
//       success: true,
//       message: "New users processed successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error processing users",
//       error,
//     });
//   }
// };
