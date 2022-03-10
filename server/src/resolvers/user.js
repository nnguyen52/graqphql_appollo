import { validateRegisterInput } from '../../customMiddleware/validateRegisterInputs';
import User from '../models/user';

export default {
  Query: {
    users: async (parent, args, { models }) => {
      return await User.find();
    },
    user: async (parent, { id }, { models }) => {
      return await User.findById(id);
    },
  },
  Mutation: {
    register: async (parent, { userName, email, password }) => {
      const validateInputResponse = validateRegisterInput({ userName, email, password });
      if (validateInputResponse) {
        return {
          network: {
            code: 400,
            success: false,
            message: 'Invalid registration',
            errors: [],
          },
        };
      }
      // const newUser = new User({ userName, email, password });

      // newUser.save();
      return {
        network: {
          code: 200,
          success: true,
          message: 'register sucessfully',
        },
        data: newUser,
      };
    },
  },
};
