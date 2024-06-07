import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { LoggedInUserType } from '../LoggedInUserType';

const AuthPayload = new GraphQLObjectType({
  name: 'AuthPayload',
  fields: () => ({
    token: {
      type: GraphQLString
    },
    user: {
      type: LoggedInUserType
    },
    message: {
      type: 
        GraphQLString
    }
  }),
});
export default AuthPayload;


