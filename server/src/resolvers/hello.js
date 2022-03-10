export default {
  Query: {
    hello(parent, args, {req,res}) {
      // console.log(req);
      console.log('cookie: ' , req.session.id)
      return 'hello world';
    },
  },
};
