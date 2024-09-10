import express, { NextFunction, Request, Response } from "express";
import {
  agentsDetails,
  editAgentDetails,
  sendOtpForAgent,
  verifyOtpAgent,
  getCurrentAgent,
  resendOtp,
  getAgent,
  getAllAgents,
} from "../controller/Agent.controller.ts";
import {
  PropertyDetails,
  //getAllForms,
  listingProperties,
  propertyPagination,
  singleAgentListing,
  updateCoordinates
  // uploadCsvData,
} from "../controller/Form.controller.ts";
import {
  addProperty,
  changeStatus,
  editProperty,
  editPropertySingleItem,
  saveCompController,
} from "../controller/NewForm.controller.ts";
import { upload } from "../middleware/multer.ts";
import { isAgent } from "../middleware/isAgent.middleware.ts";
import mongoose from "mongoose";
const router = express.Router();

router.get("/allagents", getAllAgents);
router.get("/agent/:id", agentsDetails);
router.post("/sendotpforagent", sendOtpForAgent);
router.post("/verify-otp-agent", verifyOtpAgent);
router.post("/resendotp", resendOtp);

//property

router.post("/edit_agent", upload.single("image"), editAgentDetails);
router.post("/addproperty", upload.any(), addProperty);
router.put("/editproperty/:property_id", upload.any(), editProperty);
router.post("/editpropertysingleitem/:property_id", upload.any(), editPropertySingleItem);

router.post("/saveComps/:property_id", upload.any(), saveCompController);

router.post("/listproperty", singleAgentListing);

router.post("/changeStatus", changeStatus);

//router.get("/allforms", getAllForms);
router.get("/getpropertylistings", listingProperties);
router.get("/propertydetail/:id", PropertyDetails);
router.post("/property_pagination", propertyPagination);
router.get("/updatecoordinates", updateCoordinates);

// router.get("/csvlink", uploadCsvData);
router.get("/get-current-agent", isAgent, getCurrentAgent);
router.post("/get-agent", getAgent);

export default router;

// const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
//   const { property_id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(property_id)) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid property ID format",
//     });
//   }
//   next();
// };
