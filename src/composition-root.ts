import {UserRepository} from "./repositories/users-repository-db";
import {UserBusinessLayer} from "./BLL/users-BLL";
import {UserController} from "./controllers/userController";
import {AuthBusinessLayer} from "./BLL/auth-BLL";
import {AuthController} from "./controllers/authController";
import {JWTService} from "./application/jwt-service";
import {EmailsManager} from "./bussiness/bussiness-service";
import {RefreshTokensRepository} from "./repositories/refreshTokens-repository-db";
import {BlogController} from "./controllers/blogController";
import {BlogBusinessLayer} from "./BLL/blogs-BLL";
import {PostBusinessLayer} from "./BLL/posts-BLL";
import {BlogsRepository} from "./repositories/blogs-repository-db";
import {PostsRepository} from "./repositories/posts-repository-db";
import {PostController} from "./controllers/postController";
import {CommentsRepository} from "./repositories/comments-repository-db";
import {CommentsBusinessLayer} from "./BLL/comments-BLL";
import {CommentController} from "./controllers/commentController";
import {RefreshTokensBusinessLayer} from "./BLL/refresh-tokens-BLL";
import {DeviceController} from "./controllers/deviceController";


export const userRepository = new UserRepository()
export const blogsRepository = new BlogsRepository()
export const postsRepository = new PostsRepository()
export const commentsRepository = new CommentsRepository()
export const refreshTokensRepository = new RefreshTokensRepository()

export const jwtService = new JWTService(userRepository, refreshTokensRepository)
export const emailsManager = new EmailsManager(userRepository)


const userBusinessLayer = new UserBusinessLayer(userRepository, emailsManager)
const authBusinessLayer = new AuthBusinessLayer(userRepository)
const blogBusinessLayer = new BlogBusinessLayer(blogsRepository, postsRepository)
const postBusinessLayer = new PostBusinessLayer(blogsRepository, postsRepository, commentsRepository)
const commentsBusinessLayer = new CommentsBusinessLayer(commentsRepository)
const refreshTokensBusinessLayer = new RefreshTokensBusinessLayer(jwtService, refreshTokensRepository)




export const userController = new UserController(userBusinessLayer)
export const blogController = new BlogController(blogBusinessLayer, postBusinessLayer)
export const postController = new PostController(postBusinessLayer)
export const commentController = new CommentController(commentsBusinessLayer)

export const authController = new AuthController(authBusinessLayer, userBusinessLayer, userRepository, jwtService, emailsManager, refreshTokensRepository)
export const deviceController = new DeviceController(refreshTokensBusinessLayer, jwtService)


