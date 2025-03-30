// file imports
import Cookie from '../../utils/cookie.js';

const productsDisplayArea = document.querySelector('.products-center');


let errorMessage = document.createElement("div");
document.querySelector('#create-product').appendChild(errorMessage);
errorMessage.style.textAlign = 'center';

function displayMessage(message) {
    errorMessage.innerHTML = `<text style="color: red; font-weight: bold">${message}</text><br><br>`;
}

document.querySelector('#create-product').addEventListener('submit', function(event) {
    event.preventDefault();

    let name = document.querySelector("#name").value;
    let cost = document.querySelector("#cost").value;
    let amount = document.querySelector('#amount').value;
    let image = document.querySelector('#image').value;

    console.log(name, cost, amount, image);

    if(name === '' || cost === '' || amount === '' || image === '') 
    {
        displayMessage("All fields must be filled in!");
        return;
    }

    let userCookie = Cookie.checkCookie();
    const username = userCookie.substring(userCookie.indexOf('@')).substring(1);
    
    const getUser = axios.get(`https://thrift-tiles-store-server.onrender.com/api/users/name/${username}`)
    .then(response => {
        if(response.data.admin !== true) {
            alert('Unauthorized request! Only administrators can create products!');
            return;
        }
    });

    axios.post('https://thrift-tiles-store-server.onrender.com/api/products/', {
        name: name,
        cost: cost,
        amount: amount,
        image: image
    })
    .then(
        response => {
            errorMessage.innerHTML = `<text style="color: blue; font-weight: bold">${response.data.msg}</text><br><br>`;   
            location.reload();
        }, 
        error => {
            console.log(error)
            errorMessage.innerHTML = `<text style="color: red; font-weight: bold">${error.response.data.msg}</text><br><br>`;   
        }
    );
});

const productList = await axios.get('https://thrift-tiles-store-server.onrender.com/api/products/')
.then(response => {
    let display = "";
    let products = response.data;
    products.forEach(product => {
        display += `
        <article class="product">
            <div class="img-container">
                <img src=${product.image} alt="product" 
                class="product-img">
            </div>
            <h3>${product.name}</h3>
            <h4>$${product.cost}</h4>
            <br>
            <h5 style="color: gray; text-align: center">${product.storage_amount} units</h5>
            <br>
            <h6 class="remove" id=${product.id}>Remove ⓧ</h6>
        </article>`;
    });
    productsDisplayArea.innerHTML = display;
    
    const removeButtons = document.querySelectorAll('.remove');
    removeButtons.forEach(button => {
        button.addEventListener("click", () => {
            // ensure that a site user is logged in before a product is deleted
            if(Cookie.checkCookie() == null || Cookie.checkCookie() == '' || Cookie.checkCookie() == undefined) {
                alert('No user is logged into this site!');
                return;
            }

            let userCookie = Cookie.checkCookie();
            const username = userCookie.substring(userCookie.indexOf('@')).substring(1);
            
            const getUser = axios.get(`https://thrift-tiles-store-server.onrender.com/api/users/name/${username}`)
            .then(response => {
                if(response.data.admin === true) {
                    axios.delete(`https://thrift-tiles-store-server.onrender.com/api/products/${button.id}`);
                }
                else {
                    alert('Unauthorized request! Only administrators can delete products!');
                    return;
                }
            });
        });
    });
    
})
.then(error => {
    console.log(error);
});



