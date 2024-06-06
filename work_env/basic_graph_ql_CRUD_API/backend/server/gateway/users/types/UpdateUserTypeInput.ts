import { GraphQLInputObjectType, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';

export const UpdateUserTypeInput = new GraphQLInputObjectType({
  name: 'UpdateUserTypeInput',
  fields: () => ({
    id: {
     type: new GraphQLNonNull(GraphQLString)
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  })
});

