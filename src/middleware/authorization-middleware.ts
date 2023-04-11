
//Middleware


//Basic Authorization
//Bearer Authorization
//Refresh token validation


import {NextFunction, Request, Response} from "express";
import {blackList} from "../repositories/mongodb";
import {jwtService, userRepository} from "../composition-root";


//Basic Authorization
export const authorization = (req: Request, res: Response, next: NextFunction) => {
    //check if entered password encoded in base 64 is correct
    if (req.headers.authorization == 'Basic YWRtaW46cXdlcnR5') { //decoded in Base64 password
        next()
    } else {
        res.status(401).send("Unauthorized")
    }
}


//Bearer Authorization
export const authMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    //retrieve user from token payload (if exists) and put it into request
    //token is received
    const auth = req.headers.authorization
    const typeOfAuth = req.headers.authorization?.split(' ')[0].trim()
    const dotInToken = req.headers.authorization?.split(' ')[1].trim().includes('.')
    if (!auth || typeOfAuth != 'Bearer' || !dotInToken) { //token is absent in headers
        res.sendStatus(401)
        return
    }
    //check if token expired
    const token = req.headers.authorization!.split(' ')[1]  //token is in headers: 'bearer algorithmSecretKey.payload.kindOfHash'
    const tokenExpired = await jwtService.isTokenExpired(token)
    if (tokenExpired) {
        return res.status(401).send({error: 'Token has expired'});
    }
    //put user into request
    const userDecoded = jwtService.getUserByAccessToken(token) //get user from payload
    if (userDecoded) {
        req.user = await userRepository.findUserByLoginOrEmail(userDecoded.login) //get user from db by user.login and take it into body
        next()
    }
    return 401 //we don't get user from headers.authorization
}

//check Authorization
export const checkAuthMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    //retrieve user from token payload (if exists) and put it into request
    //token is received
    const auth = req.headers.authorization
    if (!auth) {
        req.user = null
        return next()
    }
    const typeOfAuth = req.headers.authorization?.split(' ')[0].trim()
    const dotInToken = req.headers.authorization?.split(' ')[1].trim().includes('.')
    if (typeOfAuth != 'Bearer' || !dotInToken) {
        req.user = null
        return next()
    }
    //check if token expired
    const token = auth!.split(' ')[1]  //token is in headers: 'bearer algorithmSecretKey.payload.kindOfHash'
    const tokenExpired = await jwtService.isTokenExpired(token)
    if (tokenExpired) {
        req.user = null
        return next()
    }
    //put user into request
    const userDecoded = jwtService.getUserByAccessToken(token) //get user from payload
    if (userDecoded) {
        req.user = await userRepository.findUserByLoginOrEmail(userDecoded.login) //get user from db by user.login and take it into body
        return next()
    }
    return next()//we don't get user from headers.authorization
}


//check if refresh token exists and is valid
export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //take the refresh token from cookie
        const refreshToken = req.cookies.refreshToken
        //check if it exists
        if (!refreshToken) {
            return res.status(401).send({error: 'Refresh token is not found)'});
        }
        //check if it is not included in black list
        if (blackList.includes(refreshToken)) {
            return res.status(401).send({error: 'Refresh token is already invalid'})
        }
        //does user from this token exist?
        const user = jwtService.getUserByRefreshToken(refreshToken)
        if (!user) {
            return res.status(401).send({error: 'Incorrect token'});
        }
        //has the token expired?
        const tokenExpired = await jwtService.isTokenExpired(refreshToken)
        if (tokenExpired) {
            return res.status(401).send({error: 'Token has expired'});
        }
    } catch (err) {
        return res.status(401).send({error: 'Invalid token'});
    }

    next();
}