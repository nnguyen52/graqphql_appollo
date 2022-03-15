import helloworldSchema from "./hello";
import mutationResponse from "./mutationResponse";
import { ErrorType } from "./mutationResponse";
// user
import userSchema from "./user";
import userMutationReponse from "./userMutationReponse";
// post
import postSchema from "./post";
import commentSchema from "./comment";
export default [
  helloworldSchema,
  mutationResponse,
  ErrorType,
  // user
  userSchema,
  userMutationReponse,
  // post
  postSchema,
  // comment
  commentSchema,
];
