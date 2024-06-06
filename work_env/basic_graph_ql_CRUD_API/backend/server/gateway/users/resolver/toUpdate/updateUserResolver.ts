import userModel from "../../../../db/models/users";

const updateUserResolver = async (parent, args, context) => {
  try {
    const { id, username, email, password } = args.input;
    
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {  username, email, password},
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      throw new Error('User not found');
    }
    console.log("User updated:", updatedUser);
    return updatedUser;
  } catch (e) {
    console.log(e);
    return {
      errors: [
        {
          message: 'Something went wrong',
          code: 'SERVER_ERROR',
        },
      ],
    };
  }
};

export default updateUserResolver;
