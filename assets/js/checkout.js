// file imports
import Cookie from '../../utils/cookie.js';

const checkoutItems = document.querySelector(".checkout-items");
const itemsInCart = localStorage.getItem("cartItems");
const purchase = document.querySelector("#purchase-items");

let result = "";
let total = 0;
JSON.parse(itemsInCart).forEach(item => {
    result +=
    `<div class="cart-item checkout-item">
        <img src=${item.image} alt="product">
        <div>
            <h4 style="font-weight: bold">${item.name}</h4>
            <h5>$${item.cost}</h5>
        </div>
    </div>
    `;
    total += item.cost;
});
const div = document.createElement("div");
div.innerHTML = result + `<div class="checkout-total">Total: $${total}</div>`;
checkoutItems.appendChild(div);

purchase.addEventListener("click", event => {
    if(Cookie.checkCookie() == null || Cookie.checkCookie == undefined || Cookie.checkCookie == '') {
        alert('No user is logged on!');
        return;
    }
    event.preventDefault();
    axios.post('https://thrift-tiles-store-server.onrender.com/api/payment/purchase', {
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


