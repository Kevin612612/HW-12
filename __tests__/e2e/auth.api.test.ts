import request from "supertest";

import {app} from "../../src/setting";
import {createUser} from "./users.api.test";

jest.setTimeout(60000)

describe('AUTH router', () => {
    //POST user -> LOGIN user
    test('should return 200 with accessToken', async () => {
        //create user
        const user = createUser()
        //post user
        const result = await request(app)
            .post(`/users`)
            .auth("admin", "qwerty", {type: "basic"})
            .send({
                login: user.login,
                password: user.password,
                email: user.email
            })
        //login user
        const response = await request(app)
            .post(`/auth/login`)
            .send({
                loginOrEmail: user.login,
                password: user.password,
            })
        //expect status to be 200
        expect(response.statusCode).toBe(200)
        //expect response have property
        expect(response.body).toHaveProperty('accessToken');
        //expect response should be string with length more than 50
        expect(response.body.accessToken.length).toBeGreaterThan(50)
    })

})