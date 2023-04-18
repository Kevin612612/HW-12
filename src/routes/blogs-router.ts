
//Presentation Layer


//(1)get     returns all blogs
//(2)post    create  new blog
//(3)get     returns all posts by specific blog
//(4)post    create  new post for specific blog
//(5)get     returns blog by blogId
//(6)put     update  existing by blogId
//(7)delete  delete  blog by blogId

import {Router} from "express";
import {
    descriptionValidation,
    nameValidation,
    newWebSiteUrlValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidationInParams, collectionErrors
} from "../middleware/input-validation-middleware";
import {authorization} from "../middleware/authorization-middleware";
import {container} from "../composition-root";
import {BlogController} from "../controllers/blogController";
import "reflect-metadata";

const blogController = container.resolve(BlogController)


export const blogsRouter = Router({})


//(1) returns all blogs with paging
blogsRouter.get('/',
    blogController.getAllBlogs.bind(blogController)
)


//(2) create new blog
blogsRouter.post('/',
    authorization,
    nameValidation,
    descriptionValidation,
    newWebSiteUrlValidation,
    collectionErrors, // should be the last middleware
    blogController.createBlog.bind(blogController)
)


//(3) returns all posts by specified blog
blogsRouter.get('/:blogId/posts',
    blogIdValidationInParams,
    //todo: redevelop blogIdValidationInParams
    collectionErrors, // should be the last middleware
    blogController.getAllPostsByBlogId.bind(blogController)
)


//(4) create new post for specific blog
blogsRouter.post('/:blogId/posts',
    authorization,
    blogIdValidationInParams,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    collectionErrors, // should be the last middleware
    blogController.createPost.bind(blogController)
)


//(5) returns blog by blogId
blogsRouter.get('/:blogId',
    //blogIdValidationInParams,
    //collectionErrors, // should be the last middleware
    blogController.getBlogById.bind(blogController)
)


//(5-1) returns blog by name
blogsRouter.get('/find/:name',
    blogController.getBlogByName.bind(blogController)
)


//(6) update existing blog by blogId with InputModel
blogsRouter.put('/:blogId',
    authorization,
    blogIdValidationInParams,
    nameValidation,
    descriptionValidation,
    newWebSiteUrlValidation,
    collectionErrors, // should be the last middleware
    blogController.updateBlogById.bind(blogController)
)


//(7) delete blog by blogId
blogsRouter.delete('/:blogId',
    authorization,
    blogIdValidationInParams,
    collectionErrors, // should be the last middleware
    blogController.deleteBlogById.bind(blogController)
)






