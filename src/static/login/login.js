document.querySelector('.login_button').addEventListener('click', (event) => {
    event.preventDefault() // prevent form submission
    fetch('/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            loginOrEmail: document.getElementById('loginOrEmail').value,
            password: document.getElementById('password').value,
        })
    })
        .then(response => {
            if (response.status === 200) {
                console.log(response.status)
                window.location.href = '/main.html'  // load next page if status is 200
            } else {
                alert('Error: ' + response.statusText)  // handle other response statuses
            }
        })
        .catch(error => {
            alert('login failed')
            // handle any errors that occur during the registration process
        })
})

