
//Presentation Layer


//(1)get     returns all users
//(2)post    create new user
//(3)delete  delete user by ID


import {Router} from "express";
import {
    collectionErrors,
    usersEmailValidation,
    usersLoginValidation,
    usersPasswordValidation
} from "../middleware/input-validation-middleware";
import {authorization} from "../middleware/authorization-middleware";
import {userController} from "../composition-root";


export const usersRouter = Router({})


//(1) return all users
usersRouter.get('/',
    authorization,
    userController.getAllUsers.bind(userController)
)


//(2) create new user
usersRouter.post('/',
    authorization,
    usersLoginValidation,
    usersPasswordValidation,
    usersEmailValidation,
    collectionErrors,
    userController.createNewUser.bind(userController)
)


//(3) delete user by userId
usersRouter.delete('/:userId',
    authorization,
    userController.deleteUserById.bind(userController)
)
