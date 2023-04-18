
//Data access Layer


//(1) allPosts
//(2) allPostByBlogId
//(3) newPostedPost
//(4) findPostById
//(5) updatePostById
//(6) deletePost

import {postViewModel} from "../types/posts";
import {postsCollection} from "./mongodb";
import {PostModel} from "./mogoose";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class PostsRepository {

    //(1) method returns posts by blogID
    async allPosts(sortBy: any, sortDirection: any): Promise<postViewModel[]> {
        const order = sortDirection === 'asc' ? 1 : -1; // порядок сортировки
        return PostModel
            .find({}, '-_id')
            .lean()
            .sort({[sortBy]: order})
    }


    //(2) method returns all posts by blogID
    async allPostByBlogId(blogId: any, sortBy: any, sortDirection: any): Promise<postViewModel[]> {
        const order = sortDirection === 'asc' ? 1 : -1; // порядок сортировки
        return PostModel
            .find({blogId: blogId}, '-_id')
            .lean()
            .sort({[sortBy]: order})
    }


    //(3) method posts new post
    async newPostedPost(newPost: postViewModel): Promise<boolean> {
        const result = await postsCollection.insertOne(newPost)
        return result.acknowledged;
    }


    //(4) method returns post by ID
    async findPostById(postId: string): Promise<postViewModel | undefined | null> {
        return PostModel.findOne({ id: postId }, '-_id')
    }


    //(5) method updates post by ID
    async updatePostById(postId: string, blogId: string, blogName: string, title: string, shortDescription: string, content: string): Promise<boolean | number> {
        const result = await PostModel.updateOne({id: postId}, {
            $set: {
                blogId: blogId,
                blogName: blogName,
                content: content,
                id: postId,
                shortDescription: shortDescription,
                title: title,
            }
        })
        return result.matchedCount === 1
    }

    //(6) method deletes by ID
    async deletePost(postId: string): Promise<boolean> {
        const result = await PostModel.deleteOne({id: postId})
        return result.deletedCount === 1
    }
}

