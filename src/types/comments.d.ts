//COMMENTS
//view type
export type commentViewModel = {
    commentatorInfo: {
        userId: string,
        userLogin: string,
    },
    id: string,
    content: string,
    createdAt: Date,
    likesInfo: {
        dislikesCount: number,
        likesCount: number,
        myStatus: string,
    },
}


//data type
export type commentDataModel = {
    commentatorInfo: {
        userId: string,
        userLogin: string,
    },
    id: string,
    content: string,
    postId: string,
    createdAt: Date,
    likesInfo: {
        dislikesCount: number,
        likesCount: number,
        myStatus: string,
    },
    userAssess: userAssessType[]
}

export type userAssessType = {
    userIdLike: string,
    assess: string
}

//commentType returned by POST-method
export type CommentsTypeSchema = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: commentViewModel[]
}
