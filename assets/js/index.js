// file imports
import Cookie from '../../utils/cookie.js';
import { frontendURL, backendURL } from '../../utils/url.js';

// variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
const ourProducts = document.querySelector("#our-products");
const navigation = document.querySelector(".navigation");
const defaultNavbar = document.querySelector(".nav-no-user");
const secondNavbar = document.querySelector(".nav-with-user");
const logout = document.querySelector("#signout");
const mobileLogout = document.querySelector("#mb-signout");
const yourCartHeading = document.querySelector(".your-cart");
const checkout = document.querySelector(".checkout-cart");

// cart
let cart = [];
// buttons
let buttonsDOM = [];

// smooth scroll down 
function smoothScroll(ourProducts) {
    const targetElement = document.getElementById(ourProducts);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth'
        });
    }
}
document.querySelectorAll('button[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        smoothScroll(targetId);
    });
});

// get logged in user
const getUser = async () => {
    let userCookie = Cookie.checkCookie();
    let user = null;
    let storedCookie = 'cookie';
    let username = null;

    if(userCookie) {
        storedCookie = userCookie.substr(0, userCookie.indexOf('@'));
        username = userCookie.substr(userCookie.indexOf('@')).substring(1);
    }

    // get the user from the backend
    const getUser = await axios.get(`${backendURL}/api/users/cookie/${username}/${storedCookie}`)
    .then(response => {
        user = response.data.data;
      
        // alter navigation if user is logged on (i.e. cookie is in browser)
        if(user != null && user != undefined && user != '') {
            defaultNavbar.style.display = 'none';
            secondNavbar.style.display = 'block';
            yourCartHeading.innerHTML = `Your Cart - user <em>${user.username}</em>`;
        }
    })
    .then(error => {
        console.log(error);
    });
}

// get prouducts
class Products {
    async getProducts() {
        try {
            // get products from backend
            let response = await axios.get(`${backendURL}/api/products`);

            let products = response.data;
            products = products.map(item => {
                const id = item.id;
                const name = item.name;
                const cost = item.cost;
                const image = item.image;
                return {id, name, cost, image};
            });
            return products.sort((a, b) => a.name.localeCompare(b.name));
        }
        catch(error) {
            console.log(error);
        }
    }
}

// display product
class UI {
    displayProducts(products) {
        let result = "";
        products.forEach(product => {
            result += `
                <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product" 
                    class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to cart
                    </button>
                </div>
                <h3>${product.name}</h3>
                <h4>$${product.cost}</h4>
            </article>
            `;
        });
        productsDOM.innerHTML = result;
    }

    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart) {
                button.innerHTML = "In Cart";
                button.disabled = true;
            }
            button.addEventListener("click", event => {
                if(Cookie.checkCookie() == null) {
                    window.location.href = `${frontendURL}/login.html`;
                    return;
                }
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                // get product from products
                let cartItem = { ...Storage.getProduct(id), amount: 1};
                // add product to cart
                cart = [...cart, cartItem];
                // save cart in local storage
                Storage.saveCart(cart);
                // set cart values
                this.setCartValues(cart);
                // display cart item
                this.addCartItem(cartItem);
                // show the cart
                this.showCart();
            });
        });
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.cost * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src=${item.image} alt="product">
            <div>
                <h4>${item.name}</h4>
                <h5>$${item.cost}</h5>
                <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
        `;
        cartContent.appendChild(div);
    }
    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    cartLogic() {
        // clear cart button
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        });
        // cart functionality
        cartContent.addEventListener('click', event => {
            if(event.target.classList.contains('remove-item')) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            }
            else if(event.target.classList.contains("fa-chevron-up")){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if(event.target.classList.contains("fa-chevron-down")){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if(tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        });
    }
    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
    }
    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}
// local storage 
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    // setup app
    ui.setupAPP();
    // get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
        ui.cartLogic();
    });  
});

// remove cookie when user logs out
logout.addEventListener("click", () => {
    Cookie.removeCookie();
    localStorage.removeItem('cart');
});
mobileLogout.addEventListener("click", () => {
    Cookie.removeCookie();
    localStorage.removeItem('cart');
});

// redirect user to checkout page 
checkout.addEventListener("click", () => {
    if(cart.length >= 1) {
        window.location.href = `${frontendURL}/checkout.html`;
    }
    else {
        alert('You must have at least one item in the cart!');
    }
});

getUser();








