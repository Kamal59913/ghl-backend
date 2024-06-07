import express, { Application } from 'express'
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';

import { schema } from './schema';
import { config } from 'dotenv';
import initiateMongoServer from './db';
import { jwtVerify } from './gateway/users/authMiddleWare/authMiddleware';
config()

const app: Application = express()

initiateMongoServer()

app.use(express.json());
app.use(cors());
// app.use(authenticateJWT)
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
  }));
  
const PORT = process.env.PORT || 5656;

const server:any = new ApolloServer({
    schema,
    context: async ({ req }) => {
        if(!req.headers.authorization) {
            return { message: 'User must be logged In'}
        }
        const token = req.headers.authorization;
        const user = await jwtVerify(token);
        return { user }
    }
})

server.start().then(() => {
    server.applyMiddleware({ app, path: '/graphql' });
    app.listen(PORT, () => {
        console.log(`The server is running at http://localhost:${PORT}/graphql`)
    })
})
