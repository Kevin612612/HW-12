//Data access Layer


//(1) allComments
//(2) newPostedComment
//(3) updateCommentById
//(4) deleteComment
//(5) findCommentById

import {commentDataModel, commentViewModel, userAssessType} from "../types/comments";
import {CommentModel, UserModel} from "./mogoose";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class CommentsRepository {

    //(1) method returns comments by postId
    async allComments(postId: string, sortBy: any, sortDirection: any): Promise<commentDataModel[]> {
        const order = sortDirection === 'asc' ? 1 : -1; // порядок сортировки
        return CommentModel
            .find({postId: postId})
            .lean()
            .sort({[sortBy]: order})
            .select({_id: 0, __v: 0}) //postId: 0, userAssess: 0
    }


    //(2) method create new comment
    async newPostedComment(newComment: commentDataModel): Promise<boolean> {
        const result = await CommentModel.insertMany(newComment)
        return true
    }


    //(3) method update comment by Id
    async updateCommentById(commentId: string, content: string): Promise<boolean> {
        const result = await CommentModel.updateOne({id: commentId}, {
            $set: {
                content: content
            }
        })
        return result.matchedCount === 1
    }


    //(4) method delete comment by Id
    async deleteComment(id: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({id: id})
        return result.deletedCount === 1
    }


    //(5) method returns comment by Id as view model
    async findCommentById(id: string): Promise<commentViewModel | undefined | null> {
        return CommentModel.findOne({id: id}).select({_id: 0, __v: 0, postId: 0})
    }

    //(5-1) method returns comment by Id as data model
    async findCommentByIdDbType(id: string): Promise<commentDataModel | undefined | null> {
        return CommentModel.findOne({id: id}).select({_id: 0, __v: 0, postId: 0})
    }


    //(6) method change like status by Id
    async changeLikeStatus(id: string, likeStatus: string): Promise<boolean> {
        const result = await CommentModel.updateOne({id: id}, {
            $set: {
                'likesInfo.myStatus': likeStatus
            }
        })
        return result.matchedCount === 1
    }

    //(7) add like
    async addLike(comment: commentDataModel, userId: string): Promise<boolean> {
        const result = await CommentModel.updateOne({id: comment.id}, {
            $set: {
                'likesInfo.likesCount': comment!.likesInfo.likesCount + 1
            },
            $push: {userAssess: {userIdLike: userId, assess: 'Like'}}

        })
        return result.matchedCount === 1
    }

    //(7-1) delete like
    async deleteLike(comment: commentDataModel, userId: string): Promise<boolean> {
        const result = await CommentModel.updateOne({id: comment.id}, {
            $set: {
                'likesInfo.likesCount': comment.likesInfo.likesCount - 1
            },
            $pull: {userAssess: {userIdLike: userId, assess: 'Like'}}
        })
        return result.matchedCount === 1
    }


    //(8) add disLike
    async addDislike(comment: commentDataModel, userId: string): Promise<boolean> {
        const result = await CommentModel.updateOne({id: comment.id}, {
            $set: {
                'likesInfo.dislikesCount': comment!.likesInfo.dislikesCount + 1
            },
            $push: {userAssess: {userIdLike: userId, assess: 'Dislike'}}
        })
        return result.matchedCount === 1
    }

    //(8-1) delete disLike
    async deleteDislike(comment: commentDataModel, userId: string): Promise<boolean> {
        const result = await CommentModel.updateOne({id: comment.id}, {
            $set: {
                'likesInfo.dislikesCount': comment!.likesInfo.dislikesCount - 1
            },
            $pull: {userAssess: {userIdLike: userId, assess: 'Dislike'}}
        })
        return result.matchedCount === 1
    }

    //(9) set myStatus None
    async setNone(comment: commentDataModel): Promise<boolean> {
        const result = await CommentModel.updateOne({id: comment.id}, {
            $set: {
                'likesInfo.myStatus': 'None'
            }
        })
        return result.matchedCount === 1
    }

    //(10) add None
    async addNone(comment: commentDataModel, userId: string): Promise<boolean> {
        const result = await CommentModel.updateOne({id: comment.id}, {
            $push: {userAssess: {userIdLike: userId, assess: 'None'}}
        })
        return result.matchedCount === 1
    }


}
