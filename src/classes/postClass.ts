
import {ObjectId} from "mongodb";
import {createId_1} from "../application/findNonExistId";
import {PostModel} from "../repositories/mogoose";
import {blogsRepository} from "../composition-root";


export class Post {
    public _id: ObjectId
    public createdAt: Date
    constructor(public id: string = '',
                public title: string = '',
                public shortDescription: string = '',
                public content: string = '',
                public blogId: string = '',
                public blogName: string = '',
    ) {
        this._id = new ObjectId()
        this.id = id
        this.title = title
        this.shortDescription = shortDescription
        this.content = content
        this.blogId = blogId
        this.blogName = blogName
        this.createdAt = new Date()
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