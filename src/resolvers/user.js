
export default {
    Query :{
       users: async (parent, args, {models })=>{
           return await models.User.findAll();
       },
        user: (parent, {id}, {models})=>{
            return await models.User.findById(id);
        },
        me: (parent, args, {models, me}) => {
            return await models.User.findById(me.id)
        },
    },

    User: {
        messages: async (user, args, {models}) =>{
            return await models.Message.findAll({
                where : {
                    userId: user.id,
                }
            })
        },
    },
    
};