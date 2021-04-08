import jwt from 'jsonwebtoken';
//import 'dotenv/config';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { isAdmin } from './authorization';

const createToken = async (user, secret, expiresIn) => {
    console.log({user, secret, expiresIn})
    const { id, email, username, role } = user;
    return await jwt.sign({ id, email, username, role }, process.env.JWT_SECRET, {expiresIn,});
};

console.log(process.env.JWT_SECRET);

export default {
    Query :{
       users: async (parent, args, {models })=>{
           /*
            models.User.findAll().then(users => {
                console.log("All users:", JSON.stringify(users, null, 4));
            });
            */
           const result =  await models.User.findAll();
           if(result){
               return result;
            }else{
               return {"error":"data not found"}
            }
        },

        user: async (parent, {id}, {models})=>{
            //return await models.User.findById(id);
            let user = await models.User.findByPk(id);
            //if(!user) return {error:"user not exist"}
            return user;
        },

        me: async (parent, args, {models, me}) => {
            if(!me){
                return null
            }
            return await models.User.findByPk(me.id)
        },
    },

    Mutation: {
        signUp: async ( parent, {username, email, password},{models, secret} )=>{
            const user = await models.User.create({username, email, password})
            return { token: createToken(user, secret, '30m')}
        },

        signIn: async (parent, {login, password}, {models, secret},)=>{
            let user = await models.User.findByLogin(login)
            if (!user){
                throw new UserInputError('No user found with the user crediential')
            }
            let isValid = await user.validatePassword(password)
            //const isValid = await user.validatePassword(password);
            if (!isValid){
                throw new AuthenticationError('Invalid password.');
            }
            return { token: createToken(user, secret, '30m') };    
        },

        deleteUser: combineResolvers(
            isAdmin,
            async (parent, {id}, {models})=>{
                return await models.User.destroy({
                    where:{id},
                })
            },
        ),
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
