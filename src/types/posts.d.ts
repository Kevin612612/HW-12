
//POSTS
//view type
export type postViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date
}

//postType returned by POST-method
export type PostsTypeSchema = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: postViewModel[]
}
