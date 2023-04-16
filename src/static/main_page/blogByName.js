//upload blog by name

import {create_one_blog_div} from "./functions/create_one_blog_div.js";

const blogNameButton = document.getElementById('blog-name-button')

blogNameButton.addEventListener('click', function(event) {
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
            const blog = create_one_blog_div(name, description)
            document.getElementsByClassName('main-block')[0].appendChild(blog)
            document.getElementById('blog-name').value = ''
        })
        .catch(error => {
            console.error('Error fetching blog:', error)
        })
})



