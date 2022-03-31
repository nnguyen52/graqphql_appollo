import { validateRegisterInput } from '../customMiddleware/validateRegisterInputs';
import User from '../models/user';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import Token from '../models/token';
import { sendMail } from '../utils/sendMails';
import { checkAuth } from '../customMiddleware/checkAuth';
import Post from '../models/Post';
import { logout } from '../utils/logout';
import { deletePost } from '../utils/deletePost';
import user from '../schema/user';
//src: https://github.com/the-road-to-graphql/fullstack-apollo-express-mongodb-boilerplate/blob/master/src/resolvers/message.js#L6
const toCursorHash = (string) => Buffer.from(string).toString('base64');
const fromCursorHash = (string) => Buffer.from(string, 'base64').toString('ascii');
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
    users: async (parent, args, { req }) => {
      return await User.find();
    },
    user: async (parent, { id }, { req }) => {
      return await User.findById(id);
    },
    getUserByID: async (parent, { id }) => {
      try {
        const user = await User.findOne({ _id: id.toString() });
        if (!user) {
          return {
            network: {
              code: 200,
              success: true,
              message: 'User not found',
            },
            data: null,
          };
        }
        return {
          network: {
            code: 200,
            success: true,
          },
          data: user,
        };
      } catch (e) {
        console.log(e);
        return {
          network: {
            code: 500,
            success: false,
            messsage: `Internal Server Error: ${e.message}`,
          },
        };
      }
    },
  },
  Mutation: {
    verifyPassword: async (_, { password, email }, { req }) => {
      try {
        const isAllowed = await checkAuth(req);
        if (!isAllowed)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Action denied.',
              errors: [
                {
                  field: 'user',
                  message: 'Please login to edit your profile!',
                },
              ],
            },
          };
        const user = await User.findOne({
          _id: req.session.userId.toString(),
          email,
        });
        if (!user) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid data',
              errors: [
                {
                  field: `user`,
                  message: `Invalid data. Please check your password or email again.`,
                },
              ],
            },
          };
        }
        // check password hash
        const checkingPassword = await argon2.verify(user.password, password);
        if (!checkingPassword)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid password',
              errors: [
                {
                  field: 'user',
                  message: `Invalid data. Please check your password or email again.`,
                },
              ],
            },
          };
        // all good
        return {
          network: {
            code: 200,
            success: true,
          },
          data: null,
        };
      } catch (e) {
        console.log(e);
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal Server error: ${e.message}`,
          },
        };
      }
    },
    register: async (_, { userName, email, password }, { req }) => {
      try {
        //reject exsiting user
        let existingUserByUsername = await User.findOne({ userName });
        if (existingUserByUsername) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid registration',
              errors: [{ field: `userName`, message: `${userName} is already taken.` }],
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
              errors: [{ field: `email`, message: `${email} is already taken.` }],
            },
          };
        }
        // filter register inputs
        const validateInputResponse = validateRegisterInput({
          userName,
          email,
          password,
        });
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
              errors: [
                {
                  field: 'userNameOrEmail',
                  message: 'Username or email incorrect',
                },
              ],
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
        // await Token.findOneAndDelete({ userId: `${user._id}` });
        const existingTokens = await Token.find({
          userId: user._id.toString(),
        });
        if (existingTokens.length > 0)
          for (const token of existingTokens)
            await Token.findOneAndDelete({ _id: token._id.toString() });
        const resetToken = uuidv4();
        const hashedResetToken = await argon2.hash(resetToken);
        // save token to db
        await new Token({
          userId: `${user._id}`,
          token: hashedResetToken,
          type: 'forgotPassword',
        }).save();
        // send reset password link to user via email
        await sendMail(
          email,
          `<a style="color : white; background: green;"   href="http://localhost:3000/account/password?type=forgotPassword&token=${resetToken}&id=${user._id}">Reset your password</a>`,
          'Reset your password'
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
    changePassword: async (parent, { token, userId, newPassword, type }, { req }) => {
      try {
        if (!type)
          return {
            code: 400,
            succcess: false,
            message: `Invalid data`,
            errors: [{ field: 'password', message: 'Action denied.' }],
          };
        if (newPassword.length < 2)
          return {
            network: {
              code: 400,
              success: false,
              message: `Invalid ${type == 'forgotPassword' ? 'reseting' : 'updating'} password`,
              errors: [
                {
                  field: 'password',
                  message: 'New password length must have at least 3 characters!',
                },
              ],
            },
          };
        const resetPasswordTokenRecord = await Token.findOne({ userId, type });
        if (!resetPasswordTokenRecord) {
          return {
            network: {
              code: 400,
              success: false,
              message: `Invalid or expired password ${
                type == 'forgotPassword' ? 'reseting' : 'updating'
              } token`,
              errors: [
                {
                  field: 'token',
                  message: 'Your request may be expired. Please try again. ',
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
              message: `Invalid or expired password ${
                type == 'forgotPassword' ? 'reseting' : 'updating'
              } token`,
              errors: [
                {
                  field: 'token',
                  message: 'Your request may be expired. Please try again. ',
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
            message: `Password ${type == 'forgotPassword' ? 'reseted' : 'updated'}!`,
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
    editMe: async (parent, { newUserInfo }, { req }) => {
      try {
        const isAllowed = await checkAuth(req);
        if (!isAllowed)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Action denied.',
              errors: [
                {
                  field: 'user',
                  message: 'Please login to edit your profile!',
                },
              ],
            },
          };
        const { userName, password, email } = newUserInfo;
        const user = await User.findOne({ _id: req.session.userId, email });
        // change username directly
        // but changing password must be done by email verification
        if (!user) {
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid Data.',
              errors: [
                {
                  field: 'user',
                  message: 'Your session has expired. Please login again!',
                },
              ],
            },
          };
        }
        let updatedUser = user;
        if (userName)
          updatedUser = await User.findOneAndUpdate(
            { _id: req.session.userId.toString() },
            {
              ...userName,
              userName,
            },
            { new: true }
          );
        if (!password)
          return {
            network: {
              success: true,
              code: 200,
              message: 'Profile updated!',
            },
            data: {
              id: updatedUser._id.toString(),
              userName,
              email,
              password: null,
            },
          };

        // if updating password -> send mail to confirm
        await Token.findOneAndDelete({ userId: req.session.userId.toString() });
        const updatePasswordToken = uuidv4();
        const hashedUpdatePasswordToken = await argon2.hash(updatePasswordToken);
        // save token to db
        await new Token({
          userId: req.session.userId.toString(),
          token: hashedUpdatePasswordToken,
          type: 'updatePassword',
        }).save();
        await sendMail(
          email,
          `<a style="color : white; background: green;"   href="http://localhost:3000/account/password?type=updatePassword&token=${updatePasswordToken}&id=${req.session.userId.toString()}">Update your password</a>`,
          'Update your password'
        );
        return {
          network: {
            code: 200,
            success: true,
            message: 'Please check your e-mailbox! You will find a link to update password.',
          },
          data: null,
        };
      } catch (e) {
        console.log(e);
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal Server Error: ${e.message}`,
          },
        };
      }
    },
    confirmingDeleteAccount: async (parent, { email }, { req }) => {
      try {
        const isAllowed = await checkAuth(req);
        if (!isAllowed)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Action denied.',
              errors: [
                {
                  field: 'user',
                  message: 'Please login to edit your profile!',
                },
              ],
            },
          };

        const user = await User.findOne({
          _id: req.session.userId.toString(),
          email,
        });
        if (!user)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid Data',
              errors: [{ field: 'user', message: 'This account does not exist' }],
            },
          };

        const existingTokens = await Token.find({
          userId: user._id.toString(),
        });
        if (existingTokens.length > 0)
          for (const token of existingTokens)
            await Token.findOneAndDelete({ _id: token._id.toString() });
        const deleteToken = uuidv4();
        const hashedDeleteToken = await argon2.hash(deleteToken);
        // save token to db
        await new Token({
          userId: req.session.userId.toString(),
          token: hashedDeleteToken,
          type: 'deleteAccount',
        }).save();
        await sendMail(
          email,
          `<a style="color:white; background:red;"href="http://localhost:3000/account/delete?token=${deleteToken}&id=${req.session.userId.toString()}">Delete your account.</a>`,
          'Delete your Account'
        );
        return {
          network: {
            code: 200,
            success: true,
            message:
              'Please check your e-mailbox! You will find a link/confirmation to delete your account.',
          },
          data: null,
        };
      } catch (e) {
        console.log(e);
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal Server error ${e.message}`,
          },
        };
      }
    },
    deleteAccount: async (parent, { token, type }, { req, res }) => {
      try {
        const isAllowed = await checkAuth(req);
        if (!isAllowed)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Action denied.',
              errors: [
                {
                  field: 'user',
                  message: 'Please login to edit your profile!',
                },
              ],
            },
          };
        if (!type)
          return {
            network: {
              code: 400,
              success: false,
              message: `Invalid Data`,
              errors: [{ field: 'user', message: 'Action denied.' }],
            },
          };
        const deleteAccountTokenRecord = await Token.findOne({
          userId: req.session.userId,
          type,
        });
        if (!deleteAccountTokenRecord)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid Data',
              errors: [
                {
                  field: 'token',
                  message: 'Your request may be expired. Please request again.',
                },
              ],
            },
          };
        const resetDeleteAccountTokenValid = argon2.verify(deleteAccountTokenRecord.token, token);
        if (!resetDeleteAccountTokenValid)
          return {
            network: {
              code: 400,
              success: false,
              message: 'Invalid Data',
              errors: [
                {
                  field: 'token',
                  message: 'Your request may be expired. Please try again. ',
                },
              ],
            },
          };

        // all good
        // delete all post form this user + delete User
        const posts = await Post.find({
          userId: req.session.userId.toString(),
        });
        for (const post of posts) await deletePost(post, req.session.userId.toString());
        await deleteAccountTokenRecord.deleteOne();
        await User.findOneAndDelete({ _id: req.session.userId.toString() });
        // logout user
        await logout({ req, res });

        return {
          network: {
            code: 200,
            success: true,
            message: 'We are sad to see you leave. You account is deleted.',
          },
          data: null,
        };
      } catch (e) {
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal Server error ${e.message}`,
          },
        };
      }
    },
    searchUsers: async (_parent, { input, limit = 10, cursor }) => {
      try {
        let realLimit = limit > 10 ? 10 : limit;
        const cursorOptions = cursor
          ? {
              createdAt: {
                $lt: fromCursorHash(cursor),
              },
              $or: [{ userName: { $regex: `^${input}*` } }, { email: { $regex: `^${input}*` } }],
            }
          : {
              $or: [{ userName: { $regex: `^${input}*` } }, { email: { $regex: `^${input}*` } }],
            };
        let users = await User.find(cursorOptions, null, {
          sort: { createdAt: -1 },
          limit: realLimit + 1,
        });
        if (users.length == 0)
          return {
            network: {
              code: 200,
              success: true,
              mesasge: 'Opps, we can not find any users you requested. Please try again.',
            },
            data: {
              users: [],
              pageInfo: {
                hasNextPage: false,
              },
            },
          };
        const hasNextPage = users.length > realLimit;
        const edges = hasNextPage ? users.slice(0, -1) : users;
        return {
          network: {
            code: 200,
            success: true,
          },
          data: {
            users: edges,
            pageInfo: {
              hasNextPage,
              endCursor: hasNextPage
                ? toCursorHash(edges[edges.length - 1].createdAt.toString())
                : null,
            },
          },
        };
      } catch (e) {
        return {
          network: {
            code: 500,
            success: false,
            message: `Internal server error : ${e.message}`,
          },
        };
      }
    },
  },
};
