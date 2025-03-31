// file imports
import Cookie from '../../utils/cookie.js';
import { frontendURL, backendURL } from '../../utils/url.js';

const checkoutItems = document.querySelector(".checkout-items");
const itemsInCart = localStorage.getItem("cart");
const purchase = document.querySelector("#purchase-items");

let result = "";
let total = 0;
JSON.parse(itemsInCart).forEach(item => {
    console.log(item);
    result +=
    `<div class="cart-item checkout-item">
        <img src=${item.image} alt="product">
        <div>
            <h4 style="font-weight: bold">${item.name}</h4>
            <h5>$${item.cost}</h5>
            <h6>Amount: ${item.amount}</h6>
        </div>
    </div>
    `;
    total += item.cost;
});
const div = document.createElement("div");
div.innerHTML = result + `<div class="checkout-total">Total: $${total}</div>`;
checkoutItems.appendChild(div);

purchase.addEventListener("click", event => {
    event.preventDefault();

    // prevent purchase if no user is logged
    if(Cookie.checkCookie() == null || Cookie.checkCookie == undefined || Cookie.checkCookie == '') {
        alert('No user is logged on! You will be redirected to the login page!');
        window.location.href = `${frontendURL}/login.html`;
        return;
    }

    // prevent purchase if no items are in cart
    if(total === 0) {
        alert('You have no items in the cart! You will be redirected to the homepage!');
        window.location.href = `${frontendURL}/index.html`;
        return;
    }

    axios.post(`${backendURL}/api/purchase-items/checkout`, {
        items: JSON.parse(itemsInCart),
        total: total
    })
    .then(response => {
        console.log(response);
    })
    .then(error => {
        console.log(error);
    })
});


