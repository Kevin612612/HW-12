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
import {Container} from "inversify";
import "reflect-metadata";


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


// handmade IoC
const objects = [userRepository, blogsRepository, postsRepository, commentsRepository, refreshTokensRepository, jwtService, emailsManager, userBusinessLayer, authBusinessLayer, blogBusinessLayer, postBusinessLayer, commentsBusinessLayer, refreshTokensBusinessLayer, userController, blogController, postController, commentController, authController, deviceController]
export const ioc = {
    getInstanceOfClass(ClassType: any) {
        return objects.find(o => o instanceof ClassType)
    }
}

//InversifyJS container
export const container = new Container();

container.bind<UserController>(UserController).to(UserController);
container.bind<UserBusinessLayer>(UserBusinessLayer).to(UserBusinessLayer);
container.bind<UserRepository>(UserRepository).to(UserRepository);

container.bind<BlogController>(BlogController).to(BlogController);
container.bind<BlogBusinessLayer>(BlogBusinessLayer).to(BlogBusinessLayer);
container.bind<BlogsRepository>(BlogsRepository).to(BlogsRepository);

container.bind<PostController>(PostController).to(PostController);
container.bind<PostBusinessLayer>(PostBusinessLayer).to(PostBusinessLayer);
container.bind<PostsRepository>(PostsRepository).to(PostsRepository);

container.bind<CommentController>(CommentController).to(CommentController);
container.bind<CommentsBusinessLayer>(CommentsBusinessLayer).to(CommentsBusinessLayer);
container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository);

container.bind<AuthController>(AuthController).to(AuthController);
container.bind<AuthBusinessLayer>(AuthBusinessLayer).to(AuthBusinessLayer);


container.bind<DeviceController>(DeviceController).to(DeviceController);

container.bind<RefreshTokensBusinessLayer>(RefreshTokensBusinessLayer).to(RefreshTokensBusinessLayer);
container.bind<RefreshTokensRepository>(RefreshTokensRepository).to(RefreshTokensRepository);

container.bind<JWTService>(JWTService).to(JWTService);

container.bind<EmailsManager>(EmailsManager).to(EmailsManager);
