//this repository has to be async



import {MongoClient} from "mongodb";

import * as dotenv from 'dotenv'
dotenv.config()

import {blogViewModel} from "../types/blogs";
import {postViewModel} from "../types/posts";
import {userDataModel} from "../types/users";
import {commentViewModel} from "../types/comments";
import {refreshTokensDataModel} from "../types/refreshTokens";


//connection to mongodb
const mongoUri = process.env.MONGO_URL! // || "mongodb://0.0.0.0:27017";

export const client = new MongoClient(mongoUri);

export const db = client.db("hosting");
export const blogsCollection = db.collection<blogViewModel>("blogs")
export const postsCollection = db.collection<postViewModel>("posts")
export const usersCollection = db.collection<userDataModel>("users")
export const commentsCollection = db.collection<commentViewModel>("comments")
export const refreshTokensCollection = db.collection<refreshTokensDataModel>("refreshTokens")


export async function runDb() {
    try {
        //Connect the client to the server
        await client.connect();
        //Establish and verify connection
        await client.db('hosting').command({ping: 1});
        console.log('Connected successfully to mongo server')
    } catch {
        console.log("Can't connect to db")
        //Ensure that the client will close when you finish/error
        await client.close();
    }
}

//black list of refreshTokens
export let blackList : string[] = []
