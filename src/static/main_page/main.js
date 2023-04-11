document.getElementById('blogs').addEventListener('click', (event) => {
    event.preventDefault();
    //go to db and take blogs
    fetch('/blogs', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
        .then(response => response.json())
        .then(data => {
            // clear existing blogs
            document.getElementById('main-block').innerHTML = ''

            // loop through blogs and append to main-block
            data.items.forEach(dbBlog => {

                const blogNameText = dbBlog.name || 'Blog Post Title'
                const blogDescriptionText = dbBlog.description || 'Here\'s some text about the blog post.'

                // create divs
                const blogImageDiv = document.createElement('div')
                blogImageDiv.classList.add('blogImage')
                const blogContentDiv = document.createElement('div')
                blogContentDiv.classList.add('blogContent')
                const blog = document.createElement('div')
                blog.classList.add('blog')

                // create image h2  p2
                const image = document.createElement('img')
                image.classList.add('images')
                image.src = 'photo.png'
                const blogName = document.createElement('h2')
                const blogDescription = document.createElement('p2')

                // put the text into h2 p2
                blogName.innerText = blogNameText
                blogDescription.innerText = blogDescriptionText

                //construct blog
                blog.appendChild(blogImageDiv)
                blogImageDiv.appendChild(image)
                blog.appendChild(blogContentDiv)
                blogContentDiv.appendChild(blogName,)
                blogContentDiv.appendChild(blogDescription)

                document.getElementById('main-block').appendChild(blog)
            })
            console.log(data.items)
        })
        .catch(error => {
            console.error('Error fetching blogs:', error)
        })
})


