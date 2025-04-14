console.log("S.I FARMACIA E-commerce Initialized");

// --- DOM Elements ---
const productGrid = document.getElementById('product-grid');
const cartLink = document.querySelector('.cart-link');
const cartCountElement = document.querySelector('.cart-count');
const cartSidebar = document.getElementById('shopping-cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');

// --- Placeholder Product Data ---
const products = [
    { id: 'p1', name: 'Paracetamol 500mg', price: 2.50, image: null },
    { id: 'p2', name: 'Ibuprofeno 400mg', price: 3.10, image: null },
    { id: 'p3', name: 'Vitamina C Efervescente', price: 5.80, image: null },
    { id: 'p4', name: 'Jarabe para la Tos', price: 7.20, image: null },
    { id: 'p5', name: 'Crema Hidratante', price: 12.00, image: null },
    { id: 'p6', name: 'Protector Solar SPF50+', price: 15.50, image: null },
    { id: 'p7', name: 'Tiritas Variadas', price: 1.90, image: null },
    { id: 'p8', name: 'Solución Salina', price: 4.00, image: null },
];

// --- Shopping Cart State ---
let cart = []; // Array of { product, quantity }

// --- Functions ---

// Generate a simple placeholder SVG
function createPlaceholderSvg() {
    return `
        <svg class="placeholder-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="80" height="80" fill="#e0e0e0" rx="5" ry="5"/>
            <path d="M30 70 L50 30 L70 70" stroke="#a0a0a0" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="50" cy="20" r="5" fill="#a0a0a0"/>
        </svg>
    `;
}


// Render products on the page
function renderProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = ''; // Clear existing products
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
            ${product.image ? `<img src="${product.image}" alt="${product.name}">` : createPlaceholderSvg()}
            <h3>${product.name}</h3>
            <p class="price">€${product.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-product-id="${product.id}">Añadir al Carrito</button>
        `;
        productGrid.appendChild(productElement);
    });
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingCartItem = cart.find(item => item.product.id === productId);

    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        cart.push({ product: product, quantity: 1 });
    }

    console.log('Cart updated:', cart);
    updateCartUI();
    // Briefly show cart when item is added
    openCart();
    setTimeout(closeCart, 1500); // Auto-close after 1.5 seconds
}

// Update quantity in cart
function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item.product.id === productId);
    if (!cartItem) return;

    cartItem.quantity += change;

    if (cartItem.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
    }
}


// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    updateCartUI();
}

// Update the cart UI (count, sidebar content, total)
function updateCartUI() {
    // Update cart count bubble
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Update cart sidebar content
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-product-id="${item.product.id}">
                 ${item.product.image ? `<img src="${item.product.image}" alt="${item.product.name}">` : createPlaceholderSvg()}
                <div class="cart-item-details">
                    <h4>${item.product.name}</h4>
                    <p>€${item.product.price.toFixed(2)}</p>
                     <div class="cart-item-quantity">
                        <button class="quantity-change" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-change" data-change="1">+</button>
                    </div>
                </div>
                <button class="remove-item-btn"><i class="fas fa-trash-alt"></i></button>
            </div>
        `).join('');
    }

    // Update cart total
    const totalCost = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    cartTotalElement.textContent = `€${totalCost.toFixed(2)}`;

    // Add event listeners for new buttons inside the cart
    addCartItemEventListeners();
}


// Add event listeners for buttons within cart items (remove, quantity change)
function addCartItemEventListeners() {
    const removeButtons = cartItemsContainer.querySelectorAll('.remove-item-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const cartItemElement = event.target.closest('.cart-item');
            const productId = cartItemElement.dataset.productId;
            removeFromCart(productId);
        });
    });

    const quantityButtons = cartItemsContainer.querySelectorAll('.quantity-change');
    quantityButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const cartItemElement = event.target.closest('.cart-item');
            const productId = cartItemElement.dataset.productId;
            const change = parseInt(event.target.dataset.change, 10);
            updateQuantity(productId, change);
        });
    });

}

// Open the shopping cart sidebar
function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
}

// Close the shopping cart sidebar
function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
}

// --- Event Listeners ---

// Add to cart buttons (event delegation)
productGrid.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart-btn')) {
        const productId = event.target.dataset.productId;
        addToCart(productId);
    }
});

// Cart icon click
cartLink.addEventListener('click', (event) => {
    event.preventDefault();
    openCart();
});

// Close cart button
closeCartBtn.addEventListener('click', closeCart);

// Overlay click
cartOverlay.addEventListener('click', closeCart);

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI(); // Initial update in case cart is loaded from storage later
});