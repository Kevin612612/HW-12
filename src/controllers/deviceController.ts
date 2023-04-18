
import {RefreshTokensBusinessLayer} from "../BLL/refresh-tokens-BLL";
import {JWTService} from "../application/jwt-service";
import {Request, Response} from "express";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class DeviceController {

    constructor(protected refreshTokensBusinessLayer: RefreshTokensBusinessLayer,
                protected jwtService: JWTService) {}

    async getAllDevices(req: Request, res: Response) {
        //INPUT
        const refreshToken = req.cookies.refreshToken
        //BLL
        const allDevices = await this.refreshTokensBusinessLayer.allDevices(refreshToken)
        //RETURN
        res.status(200).send(allDevices)
    }

    async deleteOtherDevices(req: Request, res: Response) {
        //INPUT
        const refreshToken = req.cookies.refreshToken
        //BLL
        const allOtherDevices = await this.refreshTokensBusinessLayer.terminateAllOtherDevices(refreshToken)
        //RETURN
        res.status(204).send(allOtherDevices)
    }

    async deleteOneDevice(req: Request, res: Response) {
        //INPUT
        const deviceId = req.params.deviceId
        const refreshToken = req.cookies.refreshToken
        const user = this.jwtService.getUserByRefreshToken(refreshToken)
        //BLL
        const result = await this.refreshTokensBusinessLayer.terminateCurrentDevice(user.userId, deviceId)
        //RETURN
        res.status(204).send(result)
    }
}
