
//Business Layer


//(1) get all active devices
//(2) terminates all other devices
//(3) terminates current devices




import {RefreshTokensRepository} from "../repositories/refreshTokens-repository-db";
import {RefreshTokensTypeSchema} from "../types/refreshTokens";
import {JWTService} from "../application/jwt-service";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class RefreshTokensBusinessLayer {

    constructor (protected jwtService: JWTService,
                 protected refreshTokensRepository: RefreshTokensRepository) {}

    //(1) this method transform all found data and returns them to router
    async allDevices(refreshToken: string): Promise<RefreshTokensTypeSchema> {
        //find refreshToken by value and return userId
        const userId = this.jwtService.getUserByRefreshToken(refreshToken).userId
        //find all refreshTokens by that userId and non expired date
        if (userId) {
            const result = await this.refreshTokensRepository.allActiveDevices(userId)
            return result.map(result => {
                return {
                    ip: result.IP,
                    title: result.deviceName,
                    deviceId: result.deviceId,
                    lastActiveDate: result.createdAt,
                }
            })
        }
        return []
    }


    //(2) this method terminates all other devices
    async terminateAllOtherDevices(refreshToken: string): Promise<boolean> {
        const payload = this.jwtService.getUserByRefreshToken(refreshToken)
        if (payload) {
            return await this.refreshTokensRepository.deleteOthers(payload.userId, payload.deviceId)
        }
        return false
    }

    //(3) this method terminates current devices
    async terminateCurrentDevice(userId: string, deviceId: string): Promise<boolean | number> {
        const result = await this.refreshTokensRepository.deleteOne(userId, deviceId)
        return result ? result : 404
    }

}

