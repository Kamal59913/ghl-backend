import jwt from "jsonwebtoken";


export const generateToken =  async (user) => {

    return jwt.sign({
        _id:user._id,
        username: user.username,
        email: user.email,
    },

    process.env.TOKEN_SECRET,

    {
        expiresIn: process.env.TOKEN_EXPIRY
    }
)
}