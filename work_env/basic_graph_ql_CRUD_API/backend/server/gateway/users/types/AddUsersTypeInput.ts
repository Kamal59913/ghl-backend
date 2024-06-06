import { GraphQLInputObjectType, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { GraphQLEmailAddress } from 'graphql-scalars';

export const AddUsersTypeInput = new GraphQLInputObjectType({
  name: 'AddUsersTypeInput',
  fields: () => ({
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLEmailAddress),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }),
});
