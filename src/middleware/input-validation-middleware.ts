
//Middleware


import {body, param, header, cookie, validationResult} from 'express-validator'
import {NextFunction, Request, Response} from "express";
import {usersCollection} from "../repositories/mongodb";
import {
    blogsRepository, commentsRepository,
    jwtService,
    postsRepository,
    refreshTokensRepository,
    userRepository
} from "../composition-root";



//blogs validation

export const blogIdValidationInBody = body('blogId')
    .isLength({max: 5}) //здесь я схитрил))

export const blogIdValidationInParams = param('blogId')
    .isLength({max: 5}) //здесь я схитрил))

export const blogExtractingFromParams = async (req: Request, res: Response, next: NextFunction) => {
    const blog = await blogsRepository.findBlogById(req.params.blogId)
    if (blog) {
        req.blog = await blogsRepository.findBlogById(req.params.blogId)
    }
    next()
}

export const blogExtractingFromBody = async (req: Request, res: Response, next: NextFunction) => {
    const blog = await blogsRepository.findBlogById(req.body.blogId)
    if (blog) {
        req.blog = await blogsRepository.findBlogById(req.body.blogId)
    }
    next()
}


export const nameValidation = body('name')
    .trim()
    .notEmpty()
    .isString()
    .isLength({max: 15})

export const descriptionValidation = body('description')
    .trim()
    .notEmpty()
    .isString()
    .isLength({max: 500})

export const newWebSiteUrlValidation = body('websiteUrl')
    .trim()
    .notEmpty()
    .isURL({protocols: ['https']})
    .isLength({max: 100})


//posts validation

export const postIdValidation = param('postId')
    .isLength({max: 5}) //здесь я схитрил))

export const postExtractingFromParams = async (req: Request, res: Response, next: NextFunction) => {
    const post = await postsRepository.findPostById(req.params.postId)
    if (post) {
        req.post = await postsRepository.findPostById(req.params.postId)
    }
    next()
}

export const titleValidation = body('title')
    .trim()
    .notEmpty()
    .isString()
    .isLength({max: 30})

export const shortDescriptionValidation = body('shortDescription')
    .trim()
    .notEmpty()
    .isString()
    .isLength({max: 100})

export const contentValidation = body('content')
    .trim()
    .notEmpty()
    .isString()
    .isLength({max: 1000})


//user validation
export const userIdValidation = param('userId')
    .isLength({max: 5}) //здесь я схитрил))

export const usersIdExtractingFromBody = async (req: Request, res: Response, next: NextFunction) => {
    const user = await usersCollection.findOne({id: req.params.userId})
    if (user) {
        req.user = await userRepository.findUserByLoginOrEmail(user.accountData.login)
    }
    next()
}

//users' login validation
export const usersLoginValidation = body('login')
    .trim()
    .isLength({min: 3, max: 10})
    .matches('^[a-zA-Z0-9_-]*$')
    .custom(async value => {
        const isValidUser = await userRepository.findUserByLogin(value)
        if (isValidUser) throw new Error('Login with similar name already exists')
        return true
    })

export const usersLoginValidation1 = body('loginOrEmail')
    .trim()
    .isString()
    .isLength({min: 3, max: 10})
    .matches('^[a-zA-Z0-9_-]*$')

//users' password validation
export const usersPasswordValidation = body('password')
    .trim()
    .isLength({min: 6, max: 20})

export const usersNewPasswordValidation = body('newPassword')
    .isString()
    .trim()
    .isLength({min: 6, max: 20})

export const recoveryCodeValidation = body('recoveryCode')
    .custom(async value => {
        const user = await userRepository.findUserByPasswordCode(value)
        if (user) {
            const currentTime = new Date()
            const expirationTime = user.passwordConfirmation.expirationDate
            if (currentTime >= expirationTime) throw new Error('Code already expired')
        } else {
            throw new Error('code invalid')
        }
        return true
    })


