import { GraphQLObjectType, GraphQLString } from "graphql";

export const Error = new GraphQLObjectType({
    name: 'Error',
    fields: () => ({
        message: {
            type: GraphQLString,
        },
        code: {
            type: GraphQLString
        }
    }),
})

export default Error;