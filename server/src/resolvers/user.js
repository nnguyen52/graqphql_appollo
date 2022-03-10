import { validateRegisterInput } from '../customMiddleware/validateRegisterInputs'; 
import User from '../models/user';
import argon2 from 'argon2' 
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
    register: async (parent, { userName, email, password } , {req}) => {
      try { 
      //reject exsiting user
      let existingUserByUsername = await User.findOne( { userName });
      if (existingUserByUsername) {
        console.log(JSON.stringify(existingUserByUsername , null , 2))
        return {
        network :{
          code: 400,
          success : false , 
          message : "Invalid registration" , 
          errors : [
            {field: `Invalid ${userName}`, message : `${userName} is already taken.`}
          ] 
        }
      }}
      // 
      let existingUserByEmail = await User.findOne( { email });
      if (existingUserByEmail) {
        console.log(JSON.stringify(existingUserByEmail , null , 2))
        return {
        network :{
          code : 400,
          success : false , 
          message : "Invalid registration" , 
          errors : [
            {field: `Invalid ${email}`, message : `${email} is already taken.`}
          ] 
        }
      }}
      // filter register inputs
      const validateInputResponse = validateRegisterInput({ userName, email, password });
      if (validateInputResponse) {
        return {
          network: {
            code: 400,
            success: false,
            message: 'Invalid registration',
            errors: validateInputResponse,
          },
        };
      }

      // all good
      const hashedPassword = await argon2.hash(password)
      const newUser = new User({ userName, email, password : hashedPassword });
      newUser.save();
      req.session.userId = newUser.id 
      // console.log('inside session id ' , req.session.id); 
      return {
        network: {
          code: 200,
          success: true,
          message: 'register sucessfully',
        },
        data: newUser,
      };
    } catch (err) {
      console.log(err); 
			return {
				code: 500,
				success: false,
				message: `Internal server error ${err.message}`
			}
    }
    },
  },
};
