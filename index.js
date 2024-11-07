const container = document.querySelector('.container');
const loginBox = document.querySelector('.form-box.Login');
const registerBox = document.querySelector('.form-box.Register');
const registerLink = document.querySelector('.signUpLink');
const loginLink = document.querySelector('.signInLink');

// Show registration form
registerLink.addEventListener('click', () => {
    loginBox.style.display = 'none'; // Hide login form
    registerBox.style.display = 'block'; // Show registration form
});

// Show login form
loginLink.addEventListener('click', () => {
    registerBox.style.display = 'none'; // Hide registration form
    loginBox.style.display = 'block'; // Show login form
});

// Handle login function
function handleLogin(event) {
    event.preventDefault(); // Prevent the default form submission
    // You can add your authentication logic here (e.g., checking credentials)

    // After successful login, redirect to home page
    window.location.href = "home.html"; // Change this to the correct path if needed
}

// Initial setup: show login form by default
registerBox.style.display = 'none'; // Hide registration form initially

// Optionally, if you're using an Express app, keep this part
// app.listen(3001, () => {
//     console.log('Server is running on http://localhost:3001');
// });
