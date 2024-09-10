import agencyAccessToken from "../model/agencyToken.model";

const axios = require("axios");

const getLocationToken = async (location: string) => {
  try {
    const getToken = await agencyAccessToken.findOne({
      companyId: "odiRn6WL4UdGMZurAK01",
    });

    // Define the data to be sent
    const data = new URLSearchParams({
      companyId: "odiRn6WL4UdGMZurAK01",
      locationId: location,
    });

    // Set up the headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Version: "2021-07-28",
      Authorization: `Bearer ${getToken?.access_token}`,
    };

    // Make the POST request using axios
    const response = await axios.post(
      "https://services.leadconnectorhq.com/oauth/locationToken",
      data,
      { headers }
    );

    // Log the response
    console.log("Location Token Response:", response.data);

    // Return the response data or handle it as needed
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching location token:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      `Error fetching location token: ${
        error.response ? JSON.stringify(error.response.data) : error.message
      }`
    );
  }
};
export { getLocationToken };
