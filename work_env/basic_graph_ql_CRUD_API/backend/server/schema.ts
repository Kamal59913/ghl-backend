import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userQuery, usersMutation } from "./gateway/users/schema";

const query = new GraphQLObjectType({
  name: "query",
  fields: () => ({
    ...userQuery
  }),   
});

const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: () => ({
    ... usersMutation
  })
})

export const schema = new GraphQLSchema({
  mutation,
  query,
});
