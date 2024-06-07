import addBookResolver from "./resolver/toCreate/addUserResolver"
import getBooksResolver from "./resolver/toGet/userListResolver"
import updateBookResolver from "./resolver/toUpdate/updateUserResolver"
import { UserType } from "./types/UsersType"
import ReponseType from "./types/ResponseType"
import addUserResolver from "./resolver/toCreate/addUserResolver"
import updateUserResolver from "./resolver/toUpdate/updateUserResolver"
import getUsersResolver from "./resolver/toGet/userListResolver"
import { AddUsersTypeInput } from "./types/AddUsersTypeInput"
import { UpdateUserTypeInput } from "./types/UpdateUserTypeInput"
import AuthPayload from "./types/AuthPayLoad/AuthPayload"
import { LoginUserType } from "./types/LoginUserType"
import loginResolver from "./resolver/toLogin/loginResolver"

export const userQuery = {
    getusersList: {
        type: ReponseType,
        resolve: getUsersResolver
    } 
}

export const usersMutation = {
    addUser: {
        type: ReponseType,
        args: {
            input: {
                type: AddUsersTypeInput
            }
        },
        resolve: addUserResolver
    },
    updateUser: {
        type: ReponseType,
        args: {
            input: {
                type: UpdateUserTypeInput
            }
        },
        resolve: updateUserResolver
    },
    login: {
        type: AuthPayload,
        args: {
            input: {
                type: LoginUserType
            }
        },
        resolve: loginResolver
    }
}
    