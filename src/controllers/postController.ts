
import {PostBusinessLayer} from "../BLL/posts-BLL";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class PostController {

    constructor(@inject(PostBusinessLayer) protected postBusinessLayer: PostBusinessLayer) {}

    async getComments(req: Request, res: Response) {
        //INPUT
        const postId = req.params.postId
        const {pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc"} = req.query
        const userId = req.user?.id ?? null
        //BLL
        const allComments = await this.postBusinessLayer.allCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection, userId)
        //RETURN
        res.status(200).send(allComments)
    }

    async createComment(req: Request, res: Response) {
        //INPUT
        const userId = req.user.id
        const userLogin = req.user.accountData.login
        const postId = req.params.postId
        const content = req.body.content
        //BLL
        const comment = await this.postBusinessLayer.newPostedCommentByPostId(postId, content, userId, userLogin)
        //RETURN
        res.status(201).send(comment)
    }

    async getAllPosts(req: Request, res: Response) {
        //INPUT
        const {pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc"} = req.query
        //BLL
        const allPosts = await this.postBusinessLayer.allPosts(pageNumber, pageSize, sortBy, sortDirection)
        //RETURN
        res.status(200).send(allPosts)
    }

    async createPost(req: Request, res: Response) {
        //INPUT
        const {blogId, title, shortDescription, content} = req.body
        //BLL
        const newPost = await this.postBusinessLayer.newPostedPost(blogId, title, shortDescription, content)
        //RETURN
        res.status(201).send(newPost)
    }

    async getPostById(req: Request, res: Response) {
        //INPUT
        const postId = req.params.postId
        const user = req.user
        //BLL
        const post = await this.postBusinessLayer.findPostById(postId, user)
        //RETURN
        res.status(200).send(post)
    }

    async updatePostById(req: Request, res: Response) {
        //INPUT
        const postId = req.params.postId
        const {blogId, title, shortDescription, content} = req.body
        //BLL
        const post = await this.postBusinessLayer.updatePostById(postId, blogId, title, shortDescription, content)
        //RETURN
        res.status(204).send(post)
    }

    async deletePostById(req: Request, res: Response) {
        //INPUT
        const postId = req.params.postId
        //BLL
        const result = await this.postBusinessLayer.deletePost(postId)
        //RETURN
        res.status(204).send(result)
    }


    async changeLikeStatus(req: Request, res: Response) {
            //INPUT
            const postId = req.params.postId
            const likeStatus = req.body.likeStatus
            const user = req.user
            //BLL
            const post = await this.postBusinessLayer.changeLikeStatus(postId, likeStatus, user)
            //RETURN
            res.send(post)
        }
}
