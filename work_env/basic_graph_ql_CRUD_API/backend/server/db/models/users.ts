import { Schema, model } from 'mongoose';
import bcrypt from "bcrypt";

export type user = {
  username: string,
  email: string,
  password: string,
  age: Number
}

const userSchema = new Schema<user>({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  });

  userSchema.pre("save", async function (next) { /*Arrow function do not have this keyword for the context*/
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

const userModel = model('User', userSchema);

export default userModel;
