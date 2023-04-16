
import express, {Request, Response} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
// @ts-ignore
import device from 'express-device'
import {authRouter}     from "./routes/auth-router";
import {usersRouter}    from "./routes/users-router";
import {blogsRouter}    from "./routes/blogs-router";
import {postsRouter}    from "./routes/posts-router";
import {commentsRouter} from "./routes/comments-router";
import {emailRouter}    from "./routes/email-router";
import {deviceRouter}   from "./routes/security_devices-router";
import {testingRouter}  from "./routes/testing-router";
import {___trainRouter}    from "./routes/___train-router";
import path from "path"


export const app = express()

const corsMiddleware = cors()
app.use(corsMiddleware)

const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)

app.use(cookieParser())

app.use(device.capture())

app.set('trust proxy', true)

// const pathToStatic = '/Users/antonlazukin/WebstormProjects/HW-12/src' //localhost
const pathToStatic = __dirname // vercel

app.use(express.static(path.resolve(pathToStatic+ '/registration')))
app.use(express.static(path.resolve(pathToStatic + '/main_page')))//join files in folder
app.use(express.static(path.resolve(pathToStatic + '/login')))

app.get('/', (req: Request, res: Response) => {
    res.sendFile(pathToStatic + '/static/main_page/main.html')
})
app.get('/log', (req: Request, res: Response) => {
    res.sendFile(pathToStatic + '/static/login/login.html')
})
app.get('/registration', (req: Request, res: Response) => {
    res.sendFile( pathToStatic + '/static/registration/registration.html')
})




app.get('/page1', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'static/page1', 'page1.html'));
})

app.get('/download', (req: Request, res: Response) => {
    res.download(path.resolve(__dirname, 'static/page1', 'page1.html'));
})


//**ROUTES*/
app.use('/auth', authRouter)
app.use('/security', deviceRouter)
app.use('/users', usersRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/comments', commentsRouter)
app.use('/email', emailRouter)
app.use('/testing', testingRouter)

app.use('/train', ___trainRouter) //draft

