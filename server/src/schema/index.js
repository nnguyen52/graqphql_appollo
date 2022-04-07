import helloworldSchema from './hello';
import mutationResponse from './mutationResponse';
import { ErrorType } from './mutationResponse';
// user
import userSchema from './user';
import userMutationReponse from './userMutationReponse';
// post
import postSchema from './post';
import commentSchema from './comment';
import networkResponse from './networkResponse';
export default [
  helloworldSchema,
  mutationResponse,
  networkResponse,
  ErrorType,
  // user
  userSchema,
  userMutationReponse,
  // post
  postSchema,
  // comment
  commentSchema,
];
