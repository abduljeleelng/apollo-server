import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    messages: [Message!]!
    message(id: ID!): Message!
  }
  extend type Mutation {
    createMessage(text: String!): Message!
    createMessageX(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }
  extend type Subscription {
    messageCreated: MessageCreated!
  }
  type MessageCreated {
    message: Message!
  }
  type Message {
    id: ID!
    text: String!
    createdAt: String!
    user: User!
  }
`;
