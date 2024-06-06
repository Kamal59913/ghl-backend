import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import UsersList from "./UsersList";
import Error from "../../types/ErrorType";

const UserResponse = new GraphQLObjectType({
    name: 'UserResponse',
    fields: () => ({
        UsersList: {
            type: new GraphQLList(UsersList)
        },
        totalUsers: {
            type: GraphQLInt
        },
        errors: {
            type: new GraphQLList(Error)
        }
    })
})

export default UserResponse;