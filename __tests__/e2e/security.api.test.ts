import request from 'supertest';

import {app} from "../../src/setting";
import {createUser} from "./users.api.test";

jest.setTimeout(60000)


describe('GET DEVICES', () => {
    //create user -> post user -> login user from 4 devices -> send refreshToken -> get devices list

    //create user
    const user = createUser()

    //create cookies
    let cookies: string[] = [];

    //post user
    test('post user', async () => {
        const result = await request(app)
            .post(`/users`)
            .auth("admin", "qwerty", {type: "basic"})
            .send({
                login: user.login,
                password: user.password,
                email: user.email
            })
    })

    //login from 4 devices
    const devicesList = ['Mozilla/5.0',
        'AppleWebKit/537.36 ',
        'Chrome/88.0.4324.192',
        'Safari/537.36']
    for (let i = 0; i < 4; i++) {
        it(`should login user from device ${devicesList[i]}`, async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({loginOrEmail: user.login, password: user.password})
                .set('User-Agent', devicesList[i])
                .expect(200);

            cookies[i] = res.headers['set-cookie']
        });
    }

    //get devices
    it('should send refresh token in cookie', async () => {
        const res1 = await request(app)
            .get('/security/devices')
            .set('Cookie', cookies[3]) // login with device 3
        // respose.body
        console.log(res1.body)
    })

    //update refreshToken
    it('refresh token', async () => {
        const res = await request(app)
            .post(`/auth/refresh-token`)
            .set('Cookie', cookies[3]) // login with device
            .set('User-Agent', devicesList[3])
        cookies[3] = res.headers['set-cookie'] // update token
    })

    //logout current session
    it('logout', async () => {
        const res = await request(app)
            .post(`/auth/logout`)
            .set('Cookie', cookies[3]) // login with device
            .set('User-Agent', devicesList[3])
    })

    //get devices
    it('should send refresh token in cookie', async () => {
        const res2 = await request(app)
            .get('/security/devices')
            .set('Cookie', cookies[2]) // login with device 3
        // respose.body
        console.log(res2.body)
    })

})


describe('DELETE DEVICES', () => {
    //create user -> post user -> login user from 3 devices -> send refreshToken -> get devices list

    //create user
    const user = createUser()

    //create cookies
    let cookies: string[] = [];

    //post user
    test('post user', async () => {
        const result = await request(app)
            .post(`/users`)
            .auth("admin", "qwerty", {type: "basic"})
            .send({
                login: user.login,
                password: user.password,
                email: user.email
            })
    })

    //login from 3 devices
    const devicesList = ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'AppleWebKit/537.36 (HTML, like Gecko)',
        'Chrome/88.0.4324.192']
    for (let i = 0; i < devicesList.length; i++) {
        it(`should login user from device ${devicesList[i]}`, async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({loginOrEmail: user.login, password: user.password})
                .set('Accept', 'application/json')
                .set('User-Agent', devicesList[i])
                .expect('Content-Type', /json/)
                .expect(200);
            cookies[i] = res.headers['set-cookie'];
        });
    }

    //send refreshToken
    it('should send refresh token in cookie', async () => {
        const res = await request(app)
            .delete('/security/devices')
            .set('Cookie', cookies[1]) // login with device 1

        // respose.body
        console.log(res.body)
    });
})




describe('DELETE DEVICE', () => {
    //create user -> post user -> login user -> send refreshToken & deviceId -> request get devices -> result

    //create user
    const user = createUser()

    //create devices list
    const devicesList = ['Mozilla/5.0',
        'AppleWebKit/537.36',
        'Chrome/88.0.4324.192']

    //create cookies
    let cookies: string[] = []

    //post user
    test('post user', async () => {
        const result = await request(app)
            .post(`/users`)
            .auth("admin", "qwerty", {type: "basic"})
            .send({
                login: user.login,
                password: user.password,
                email: user.email,
                deviceId: 1
            })
    })

    //login from 3 devices
    for (let i = 0; i < devicesList.length; i++) {
        it(`should login user from device ${devicesList[i]}`, async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({loginOrEmail: user.login, password: user.password})
                .set('User-Agent', devicesList[i])
            cookies[i] = res.headers['set-cookie'];
        });
    }

    //refresh token for 2-nd device
    test('refresh token', async () => {
        const result = await request(app)
            .post(`/auth/refresh-token`)
            .set('Cookie', cookies[2]) // login with device
            .set('User-Agent', devicesList[2])
    })

    //delete device by Id
    test('delete device by Id', async () => {
        const result = await request(app)
            .delete(`/security/devices/1`)
            .set('Cookie', cookies[1]) // login with device
    })

    //get devices
    it('should get devices', async () => {
        const res = await request(app)
            .get('/security/devices')
            .set('Cookie', cookies[1]) // login with device 1

        // respose.body
        console.log(res.body)
    })

})
