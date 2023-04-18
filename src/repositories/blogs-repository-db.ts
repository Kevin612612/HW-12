//Data access Layer


//(1) allBlogs
//(2) newPostedBlog
//(3) findBlogById
//(4) updateBlogById
//(5) deleteBlog
//(6) findBlogByName


import {blogViewModel} from "../types/blogs";
import {BlogModel} from "./mogoose";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class BlogsRepository {

    //(1) method returns structured Array
    async allBlogs(searchNameTerm: string, sortBy: string, sortDirection: string): Promise<blogViewModel[]> {
        const order = (sortDirection == 'asc') ? 1 : -1; // порядок сортировки
        return BlogModel
            .find({name: {$regex: searchNameTerm, $options: 'i'}})
            .lean()
            .sort({[sortBy]: order})
            .select({_id: 0, __v: 0})
    }


    //(2) method posts new blog in Db
    async newPostedBlog(newBlog: blogViewModel): Promise<boolean> {
        const result = await BlogModel.insertMany(newBlog)
        return true
    }


    //(3) method returns blog by blogId
    async findBlogById(blogId: string): Promise<blogViewModel | undefined | null> {
        const result = await BlogModel.findOne({id: blogId}, '-_id')
        return result
    }


    //(4) method updates blog by blogId
    async updateBlogById(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await BlogModel.updateOne({id: blogId}, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl
            }
        })
        return result.matchedCount === 1
    }


    //(5) method deletes blog by blogId
    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({id: id})
        return result.deletedCount === 1
    }


    //(6) method returns blog by name
    async findBlogByName(name: string): Promise<blogViewModel | undefined> {
        const result = await BlogModel.findOne({"name": {$regex: name}})
        return result ? result : undefined
    }
}

