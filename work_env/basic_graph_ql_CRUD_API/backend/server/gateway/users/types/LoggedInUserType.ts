import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const LoggedInUserType = new GraphQLObjectType({
    name: 'LoggedInUserType',
    fields: {
      username: {type: new GraphQLNonNull(GraphQLString)},
      email: {type: new GraphQLNonNull(GraphQLString)},
    }
  })