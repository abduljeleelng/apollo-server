import 'dotenv/config';
 
import express from 'express';
import {ApolloServer, gql} from 'apollo-server-express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
const users = {
    1:{
        id:'1',
        username : "Robin Wieruch",
        messageIds: [1]
    },
    2:{
        id:'2',
        username : "Robin ",
        messageIds: [2]
    },
    3:{
        id:'3',
        username : "Wieruch",
        messageIds: [3]
    },
    4:{
        id:'4',
        username : "Muhammed",
        messageIds: [4]
    },
}
const me = users[1];
const message = {
    1:{
        id:'1',
        text: "hello word",
        userId: '1'
    },
    2:{
        id:'2',
        text: "messaging demo",
        userId: '2'
    },
    3:{
        id:'3',
        text: "hello word",
        userId: '3'
    },
    4:{
        id:'4',
        text: "messaging demo",
        userId: '4'
    }
}

const schema = gql`
type Query{
    users: [User!]
    me: User
    user(id:ID!): User
    
    messages: [Message!]!
    message(id: ID!): Message!
}

type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!):Boolean!
}

type User {
    id :ID
    username :String!
    messages: [Message!]
}

type Message {
    id: ID!
    text: String!
    user: User!
}
`;
const resolvers = {
    Query :{
       users: ()=>{
        return Object.values(users)
       },
        user: (parent, {id})=>{
            return users[id]
        },
        me: (parent, args, {me}) => {
            return me
        },

        messages: ()=>{
            return Object.values(messages)
        },
     
        message: (parent, {id})=>{
            return message[id]
        },
    },

    Mutation: {
        createMessage: (parent, {text}, {me})=>{
            const id = uuidv4();
            const message = {
                id,
                text,
                userId: me.id
            };
            console.log({message})
         
            messages[id] = message;
           // messages[id].push(message)
            users[me.id].messageIds.push(id);
            return message;
        },
        deleteMessage: (parent, {id})=>{
            const {[id]: message, ...otherMessage } = messages;
            if(!message){
                return false;
            }
            messages = otherMessage;
            return true
        },
    },
       
    User: {
        messages: user =>{
            return Object.values(messages).filter(
                message=>message.userId === user.id,
            );
        },
    },

    Message: {
        user: Message =>{
            return users[Message.userId];
        },
    },
    
};

const server = new ApolloServer({
    typeDefs:schema,
    resolvers,
    context: {
        me: users[1],
    }
});

server.applyMiddleware({
    app,
    path:'/graphql'
});

app.listen({
    port :8000
},
()=>{
    console.log('Apollo Server on http://localhost:8000/graphql');
});

 
console.log(process.env.MY_SECRET);