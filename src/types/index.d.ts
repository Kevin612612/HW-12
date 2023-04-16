
import {blogViewModel, postViewModel, userDataModel} from "../repositories/mongodb";
import {DeviceDetector} from ''


//expanding type Request
declare global {
    declare namespace Express {
        export interface Request {
            user: userDataModel | undefined,
            blog: blogViewModel | undefined,
            post: postViewModel | undefined,
            useragent: string | string[] | undefined,
            device: any,
            bot: any,
            resultClient: any,
            resultOs: any,
            result: any,
        }
    }
}


//APIErrorResult
export type errors = { errorsMessages: fieldError[] }
type fieldError = { message: string, field: string }