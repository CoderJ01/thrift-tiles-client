// imports
import { backendURL } from "../../utils/url";

// To prevent event handler conflict, this 'submit' event has been placed in its own page
let errorMessage = document.createElement("div");
document.querySelector('#signup-form').appendChild(errorMessage);
errorMessage.id = 1;
errorMessage.style.textAlign = 'center';

function displayMessage(message, password) {
    if(!password) {
        errorMessage.innerHTML = `<text style="color: red; font-weight: bold">${message}</text><br><br>`;
    } 
    else {
        errorMessage.innerHTML = `<div style="text-align: left; margin-left: 10px">${message}</div><br>`;
    } 
}

function outputLine(color, mark, output) {
    return `<text style="color: ${color}; font-weight: bold; text-align: left">${mark} ${output}</text><br>`
}

function validatePassword(password) {
    let regex = [];   
  
    regex['lowercaseLetter'] = /(?=.*[a-z])/;
    regex['uppercaseLetter'] = /(?=.*[A-Z])/;
    regex['digit'] = /(?=.*\d)/;
    regex['special'] = /(?=.*[-+_!@#$%^&*.,?])/;

    let message = [];
    let validColor = 'blue';
    let validMark = '✓'
    let invalidColor = 'red';
    let invalidMark = '✗';

    let valid = true;

    if(password.length >= 8) {
        message['characterLength'] = outputLine(validColor, validMark, 'Password must have at least 8 characters!');
    }
    else {
        message['characterLength'] = outputLine(invalidColor, invalidMark, 'Password must have at least 8 characters!');
        valid = false;
    }

    if(regex.lowercaseLetter.test(password)) {
        message['lowercaseLetter'] = outputLine(validColor, validMark, 'Password must have at least one lowercase letter!');
    }
    else {
        message['lowercaseLetter'] = outputLine(invalidColor, invalidMark, 'Password must have at least one lowercase letter!');
        valid = false;
    }

    if(regex.uppercaseLetter.test(password)) {
        message['uppercaseLetter'] = outputLine(validColor, validMark, 'Password must have at least one uppercase letter!');
    }
    else {
        message['uppercaseLetter'] = outputLine(invalidColor, invalidMark, 'Password must have at least one uppercase letter!');
        valid = false;
    }

    if(regex.digit.test(password)) {
        message['digit'] = outputLine(validColor, validMark, 'Password must have at least one digit!');
    }
    else {
        message['digit'] = outputLine(invalidColor, invalidMark, 'Password must have at least one digit!');
        valid = false;
    }

    if(regex.special.test(password)) {
        message['special'] = outputLine(validColor, validMark, 'Password must have at least one special character!');
    }
    else {
        message['special'] = outputLine(invalidColor, invalidMark, 'Password must have at least one special character!');
        valid = false;
    }

    message = message.characterLength + message.lowercaseLetter + message.uppercaseLetter + message.digit + message.special;

    displayMessage(message, true);

    if(!valid) return false;
    else return true;
}

// capture form input for signup
document.querySelector('#signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
   
    let firstName = document.querySelector("#fname").value;
    let lastName = document.querySelector("#lname").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let repeatPassword = document.querySelector("#rpassword").value;

    if(firstName === '' || lastName === '' || email === '' || password === '') 
    {
        displayMessage("All fields must be filled in!", false);
        return;
    }

    if(!validatePassword(password)) {
        return;
    };

    if(validatePassword(password) && repeatPassword !== password) {
        displayMessage("Passwords must match!", false);
        return;
    }

    axios.post(`${backendURL}/api/users/register`, 
        {
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: password,
        }, 
        {
            withCredentials: true,
            credentials: 'include'
        }
        )
        .then(
            response => {
                errorMessage.innerHTML = `<text style="color: blue; font-weight: bold">${response.data.msg}</text><br><br>`;   
            }, 
            error => {
                errorMessage.innerHTML = `<text style="color: red; font-weight: bold">${error.response.data.msg}</text><br><br>`;   
            }
        );
});