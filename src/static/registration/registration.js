const registrationForm = document.getElementById('registration-form');


registrationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const registrationData = {
        login: usernameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
    };

    fetch('http://localhost:5001/users', {
        method: 'POST',
        headers: {
            "Authorization": "Basic YWRtaW46cXdlcnR5",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registrationData)
    })
        .then(response => {
            // Check if the response was successful
            if (response.errorsMessages) {
                alert('Network response was not ok')
            }
        })
        .then(data => {
            console.log('Registration successful:', JSON.stringify(data));
            // do something with the response data, such as redirect to a success page
        })
        .catch(error => {
            console.error('Registration failed:', error);
            // handle any errors that occur during the registration process
        });
});