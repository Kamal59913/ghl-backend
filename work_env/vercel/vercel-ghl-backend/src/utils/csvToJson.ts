import axios from "axios";
import csvtojson from "csvtojson";

const csvToJson = async (link: string): Promise<any[]> => {
  try {
    const response = await axios.get(link);
    const csvText = response.data;

    const jsonArray = await csvtojson().fromString(csvText);
    return jsonArray;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error processing the CSV file");
  }
};

export default csvToJson;
