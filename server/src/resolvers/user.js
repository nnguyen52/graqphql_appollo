import { validateRegisterInput } from '../customMiddleware/validateRegisterInputs';
import User from '../models/user';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import Token from '../models/token';
import { sendMail } from '../utils/sendMails';
export default {
  Query: {
    me: async (parent, args, { req }) => {
      if (!req.session.userId)
        return {
          network: {
            code: 400,
            success: false,
            message: 'Not logged in',
          },
          data: null,
        };
      const user = await User.findById({ _id: req.session.userId });
      if (!user)
        return {
          network: {
            code: 400,
            success: false,
            message: 'Not logged in',
          },
          data: null,
        };
      return {
        network: {
          code: 200,
          success: true,
          message: 'Logged in',
        },
        data: user,
      };
    },
    users: async (parent, args, { models }) => {
      return await User.find();
    },
    user: async (parent, { id }, { models }) => {
      return await User.findById(id);
    },
  },
  Mutation: {
    register: async (parent, { userName, email, password }, { req }) => {
      try {
        //reject exsiting user
        let existingUserByUsername = await User.findOne({ userName });
        if (existingUserByUsername) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid registration',
              errors: [{ field: `Invalid ${userName}`, message: `${userName} is already taken.` }],
            },
          };
        }
        //
        let existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid registration',
              errors: [{ field: `Invalid ${email}`, message: `${email} is already taken.` }],
            },
          };
        }
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
        // all good -> add cookie userId
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({ userName, email, password: hashedPassword });
        newUser.save();
        req.session.userId = newUser.id;
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
          network: {
            code: 500,
            success: false,
            message: `Internal server error ${err.message}`,
          },
        };
      }
    },
    login: async (_, { userNameOrEmail, password }, { req }) => {
      try {
        const existingUser = await User.findOne(
          userNameOrEmail.includes('@') ? { email: userNameOrEmail } : { userName: userNameOrEmail }
        );
        // if account not exist
        if (!existingUser)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Account not found',
              errors: [{ field: 'userNameOrEmail', message: 'Username or email incorrect' }],
            },
          };
        // check password hash
        const checkingPassword = await argon2.verify(existingUser.password, password);
        if (!checkingPassword)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid password',
              errors: [{ field: 'password', message: 'Password is incorrect!' }],
            },
          };
        // all good -> add cookie userId
        req.session.userId = existingUser.id;
        return {
          network: {
            code: 200,
            success: true,
            message: 'Logged in',
          },
          data: existingUser,
        };
      } catch (err) {
        console.log(err);
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal server error ${err.message}`,
          },
        };
      }
    },
    logout: async (_, {}, { req, res }) => {
      return new Promise((resolve, _reject) => {
        res.clearCookie(process.env.COOKIE_NAME);
        req.session.destroy((error) => {
          if (error) {
            console.log('Destroying cookie error: ', error);
            resolve(false);
          }
          resolve(true);
        });
      });
    },
    forgotPassword: async (_, { email }, {}) => {
      try {
        const user = await User.findOne({ email });
        if (!user)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Email not found',
            },
          };
        // delete previous token if user dont use
        await Token.findOneAndDelete({ userId: `${user._id}` });
        const resetToken = uuidv4();
        const hashedResetToken = await argon2.hash(resetToken);
        // save token to db
        await new Token({
          userId: `${user._id}`,
          token: hashedResetToken,
        }).save();
        // send reset password link to user via email
        await sendMail(
          email,
          `<a style="color : white; background: green;"   href="http://localhost:5000/change-password?token=${resetToken}&id=${user._id}">Reset your password</a>`
        );
        return {
          network: {
            code: 200,
            success: true,
            message: 'Please check your e-mailbox! You will find a link to reset password.',
          },
        };
      } catch (e) {
        console.log(e);
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal server error: ${e.message}`,
          },
        };
      }
    },
    changePassword: async (parent, { token, userId, newPassword }, { req }) => {
      try {
        if (newPassword.length < 2)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid Reseting password',
              errors: [
                {
                  message: 'Invalid password',
                  details: [
                    {
                      field: 'password',
                      detailedMessage: 'New password length must have at least 3 characters!',
                    },
                  ],
                },
              ],
            },
          };
        const resetPasswordTokenRecord = await Token.findOne({ userId });
        if (!resetPasswordTokenRecord) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid or expired password reset token',
              errors: [
                {
                  field: 'token',
                  message: 'Invalid or expired password reset token',
                },
              ],
            },
          };
        }
        const resetPasswordTokenValid = argon2.verify(resetPasswordTokenRecord.token, token);
        if (!resetPasswordTokenValid) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid or expired password reset token',
              errors: [
                {
                  field: 'token',
                  message: 'Invalid or expired password reset token',
                },
              ],
            },
          };
        }
        const user = await User.findOne({ _id: userId.toString() });
        if (!user) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'User no longer exists',
              errors: [{ field: 'token', message: 'User no longer exists' }],
            },
          };
        }
        // all good
        const updatedPassword = await argon2.hash(newPassword);
        await User.findOneAndUpdate({ _id: userId }, { password: updatedPassword });
        await resetPasswordTokenRecord.deleteOne();
        req.session.userId = user.id;
        return {
          network: {
            code: 200,
            success: true,
            message: 'Password reseted!',
          },
          data: user,
        };
      } catch (e) {
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal server error || Malware acions`,
          },
        };
      }
    },
  },
};
