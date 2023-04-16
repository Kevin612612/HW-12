
//USERS


//view type
import {ObjectId} from "mongodb";

export type userViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: Date
}


type codeDataType = {
    code: string,
    sentAt: Date
}

type TokenType = {
    value: string,
    createdAt: Date,
    expiredAt: Date

}

export type userAccountDataType = {
    login: string,
    email: string,
    passwordSalt,
    passwordHash,
    createdAt: Date
}
export type conformationType = {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean,
}

export type userDataModel = {
    _id: ObjectId,
    id: string,
    accountData: userAccountDataType,
    emailConfirmation: conformationType,
    emailCodes: codeDataType[],
    passwordConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
    },
    passwordCodes: {
        code: string,
        sentAt: Date
    }[],
    tokens: {
        accessTokens: TokenType[],
        refreshTokens: TokenType[]
    }
}

//userType returned by POST-method
export type UsersTypeSchema = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: userViewModel[]
}
