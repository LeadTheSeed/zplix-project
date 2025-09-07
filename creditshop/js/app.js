// CreditShop Application
// Main JavaScript file for functionality

// Global variables
let currentUser = null;
let products = [];
let cart = [];

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadPage('home');
});

// Initialize application data
function initializeApp() {
    loadUserData();
    initializeProducts();
    updateCartDisplay();
    
    // If user is logged in, update UI
    if (currentUser) {
        updateUserInterface();
    }
}

// Load user data from localStorage
function loadUserData() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('register-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'inline-block';
        updateCreditDisplay();
    }
}

// Update credit display in header
function updateCreditDisplay() {
    if (currentUser) {
        document.getElementById('credit-display').textContent = `Credit: $${currentUser.credit.toFixed(2)}`;
    }
}

// Initialize product data
function initializeProducts() {
    // Check if products exist in localStorage
    const storedProducts = localStorage.getItem('products');
    
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        // Create demo products
        products = [
            {
                id: 1,
                name: 'Wireless Earbuds',
                price: 49.99,
                category: 'electronics',
                image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
                description: 'High-quality wireless earbuds with noise cancellation and long battery life.'
            },
            {
                id: 2,
                name: 'Smart Watch',
                price: 129.99,
                category: 'electronics',
                image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
                description: 'Track your fitness, receive notifications, and more with this sleek smart watch.'
            },
            {
                id: 3,
                name: 'Laptop Backpack',
                price: 39.99,
                category: 'clothing',
                image: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=400',
                description: 'Durable and comfortable backpack with dedicated laptop compartment and multiple pockets.'
            },
            {
                id: 4,
                name: 'Stainless Steel Water Bottle',
                price: 24.99,
                category: 'home',
                image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
                description: 'Keep your drinks hot or cold for hours with this premium insulated water bottle.'
            },
            {
                id: 5,
                name: 'Wireless Charging Pad',
                price: 29.99,
                category: 'electronics',
                image: 'https://images.unsplash.com/photo-1608479339946-43e14d609104?w=400',
                description: 'Charge your compatible devices without the hassle of cables.'
            },
            {
                id: 6,
                name: 'Cotton T-Shirt',
                price: 19.99,
                category: 'clothing',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
                description: 'Soft and comfortable cotton t-shirt perfect for everyday wear.'
            }
        ];
        
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    // Load products into shop page
    displayProducts(products);
}

// Display products on shop page
function displayProducts(productsToDisplay) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-card-actions">
                    <button class="btn btn-small view-product" data-id="${product.id}">View Details</button>
                    <button class="btn btn-small btn-outline add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
        
        // Add event listeners for product actions
        productCard.querySelector('.view-product').addEventListener('click', () => {
            openProductModal(product);
        });
        
        productCard.querySelector('.add-to-cart').addEventListener('click', () => {
            addToCart(product.id, 1);
        });
    });
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage(e.target.getAttribute('data-page'));
        });
    });
    
    // Auth buttons
    document.getElementById('login-btn').addEventListener('click', () => {
        loadPage('account');
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
    });
    
    document.getElementById('register-btn').addEventListener('click', () => {
        loadPage('account');
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    });
    
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Form switching
    document.getElementById('switch-to-register').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    });
    
    document.getElementById('switch-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
    });
    
    // Form submissions
    document.getElementById('login-form-element').addEventListener('submit', handleLogin);
    document.getElementById('register-form-element').addEventListener('submit', handleRegistration);
    
    // Account page
    document.getElementById('topup-btn').addEventListener('click', openTopUpModal);
    
    // Top-up form
    document.getElementById('topup-form').addEventListener('submit', handleTopUp);
    
    // Product filters
    document.getElementById('category-filter').addEventListener('change', filterProducts);
    document.getElementById('sort-filter').addEventListener('change', filterProducts);
    
    // Cart and checkout
    document.getElementById('checkout-btn').addEventListener('click', openCheckoutModal);
    
    // Modal controls
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
    
    // Product modal controls
    document.getElementById('decrease-quantity').addEventListener('click', () => {
        const quantityInput = document.getElementById('product-quantity');
        if (parseInt(quantityInput.value) > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });
    
    document.getElementById('increase-quantity').addEventListener('click', () => {
        const quantityInput = document.getElementById('product-quantity');
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    
    document.getElementById('add-to-cart-modal').addEventListener('click', () => {
        const productId = parseInt(document.getElementById('add-to-cart-modal').getAttribute('data-id'));
        const quantity = parseInt(document.getElementById('product-quantity').value);
        addToCart(productId, quantity);
        closeAllModals();
    });
    
    // Complete purchase button
    document.getElementById('complete-purchase-btn').addEventListener('click', completePurchase);
}

// Page navigation
function loadPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the requested page
    document.getElementById(`${pageName}-page`).classList.add('active');
    
    // Special handling for certain pages
    if (pageName === 'account') {
        handleAccountPage();
    } else if (pageName === 'shop') {
        filterProducts();
    }
}

// Handle account page display based on login status
function handleAccountPage() {
    if (currentUser) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('account-overview').style.display = 'block';
        
        // Update account information
        document.getElementById('account-balance').textContent = currentUser.credit.toFixed(2);
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-email').textContent = currentUser.email;
        
        // Load order history
        loadOrderHistory();
    } else {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('account-overview').style.display = 'none';
    }
}

