"use strict";

import {create_one_blog_div} from "./functions/create_one_blog_div.js";

const blogsSidebar = document.getElementsByClassName('blog_sidebar')[0];

blogsSidebar.addEventListener('click', function (event) {
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
                const blog = create_one_blog_div(name, description)
                document.getElementsByClassName('main-block')[0].appendChild(blog)
            })
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


