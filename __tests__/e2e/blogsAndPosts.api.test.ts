import request from 'supertest';
import {app} from "../../src/setting";
jest.setTimeout(180000)


// 'describe' creates a block that groups together several related tests
describe('all tests', () => {

    // очищаем все данные delete
    beforeAll(async () => {
        await request(app)
            .delete("/testing/all-data")
    })

    //тестируем blogs
    describe('we are going to test blogs', () => {

        // test get '/blogs/' request
        it('should get empty array', async () => {
            await request(app)
                .get('/blogs/')
                .expect(200, [])
        });

        // создаем блог       post
        it('should create a new blog', async () => {
            const createResponse = await request(app)
                .post('/blogs/')
                .auth("admin", "qwerty", {type: "basic"})
                .send({
                    name: "string",
                    description: "string",
                    websiteUrl: "https://www.google.com/"
                })
                .expect(201)

            const createdBlog = createResponse.body;

            expect(createdBlog).toEqual({
                id: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                websiteUrl: expect.any(String)
            })
        }, 180000);


        // запрашиваем blog по id    get
        it('should get createdBlog', async () => {
            const createResponse = await request(app)
                .get('/blogs/1')
                .expect(200)

            const gotResponse = createResponse.body

            expect(gotResponse).toEqual({
                id: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                websiteUrl: expect.any(String),
                createdAt: expect.any(String)
            })
            console.log(gotResponse)
        });

        // меняем по ID       put by ID
        it('should change created blog', async () => {
            await request(app)
                .put('/blogs/1')
                .auth("admin", "qwerty", {type: "basic"})
                .send({
                    name: "string",
                    description: "string",
                    websiteUrl: "https://www.google.com/"
                })
                .expect(204)
        });

        // удаляем по ID      delete by ID
        it('should delete blog by ID', async () => {
            await request(app)
                .delete('/blogs/1')
                .auth("admin", "qwerty", {type: "basic"})
                .expect(204)
        });
    })

    //тестируем posts
    describe('we are going to test posts', () => {

        // test get '/posts/' request
        it('should get empty array', async () => {
            await request(app)
                .get('/posts/')
                .expect(200, [])
        });

        // создаем пост       post
        it('should create a new post', async () => {
            const createResponse = await request(app)
                .post('/posts/')
                .auth("admin", "qwerty", {type: "basic"})
                .send({
                    title: "string",
                    shortDescription: "string",
                    content: "string",
                    blogId: "string"
                })
                .expect(201)

            const createdPost = createResponse.body;

            expect(createdPost).toEqual({
                id: expect.any(String),
                title: expect.any(String),
                shortDescription: expect.any(String),
                content: expect.any(String),
                blogId: expect.any(String),
                blogName: expect.any(String)
            })
        });

        // запрашиваем post по id    get
        it('should get createdPost', async () => {
            const createResponse = await request(app)
                .get('/posts/1')
                .expect(200)

            const gotResponse = createResponse.body

            expect(gotResponse).toEqual({
                id: expect.any(String),
                title: expect.any(String),
                shortDescription: expect.any(String),
                content: expect.any(String),
                blogId: expect.any(String),
                blogName: expect.any(String)
            })
        });

        // меняем post по ID       put by ID
        it('should change created post', async () => {
            await request(app)
                .put('/posts/1')
                .auth("admin", "qwerty", {type: "basic"})
                .send({
                    title: "string",
                    shortDescription: "string",
                    content: "string",
                    blogId: "string"
                })
                .expect(204)
        });

        // удаляем post по ID      delete by ID
        it('should delete post by ID', async () => {
            await request(app)
                .delete('/posts/1')
                .auth("admin", "qwerty", {type: "basic"})
                .expect(204)
        });
    })

    //тестируем эндпоинт удаления
    it('we are going to test testings', async () => {
        await request(app)
            .delete("/testing/all-data")
            .expect(204, {})
    })
})

