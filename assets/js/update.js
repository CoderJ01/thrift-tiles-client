// file imports
import Cookie from '../../utils/cookie.js';

// To prevent event handler conflict, this 'submit' event has been placed in its own page
let errorMessage = document.createElement("div");
document.querySelector('#update-form').appendChild(errorMessage);
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
document.querySelector('#update-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // prohibit update if user is not logged in
    if(Cookie.checkCookie() == null || Cookie.checkCookie == undefined || Cookie.checkCookie() == '') {
        alert('No user is logged in!');
        return;
    }
   
    let email = document.querySelector("#email").value;
    let oldPassword = document.querySelector("#password").value;
    let newPassword = document.querySelector("#npassword").value;
    const userCookie = Cookie.checkCookie();
    const username = userCookie.substring(userCookie.indexOf('@')).substring(1);
    
    if(email === '' && oldPassword === '' && newPassword === '') 
    {
        displayMessage('Please fill in at least one field', false);
        return;
    }

    if((oldPassword !== '' && newPassword === '') || (oldPassword === '' && newPassword !== '')) {
        displayMessage('Please fill in both your current password and your new password!', false);
        return;
    }

    if((oldPassword !== '' && newPassword !== '')) {
        if(!validatePassword(newPassword)) {
            return;
        };
    }

    const getUser = axios.get(`https://thrift-tiles-store-server.onrender.com/api/users/name/${username}`)
    .then(user => {
        axios.put(`https://thrift-tiles-store-server.onrender.com/api/users/update/${user.data.username}`, 
        {
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        })
        .then(
            change => {
                errorMessage.innerHTML = `<text style="color: blue; font-weight: bold">${change.data.msg}</text><br><br>`;   
            }, 
            error => {
                errorMessage.innerHTML = `<text style="color: red; font-weight: bold">${error.response.data.msg}</text><br><br>`;   
            }
        );
    });
});