
import {Request, Response, Router} from "express";
import requestIp from 'request-ip';

import DeviceDetector from 'node-device-detector'
import UAParser from "ua-parser-js";

import {checkRequestNumber} from "../middleware/input-validation-middleware";
import {User} from "../classes/userClass";
import {Blog} from "../classes/blogClass";
import * as os from "os";
import {UserRepository} from "../repositories/users-repository-db";
import {BlogsRepository} from "../repositories/blogs-repository-db";

export const ___trainRouter = Router({})


___trainRouter.get('/detect', (req: Request, res: Response) => {
    const {type, os, browser} = req.device;
    res.send(`You are using a ${type} device running ${os} and using ${browser}.`);
    // res.send(req.device)
})


___trainRouter.get('/detect1',
    function (req: Request, res: Response) {
        const detector = new DeviceDetector();

        const userAgent = req.headers['user-agent']
        const resultClient = detector.parseClient(userAgent!)
        // const botResult    = detector.parseBot(userAgent!)
        // const resultOs     = detector.parseOs(userAgent!)
        // const result       = detector.detect(userAgent!)

        // res.json({userAgent, resultClient, botResult, resultOs, result})
        res.json({userAgent, resultClient})

    })


___trainRouter.get('/getIP',
    function (req: Request, res: Response) {
        const ipAddress1 = req.socket.remoteAddress
        const ipAddress2 = req.ip
        const ipAddress3 = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : 'none'
        const ipAddress4 = req.socket.remoteAddress;
        const ipAddress5 = requestIp.getClientIp(req);
        const Host = req.header('Host') ? req.header('Host') : 'none'
        const Token = req.header('Postman-Token') ? req.header('Postman-Token') : 'none'
        const userAgent = req.headers['user-agent']

        res.json({ipAddress1, ipAddress2, ipAddress3, ipAddress4, ipAddress5, Host, Token, userAgent})
    })


___trainRouter.get('/devices',
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        res.json({refreshToken})
    })


___trainRouter.get('/devicename',
    async (req: Request, res: Response) => {
        const userAgent = req.headers['user-agent']
        const parser = new UAParser(userAgent);
        const deviceName = parser.getResult().ua
        res.json(deviceName)
    })


___trainRouter.get('/ip',
    checkRequestNumber,
    async (req: Request, res: Response) => {
        const ip = req.ip
        const path = req.path
        res.json({ip, path})
    })


___trainRouter.get('/request',
    (req: Request, res: Response) => {
        res.send(req)
    })

___trainRouter.get('/user',
    async (req: Request, res: Response) => {
        const {login, email, password} = req.body
        let user = new User() //empty user
        user = await user.addAsyncParams(login, email, password)
        const usersRepository = new UserRepository();
        const result = await usersRepository.newPostedUser(user)
        res.send(user)
    })

___trainRouter.get('/blog',
    async (req: Request, res: Response) => {
        const {name, description, websiteUrl} = req.body
        let blog = new Blog() //empty blog
        blog = await blog.addAsyncParams(name, description, websiteUrl)
        let blogsRepository = new BlogsRepository();
        const result = await blogsRepository.newPostedBlog(blog)
        res.send(blog)
    })


___trainRouter.get('/os', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    const osInfo = {
        platform: os.platform(),
        architecture: os.arch(),
        hostname: os.hostname(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpus: os.cpus(),
        networkInterfaces: os.networkInterfaces(),
    }
    res.end(JSON.stringify(osInfo))
})






