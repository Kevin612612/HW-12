//upload blog by name

const blogNameButton = document.getElementById('blog-name-button')

blogNameButton.addEventListener('click', (event) => {
    event.preventDefault();
    const blogName = document.getElementById('blog-name').value
    document.getElementById('blog-name').innerHTML = '' // clear input
    fetch(`/blogs/find/${blogName}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    }).then(response => response.json())
        .then(data => {
            document.getElementsByClassName('main-block')[0].innerHTML = '' // clear main-block
            const {name, description} = data

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
            image.src = 'images/photo.png'
            const blogName = document.createElement('h2')
            const blogDescription = document.createElement('p2')

            // put the text into h2 p2
            blogName.innerText = name
            blogDescription.innerText = description

            //construct blog
            blog.appendChild(blogImageDiv)
            blogImageDiv.appendChild(image)
            blog.appendChild(blogContentDiv)
            blogContentDiv.appendChild(blogName)
            blogContentDiv.appendChild(blogDescription)

            document.getElementsByClassName('main-block')[0].appendChild(blog)
            document.getElementById('blog-name').value = ''
        })
        .catch(error => {
            console.error('Error fetching blog:', error)
        })
})



