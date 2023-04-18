
import {AuthBusinessLayer} from "../BLL/auth-BLL";
import {UserBusinessLayer} from "../BLL/users-BLL";
import {UserRepository} from "../repositories/users-repository-db";
import {JWTService} from "../application/jwt-service";
import {EmailsManager} from "../bussiness/bussiness-service";
import {RefreshTokensRepository} from "../repositories/refreshTokens-repository-db";
import {Request, Response} from "express";
import requestIp from "request-ip";
import UAParser from "ua-parser-js";
import {createDeviceId} from "../application/findNonExistId";
import {blackList} from "../repositories/mongodb";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class AuthController {

    constructor(protected authBusinessLayer: AuthBusinessLayer,
                protected userBusinessLayer: UserBusinessLayer,
                protected userRepository: UserRepository,
                protected jwtService: JWTService,
                protected emailsManager: EmailsManager,
                protected refreshTokensRepository: RefreshTokensRepository) {
    }

    async login(req: Request, res: Response) {
        //INPUT
        const {loginOrEmail, password} = req.body
        const ipAddress = requestIp.getClientIp(req)
        const userAgent = req.headers['user-agent']
        const parser = new UAParser(userAgent);
        const deviceName = parser.getResult().ua ? parser.getResult().ua : 'noname';
        const deviceId = req.body.deviceId ? req.body.deviceId : await createDeviceId()
        //BLL
        const user = await this.authBusinessLayer.IsUserExist(loginOrEmail, password)
        //RETURN
        if (user) {
            //create the pair of tokens and put them into db
            const accessToken = await this.jwtService.createAccessJWT(user)
            const refreshToken = await this.jwtService.createRefreshJWT(user, deviceId!, deviceName!, ipAddress!)
            //send response with tokens
            res
                .cookie('refreshToken', refreshToken, {
                    maxAge: 3600 * 1000,
                    httpOnly: true,
                    secure: true
                })
                .status(200)
                .json({accessToken: accessToken})
        } else {
            res.sendStatus(401)
        }
    }

    async passwordRecovery(req: Request, res: Response) {
        //INPUT
        const email = req.body.email
        //BLL
        const result = await this.emailsManager.sendEmailConfirmationPasswordMessage(email)
        //RETURN
        res.sendStatus(204)
    }

    async newPassword(req: Request, res: Response) {
        //INPUT
        const newPassword = req.body.newPassword
        const code = req.body.recoveryCode
        const user = await this.userRepository.findUserByPasswordCode(code)
        //BLL
        if (user) {
            const result = await this.userBusinessLayer.updatePassword(user.id, newPassword)
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }

    async newPairOfTokens(req: Request, res: Response) {
        //INPUT
        const refreshToken = req.cookies.refreshToken
        const ipAddress = req.socket.remoteAddress;
        const userAgent = req.headers['user-agent']
        const parser = new UAParser(userAgent);
        const deviceName = parser.getResult().ua ? parser.getResult().ua : 'noname';
        const payload = this.jwtService.getUserByRefreshToken(refreshToken)
        const deviceId = payload.deviceId
        const user = await this.userRepository.findUserByLoginOrEmail(payload?.login)
        //BLL
        //since validation is passed, so we can add refreshToken in black list
        blackList.push(refreshToken)
        //...and delete from DB
        const deleteRefreshToken = await this.refreshTokensRepository.deleteOne(user!.id, deviceId)
        //RETURN
        if (user) {
            //create the pair of tokens and put them into db
            const accessToken = await this.jwtService.createAccessJWT(user)
            const refreshToken = await this.jwtService.createRefreshJWT(user, deviceId!, deviceName!, ipAddress!)
            //send response with tokens
            res
                .cookie('refreshToken', refreshToken, {
                    // maxAge: 20000 * 1000,
                    maxAge: 20 * 1000,
                    httpOnly: true,
                    secure: true
                })
                .status(200)
                .json({accessToken: accessToken})
        } else {
            res.sendStatus(401)
        }
    }

    async registrationConfirmation(req: Request, res: Response) {
        //INPUT
        const code = req.body.code
        //BLL
        const result = await this.userBusinessLayer.confirmCodeFromEmail(code)
        //RETURN
        res.status(204).send(result)
    }

    async registration(req: Request, res: Response) {
        //INPUT
        const {login, email, password} = req.body
        //BLL
        const user = await this.userBusinessLayer.newRegisteredUser(login, email, password)
        //RETURN
        if (user) {
            res.status(204).send(user)
        } else {
            res.status(400)
        }
    }

    async resendRegistrationCode(req: Request, res: Response) {
        //INPUT
        const email = req.body.email
        //BLL
        const result = await this.emailsManager.sendEmailConfirmationMessageAgain(email)
        //RETURN
        res.status(204).send(result)
    }

    async logout(req: Request, res: Response) {
        //INPUT
        const refreshToken = req.cookies.refreshToken
        const payload = this.jwtService.getUserByRefreshToken(refreshToken)
        //BLL
        //make refreshToken Expired/Invalid
        const result = await this.jwtService.makeRefreshTokenExpired(refreshToken)
        //...and delete from DB
        const deleteRefreshToken = await this.refreshTokensRepository.deleteOne(payload.userId, payload.deviceId)
        //RETURN
        //clear the refreshToken from the cookies
        res.clearCookie('refreshToken').status(204).send('you\'re quit')

    }

    async getInfo(req: Request, res: Response) {
        res.status(200).json({
            email: req.user!.accountData.email,
            login: req.user!.accountData.login,
            userId: req.user!.id
        })
    }

}
