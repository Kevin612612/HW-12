
import {ObjectId} from "mongodb";
import {createId_1} from "../application/findNonExistId";
import {CommentModel} from "../repositories/mogoose";
import {userRepository} from "../composition-root";
import {userAssessType} from "../types/comments";


export class Comment {
    public _id: ObjectId
    public createdAt: Date
    public commentatorInfo: {
        userId: string,
        userLogin: string
    }
    public likesInfo: {
        dislikesCount: number,
        likesCount: number,
        myStatus: string,
    }
    public userAssess: Array<userAssessType>
    constructor(public id: string = '',
                public content: string = '',
                public userId: string = '',
                public userLogin: string = '',
                public postId: string = '',
                public dislikesCount: number = 0,
                public likesCount: number = 0,
                public myStatus: string = 'None',
                public userIdLike: string = '',
                public assess: string = 'None',
    ) {
        this._id = new ObjectId()
        this.id = id
        this.content = content
        this.commentatorInfo = {
            userId : userId,
            userLogin : userLogin
        }
        this.postId = postId
        this.createdAt = new Date()
        this.likesInfo = {
            dislikesCount : dislikesCount,
            likesCount : likesCount,
            myStatus : myStatus,
        }
        this.userAssess = []
    }

    public async addAsyncParams(content: string,
                                userId: string,
                                userLogin: string,
                                postId: string) {
        const commentId = await createId_1(CommentModel)
        return new Comment(commentId, content, userId, userLogin, postId)
    }
}