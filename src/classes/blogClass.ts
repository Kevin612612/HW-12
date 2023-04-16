
import {ObjectId} from "mongodb";
import {createId_1} from "../application/findNonExistId";
import {BlogModel} from "../repositories/mogoose";


export class Blog {
    public _id: ObjectId
    public createdAt: Date
    constructor(public id: string = '',
                public name: string = '',
                public description: string = '',
                public websiteUrl: string = '',
                ) {
        this._id = new ObjectId()
        this.id = id
        this.name = name
        this.description = description
        this.websiteUrl = websiteUrl
        this.createdAt = new Date()
    }

    public async addAsyncParams(name: string,
                                description: string,
                                websiteUrl: string) {
        const blogId = await createId_1(BlogModel)
        return new Blog(blogId, name, description, websiteUrl)
    }
}