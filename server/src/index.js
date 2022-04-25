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
import { graphqlUploadExpress } from 'graphql-upload';

async function startApolloServer() {
  const app = express();
  app.use(cors());
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
        secure: process.env.NODE_ENV === 'production', // cookie only works in https
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
    uploads: false,
  });
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));

  await server.start();
  server.applyMiddleware({ app, cors: false });
  await new Promise((resolve) => httpServer.listen({ port: process.env.PORT || 4000 }, resolve));
  console.log(`Server running at http://localhost:4000${server.graphqlPath}`);
}

await startApolloServer();

// await Post.deleteMany();
// await Comment.deleteMany();
// await Vote.deleteMany();
// await VoteComment.deleteMany();
