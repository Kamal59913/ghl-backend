import jwt from "jsonwebtoken";

export const jwtVerify = async (token: any) => {
  const SECRET_KEY:any = process.env.JWT_TOKEN_SECRET;

  try {
    if (token) {
      const data: any = jwt.verify(token, SECRET_KEY);
      return data;
    }
  } catch (err) {
    return {
      error: true,
      msg: "Token Invalid",
    };
  }
};
