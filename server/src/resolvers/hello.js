import { sendMail } from '../utils/sendMails';
export default {
  Query: {
    hello: async (parent, args, { req, res }) => {
      await sendMail();
      return 'hello world';
    },
  },
};
