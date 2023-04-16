
import {
    blogsCollection,
    commentsCollection,
    postsCollection,
    refreshTokensCollection,
    usersCollection
} from "../repositories/mongodb";
import {UserModel} from "../repositories/mogoose";

export const createId  = async (collection: any): Promise<string> => {
    let id = 1
    while (id) {
        let obj = await collection.findOne({id: id.toString()})
        if (!obj) {break}
        id++
    }
    return id.toString();
}

export const createId_1  = async (model: any): Promise<string> => {
    let id = 1
    while (id) {
        let obj = await model.findOne({id: id.toString()}, { maxTimeMS: 20000 })
        if (!obj) {break}
        id++
    }
    return id.toString();
}

//create userId in mongoDb
// export const createUserId  = async (): Promise<string> => {
//     let userId = 1
//     while (userId) {
//         let user = await usersCollection.findOne({id: userId.toString()})
//         if (!user) {break}
//         userId++
//     }
//     return userId.toString();
// }

//create userId in mongoose
export const createUserId  = async (): Promise<string> => {
    let userId = 1
    while (userId) {
        let user = await UserModel.findOne({id: userId.toString()})
        if (!user) {break}
        userId++
    }
    return userId.toString();
}

export const createDeviceId  = async (): Promise<string> => {
    let deviceId = 1
    while (deviceId) {
        let token = await refreshTokensCollection.findOne({deviceId: deviceId.toString()})
        if (!token) {break}
        deviceId++
    }
    return deviceId.toString();
}
//
// export const createBlogId  = async (): Promise<string> => {
//     let blogId = 1
//     while (blogId) {
//         let blog = await blogsCollection.findOne({id: blogId.toString()})
//         if (!blog) {break}
//         blogId++
//     }
//     return blogId.toString();
// }
//
// export const createPostId  = async (): Promise<string> => {
//     let postId = 1
//     while (postId) {
//         let post = await postsCollection.findOne({id: postId.toString()})
//         if (!post) {break}
//         postId++
//     }
//     return postId.toString();
// }
//
// export const createCommentId  = async (): Promise<string> => {
//     let commentId = 1
//     while (commentId) {
//         let post = await commentsCollection.findOne({id: commentId.toString()})
//         if (!post) {break}
//         commentId++
//     }
//     return commentId.toString();
// }
//


