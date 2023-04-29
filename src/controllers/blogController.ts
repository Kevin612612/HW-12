
import {BlogBusinessLayer} from "../BLL/blogs-BLL";
import {PostBusinessLayer} from "../BLL/posts-BLL";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class BlogController {

    constructor(@inject(BlogBusinessLayer) protected blogBusinessLayer: BlogBusinessLayer,
                @inject(PostBusinessLayer) protected postBusinessLayer: PostBusinessLayer) {}

    async getAllBlogs(req: Request, res: Response) {
        //INPUT
        const {
            pageNumber = 1,
            pageSize = 9,
            sortBy = "id",
            sortDirection = "asc",
            searchNameTerm = ""
        } = req.query;
        //BLL
        const allBlogs = await this.blogBusinessLayer.allBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize)
        //RETURN
        res.status(200).send(allBlogs)
    }


    async createBlog(req: Request, res: Response) {
        //INPUT
        const {name, description, websiteUrl, id} = req.body
        //BLL
        const result = await this.blogBusinessLayer.newPostedBlog(name, description, websiteUrl, id)
        //RETURN
        res.status(201).send(result)
    }


    async getAllPostsByBlogId(req: Request, res: Response) {
        //INPUT
        const {pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc"} = req.query;
        const blogId = req.params.blogId || "1"
        const userId = req.user?.id
        //BLL
        const posts = await this.blogBusinessLayer.allPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection, userId)
        //RETURN
        res.status(200).send(posts)
    }


    async createPost(req: Request, res: Response) {
        //INPUT
        const blogId = req.params.blogId || '1'
        const {title = 'default title', shortDescription = 'default post', content = 'default content'} = req.body
        //BLL
        const post = await this.postBusinessLayer.newPostedPost(blogId, title, shortDescription, content)
        //RETURN
        res.status(201).send(post)
    }


    async getBlogById(req: Request, res: Response) {
        //INPUT
        const blogId = req.params.blogId || "1"
        //BLL
        const blog = await this.blogBusinessLayer.findBlogById(blogId)
        //RETURN
        res.status(200).send(blog)
    }


    async getBlogByName(req: Request, res: Response) {
        //INPUT
        const name = req.params.name || ""
        //BLL
        const blog = await this.blogBusinessLayer.findBlogByName(name)
        //RETURN
        res.status(200).send(blog)
    }


    async updateBlogById(req: Request, res: Response) {
        //INPUT
        const blogId = req.params.blogId || "0"
        const {name, description, websiteUrl} = req.body
        //BLL
        const result = await this.blogBusinessLayer.updateBlogById(blogId, name, description, websiteUrl)
        //RETURN
        res.status(204).send(result)
    }


    async deleteBlogById(req: Request, res: Response) {
        //INPUT
        const blogId = req.params.blogId
        //BLL
        const result = await this.blogBusinessLayer.deleteBlog(blogId)
        //RETURN
        res.status(204).send(result)
    }
}
