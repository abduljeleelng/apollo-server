import { ForbiddenError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';

import pubsub, { EVENTS } from '../subscription';

export default {
    Query :{
        messages:   async (parent, arg, { models })=>{
            return await models.Message.findAll();
        },
     
        message: async (parent, {id}, { models })=>{
            return await models.Message.findByPk(id);
        },
    },

    Mutation: {
        createMessageX: async (parent, {text}, {me, models})=>{
            try {
                return await models.Message.create(
                    {
                        text,
                        userId: me.id
                    }
                )
            } catch (error) {
                throw new Error(error) 
            }
        },

        createMessage: combineResolvers(
            isAuthenticated,
            async (parent, { text }, { me, models }) => {
                if(!me){
                    throw new ForbiddenError('Not authenticated as user.')
                }
                const message =await models.Message.create(
                    {
                        text,
                        userId:me.id
                    }
                );
                pubsub.publish(EVENTS.MESSAGE.CREATED, {
                    messageCreated: { message },
                });

                return message
            },
        ),
        
        deleteMessage: combineResolvers(
            isAuthenticated,
            isMessageOwner,
            async (parent, {id}, {models})=>{
                return await models.Message.destroy({ where: {id}});
            },
        ),

    },
       
    Message: {
        user: async (message, args, { models}) =>{
            return await models.User.findByPk(message.userId);
        },
    },

    Subscription: {
        messageCreated: {
            subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
        },
    },
};