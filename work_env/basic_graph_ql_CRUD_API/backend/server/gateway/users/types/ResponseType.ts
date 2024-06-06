  import { GraphQLObjectType, GraphQLList, GraphQLBoolean } from 'graphql';
  import Error from '../../types/ErrorType';
  import { UserType } from './UsersType';

  const ReponseType = new GraphQLObjectType({
    name: 'ReponseType',
    fields: () => ({
      success: {
        type: GraphQLBoolean
      },
      user: {
        type: UserType
      },
      errors: {
        type: new GraphQLList(Error),
      },
    }),
  });
  export default ReponseType;
