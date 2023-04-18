
import {CommentsBusinessLayer} from "../BLL/comments-BLL";
import {Request, Response} from "express";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class CommentController {

    constructor(protected commentsBusinessLayer: CommentsBusinessLayer) {}

    async updateComment(req: Request, res: Response) {
        //INPUT
        const commentId = req.params.commentId
        const userId = req.user.id
        const content = req.body.content
        //BLL
        const comment = await this.commentsBusinessLayer.updateCommentById(commentId, userId, content)
        //RETURN
        res.status(204).send(comment)
    }

    async deleteComment(req: Request, res: Response) {
        //INPUT
        const commentId = req.params.commentId;
        const userId = req.user.id
        //BLL
        const comment = await this.commentsBusinessLayer.deleteComment(commentId, userId)
        //RETURN
        res.send(comment)
    }

    async getCommentById(req: Request, res: Response) {
        //INPUT
        const commentId = req.params.commentId
        const user = req.user
        //BLL
        const comment = await this.commentsBusinessLayer.findCommentById(commentId, user)
        //RETURN
        res.status(200).send(comment)
    }

    async changeLikeStatus(req: Request, res: Response) {
        //INPUT
        const id = req.params.commentId
        const likeStatus = req.body.likeStatus
        const user = req.user
        //BLL
        const comment = await this.commentsBusinessLayer.changeLikeStatus(id, likeStatus, user)
        //RETURN
        res.send(comment)
    }
}