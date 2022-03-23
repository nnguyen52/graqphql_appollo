import { validateRegisterInput } from "../customMiddleware/validateRegisterInputs";
import User from "../models/user";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import Token from "../models/token";
import { sendMail } from "../utils/sendMails";
import { checkAuth } from "../customMiddleware/checkAuth";
export default {
  Query: {
    me: async (parent, args, { req }) => {
      if (!req.session.userId)
        return {
          network: {
            code: 400,
            success: false,
            message: "Not logged in",
          },
          data: null,
        };
      const user = await User.findById({ _id: req.session.userId });
      if (!user)
        return {
          network: {
            code: 400,
            success: false,
            message: "Not logged in",
          },
          data: null,
        };
      return {
        network: {
          code: 200,
          success: true,
          message: "Logged in",
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
    register: async (_, { userName, email, password }, { req }) => {
      try {
        //reject exsiting user
        let existingUserByUsername = await User.findOne({ userName });
        if (existingUserByUsername) {
          return {
            network: {
              code: 400,
              success: false,
              message: "Invalid registration",
              errors: [
                { field: `userName`, message: `${userName} is already taken.` },
              ],
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
              message: "Invalid registration",
              errors: [
                { field: `email`, message: `${email} is already taken.` },
              ],
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
              message: "Invalid registration",
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
            message: "register sucessfully",
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
          userNameOrEmail.includes("@")
            ? { email: userNameOrEmail }
            : { userName: userNameOrEmail }
        );
        // if account not exist
        if (!existingUser)
          return {
            network: {
              code: 400,
              success: false,
              message: "Account not found",
              errors: [
                {
                  field: "userNameOrEmail",
                  message: "Username or email incorrect",
                },
              ],
            },
          };
        // check password hash
        const checkingPassword = await argon2.verify(
          existingUser.password,
          password
        );
        if (!checkingPassword)
          return {
            network: {
              code: 400,
              success: false,
              message: "Invalid password",
              errors: [
                { field: "password", message: "Password is incorrect!" },
              ],
            },
          };
        // all good -> add cookie userId
        req.session.userId = existingUser.id;
        // console.log( existingUser.id)
        return {
          network: {
            code: 200,
            success: true,
            message: "Logged in",
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
            console.log("Destroying cookie error: ", error);
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
              message: "Email not found",
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
          `<a style="color : white; background: green;"   href="http://localhost:5000/change-password?type=reset&token=${resetToken}&id=${user._id}">Reset your password</a>`,
          "Reset your password"
        );
        return {
          network: {
            code: 200,
            success: true,
            message:
              "Please check your e-mailbox! You will find a link to reset password.",
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
    changePassword: async (
      parent,
      { token, userId, newPassword, type },
      { req }
    ) => {
      try {
        if (newPassword.length < 2)
          return {
            network: {
              code: 400,
              success: false,
              message: `Invalid ${
                type == "reset" ? "reseting" : "updating"
              } password`,
              errors: [
                {
                  message: "Invalid password",
                  details: [
                    {
                      field: "password",
                      detailedMessage:
                        "New password length must have at least 3 characters!",
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
              message: `Invalid or expired password ${
                type == "reset" ? "reseting" : "updating"
              } token`,
              errors: [
                {
                  field: "token",
                  message: `Invalid or expired password ${
                    type == "reset" ? "reseting" : "updating"
                  } token`,
                },
              ],
            },
          };
        }
        const resetPasswordTokenValid = argon2.verify(
          resetPasswordTokenRecord.token,
          token
        );
        if (!resetPasswordTokenValid) {
          return {
            network: {
              code: 400,
              success: false,
              message: `Invalid or expired password ${
                type == "reset" ? "reseting" : "updating"
              } token`,
              errors: [
                {
                  field: "token",
                  message: `Invalid or expired password ${
                    type == "reset" ? "reseting" : "updating"
                  } token`,
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
              message: "User no longer exists",
              errors: [{ field: "token", message: "User no longer exists" }],
            },
          };
        }
        // all good
        const updatedPassword = await argon2.hash(newPassword);
        await User.findOneAndUpdate(
          { _id: userId },
          { password: updatedPassword }
        );
        await resetPasswordTokenRecord.deleteOne();
        req.session.userId = user.id;
        return {
          network: {
            code: 200,
            success: true,
            message: `Password ${type == "reset" ? "reseted" : "updated"}!`,
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
        if (!isAllowed || !newUserInfo.email)
          return {
            network: {
              code: 400,
              success: false,
              message: "Action denied.",
              errors: [
                {
                  field: "user",
                  message: "Please login to edit your profile!",
                },
              ],
            },
          };
        const { userName, password, email } = newUserInfo;
        if (!userName && !password) {
          return {
            network: {
              code: 400,
              success: false,
              message: "Action denied.",
              errors: [
                {
                  field: "user",
                  message: "Action denied.",
                },
              ],
            },
          };
        }
        const user = await User.findOne({ _id: req.userId, email });
        // change username directly
        // but changing password must be done by email verification
        if (!user) {
          return {
            network: {
              code: 400,
              success: false,
              message: "Invalid Data.",
              errors: [
                {
                  field: "user",
                  message: "Account now found. Please check your info again.",
                },
              ],
            },
          };
        }
        let updatedUser = user;
        if (userName)
          updatedUser = await User.findOneAndUpdate(
            { _id: req.userId.toString() },
            {
              ...userName,
              userName,
            }
          );
        if (!password)
          return {
            network: {
              success: true,
              code: 200,
              message: "Profile updated!",
            },
            data: {
              ...updatedUser._doc,
              userName,
              password: null,
            },
          };
        await Token.findOneAndDelete({ userId: req.userId.toString() });
        const resetToken = uuidv4();
        const hashedResetToken = await argon2.hash(resetToken);
        // save token to db
        await new Token({
          userId: req.userId.toString(),
          token: hashedResetToken,
        }).save();
        await sendMail(
          email,
          `<a style="color : white; background: green;"   href="http://localhost:5000/change-password?type=update&token=${resetToken}&id=${req.userId.toString()}">Update your password</a>`,
          "Update your password"
        );
        return {
          network: {
            code: 200,
            success: true,
            message:
              "Please check your e-mailbox! You will find a link to update password.",
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
  },
};
