//upload all blogs

const blogsSidebar = document.getElementsByClassName('blog_sidebar')[0];

blogsSidebar.addEventListener('click', (event) => {
    event.preventDefault();
    fetch('/blogs', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
        .then(response => response.json())
        .then(data => {
            document.getElementsByClassName('main-block')[0].innerHTML = '' // clear main-block
            // loop through blogs and append to main-block
            data.items.forEach(dbBlog => {
                const {name, description} = dbBlog

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
            })
            // console.log(data.items)
        })
        .catch(error => {
            console.error('Error fetching blogs:', error)
        })
})

// Add event listener to button to call the toggleClass function
blogsSidebar.addEventListener("click", toggleClass);

function toggleClass() {
    blogsSidebar.classList.toggle("active");
}


