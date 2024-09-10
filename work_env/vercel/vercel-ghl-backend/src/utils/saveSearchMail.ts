import alertTemplate from "../templates/alertTemp";
import mailSender from "./mailSender";

const sendSaveSearchEmail = async (email: string, property: any) => {
  try {
    // You need to provide both arguments: properties and alertFrequency
    const mailResponse = await mailSender(
      email,
      "Property By HomeHawk",
      alertTemplate([{ title: "Property Details", details: property }], "Daily")
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
};

export default sendSaveSearchEmail;
