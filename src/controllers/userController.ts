
import {UserBusinessLayer} from "../BLL/users-BLL";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class UserController {

    constructor (@inject(UserBusinessLayer) protected userBusinessLayer: UserBusinessLayer) {}

    async getAllUsers(req: Request, res: Response) {
        //INPUT
        const {pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc"} = req.query;
        const searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm : null
        const searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm : null
        //BLL
        const allUsers = await this.userBusinessLayer.allUsers(pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm)
        //RETURN
        res.status(200).send(allUsers)
    }


    async createNewUser(req: Request, res: Response) {
        //INPUT
        const {login, email, password} = req.body
        //BLL
        const user = await this.userBusinessLayer.newPostedUser(login, email, password)
        //RETURN
        res.status(201).send(user)
    }


    async deleteUserById(req: Request, res: Response) {
        //INPUT
        const userId = req.params.userId
        //BLL
        const user = await this.userBusinessLayer.deleteUser(userId)
        //RETURN
        res.status(204).send(user)
    }
}


