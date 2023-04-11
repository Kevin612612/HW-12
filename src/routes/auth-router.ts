
//Presentation Layer


//login
//password-recovery
//new password
//refresh tokens
//registration-confirmation
//registration
//resend-registration-code
//logout
//get info about current user

import {Router} from "express";
import {oneOf} from "express-validator";

import {
    usersLoginValidation1,
    usersEmailValidation1,
    usersPasswordValidation,
    usersLoginValidation,
    usersEmailValidation,
    codeValidation,
    usersEmailValidation2,
    checkRequestNumber,
    usersEmailValidation3,
    usersNewPasswordValidation,
    recoveryCodeValidation,
    collectionErrors
} from "../middleware/input-validation-middleware";
import {authMiddleWare, checkRefreshToken} from "../middleware/authorization-middleware";
import {authController} from "../composition-root";


export const authRouter = Router({})


//login
authRouter.post('/login',
    checkRequestNumber,
    oneOf([usersLoginValidation1, usersEmailValidation1]),
    usersPasswordValidation,
    collectionErrors, // should be the last middleware
    authController.login.bind(authController)
)

//password-recovery
authRouter.post('/password-recovery',
    checkRequestNumber,
    usersEmailValidation3,
    collectionErrors, // should be the last middleware
    authController.passwordRecovery.bind(authController)
)


//new-password
authRouter.post('/new-password',
    checkRequestNumber,
    usersNewPasswordValidation,
    recoveryCodeValidation,
    collectionErrors, // should be the last middleware
    authController.newPassword.bind(authController)
)


//new pair of tokens
authRouter.post('/refresh-token',
    checkRequestNumber,
    checkRefreshToken,
    collectionErrors, // should be the last middleware
    authController.newPairOfTokens.bind(authController)
)


//registration-confirmation
authRouter.post('/registration-confirmation',
    checkRequestNumber,
    codeValidation,
    collectionErrors, // should be the last middleware
    authController.registrationConfirmation.bind(authController)
)


//registration
authRouter.post('/registration',
    checkRequestNumber,
    usersLoginValidation,
    usersPasswordValidation,
    usersEmailValidation,
    collectionErrors, // should be the last middleware
    authController.registration.bind(authController)
)


//resend-registration-code
authRouter.post('/registration-email-resending',
    checkRequestNumber,
    usersEmailValidation2,
    collectionErrors, // should be the last middleware
    authController.resendRegistrationCode.bind(authController)
)


//logout
authRouter.post('/logout',
    checkRefreshToken,
    authController.logout.bind(authController)
)


//get info about current user
authRouter.get('/me',
    authMiddleWare,
    authController.getInfo.bind(authController)
)