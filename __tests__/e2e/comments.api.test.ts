import request from "supertest";
import {app} from "../../src/setting";
import mongoose from "mongoose";
import {mongoUri} from "../../src/repositories/mogoose";
import {createUser} from "./users.api.test";

jest.setTimeout(600000)

describe('Comments api test', () => {
    beforeAll(async () => {
        console.log('beforeAll')
        const options = {
            dbName: 'hosting', // dbName
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 6000, // Keep trying to send operations for 6 seconds
        }
        await mongoose.connect(mongoUri, options)
        console.log('Connected successfully to mongo server')
        await request(app).delete("/testing/all-data")
    })

    afterAll(async () => {
        console.log('afterAll')
        await mongoose.disconnect()
        console.log("Can't connect to db")
    })

    it('script1', async () => {
        // create user1 ->
        // login user1 ->
        // create blog1 ->
        // create post1 ->
        // create comment1 ->

        // create user2 ->
        // login user2 ->
        // dislike comment1 ->
        // get comment 1 ->

        // create user3 ->
        // login user3 ->
        // dislike comment1 ->
        // get comment 1 ->

        // create user4 ->
        // login user4 ->
        // like comment1 ->
        // like comment1 ->
        // get the comment after each like by user 1 ->

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

        //create comment of user1 to post1
        const responseComment1 = await request(app)
            .post(`/posts/${responsePost1.body.id}/comments/`)
            .auth(`${tokenUser1}`, {type: "bearer"})
            .send({
                content: `comment 1 to post ${responsePost1.body.id} blog ${responseBlog1.body.id} by user ${responseUser1.body.id}`,
            })
        console.log(responseComment1.body)

        // create user2
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

        // login user2
        const responseLoginUser2 = await request(app)
            .post(`/auth/login`)
            .send({
                loginOrEmail: user2.login,
                password: user2.password,
            })
        const tokenUser2 = responseLoginUser2.body.accessToken
        console.log(tokenUser2)

        // dislike comment1 by user 2
        const dislikeUser2 = await request(app)
            .put(`/comments/${responseComment1.body.id}/like-status`)
            .auth(`${tokenUser2}`, {type: "bearer"})
            .send({
                likeStatus: "Dislike"
            })

        // get comment 1 ->
        const getComment1 = await request(app)
            .get(`/comments/${responseComment1.body.id}`)
        console.log(getComment1.body)

        // create user3
        const user3 = createUser()
        const responseUser3 = await request(app)
            .post(`/users`)
            .auth("admin", "qwerty", {type: "basic"})
            .send({
                login: user3.login,
                password: user3.password,
                email: user3.email
            })
        console.log(responseUser3.body)

        // login user3
        const responseLoginUser3 = await request(app)
            .post(`/auth/login`)
            .send({
                loginOrEmail: user3.login,
                password: user3.password,
            })
        const tokenUser3 = responseLoginUser3.body.accessToken
        console.log(tokenUser3)

        // dislike comment1 by user 3
        const dislikeUser3 = await request(app)
            .put(`/comments/${responseComment1.body.id}/like-status`)
            .auth(`${tokenUser3}`, {type: "bearer"})
            .send({
                likeStatus: "Dislike"
            })

        // get comment 1 ->
        const getComment1_1 = await request(app)
            .get(`/comments/${responseComment1.body.id}`)
        console.log(getComment1_1.body)

        // create user4
        const user4 = createUser()
        const responseUser4 = await request(app)
            .post(`/users`)
            .auth("admin", "qwerty", {type: "basic"})
            .send({
                login: user4.login,
                password: user4.password,
                email: user4.email
            })
        console.log(responseUser4.body)

        // login user4
        const responseLoginUser4 = await request(app)
            .post(`/auth/login`)
            .send({
                loginOrEmail: user4.login,
                password: user4.password,
            })
        const tokenUser4 = responseLoginUser4.body.accessToken
        console.log(tokenUser4)

        // like comment1 by user 4
        const likeUser4 = await request(app)
            .put(`/comments/${responseComment1.body.id}/like-status`)
            .auth(`${tokenUser4}`, {type: "bearer"})
            .send({
                likeStatus: "Like"
            })

        // like comment1 by user 4
        const likeUser4_1 = await request(app)
            .put(`/comments/${responseComment1.body.id}/like-status`)
            .auth(`${tokenUser4}`, {type: "bearer"})
            .send({
                likeStatus: "Like"
            })

        // get comment 1 ->
        const getComment1_2 = await request(app)
            .get(`/comments/${responseComment1.body.id}`)
        console.log(getComment1_2.body)
    }, 120000)





    it('script2', async () => {
        // create user1 ->
        // login user1 ->
        // create blog1 ->
        // create post1 ->
        // create comment1 ->

        // like comment1 by user1 ->
        // get comment 1 by user1->

        // dislike comment1 by user1 ->
        // get comment 1 by user1->

        // none comment1 by user1 ->
        // get comment 1 by user1->


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

        //create comment of user1 to post1
        const responseComment1 = await request(app)
            .post(`/posts/${responsePost1.body.id}/comments/`)
            .auth(`${tokenUser1}`, {type: "bearer"})
            .send({
                content: `comment 1 to post ${responsePost1.body.id} blog ${responseBlog1.body.id} by user ${responseUser1.body.id}`,
            })
        console.log(responseComment1.body)

        // like comment1 by user1 ->
        const likeUser1 = await request(app)
            .put(`/comments/${responseComment1.body.id}/like-status`)
            .auth(`${tokenUser1}`, {type: "bearer"})
            .send({
                likeStatus: "Like"
            })

        // get comment 1 by user1->
        const getComment1_1 = await request(app)
            .get(`/comments/${responseComment1.body.id}`)
            .auth(`${tokenUser1}`, {type: "bearer"})
        console.log(getComment1_1.body)

        // dislike comment1 by user1 ->
        const dislikeUser1 = await request(app)
            .put(`/comments/${responseComment1.body.id}/like-status`)
            .auth(`${tokenUser1}`, {type: "bearer"})
            .send({
                likeStatus: "Dislike"
            })

        // get comment 1 by user1->
        const getComment1_2 = await request(app)
            .get(`/comments/${responseComment1.body.id}`)
            .auth(`${tokenUser1}`, {type: "bearer"})
        console.log(getComment1_2.body)

        // None comment1 by user1 ->
        const noneUser1 = await request(app)
            .put(`/comments/${responseComment1.body.id}/like-status`)
            .auth(`${tokenUser1}`, {type: "bearer"})
            .send({
                likeStatus: "None"
            })

        // get comment 1 by user1->
        const getComment1_3 = await request(app)
            .get(`/comments/${responseComment1.body.id}`)
            .auth(`${tokenUser1}`, {type: "bearer"})
        console.log(getComment1_3.body)

    }, 200000)

})

