import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import cors from 'cors';
import MongoStore from 'connect-mongo';
import session from 'express-session';

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';

import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import schema from './schema/index';
import resolvers from './resolvers/index';
import { compileFunction } from 'vm';
import Comment from './models/comment';

async function startApolloServer() {
  const app = express();
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN_DEV,
      credentials: true,
    })
  );

  const httpServer = http.createServer(app);

  // mongo
  const mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.bkuzt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const connectMongo = async () => {
    try {
      await mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
    } catch (error) {
      console.log(error.message);
      process.exit(1);
    }
  };
  await connectMongo();
  app.set('trust proxy', 1);
  app.use(
    session({
      name: process.env.COOKIE_NAME,
      store: MongoStore.create({ mongoUrl }),
      cookie: {
        maxAge: 1000 * 60 * 60, // one hour
        httpOnly: true, // JS front end cannot access the cookie
        secure: false, // cookie only works in https
        sameSite: 'lax',
      },
      secret: process.env.SESSION_SECRET_DEV_PROD,
      saveUninitialized: false, // don't save empty sessions, right from the start
      resave: false,
    })
  );

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  });

  await server.start();

  server.applyMiddleware({ app, cors: false });

  await new Promise((resolve) => httpServer.listen({ port: process.env.PORT || 4000 }, resolve));

  console.log(`Server running at http://localhost:4000${server.graphqlPath}`);
}

try {
  await startApolloServer();
} catch (e) {
  console.log('SERVER_ERRORS:', e);
}

// await Comment.deleteMany(); 
// const comment1  = new Comment({content: "comment root" , tag : "622ba6549ab5b03daea70a83" , user:"622ba6549ab5b03daea70a83" , postId : "622f74ee2a33d5c46650babf" , postUserId  : "622bb40db7b211376f997eb3"}); 
// const commentReply  = new Comment({reply:comment1._id , content: "comment reply" , tag : "622ba6549ab5b03daea70a83" , user:"622bb40db7b211376f997eb3" , postId : "622f74ee2a33d5c46650babf" , postUserId  : "622bb40db7b211376f997eb3"}); 
// const commentNesetedReply  = new Comment({reply : commentReply._id ,  content: "comment nested reply" , tag : "622ba6549ab5b03daea70a83" , user:"622ba6549ab5b03daea70a83" , postId : "622f74ee2a33d5c46650babf" , postUserId  : "622bb40db7b211376f997eb3"}); 
// await comment1.save();
// await commentReply.save(); 
// await commentNesetedReply.save()