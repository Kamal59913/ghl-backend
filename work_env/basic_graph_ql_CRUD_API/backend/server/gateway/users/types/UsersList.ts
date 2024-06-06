import {GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

const UsersList = new GraphQLObjectType({
    name: 'UsersList',
    fields: () => ({
        _id: {
            type: GraphQLID,
        },
        username: {
            type: GraphQLString 
        },
        email: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString
        }
    })
})

export default UsersList;