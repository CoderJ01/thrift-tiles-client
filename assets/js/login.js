// file imports
import Cookie from '../../utils/cookie.js';

// To prevent event handler conflict, this 'submit' event has been placed in its own page
let errorMessage = document.createElement("div");
document.querySelector('#login-form').appendChild(errorMessage);
errorMessage.style.textAlign = 'center';

function displayMessage(message) {
    errorMessage.innerHTML = `<text style="color: red; font-weight: bold">${message}</text><br><br>`;
}
// capture form input for login
document.querySelector('#login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    if(email === '' || password === '') 
    {
        displayMessage("All fields must be filled in!");
        return;
    }

    axios.post('https://thrift-tiles-store-server.onrender.com/api/users/login', {
        email: email,
        password: password
    })
    .then(
        response => {
            errorMessage.innerHTML = `<text style="color: blue; font-weight: bold">${response.data.msg}</text><br><br>`;   
            Cookie.setCookie('thrift-tiles-cookie', response.data.cookie, 1);
            window.location.reload(false);
        }, 
        error => {
            errorMessage.innerHTML = `<text style="color: red; font-weight: bold">${error.response.data.msg}</text><br><br>`;   
        }
    );
});


