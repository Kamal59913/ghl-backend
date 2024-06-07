import { GraphQLInputObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { GraphQLEmailAddress } from 'graphql-scalars';

export const LoginUserType = new GraphQLInputObjectType({
  name: 'LoginUserType',
  fields: () => ({
    email: {
      type: new GraphQLNonNull(GraphQLEmailAddress),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }),
});
