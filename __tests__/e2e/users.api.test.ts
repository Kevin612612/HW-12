import request from "supertest";

import {app} from "../../src/setting";

jest.setTimeout(600000)


//create function for creating random string
export const generateRandomString = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

//create random user
export function createUser() {
    return {
        login: generateRandomString(5) + 'user',
        password: generateRandomString(7),
        email: generateRandomString(10) + '@gmail.com'
    }
}


describe('USER router', () => {
    //GET USERS
    test('should return 200 with UserSchema', async () => {
        //query parameters
        const QP = {
            pageSize: 10,
            pageNumber: 1,
            searchLoginTerm: '',
            searchEmailTerm: '',
            sortDirection: 'asc',
            sortBy: 'login'
        };
        //expected result
        const expectedResult = {
            pagesCount: expect.any(Number),
            page: expect.any(Number),
            pageSize: expect.any(Number),
            totalCount: expect.any(Number),
            items: expect.any(Array)
        };
        //response
        const response = await request(app)
            .get(`/users?pageSize=${QP.pageSize}&pageNumber=${QP.pageNumber}&searchLoginTerm=${QP.searchLoginTerm}&searchEmailTerm=${QP.searchEmailTerm}&sortDirection=${QP.sortDirection}&sortBy=${QP.sortBy}`)
            .auth("admin", "qwerty", {type: "basic"})
        //expect status to be 200
        expect(response.statusCode).toBe(200)
        //expect response should be
        expect(response.body).toMatchObject(expectedResult)
        expect(response.body.items[0]).toMatchObject(expect.objectContaining({
            id: expect.any(String),
            login: expect.any(String),
            email: expect.any(String),
            createdAt: expect.any(String)
        }))
        //response
        console.log(response.body)
    })


    //POST USER
    test('should return 201 with user', async () => {
        //create user
        const user = createUser()
        //expected result
        const expectedResult = {
            id: expect.any(String),
            login: user.login,
            email: user.email,
            createdAt: expect.any(String)
        }
        //response
        const response = await request(app)
            .post(`/users`)
            .auth("admin", "qwerty", {type: "basic"})
            .send({
                login: user.login,
                password: user.password,
                email: user.email
            })
        //expect status to be 201
        // expect(response.statusCode).toBe(201)
        //expect response should be
        // expect(response.body).toMatchObject(expectedResult)
        //response
        console.log(response.body)
    })


    //DELETE USER
    test('should return 204', async () => {
        const userId = '1'
        const response = await request(app)
            .delete(`/users/${userId}`)
            .auth("admin", "qwerty", {type: "basic"})
        //expect status to be 204
        expect(response.statusCode).toBe(204)
    })
})