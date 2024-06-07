import userModel from "../../../../db/models/users";
import { validateEmail, validatePassword, validateUsername } from "../../validation/validation";
import { generateToken } from "../../jwtGen/jwtGwn";
import { isPassWordCorrect } from "../../jwtGen/passWordVerify";

const loginResolver = async (parent, args, context) => {
  try {
    const { email, password} = args.input;
    const user = await userModel.findOne({email})

    if (!user) {
      console.log("User not found with email: ", email);
      return {
          errors: [{ message: 'User not found', code: 'USER_NOT_FOUND' }]
      };
    }
    const ispasspordcorrect = await isPassWordCorrect(user.password ,password)

    if (!ispasspordcorrect) {
      console.log("Invalid credentials for email: ", email);
      return {
          errors: [{ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }]
      };
  }

    
    const jwtAccessToken = await generateToken(user) 

    console.log("JWT access token is here", jwtAccessToken)
    console.log("Password is", ispasspordcorrect)

    const loggedInUser = await userModel.findOne({email}).select("-password -refreshToken")

    const errors = [];


    const emailError = validateEmail(email);
    if (emailError) errors.push({ message: emailError, code: "INVALID_EMAIL" });

    const passwordError = validatePassword(password);
    if (passwordError) errors.push({ message: passwordError, code: "INVALID_PASSWORD" });

    if (errors.length > 0) {
     return { errors };
    }

    return {
        token: jwtAccessToken,
        user: loggedInUser,
        message: "success",
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

export default loginResolver;
