
//Presentation Layer


//(1)put     update comments
//(2)delete  delete comment
//(3)get     returns comment by Id
//(4)put     like-operation


import {Router} from "express";
import {authMiddleWare, checkAuthMiddleWare} from "../middleware/authorization-middleware";
import {
    collectionErrors,
    commentValidation,
    likeStatusValidation
} from "../middleware/input-validation-middleware";
import {container} from "../composition-root";
import {CommentController} from "../controllers/commentController";

const commentController = container.resolve(CommentController)


export const commentsRouter = Router({})


//(1) update comments
commentsRouter.put('/:commentId',
    authMiddleWare,
    commentValidation,
    collectionErrors,
    commentController.updateComment.bind(commentController)
)


//(2) delete comments
commentsRouter.delete('/:commentId',
    authMiddleWare,
    commentController.deleteComment.bind(commentController)
)


//(3) returns comment by Id
commentsRouter.get('/:commentId',
    checkAuthMiddleWare, //check authorization and put user into request
    commentController.getCommentById.bind(commentController)
)


//(4) like operation
commentsRouter.put('/:commentId/like-status',
    authMiddleWare, // put user into request
    likeStatusValidation,
    collectionErrors,
    commentController.changeLikeStatus.bind(commentController)
)