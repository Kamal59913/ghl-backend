import userModel from "../../../../db/models/users";
import { validateEmail, validatePassword, validateUsername } from "../../validation/validation";

const addUserResolver = async (parent, args, context) => {
  try {
   const { username, email, password} = args.input;

   const errors = [];

   const usernameError = validateUsername(username);
   if (usernameError) errors.push({ message: usernameError, code: "INVALID_USERNAME" });
   
   const emailError = validateEmail(email);
   if (emailError) errors.push({ message: emailError, code: "INVALID_EMAIL" });

  
   if (errors.length > 0) {
     return { errors };
   }

   const newUser = new userModel({
    username, email, password
   })

   await newUser.save();

   console.log("Some new Users has been added to the database")

   return {
    success: true,
    message: "User Added Successfully",
    user: newUser
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

export default addUserResolver;
