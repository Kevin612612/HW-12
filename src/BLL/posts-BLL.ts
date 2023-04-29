//Business Layer


//(1) allCommentsByPostId
//(2) newPostedCommentByPostId
//(3) allPosts
//(4) newPostedPost
//(5) findPostById
//(6) updatePostById
//(7) deletePost
//(8) changeLikeStatus


import {postViewModel, PostsTypeSchema} from "../types/posts";
import {
    CommentsTypeSchema,
    commentViewModel
} from "../types/comments";
import {BlogsRepository} from "../repositories/blogs-repository-db";
import {PostsRepository} from "../repositories/posts-repository-db";
import {CommentsRepository} from "../repositories/comments-repository-db";
import {CommentModel, PostModel} from "../repositories/mogoose";
import mongoose from "mongoose";
import {Comment} from "../classes/commentClass";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Post} from "../classes/postClass";
import {userDataModel} from "../types/users";

@injectable()
export class PostBusinessLayer {


    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository,
                @inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(CommentsRepository) protected commentsRepository: CommentsRepository) {
    }

    //(1) this method return all comments by postId
    async allCommentsByPostId(postId: string,
                              pageNumber: any,
                              pageSize: any,
                              sortBy: any,
                              sortDirection: any,
                              userId: string): Promise<CommentsTypeSchema | number> {
        const foundPost = await this.postsRepository.findPostById(postId)
        if (!foundPost) return 404

        const allDataComments = await this.commentsRepository.allComments(postId, sortBy, sortDirection)
        const quantityOfDocs = await CommentModel.where({postId: postId}).countDocuments()
        //filter allDataComments and return array that depends on which user send get request
        const sortedItems = allDataComments.map(obj => {
            if (obj.userAssess.find(el => el.userIdLike === userId)) {
                return {
                    id: obj.id,
                    content: obj.content,
                    commentatorInfo: obj.commentatorInfo,
                    createdAt: obj.createdAt,
                    likesInfo: {
                        likesCount: obj.likesInfo.likesCount,
                        dislikesCount: obj.likesInfo.dislikesCount,
                        myStatus: obj.userAssess.find(el => el.userIdLike === userId)?.assess ?? 'None',
                    }
                }
            } else {
                return {
                    id: obj.id,
                    content: obj.content,
                    commentatorInfo: obj.commentatorInfo,
                    createdAt: obj.createdAt,
                    likesInfo: {
                        likesCount: obj.likesInfo.likesCount,
                        dislikesCount: obj.likesInfo.dislikesCount,
                        myStatus: 'None',
                    }
                }
            }
        })//if user left comment return his assess as myStatus

        return {
            pagesCount: Math.ceil(quantityOfDocs / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: quantityOfDocs,
            items: sortedItems.slice((+pageNumber - 1) * (+pageSize), (+pageNumber) * (+pageSize))
        }
    }


    //(2) creates new comment by postId
    async newPostedCommentByPostId(postId: string, content: string, userId: string, userLogin: string): Promise<commentViewModel | number | string[]> {
        const foundPost = await this.postsRepository.findPostById(postId)
        if (!foundPost) return 404
        //create new comment
        let newComment = new Comment() //empty comment
        newComment = await newComment.addAsyncParams(content, userId, userLogin, postId) // fill user with async params
        // put this new comment into db
        try {
            const result = await this.commentsRepository.newPostedComment(newComment)
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
            id: newComment.id,
            content: newComment.content,
            commentatorInfo: {
                userId: newComment.commentatorInfo.userId,
                userLogin: newComment.commentatorInfo.userLogin,
            },
            createdAt: newComment.createdAt,
            likesInfo: {
                dislikesCount: newComment.likesInfo.dislikesCount,
                likesCount: newComment.likesInfo.likesCount,
                myStatus: newComment.likesInfo.myStatus,
            },
        }
    }


    //(3) this method return all posts
    async allPosts(pageNumber: any,
                   pageSize: any,
                   sortBy: any,
                   sortDirection: any,
                   userId: string): Promise<PostsTypeSchema | number> {

        const allDataPosts = await this.postsRepository.allPosts(sortBy, sortDirection)
        const quantityOfDocs = await PostModel.where({}).countDocuments()
        //filter allDataPosts and return array that depends on which user send get request
        const sortedItems = allDataPosts.map(post => {
            if (post.userAssess.find(el => el.userIdLike === userId)) { //if current user exist in userAsses array
                return {
                    extendedLikesInfo: {
                        likesCount: post.extendedLikesInfo.likesCount,
                        dislikesCount: post.extendedLikesInfo.dislikesCount,
                        myStatus: post.userAssess.find(el => el.userIdLike === userId)?.assess || 'None',
                        newestLikes: post.extendedLikesInfo.newestLikes
                            .slice(-3)
                            // .sort((a, b) => b.login.localeCompare(a.login))
                            .map(obj => {
                                return {
                                    addedAt: obj.addedAt,
                                    login: obj.login,
                                    userId: obj.userId,
                                }
                            })
                            .reverse()
                    },
                    id: post.id,
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                }
            } else {
                return {
                    extendedLikesInfo: {
                        likesCount: post.extendedLikesInfo.likesCount,
                        dislikesCount: post.extendedLikesInfo.dislikesCount,
                        myStatus: 'None',
                        newestLikes: post.extendedLikesInfo.newestLikes
                            .slice(-3)
                            // .sort((a, b) => b.login.localeCompare(a.login))
                            .map(obj => {
                                return {
                                    addedAt: obj.addedAt,
                                    login: obj.login,
                                    userId: obj.userId,
                                }
                            })
                            .reverse()
                    },
                    id: post.id,
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                }
            }
        })

        return {
            pagesCount: Math.ceil(quantityOfDocs / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: quantityOfDocs,
            items: sortedItems.slice((pageNumber - 1) * (pageSize), (pageNumber) * pageSize)
        }
    }


    //(4) method creates post with specific blogId
    async newPostedPost(blogId: string,
                        title: string,
                        shortDescription: string,
                        content: any): Promise<postViewModel | undefined | null | number | string[]> {
        const blog = await this.blogsRepository.findBlogById(blogId)
        if (!blog) return 404
        //create new post
        let newPost = new Post() //empty post
        newPost = await newPost.addAsyncParams(title, shortDescription, content, blogId) // fill post with async params
        // put this new post into db
        try {
            const result = await this.postsRepository.newPostedPost(newPost)
            //find this created post
            return await this.postsRepository.findPostById(newPost.id)
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


    //(5) method take post by postId
    async findPostById(postId: string, user: userDataModel): Promise<postViewModel | number> {
        //find post
        const post = await this.postsRepository.findPostByIdDbType(postId)
        if (!post) return 404
        //hide info about likes from unauthorized user
        if (user == null) {
            post.extendedLikesInfo.myStatus = 'None'
        }
        //if user authorized
        if (user != null) {
            //if user authorized -> find his like/dislike in userAssess Array in post
            const assess = post.userAssess.find(obj => obj.userIdLike === user.id)?.assess
            //return post to user with his assess if this user leave like or dislike
            if (assess) {
                post.extendedLikesInfo.myStatus = assess //like or dislike
            } else {
                post.extendedLikesInfo.myStatus = 'None'
            }
        }
        
        //return viewModel converted from dataModel
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                myStatus: post.extendedLikesInfo.myStatus,
                newestLikes: post.extendedLikesInfo.newestLikes
                    .slice(-3)
                    .sort((a, b) => b.login.localeCompare(a.login))
                    .map(obj => {
                        return {
                            addedAt: obj.addedAt,
                            login: obj.login,
                            userId: obj.userId,
                        }
                    })
            }
        }
    }


    //(6) method updates post by postId
    async updatePostById(postId: string, blogId: string, title: string, shortDescription: string, content: string): Promise<boolean | number | string[]> {
        const foundBlog = await this.blogsRepository.findBlogById(blogId)
        if (!foundBlog) return 404
        const foundPost = await this.postsRepository.findPostById(postId)
        if (!foundPost) return 404
        try {
            const result = this.postsRepository.updatePostById(postId, blogId, foundBlog.name, title, shortDescription, content)
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


    //(7) method deletes by postId
    async deletePost(postId: string): Promise<boolean | number> {
        const result = await this.postsRepository.deletePost(postId)
        return result ? result : 404
    }


    //(8) method change like status
    async changeLikeStatus(postId: string, likeStatus: string, user: userDataModel): Promise<number> {
        //find post
        const post = await this.postsRepository.findPostByIdDbType(postId)
        if (!post) return 404
        //change myStatus / myStatus = current assess
        const result = await this.postsRepository.changeLikeStatus(postId, likeStatus)
        //check whether this user left assess to this post
        const userAssess = post.userAssess.find(obj => obj.userIdLike === user.id)
        //if this user didn't leave like/dislike -> add like/dislike/none to post
        if (!userAssess) {
            if (likeStatus == 'Like') {
                const result1 = await this.postsRepository.addLike(post, user)
            }
            if (likeStatus == 'Dislike') {
                const result2 = await this.postsRepository.addDislike(post, user.id)
            }
            if (likeStatus == 'None') {
                const result3 = await this.postsRepository.setNone(post)
            }
        } else {
            //assess of this user
            const assess = userAssess.assess 
            if (assess == 'Like' && likeStatus == 'Like') {
                //nothing
            }
            if (assess == 'Like' && likeStatus == 'Dislike') {
                //minus like and delete user from array then add addDislike()
                const result1 = await this.postsRepository.deleteLike(post, user.id)
                const result2 = await this.postsRepository.addDislike(post, user.id)
                //set my status None
                const result3 = await this.postsRepository.setNone(post)
            }
            if (assess == 'Like' && likeStatus == 'None') {
                //minus like and delete user from array
                const result1 = await this.postsRepository.deleteLike(post, user.id)
            }
            if (assess == 'Dislike' && likeStatus == 'Like') {
                //minus dislike and delete user from array then add addLike()
                const result1 = await this.postsRepository.deleteDislike(post, user.id)
                const result2 = await this.postsRepository.addLike(post, user)
                //set my status None
                const result3 = await this.postsRepository.setNone(post)
            }
            if (assess == 'Dislike' && likeStatus == 'Dislike') {
                //nothing
            }
            if (assess == 'Dislike' && likeStatus == 'None') {
                //minus dislike and delete user from array
                const result1 = await this.postsRepository.deleteDislike(post, user.id)
            }
        }
        return 204
    }
}

