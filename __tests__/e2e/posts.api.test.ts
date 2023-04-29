import request from "supertest";
import mongoose from "mongoose"
import { mongoUri } from "../../src/repositories/mogoose"
import { app } from "../../src/setting"
import { createUser } from "./users.api.test";


jest.setTimeout(600000) //10min

describe('posts', ()=> {
    beforeAll(async () => {
        console.log('beforeAll')
        const options = {
            dbName: 'hosting', // dbName
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 6000, // Keep trying to send operations for 6 seconds
        }
        await mongoose.connect(process.env.MONGO_URL!, options)
        console.log('Connected successfully to mongo server')
        // await request(app).delete("/testing/all-data")
    })

    afterAll(async () => {
        console.log('afterAll')
        await mongoose.disconnect()
        console.log("Disconnected from db")
    })

    it('some script', async () => {
        // create user1 +
        // login user1 +
        // create user2 +
        // login user2 +
        // create blog1 +
        // create post1 +
        
        // like post1 by user1 +
        // get post1 by user2 +
        // dislike post1 by user2 
        // get post1 by user1

        //create user1
        const user1 = createUser()
        const responseUser1 = await request(app)
            .post(`/users`)
            .auth("admin", "qwerty", {type: "basic"})
            .send({
                login: user1.login,
                password: user1.password,
                email: user1.email
            })
        console.log(responseUser1.body)

        //login user1
        const responseLoginUser1 = await request(app)
            .post(`/auth/login`)
            .send({
                loginOrEmail: user1.login,
                password: user1.password,
            })
        const tokenUser1 = responseLoginUser1.body.accessToken
        console.log(tokenUser1)
        

        //create user2
        const user2 = createUser()
        const responseUser2 = await request(app)
            .post(`/users`)
            .auth("admin", "qwerty", {type: "basic"})
            .send({
                login: user2.login,
                password: user2.password,
                email: user2.email
            })
        console.log(responseUser2.body)

        //login user2
        const responseLoginUser2 = await request(app)
            .post(`/auth/login`)
            .send({
                loginOrEmail: user2.login,
                password: user2.password,
            })
        const tokenUser2 = responseLoginUser2.body.accessToken
        console.log(tokenUser2)

        //create blog1
        const responseBlog1 = await request(app)
            .post('/blogs/')
            .auth("admin", "qwerty", {type: "basic"})
            .send({
                name: "blog",
                description: "blog about nothing",
                websiteUrl: "https://www.google.com/"
            })
        console.log(responseBlog1.body)

        //create post1
        const responsePost1 = await request(app)
            .post(`/blogs/${responseBlog1.body.id}/posts/`)
            .auth("admin", "qwerty", {type: "basic"})
            .send({
                content: "new post content",
                shortDescription: "description",
                title: `post of blog ${responseBlog1.body.id}`
            })
        console.log(responsePost1.body)

        // like post1 by user1 ->
        const likeUser1 = await request(app)
            .put(`/posts/${responsePost1.body.id}/like-status`)
            .auth(`${tokenUser1}`, {type: "bearer"})
            .send({
                likeStatus: "Like"
            })

        // get post1 by user2 ->
        const getPost1_1 = await request(app)
            .get(`/posts/${responsePost1.body.id}`)
            .auth(`${tokenUser2}`, {type: "bearer"})
        console.log(getPost1_1.body)

        // dislike post1 by user2 ->
        const dislikeUser2 = await request(app)
            .put(`/posts/${responsePost1.body.id}/like-status`)
            .auth(`${tokenUser2}`, {type: "bearer"})
            .send({
                likeStatus: "Dislike"
            })

        // get post1 by user1 ->
        const getPost1_2 = await request(app)
            .get(`/posts/${responsePost1.body.id}`)
            .auth(`${tokenUser1}`, {type: "bearer"})
        console.log(getPost1_2.body)
    }, 200000)
})