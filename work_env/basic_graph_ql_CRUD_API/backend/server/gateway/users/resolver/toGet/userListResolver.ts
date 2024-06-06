import mongoose from 'mongoose';
import userModel from '../../../../db/models/users';

const getUsersResolver = async (): Promise<any> => {
  try {

    const bookList: any[] = await userModel.find()

    console.log("Hello world")
    
    if (!bookList) {
      return {
        errors: [
          {
            message: 'Employee not found',
            code: 'BAD_Users_INPUT',
          },
        ],
      };
    }
    return {
        bookList,
      errors: null,
    };
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

export default getUsersResolver;
