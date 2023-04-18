
//Business Layer




//(1) Does user exist and password correct

import bcrypt from "bcrypt";
import {userDataModel} from "../types/users";
import {UserRepository} from "../repositories/users-repository-db";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class AuthBusinessLayer {

    constructor (protected userRepository: UserRepository) {}

    //(1) Does user exist and password correct
    async IsUserExist(loginOrEmail: string, password: string): Promise<userDataModel | undefined> {
        //find user by login or email
        const user = await this.userRepository.findUserByLoginOrEmail(loginOrEmail)
        //if user exists then compare its hash and the hash of entered password
        if (user) {
            const passwordHash = await bcrypt.hash(password, user.accountData.passwordSalt)
            if (passwordHash == user.accountData.passwordHash) {
                return user
            }
        }
        return undefined
    }
}

