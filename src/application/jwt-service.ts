
//Presentation Layer


//(1) create access token
//(2) create refresh token
//(3) method returns user by token
//(4) method return user by refresh-token
//(5) check if a token has expired
//(6) make refreshToken Invalid


import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

import {userDataModel} from "../types/users";
import {UserRepository} from "../repositories/users-repository-db";
import {blackList} from "../repositories/mongodb";
import {RefreshTokensRepository} from "../repositories/refreshTokens-repository-db";
import add from "date-fns/add";
import {refreshTokensDataModel} from "../types/refreshTokens";

export class JWTService {

    constructor(protected userRepository: UserRepository,
                protected refreshTokensRepository: RefreshTokensRepository)
    {}


    //(1) create access token
    async createAccessJWT(user: userDataModel) {
        //create token
        const payload = {
            userId: user.id,
            login: user.accountData.login,
            email: user.accountData.email
        }
        const liveTime = 3600
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_secret!,
            {expiresIn: liveTime + "s"}
        )
        //put it into db in user schema
        const result = await this.userRepository.addAccessToken(user, accessToken, liveTime)
        return accessToken
    }


    //(2) create refresh token
    async createRefreshJWT(user: userDataModel,
                           deviceId: string,
                           deviceName: string,
                           IP: string,) {
        const payload = {
            userId: user.id,
            login: user.accountData.login,
            email: user.accountData.email,
            deviceId: deviceId
        }
        const liveTime = 7200
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_secret!,
            {expiresIn: liveTime + "s"}
        )
        //put it into db in user schema
        const result1 = await this.userRepository.addRefreshToken(user, refreshToken, liveTime)
        //put it into refreshTokensCollection
        const refreshTokenObject: refreshTokensDataModel = {
            value: refreshToken,
            userId: user.id,
            deviceId: deviceId,
            deviceName: deviceName,
            IP: IP,
            createdAt: new Date(),
            expiredAt: add(new Date(), {seconds: liveTime})
        }
        const result2 = await this.refreshTokensRepository.newCreatedToken(refreshTokenObject)
        return refreshToken
    }


    //(3) method return user by access-token
    getUserByAccessToken(token: string) {
        const user: any = jwt.verify(token, process.env.JWT_secret!)
        return {
            userId: user.userId,
            login: user.login,
            email: user.email
        }
    }


    //(4) method return user by refresh-token
    getUserByRefreshToken(token: string) {
        const user: any = jwt.verify(token, process.env.JWT_secret!)
        return {
            userId: user.userId,
            login: user.login,
            email: user.email,
            deviceId: user.deviceId
        }
    }


    //(5)check if a token has expired
    async isTokenExpired(token: string): Promise<boolean> {
        try {
            const payload = jwt.verify(token, process.env.JWT_secret!) as { exp: number }
            const expirationTime = payload.exp
            const currentTime = Math.floor(Date.now() / 1000)
            return expirationTime < currentTime;
        } catch (error) {
            // Handle invalid token or other errors
            return true;
        }
    }


    //(6) make refreshToken Invalid
    async makeRefreshTokenExpired(token: string): Promise<boolean> {
        blackList.push(token)
        return true
    }
}