// Load user's order history
function loadOrderHistory() {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';
    
    if (currentUser.orders && currentUser.orders.length > 0) {
        currentUser.orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
                <td>${order.items.length}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>Complete</td>
            `;
            ordersList.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" class="no-orders">No order history</td>';
        ordersList.appendChild(row);
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // In a real app, this would be an API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Remove password from user object for security
        const { password, ...userWithoutPassword } = user;
        currentUser = userWithoutPassword;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('register-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'inline-block';
        updateCreditDisplay();
        
        handleAccountPage();
    } else {
        alert('Invalid email or password');
    }
}

// Handle registration form submission
function handleRegistration(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // In a real app, this would be an API call
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email is already registered
    if (users.some(u => u.email === email)) {
        alert('Email is already registered');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        credit: 0,
        orders: []
    };
    
    // Add to users list
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log user in
    const { password: pw, ...userWithoutPassword } = newUser;
    currentUser = userWithoutPassword;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    document.getElementById('login-btn').style.display = 'none';
    document.getElementById('register-btn').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'inline-block';
    updateCreditDisplay();
    
    handleAccountPage();
}

// Logout user
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Update UI
    document.getElementById('login-btn').style.display = 'inline-block';
    document.getElementById('register-btn').style.display = 'inline-block';
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('credit-display').textContent = 'Credit: $0.00';
    
    loadPage('home');
}

// Filter products based on category and sort options
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;
    
    let filteredProducts = [...products];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }
    
    // Apply sort filter
    if (sortFilter === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortFilter === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortFilter === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Display filtered products
    displayProducts(filteredProducts);
}

// Cart functions

// Add item to cart
function addToCart(productId, quantity) {
    // Get cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Find product
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            name: product.name,
            price: product.price,
            quantity
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
    
    // Show confirmation
    alert(`${quantity} ${product.name} added to your cart`);
}

// Update cart display (count and items if on cart page)
function updateCartDisplay() {
    // Get cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Update cart count
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
    
    // If on cart page, update items
    if (document.getElementById('cart-page').classList.contains('active')) {
        displayCartItems();
    }
}

// Display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        document.getElementById('cart-summary').style.display = 'none';
        return;
    }
    
    document.getElementById('cart-summary').style.display = 'block';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        // Find product for image
        const product = products.find(p => p.id === item.productId);
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${product.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="decrease-cart-qty" data-id="${item.productId}">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="cart-item-qty" data-id="${item.productId}">
                        <button class="increase-cart-qty" data-id="${item.productId}">+</button>
                    </div>
                    <div class="remove-item" data-id="${item.productId}">Remove</div>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners to cart items
    document.querySelectorAll('.decrease-cart-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(id, -1);
        });
    });
    
    document.querySelectorAll('.increase-cart-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(id, 1);
        });
    });
    
    document.querySelectorAll('.cart-item-qty').forEach(input => {
        input.addEventListener('change', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const quantity = parseInt(this.value);
            setCartItemQuantity(id, quantity);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
    
    // Update summary
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;
    
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

// Update cart item quantity
function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            setCartItemQuantity(productId, newQuantity);
        }
    }
}

// Set cart item to specific quantity
function setCartItemQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Modal functions

// Open product modal
function openProductModal(product) {
    document.getElementById('modal-product-title').textContent = product.name;
    document.getElementById('modal-product-price').textContent = product.price.toFixed(2);
    document.getElementById('modal-product-description').textContent = product.description;
    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('product-quantity').value = 1;
    document.getElementById('add-to-cart-modal').setAttribute('data-id', product.id);
    
    openModal('product-modal');
}

// Open top-up modal
function openTopUpModal() {
    if (!currentUser) {
        alert('Please login to add credit');
        loadPage('account');
        return;
    }
    
    openModal('topup-modal');
}

// Open checkout modal
function openCheckoutModal() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    if (!currentUser) {
        alert('Please login to checkout');
        loadPage('account');
        return;
    }
    
    // Calculate total
    let total = 0;
    const checkoutItems = document.getElementById('checkout-items-summary');
    checkoutItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        
        checkoutItems.appendChild(checkoutItem);
    });
    
    // Add tax
    const tax = total * 0.05; // 5% tax
    const taxItem = document.createElement('div');
    taxItem.className = 'checkout-item';
    taxItem.innerHTML = `
        <span>Tax (5%)</span>
        <span>$${tax.toFixed(2)}</span>
    `;
    checkoutItems.appendChild(taxItem);
    
    total += tax;
    
    // Update total and balance display
    document.getElementById('checkout-total-amount').textContent = `$${total.toFixed(2)}`;
    document.getElementById('checkout-account-balance').textContent = `$${currentUser.credit.toFixed(2)}`;
    
    // Check if user has enough credit
    const hasEnoughFunds = currentUser.credit >= total;
    document.getElementById('insufficient-funds-warning').style.display = hasEnoughFunds ? 'none' : 'block';
    document.getElementById('complete-purchase-btn').disabled = !hasEnoughFunds;
    
    openModal('checkout-modal');
}

// Open a modal
function openModal(modalId) {
    document.getElementById('modal-overlay').style.display = 'flex';
    document.getElementById(modalId).style.display = 'block';
}

// Close all modals
function closeAllModals() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Handle top-up form submission
function handleTopUp(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('topup-amount').value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    // In a real app, this would connect to a payment processor
    addCreditToAccount(amount);
    
    closeAllModals();
}

// Add credit to user account
function addCreditToAccount(amount) {
    if (!currentUser) return;
    
    // Update user's credit
    currentUser.credit += amount;
    
    // Update in localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].credit = currentUser.credit;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update UI
    updateCreditDisplay();
    if (document.getElementById('account-page').classList.contains('active')) {
        document.getElementById('account-balance').textContent = currentUser.credit.toFixed(2);
    }
    
    alert(`$${amount.toFixed(2)} has been added to your account`);
}

// Complete purchase process
function completePurchase() {
    if (!currentUser) return;
    
    // Calculate total
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    
    // Add tax
    total += total * 0.05; // 5% tax
    
    // Check if user has enough credit
    if (currentUser.credit < total) {
        alert('Insufficient funds');
        return;
    }
    
    // Create order
    const order = {
        id: 'ORD' + Date.now().toString().slice(-6),
        date: Date.now(),
        items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: total
    };
    
    // Deduct credit from account
    currentUser.credit -= total;
    
    // Add order to user's orders
    if (!currentUser.orders) currentUser.orders = [];
    currentUser.orders.unshift(order);
    
    // Update in localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].credit = currentUser.credit;
        users[userIndex].orders = currentUser.orders;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show order confirmation
    document.getElementById('order-number').textContent = order.id;
    document.getElementById('order-total').textContent = `$${order.total.toFixed(2)}`;
    document.getElementById('new-balance').textContent = `$${currentUser.credit.toFixed(2)}`;
    
    closeAllModals();
    openModal('order-confirmation-modal');
    updateCreditDisplay();
    updateCartDisplay();
}
