
//Business Layer


//(1) allUsers
//(2) newPostedUser
//(3) deleteUser
//(4) confirm code
//(5) update password
//(6) method registers user


import {userViewModel, UsersTypeSchema} from "../types/users";
import {UserRepository} from "../repositories/users-repository-db";
import bcrypt from "bcrypt"
import {UserModel} from "../repositories/mogoose"
import mongoose from "mongoose";
import {User} from "../classes/userClass";
import {EmailsManager} from "../bussiness/bussiness-service";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class UserBusinessLayer {

    constructor (protected userRepository: UserRepository,
                 protected emailsManager: EmailsManager) { //we can pass any object looked like userRepository
    }

    //(1) this method returns all users to router
    async allUsers(pageNumber: any, pageSize: any, sortBy: any, sortDirection: any, searchLoginTerm: any, searchEmailTerm: any): Promise<UsersTypeSchema> {
        //define filter that depends on if we have searchLoginTerm and/or searchEmailTerm

        // x = a ? (b ? 11 : 10) : (b ? 01 : 00)
        const filter = searchLoginTerm ? searchEmailTerm ? {
            $or: [{
                "accountData.login": {
                    $regex: searchLoginTerm,
                    $options: "i"
                }
            }, {
                "accountData.email": {
                    $regex: searchEmailTerm,
                    $options: "i"
                }
            }]
        } : {
            "accountData.login": {
                $regex: searchLoginTerm,
                $options: "i"
            }
        } : searchEmailTerm ? {
            "accountData.email": {
                $regex: searchEmailTerm,
                $options: "i"
            }
        } : {};

        const sortedItems = await this.userRepository.allUsers(sortBy, sortDirection, filter)
        const quantityOfDocs = await UserModel.countDocuments(filter)

        return {
            pagesCount: Math.ceil(quantityOfDocs / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: quantityOfDocs,
            items: sortedItems.slice((+pageNumber - 1) * (+pageSize), (+pageNumber) * (+pageSize)).map((User: { id: any; accountData: { login: any; email: any; createdAt: any; }; }) => {
                return {
                    id: User.id,
                    login: User.accountData.login,
                    email: User.accountData.email,
                    createdAt: User.accountData.createdAt
                }
            })
        }
    }


    //(2) method creates user
    async newPostedUser(login: string, email: string, password: string): Promise<userViewModel | number | any> {
        //create new user
        let newUser = new User() //empty user
        newUser = await newUser.addAsyncParams(login, email, password) // fill user with async params
        // put this new user into db
        try {
            const result = await this.userRepository.newPostedUser(newUser)
            return {
                id: newUser.id,
                login: newUser.accountData.login,
                email: newUser.accountData.email,
                createdAt: newUser.accountData.createdAt,
            }
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

        //send email from our account to this user's email
        try {
            const sendEmail = await this.emailsManager.sendEmailConfirmationMessage(newUser.accountData.email, newUser.emailConfirmation.confirmationCode)
            return {
                id: `user with id ${newUser.id} and email ${sendEmail.accepted.toString()} has received a letter with code`,
                login: newUser.accountData.login,
                email: newUser.accountData.email,
                createdAt: newUser.accountData.createdAt,
            }
        } catch (error) {
            return 400 //email hasn't been sent
        }
    }


    //(3) method deletes by ID
    async deleteUser(userId: string): Promise<boolean | number> {
        const result = await this.userRepository.deleteUser(userId)
        return result ? result : 404
    }


    //(4) confirm code
    async confirmCodeFromEmail(code: string): Promise<boolean | number> {
        //find user by code
        const user = await this.userRepository.findUserByCode(code)
        //check if user exists and email confirmed and code is not expired
        if (user && user.emailConfirmation.expirationDate > new Date() && user.emailConfirmation.isConfirmed != true) {
            const changeStatus = await this.userRepository.updateStatus(user)
            return 204
        }
        return 400
    }

    //(5) update password
    async updatePassword(userId: string, newPassword: string): Promise<number> {
        const newPasswordSalt = await bcrypt.genSalt(10)
        const newPasswordHash = await bcrypt.hash(newPassword, newPasswordSalt)
        const result = await this.userRepository.updateSaltAndHash(userId, newPasswordSalt, newPasswordHash)
        return 204
    }


    //(6) method registers user
    async newRegisteredUser(login: string, email: string, password: string): Promise<userViewModel | number | any> {
        //create new user
        let newUser = new User() //empty user
        newUser = await newUser.addAsyncParams(login, email, password) // fill user with async params
        // put this new user into db
        try {
            const result = await this.userRepository.newPostedUser(newUser)
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

        //send email from our account to this user's email
        try {
            const sendEmail = await this.emailsManager.sendEmailConfirmationMessage(newUser.accountData.email, newUser.emailConfirmation.confirmationCode)
            return {
                id: `user with id ${newUser.id} and email ${sendEmail.accepted.toString()} has received a letter with code`,
                login: newUser.accountData.login,
                email: newUser.accountData.email,
                createdAt: newUser.accountData.createdAt,
            }
        } catch (error) {
            return 400 //email hasn't been sent
        }
    }
}

