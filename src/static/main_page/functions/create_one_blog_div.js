"use strict";
export function create_one_blog_div(name, description) {
    // create divs
    const blog = document.createElement('div')
    blog.classList.add('blog')
    const blogImageDiv = document.createElement('div')
    blogImageDiv.classList.add('blogImage')
    const blogContentDiv = document.createElement('div')
    blogContentDiv.classList.add('blogContent')

    // create image h2  p2
    const image = document.createElement('img')
    image.classList.add('images')
    image.src = 'images/photo.png'
    const blogName = document.createElement('h2')
    const blogDescription = document.createElement('p2')

    // put the text into h2 and p2
    blogName.innerText = name
    blogDescription.innerText = description

    //construct blog
    blog.appendChild(blogImageDiv)
    blog.appendChild(blogContentDiv)
    blogImageDiv.appendChild(image)
    blogContentDiv.appendChild(blogName)
    blogContentDiv.appendChild(blogDescription)

    return blog
}
