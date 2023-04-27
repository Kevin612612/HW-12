import {ObjectId} from "mongodb";
import {createId_1} from "../application/findNonExistId";
import {PostModel} from "../repositories/mogoose";
import {blogsRepository} from "../composition-root";
import {userAssessType} from "../types/comments";
import {NewestLikesType} from "../types/posts";


export class Post {
    public _id: ObjectId
    public createdAt: Date
    public extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: NewestLikesType[]
    }
    public userAssess: userAssessType[]
    constructor(public id: string = '',
                public title: string = '',
                public shortDescription: string = '',
                public content: string = '',
                public blogId: string = '',
                public blogName: string = '',
                // public dislikesCount: number = 0,
                // public likesCount: number = 0,
                // public myStatus: string = 'None',
                // public userId: string = '',
                // public login: string = '',
                // public addedAt: string = '',
                // public userIdLike: string = '',
                // public assess: string = 'None',
    ) {
        this._id = new ObjectId()
        this.id = id
        this.title = title
        this.shortDescription = shortDescription
        this.content = content
        this.blogId = blogId
        this.blogName = blogName
        this.createdAt = new Date()
        this.extendedLikesInfo = {
            dislikesCount : 0,
            likesCount : 0,
            myStatus : 'None',
            newestLikes: [],
        }
        this.userAssess = []
    }

    public async addAsyncParams(title: string,
                                shortDescription: string,
                                content: string,
                                blogId: string) {
        const postId = await createId_1(PostModel)
        const blog = await blogsRepository.findBlogById(blogId)
        const blogName = blog ? blog.name : 'no blog such ID'
        return new Post(postId, title, shortDescription, content, blogId, blogName)
    }
}