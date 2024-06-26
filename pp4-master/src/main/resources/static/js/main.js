//API CONTEXT
const getProducts = () => {
    return fetch("/api/products")
        .then(response => response.json());
}
const getCurrentOffer = () => {
    return fetch("/api/current-offer")
        .then(response => response.json());
}
const addProductToCart = (productId) => {
    return fetch(`/api/add-to-cart/${productId}`, {
    method: 'POST'
    });
}

const acceptOffer = (acceptOfferRequest) => {
    return fetch("/api/accept-offer", {
        method: 'POST',
        headers:{
            "Content-Type": "application.json"
        },
        body : JSON.stringify(acceptOfferRequest)
    })
        .then(response => response.json());
}


const createHtmlEl = (productData) => {
    const template = `
        <div class="product">
            <h4>${productData.name}</h4>
            <img src="https://picsum.photos/id/237/200/300" />
            <div class="product__price">
                <span>${productData.price}</span>
                <button data-id="${productData.id}">Add to cart +</button>
            </div>
        </div>
    `
    const el = document.createElement("li");
    el.innerHTML = template.trim();

    return el;

}
const refreshCurrentOffer = () => {
    const totalEl = document.querySelector('#offer__total');
    const itemCountEl = document.querySelector('#offer__items-count');

    getCurrentOffer()
        .then(offer => {
            totalEl.textContent = `${offer.total} PLN`;
            itemCountEl.textContent = `${offer.itemsCount}`;
        })
}

const initializeCartHandler = (productHtmlEl) => {
    const addToCartBtn = productHtmlEl.querySelector("button[data-id]");
    addToCartBtn.addEventListener("click", (event)=> {
        const productId = event.target.getAttribute("data-id");
        addProductToCart(productId)
            .then(refreshCurrentOffer());
    });

    return productHtmlEl;
}

const checkoutFormEl = document.querySelector('#checkout');
checkoutFormEl.addEventListener("submit", (event)=> {
    event.preventDefault();

    const acceptOfferRequest = {
        firstName: checkoutFormEl.querySelector('input[name="first_name"]').value,
        lastName:  checkoutFormEl.querySelector('input[name="last_name"]').value,
        email:  checkoutFormEl.querySelector('input[name="email"]').value,
    }
    acceptOffer(acceptOfferRequest)
        then(resDetails => window.location.href = resDetails.paymentUrl);
});

//(() => {
//    const productList = document.querySelector("#productList");

document.addEventListener("DOMContentLoader", () => {
    console.log("it works");
    const productList = document.querySelector("#productList");
    getProducts()
        .then(productsAsJson => productsAsJson.map(createHtmlEl))
        .then(productsAsHtml => productHtmlEl.map(initializeCartHandler))
        .then(productsAsHtml => {
            productsAsHtml.forEach(productEl => productList.appendChild(productEl))
        });

});
