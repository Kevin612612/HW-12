
//Presentation Layer


//get devices
//delete devices
//delete deviceId

import {Router} from "express";

import {checkRefreshToken} from "../middleware/authorization-middleware";
import {collectionErrors, deviceIdValidation} from "../middleware/input-validation-middleware";
import {deviceController} from "../composition-root";


export const deviceRouter = Router({})


//get devices
deviceRouter.get('/devices',
    checkRefreshToken,
    deviceController.getAllDevices.bind(deviceController)
)

//delete devices
deviceRouter.delete('/devices',
    checkRefreshToken,
    deviceController.deleteOtherDevices.bind(deviceController)
)

//delete device
deviceRouter.delete('/devices/:deviceId',
    checkRefreshToken,
    deviceIdValidation,
    collectionErrors, // should be the last middleware
    deviceController.deleteOneDevice.bind(deviceController)
)
