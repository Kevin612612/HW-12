//Presentation Layer


//(1)get     returns comments for specified post
//(2)post    create new comment
//(3)get     returns all posts
//(4)post    create new post
//(5)get     returns post by postId
//(6)put     update post by postId
//(7)delete  delete post by postId
//(8)put     like-operation



import {Router} from "express";
import {
    blogIdValidationInBody, collectionErrors,
    commentValidation,
    contentValidation, likeStatusValidation,
    postIdValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middleware/input-validation-middleware";
import {authMiddleWare, authorization, checkAuthMiddleWare} from "../middleware/authorization-middleware";
import {container} from "../composition-root";
import {PostController} from "../controllers/postController";

const postController = container.resolve(PostController)


export const postsRouter = Router({})



//(1) returns comments for specified post
postsRouter.get('/:postId/comments',
    checkAuthMiddleWare,
    postIdValidation,
    collectionErrors, // should be the last middleware
    postController.getComments.bind(postController)
)


//(2) create new comment
postsRouter.post('/:postId/comments',
    authMiddleWare,
    commentValidation,
    collectionErrors, // should be the last middleware
    postController.createComment.bind(postController)
)


//(3) returns all posts with paging
postsRouter.get('/',
    postController.getAllPosts.bind(postController)
)


//(4) create new post
postsRouter.post('/',
    authorization,
    blogIdValidationInBody,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    collectionErrors, // should be the last middleware
    postController.createPost.bind(postController)
)


//(5) get post by postId
postsRouter.get('/:postId',
    postIdValidation,
    collectionErrors, // should be the last middleware
    postController.getPostById.bind(postController)
)


//(6) update post by postId
postsRouter.put('/:postId',
    authorization,
    blogIdValidationInBody,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    collectionErrors, // should be the last middleware
    postController.updatePostById.bind(postController)
)


//(7) delete post by postId
postsRouter.delete('/:postId',
    authorization,
    postIdValidation,
    collectionErrors, // should be the last middleware
    postController.deletePostById.bind(postController)
)

//(8) like operation
postsRouter.put('/:postId/like-status',
    authMiddleWare, // put user into request
    likeStatusValidation,
    collectionErrors,
    postController.changeLikeStatus.bind(postController)
)
