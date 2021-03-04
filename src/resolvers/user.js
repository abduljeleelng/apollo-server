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
    },

    User: {
        messages: user =>{
            return Object.values(messages).filter(
                message=>message.userId === user.id,
            );
        },
    },
    
};