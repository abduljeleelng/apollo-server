import 'dotenv/config';
import http from 'http';

import jwt from 'jsonwebtoken';
 
import express from 'express';
import {ApolloServer, AuthenticationError,} from 'apollo-server-express';
import cors from 'cors';
import morgan from 'morgan';


import schema from './schema/index';
import resolvers from './resolvers';
import models, {sequelize} from './models'

const app = express();
app.use(cors());

//app.use(morgan('dev'));

const getMe = async req => {
  const token = req.headers['token'];
  //console.log({token})
  if (token){
    try {
      return await jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AuthenticationError('Your session expired. Sign in again.')
    }
  }
}

const server = new ApolloServer({
    introspection: true,
    playground: true,
    typeDefs:schema,
    resolvers,
    formatError: error=>{
      const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');
      return {
        ...error,
        message,
      }
    },
    context: async ({req, connection})=>{
      if(connection){
        return {
          models,
        };
      }

      if(req){
        const me = await getMe(req);
        return {
          models,
          me,
          secret: process.env.SECRET,
          myData:"Testing the logic"
        };
      }
    },
});

server.applyMiddleware({
    app,
    path:'/graphql'
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const eraseDatabaseOnSync = false;


sequelize.sync({ force: eraseDatabaseOnSync}).then(async ()=>{
    if(eraseDatabaseOnSync){
      //createUsersWithMessages();
      console.log("erase and insert new records")
    }
    app.listen({ port :8000 }, ()=>{
        console.log('Apollo Server on http://localhost:8000/graphql');
    });
});


//console.log(process.env.MY_SECRET);
const createUsersWithMessages = async date => {
    await models.User.create(
      {
        username: 'rwieruch',
        email: 'hello@robin.com',
        password: 'rwieruch',
        role: 'ADMIN',
        messages: [
          {
            text: 'Published the Road to learn React',
            //createdAt: date.setSeconds(date.getSeconds() + 1),
          },
        ],
      },
      {
        include: [models.Message],
      },
    );
  
    await models.User.create(
      {
        username: 'ddavids',
        email: 'hello@david.com',
        password: 'ddavids',
        messages: [
          {
            text: 'Happy to release ...',
            //createdAt: date.setSeconds(date.getSeconds() + 1),
          },
          {
            text: 'Published a complete ...',
            //createdAt: date.setSeconds(date.getSeconds() + 1),
          },
        ],
      },
      {
        include: [models.Message],
      },
    );
};