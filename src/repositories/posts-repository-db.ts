//Data access Layer


//(1) allPosts
//(2) allPostByBlogId
//(3) newPostedPost
//(4) findPostById
//(5) updatePostById
//(6) deletePost

import {postDataModel, postViewModel} from "../types/posts";
import {postsCollection} from "./mongodb";
import {CommentModel, PostModel} from "./mogoose";
import {injectable} from "inversify";
import "reflect-metadata";
import {commentDataModel} from "../types/comments";
import {userDataModel} from "../types/users";

@injectable()
export class PostsRepository {

    //(1) method returns posts by blogID
    async allPosts(sortBy: any, sortDirection: any): Promise<postDataModel[]> {
        const order = sortDirection === 'asc' ? 1 : -1; // порядок сортировки
        return PostModel
            .find({}, '-_id')
            .lean()
            .sort({[sortBy]: order})
    }


    //(2) method returns all posts by blogID
    async allPostByBlogId(blogId: any, sortBy: any, sortDirection: any): Promise<postDataModel[]> {
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
        return PostModel.findOne({id: postId}).select({_id: 0, userAssess: 0})
    }


    //(4-1) method returns post by ID as data model
    async findPostByIdDbType(postId: string): Promise<postDataModel | undefined | null> {
        return PostModel.findOne({id: postId}).select({_id: 0})
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


    //(6) method change like status by Id
    async changeLikeStatus(postId: string, likeStatus: string): Promise<boolean> {
        const result = await PostModel.updateOne({id: postId}, {
            $set: {
                'extendedLikesInfo.myStatus': likeStatus
            }
        })
        return result.matchedCount === 1
    }

    //(7) add like
    async addLike(post: postDataModel, user: userDataModel): Promise<boolean> {
        const result = await PostModel.updateOne({id: post.id}, {
            $set: {
                'extendedLikesInfo.likesCount': post.extendedLikesInfo.likesCount + 1
            },
            $push: {
                userAssess: {userIdLike: user.id, assess: 'Like'},
                'extendedLikesInfo.newestLikes': {
                    userId: user.id,
                    login: user.accountData.login,
                    addedAt: new Date()
                }
            }
        })
        return result.matchedCount === 1
    }

    //(7-1) delete like
    async deleteLike(post: postDataModel, userId: string): Promise<boolean> {
        const result = await PostModel.updateOne({id: post.id}, {
            $set: {
                'extendedLikesInfo.likesCount': post.extendedLikesInfo.likesCount - 1
            },
            $pull: {userAssess: {userIdLike: userId, assess: 'Like'},
                'extendedLikesInfo.newestLikes': {userId : userId}}
        })
        return result.matchedCount === 1
    }


    //(8) add disLike
    async addDislike(post: postDataModel, userId: string): Promise<boolean> {
        const result = await PostModel.updateOne({id: post.id}, {
            $set: {
                'extendedLikesInfo.dislikesCount': post.extendedLikesInfo.dislikesCount + 1
            },
            $push: {userAssess: {userIdLike: userId, assess: 'Dislike'}}
        })
        return result.matchedCount === 1
    }


    //(8-1) delete disLike
    async deleteDislike(post: postDataModel, userId: string): Promise<boolean> {
        const result = await PostModel.updateOne({id: post.id}, {
            $set: {
                'extendedLikesInfo.dislikesCount': post.extendedLikesInfo.dislikesCount - 1
            },
            $pull: {userAssess: {userIdLike: userId, assess: 'Dislike'}}
        })
        return result.matchedCount === 1
    }

    //(9) set myStatus None
    async setNone(post: postDataModel): Promise<boolean> {
        const result = await PostModel.updateOne({id: post.id}, {
            $set: {
                'extendedLikesInfo.myStatus': 'None'
            }
        })
        return result.matchedCount === 1
    }

    //(10) add None
    async addNone(post: postDataModel, userId: string): Promise<boolean> {
        const result = await PostModel.updateOne({id: post.id}, {
            $push: {userAssess: {userIdLike: userId, assess: 'None'}}
        })
        return result.matchedCount === 1
    }
}

