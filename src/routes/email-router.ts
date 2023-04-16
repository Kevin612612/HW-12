
//Presentation Layer


//(1)get     returns email


import {Request, Response, Router} from "express";
import {emailAdapter} from "../adapters/email-adapter";

export const emailRouter = Router({})


//(1) return email
emailRouter.get('/',
    async (req: Request, res: Response) => {
        //INPUT
        const {email: email, message: message, subject: subject} = req.body
        //ADAPTER
        const result = await emailAdapter.sendEmail(email, message, subject)
        //RETURN
        res.status(200).send(result.accepted)
    })

