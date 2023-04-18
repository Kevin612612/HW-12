
//Data access Layer


//(1)  allUsers
//(2)  newPostedUser
//(3)  deleteUser
//(4)  findUserByLoginOrEmail
//(5)  findUserByLogin
//(6)  findUserByPasswordCode
//(7)  returns user by code
//(8)  update status
//(9)  update code
//(10) update date when the code was sent
//(11) update salt and hash
//(12) add accessToken into db
//(13) add refreshToken into db
//(14) add code
//(15) set refreshToken expired


import {userDataModel} from "../types/users";
import {usersCollection} from "./mongodb";
import add from "date-fns/add";
import {UserModel} from "./mogoose";
import mongoose from "mongoose";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class UserRepository {

    //(1) method returns array of users
    async allUsers(sortBy: string, sortDirection: string, filter: any): Promise<userDataModel[]> {
        const order = (sortDirection === 'asc') ? 1 : -1 // 1 for ascending order, -1 for descending order
        return UserModel.find(filter).lean().sort({[sortBy]: order}).select('-_id')
    }


    //(2) method creates user
    async newPostedUser(newUser: userDataModel): Promise<boolean | string[]> {
        try {
            const result = await UserModel.insertMany([newUser])
            return true
        } catch (err: any) {
            const validationErrors = []
            if (err instanceof mongoose.Error.ValidationError) {
                for (const path in err.errors) {   //accountData.login, accountData.email - path
                    const error = err.errors[path].message
                    validationErrors.push(error)
                }
            }
            return validationErrors
        }
    }


    //(3) method  delete user by Id
    async deleteUser(id: string): Promise<boolean | undefined> {
        const result = await UserModel.deleteOne({id: id})
        return result.deletedCount === 1
    }


    //(4) method returns user by loginOrEmail
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<userDataModel | undefined> {
        const result = await UserModel.findOne({$or: [{"accountData.login": {$regex: loginOrEmail}}, {"accountData.email": {$regex: loginOrEmail}}]})
        return result ? result : undefined
    }


    //(5) findUserByLogin
    async findUserByLogin(login: string): Promise<userDataModel | undefined> {
        const result = await UserModel.findOne({"accountData.login": {$regex: login}}, { maxTimeMS: 30000 })
        return result ? result : undefined
    }


    //(6) findUserByPasswordCode
    async findUserByPasswordCode(code: string): Promise<userDataModel | undefined> {
        const result = await UserModel.findOne({"passwordConfirmation.confirmationCode": code}, { maxTimeMS: 30000 })
        return result ? result : undefined
    }


    //(7) method returns user by code
    async findUserByCode(code: string): Promise<userDataModel | undefined> {
        const result = await UserModel.findOne({codes: {$elemMatch: {code: code}}}, { maxTimeMS: 30000 })
        return result ? result : undefined
    }


    //(8) method update status
    async updateStatus(user: userDataModel): Promise<boolean> {
        const result = await UserModel.updateOne({id: user.id}, {
            $set: {"emailConfirmation.isConfirmed": true}
        })
        return result.matchedCount === 1
    }


    //(9) method update code and PUSH every new code into array
    async updateCode(user: userDataModel, code: string): Promise<boolean> {
        const result = await UserModel.updateOne({"accountData.login": user.accountData.login}, {
            $set: {"emailConfirmation.confirmationCode": code}
        })
        const result1 = await UserModel.updateOne({"accountData.login": user.accountData.login}, {
            $push: {emailCodes: {code: code, sentAt: new Date()}}
        })
        return result.matchedCount === 1
    }

    //(10) method update the date when the FIRST CODE was sent
    async updateDate(user: userDataModel, code: string): Promise<boolean> {
        const result = await UserModel.updateOne({"accountData.login": user.accountData.login}, {
            $set: {emailCodes: [{code: code, sentAt: new Date()}]}
        })
        return result.matchedCount === 1
    }


    //(11) update salt and hash
    async updateSaltAndHash(userId: string, newPasswordSalt: string, newPasswordHash: string): Promise<boolean> {
        const result = await UserModel.updateOne({id: userId},
            {
                "accountData.passwordSalt": newPasswordSalt,
                "accountData.passwordHash": newPasswordHash
            }
        )
        return true
    }


    //(12) method add accessToken into db
    async addAccessToken(user: userDataModel, token: string, liveTime: number): Promise<boolean> {
        const result = await UserModel.findOneAndUpdate({"accountData.login": user.accountData.login}, {
            $push: {
                'tokens.accessTokens': {
                    value: token,
                    createdAt: new Date(),
                    expiredAt: add(new Date(), {seconds: liveTime})
                }
            }
        })
        return true
    }


    //(13) method add refreshToken into db
    async addRefreshToken(user: userDataModel, token: string, liveTime: number): Promise<boolean> {
        const result = await UserModel.findOneAndUpdate({"accountData.login": user.accountData.login}, {
            $push: {
                'tokens.refreshTokens': {
                    value: token,
                    createdAt: new Date(),
                    expiredAt: add(new Date(), {seconds: liveTime})
                }
            }
        })
        return true
    }


    //(14) add code into user
    async addCode(user: userDataModel | undefined, recoveryCode: string): Promise<boolean> {
        const userId = user?.id
        const result1 = await UserModel.findOneAndUpdate({id: userId}, {
            $push: {
                'passwordCodes': {
                    code: recoveryCode,
                    sentAt: new Date(),
                }
            }
        })
        const result2 = await UserModel.findOneAndUpdate({id: userId},
            {
                'passwordConfirmation.confirmationCode': recoveryCode,
                'passwordConfirmation.expirationDate': add(new Date(), {
                    hours: 10,
                    minutes: 3,
                })
            }
        )
        return true
    }


    //(15) method set refreshToken expired
    async setRefreshTokenExpired(user: userDataModel): Promise<boolean> {
        const result = await usersCollection.updateOne({"accountData.login": user.accountData.login}, {
            $set: {"refreshTokens": [{value: "", createdAt: "", expiredAt: ""}]}
        })
        return result.matchedCount === 1
    }

}

