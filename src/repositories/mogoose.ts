import mongoose from 'mongoose'
import {userDataModel} from "../types/users";
import {blogViewModel} from "../types/blogs";
import {postViewModel} from "../types/posts";
import {commentDataModel} from "../types/comments";
import {refreshTokensDataModel} from "../types/refreshTokens";
import {ObjectId} from "mongodb";

//URI
export const mongoUri = process.env.MONGO_URL!



//USER SCHEMA
const userSchema = new mongoose.Schema<userDataModel>({
    _id: ObjectId,
    id: {type: String, required: true},
    accountData: {
        login: {
            type: String,
            required: [true, 'login is required, {VALUE} is received'],
            minlength: [3, 'login is too short'],
            maxlength: [10, 'login is too long'],
        },
        email: {
            type: String,
            required: [true, 'email is required, {VALUE} is received'],
            minlength: [3, 'email is too short'],
        },
        passwordSalt: {
            type: String,
            required: true,
            minlength: 10,
        },
        passwordHash: {
            type: String,
            required: [true, 'password is required'],
            minlength: 10,
        },
        createdAt: {type: Date, default: Date.now},
    },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: {type: Date, default: Date.now},
        isConfirmed: {type: Boolean, default: false},
    },
    emailCodes: [{
        code: String,
        sentAt: Date
    }],
    passwordConfirmation: {
        confirmationCode: String,
        expirationDate: {type: Date, default: Date.now},
    },
    passwordCodes: [{
        code: String,
        sentAt: Date,
    }],
    tokens: {
        accessTokens: [{
            value: String,
            createdAt: Date,
            expiredAt: Date,
        }],
        refreshTokens: [{
            value: String,
            createdAt: Date,
            expiredAt: Date,
        }],
    }
})

//BLOG SCHEMA
const blogSchema = new mongoose.Schema<blogViewModel>({
    id: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now},
})


//POST SCHEMA
const postSchema = new mongoose.Schema<postViewModel>({
    id: {type: String, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now},
})


//COMMENT SCHEMA
const commentSchema = new mongoose.Schema<commentDataModel>({
        id: {type: String, required: true},
        content: {type: String, required: true},
        commentatorInfo: {
            userId: {type: String, required: true},
            userLogin: {type: String, required: true},
        },
        postId: {type: String, required: true},
        createdAt: {type: Date, required: true, default: Date.now},
        likesInfo: {
            dislikesCount: {
                type: Number,
                required: true,
            },
            likesCount: {
                type: Number,
                required: true,
            },
            myStatus: {
                type: String,
                required: true,
            },
        },
        userAssess: [{
            userIdLike: {type: String, required: true},
            assess: {type: String, required: true}, // Like / Dislike / None
        }]
    }
)


//REFRESHTOKEN SCHEMA
const refreshTokenSchema = new mongoose.Schema<refreshTokensDataModel>({
        value: {type: String, required: true},
        userId: {type: String, required: true},
        deviceId: {type: String, required: true},
        deviceName: {type: String, required: true},
        IP: {type: String, required: true},
        createdAt: {type: Date, required: true, default: Date.now},
        expiredAt: {type: Date, required: true}
    }
)


//CREATE MODELS
export const UserModel = mongoose.model('User', userSchema, 'users')
export const BlogModel = mongoose.model('Blog', blogSchema, 'blogs')
export const PostModel = mongoose.model('Post', postSchema, 'posts')
export const CommentModel = mongoose.model('Comment', commentSchema, 'comments')
export const RefreshTokenModel = mongoose.model('RefreshToken', refreshTokenSchema, 'refreshTokens')


//CONNECT TO DB
export async function runDb() {
    try {
        const options = {
            dbName: 'hosting', // dbName
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 6000, // Keep trying to send operations for 6 seconds
        }
        await mongoose.connect(mongoUri, options)
        console.log('Connected successfully to mongo server')
    } catch {
        await mongoose.disconnect()
        console.log("Can't connect to db")
    }
}





