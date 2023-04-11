
//BLOGS
//view type
export type blogViewModel = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: Date
}

//blogType returned by POST-method
export type blogsTypeSchema = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: blogViewModel[]
}
