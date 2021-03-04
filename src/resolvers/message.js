import { v4 as uuidv4 } from 'uuid';

export default {
    Query :{

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
       

    Message: {
        user: Message =>{
            return users[Message.userId];
        },
    },
    
};