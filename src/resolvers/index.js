import { v4 as uuidv4 } from 'uuid';

export default {
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