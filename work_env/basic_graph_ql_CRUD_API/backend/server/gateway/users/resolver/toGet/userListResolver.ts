import userModel from "../../../../db/models/users";
import { validateEmail, validatePassword, validateUsername } from "../../validation/validation";

const getUserResolver = async (parent, args, context) => {
  try {
      const users = await userModel.find()
      console.log(users)

   return {
    success: true,
    message: "User Added Successfully",
    user: users
   }

  } catch (e) {
    console.log(e);
    return {
      errors: [
        {
          message: 'Something went wrongf',
          code: 'SERVER_ERROR',
        },
      ],
    };
  }
};

export default getUserResolver;
