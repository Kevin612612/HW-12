//Business Layer


//(1) allBlogs
//(2) newPostedBlog
//(3) allPostsByBlogId
//(4) newPostedPostByBlogId
//(5) findBlogById
//(6) updateBlogById
//(7) deleteBlog

import {
    blogViewModel,
    blogsTypeSchema,
} from "../types/blogs";
import {BlogsRepository} from "../repositories/blogs-repository-db";
import {PostsRepository} from "../repositories/posts-repository-db";
import {createId_1} from "../application/findNonExistId";
import {PostsTypeSchema} from "../types/posts";
import {BlogModel, PostModel} from "../repositories/mogoose";
import mongoose from "mongoose";
import {inject, injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class BlogBusinessLayer {

    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository,
                @inject(PostsRepository) protected postsRepository: PostsRepository) {
    }

    //(1) this method transform all found data and returns them to router
    async allBlogs(searchNameTerm: any,
                   sortBy: any,
                   sortDirection: any,
                   pageNumber: any,
                   pageSize: any): Promise<blogsTypeSchema> {
        const sortedItems = await this.blogsRepository.allBlogs(searchNameTerm, sortBy, sortDirection);
        const quantityOfDocs = await BlogModel.countDocuments({name: {$regex: searchNameTerm, $options: 'i'}})
        return {
            pagesCount: Math.ceil(quantityOfDocs / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: quantityOfDocs,
            items: sortedItems.slice((pageNumber - 1) * (pageSize), (pageNumber) * (pageSize))
        }
    }


    //(2) method creates blog
    async newPostedBlog(name: string,
                        description: string,
                        websiteUrl: string,
                        id: string): Promise<blogViewModel | string[]> {
        const idName: string = id ? id : await createId_1(BlogModel)
        const newBlog = new BlogModel({
            id: idName,
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date(),
        })
        // put this new blog into db
        try {
            const result = await this.blogsRepository.newPostedBlog(newBlog)
        } catch (err: any) {
            const validationErrors = []
            if (err instanceof mongoose.Error.ValidationError) {
                for (const path in err.errors) {
                    const error = err.errors[path].message
                    validationErrors.push(error)
                }
            }
            return validationErrors
        }

        return {
            id: newBlog.id,
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
        }
    }


    //(3) this method return all posts by blogId
    async allPostsByBlogId(blogId: string,
                           pageNumber: any,
                           pageSize: any,
                           sortBy: any,
                           sortDirection: any): Promise<PostsTypeSchema | number> {
        const foundBlog = await this.blogsRepository.findBlogById(blogId)
        if (!foundBlog) return 404
        const sortedItems = await this.postsRepository.allPostByBlogId(blogId, sortBy, sortDirection);
        const quantityOfDocs = await PostModel.countDocuments({blogId: blogId})
        return {
            pagesCount: Math.ceil(quantityOfDocs / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: quantityOfDocs,
            items: sortedItems.slice((pageNumber - 1) * (pageSize), (pageNumber) * (pageSize))
        }
    }


    //(4) method create new post by blogId
    // this method is equal to post-BLL method


    //(5) method take blog by blogId
    async findBlogById(id: string): Promise<blogViewModel | number> {
        const result = await this.blogsRepository.findBlogById(id)
        return result ? result : 404
    }

    //(5-1) method take blog by name
    async findBlogByName(name: string): Promise<blogViewModel | number> {
        const result = await this.blogsRepository.findBlogByName(name)
        return result ? result : 404
    }


    //(6) method updates blog by blogId
    async updateBlogById(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean | number | string[]> {
        try {
            const result = await this.blogsRepository.updateBlogById(blogId, name, description, websiteUrl)
            return true
        } catch (err: any) {
            const validationErrors = []
            if (err instanceof mongoose.Error.ValidationError) {
                for (const path in err.errors) {
                    const error = err.errors[path].message
                    validationErrors.push(error)
                }
            }
            return validationErrors
        }
    }


    //(7) method deletes by blogId
    async deleteBlog(id: string): Promise<boolean | number> {
        const result = await this.blogsRepository.deleteBlog(id)
        return result ? result : 404
    }
}


