//POSTS

//view type
import {userAssessType} from "./comments";

export type postViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: NewestLikesType[]
    }
}

//data type
export type postDataModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: NewestLikesType[]
    },
    userAssess: userAssessType[]
}

export type NewestLikesType = {
    userId: string,
    login: string,
    addedAt: string
}

//postType returned by POST-method
export type PostsTypeSchema = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: postViewModel[]
}