//users' e-mail validation
export const usersEmailValidation = body('email')
    .trim()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .custom(async value => {
        const user = await userRepository.findUserByLoginOrEmail(value)
        if (user) throw new Error('Email already exists')
        return true
    })


export const usersEmailValidation1 = body('loginOrEmail')
    .trim()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')


export const usersEmailValidation2 = body('email')
    .trim()
    .isString()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
    .custom(async value => {
        const user = await userRepository.findUserByLoginOrEmail(value)
        if (!user) throw new Error('User doesn\'t exist')
        return true
    })
    .custom(async value => {
        const user = await userRepository.findUserByLoginOrEmail(value)
        if (user?.emailConfirmation.isConfirmed === true) throw new Error('Email already confirmed')
        return true
    })


export const usersEmailValidation3 = body('email')
    .trim()
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')


export const codeValidation = body('code')
    .custom(async value => {
        //find the user by code
        const user = await userRepository.findUserByCode(value)
        //check if he exists
        if (!user) throw new Error('user with this code doesn\'t exist')
        return true
    })
    .custom(async value => {
        //find user by code
        const user = await userRepository.findUserByCode(value)
        //check if his email already confirmed
        if (user?.emailConfirmation.isConfirmed == true) throw new Error('Code already confirmed')
        return true
    })


//comment validation
export const commentValidation = body('content')
    .isLength({min: 20, max: 300})

export const likeStatusValidation = body('likeStatus')
    .isIn(['Like', 'Dislike', 'None'])


//token validation
export const tokenValidation = header('authorization').isJWT()

export const tokenValidation1 = cookie('refreshToken').isJWT()

// export const deviceIdValidation = param('deviceId')
//     .custom(async value => {
//         const deviceId = await refreshTokensRepository.findUserByDeviceId(value)
//         if (!deviceId) throw new Error('deviceId doesn\'t exist')
//         return true
//     })

//check deviceId
export const deviceIdValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //take the deviceId that should be deleted
        const deviceId = req.params.deviceId
        //if it doesn't exist throw error
        if (!deviceId) {
            return res.status(404).send({error: 'deviceId is not found in params'})
        }
        //if it is correct
        const result = await refreshTokensRepository.findUserByDeviceId(deviceId)
        if (!result) {
            return res.status(404).send({error: 'deviceId is not found in db'})
        }
        //retrieve userId from refreshToken
        const userId = jwtService.getUserByRefreshToken(req.cookies.refreshToken).userId
        //find refreshToken by userId and deviceId
        const token = await refreshTokensRepository.findTokenByUserIdAndDeviceId(userId, deviceId)
        //if it doesn't exist throw error
        if (!token) {
            return res.status(403).send({error: 'There is no user with such deviceId'});
        }
    } catch (err) {
        return res.status(401).send({error: 'Invalid deviceId'});
    }
    next();
}


//array of requests
export const memoryRequests: { ip: string, path: string, date: number }[] = []
//function
export const checkRequestNumber = async (req: Request, res: Response, next: NextFunction) => {
    const path = req.path //path of request
    const ip = req.ip //ip
    const requestsOfOneEndPoint = memoryRequests.filter(x => x.ip === ip && x.path === path) //quantity of this ip and path's request
    const currentDate = Date.now()
    const requestsNumber = requestsOfOneEndPoint.filter(x => (currentDate - x.date) <= 10000) //frequency of these requests
    if (requestsNumber.length >= 5) { // 5 req/10 sec
        return res.sendStatus(429)
    }
    memoryRequests.push({ip, path, date: currentDate}) //add each request into array
    next()
}


//collect all errors into ErrorSchema
export function collectionErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errs = errors.array({onlyFirstError: true})
        const result =  {errorsMessages: errs.map(e => {return {message: e.msg, field: e.param}})}
        return res.status(400).json(result)
    } else {
        next()
    }
}