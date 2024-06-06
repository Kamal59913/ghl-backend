import * as yup from "yup";

export const schema = yup.object({
  username: yup.string()
    .required("Username is required")
    .matches(/^\S*$/, "Username cannot contain spaces")
    .min(3, "Username must be at least 3 characters")
    .max(15, "Username must not exceed 15 characters")
    ,

  email: yup.string()
    .required("Email is required")
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid email"
    ),
    
  password: yup.string()
    .required("Password is required")
    .matches(/^\S*$/, "Password cannot contain spaces")
    .matches(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .matches(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .matches(/^(?=.*\d)/, "Password must contain at least one number")
    .matches(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character")
    .min(8, "Password must be at least 8 characters")
});
