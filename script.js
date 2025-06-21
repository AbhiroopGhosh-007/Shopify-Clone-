        // Product data with actual images
        const products = [
            {
                id: 1,
                title: "Premium Headphones",
                description: "High-quality headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
                price: 129.99,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500"
            },
            {
                id: 2,
                title: "Smart Watch Series 5",
                description: "The latest smartwatch with heart rate monitoring, GPS tracking, and long battery life. Stay connected wherever you go.",
                price: 199.99,
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500"
            },
            {
                id: 3,
                title: "Wireless Earbuds",
                description: "True wireless earbuds with crystal clear sound and comfortable fit. Perfect for workouts and daily commutes.",
                price: 89.99,
                image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=500"
            },
            {
                id: 4,
                title: "Bluetooth Speaker",
                description: "Portable Bluetooth speaker with 360° sound and waterproof design. Take your music anywhere with you.",
                price: 79.99,
                image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500"
            },
            {
                id: 5,
                title: "Tablet Pro",
                description: "Powerful tablet with high-resolution display and long battery life. Perfect for work and entertainment.",
                price: 349.99,
                image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=500"
            },
            {
                id: 6,
                title: "Gaming Mouse",
                description: "Ergonomic gaming mouse with customizable RGB lighting and high-precision sensor. Level up your gaming experience.",
                price: 59.99,
                image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500"
            }
        ];

        // DOM Elements
        const productGrid = document.getElementById('productGrid');
        const cartIcon = document.getElementById('cartIcon');
        const cartCount = document.getElementById('cartCount');
        const cartModal = document.getElementById('cartModal');
        const closeCart = document.getElementById('closeCart');
        const cartItems = document.getElementById('cartItems');
        const subtotal = document.getElementById('subtotal');
        const total = document.getElementById('total');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const overlay = document.getElementById('overlay');

        // Cart state
        let cart = [];

        // Initialize the app
        function init() {
            renderProducts();
            loadCart();
            setupEventListeners();
        }

        // Render products to the page
        function renderProducts() {
            // Show loading state
            productGrid.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
            
            // Simulate API delay
            setTimeout(() => {
                productGrid.innerHTML = '';
                
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.innerHTML = `
                        <img class="product-image" src="${product.image}" alt="${product.title}">
                        <div class="product-info">
                            <h3 class="product-title">${product.title}</h3>
                            <p class="product-price">$${product.price.toFixed(2)}</p>
                            <p class="product-description">${product.description}</p>
                            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                        </div>
                    `;
                    productGrid.appendChild(productCard);
                });
                
                // Add event listeners to add to cart buttons
                document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = parseInt(e.target.getAttribute('data-id'));
                        addToCart(productId);
                    });
                });
            }, 800);
        }

        // Add item to cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            updateCart();
            showCartNotification();
        }

        // Update cart display
        function updateCart() {
            // Update cart count
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart modal
            renderCartItems();
        }

        // Render cart items
        function renderCartItems() {
            if (cart.length === 0) {
                cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
                subtotal.textContent = '$0.00';
                total.textContent = '$0.00';
                return;
            }
            
            cartItems.innerHTML = '';
            
            let cartTotal = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                cartTotal += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img class="cart-item-image" src="${item.image}" alt="${item.title}">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.title}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="cart-item-actions">
                            <button class="quantity-btn decrease" data-id="${item.id}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn increase" data-id="${item.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="remove-btn" data-id="${item.id}">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
            
            // Update totals
            subtotal.textContent = `$${cartTotal.toFixed(2)}`;
            total.textContent = `$${cartTotal.toFixed(2)}`;
            
            // Add event listeners to cart item buttons
            document.querySelectorAll('.decrease').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = parseInt(e.target.closest('.quantity-btn').getAttribute('data-id'));
                    updateQuantity(id, -1);
                });
            });
            
            document.querySelectorAll('.increase').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = parseInt(e.target.closest('.quantity-btn').getAttribute('data-id'));
                    updateQuantity(id, 1);
                });
            });
            
            document.querySelectorAll('.remove-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = parseInt(e.target.closest('.remove-btn').getAttribute('data-id'));
                    removeFromCart(id);
                });
            });
        }

        // Update item quantity
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (!item) return;
            
            item.quantity += change;
            
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
            
            updateCart();
        }

        // Remove item from cart
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCart();
        }

        // Load cart from localStorage
        function loadCart() {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
                updateCart();
            }
        }

        // Show cart notification
        function showCartNotification() {
            cartCount.classList.add('pulse');
            setTimeout(() => {
                cartCount.classList.remove('pulse');
            }, 300);
        }

        // Setup event listeners
        function setupEventListeners() {
            // Toggle cart modal
            cartIcon.addEventListener('click', () => {
                cartModal.classList.add('open');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
            
            closeCart.addEventListener('click', closeCartModal);
            overlay.addEventListener('click', closeCartModal);
            
            // Checkout button
            checkoutBtn.addEventListener('click', () => {
                if (cart.length === 0) return;
                
                // In a real app, this would redirect to Shopify checkout
                alert('Congratulations,your order have been placed.');
                cart = [];
                updateCart();
                closeCartModal();
            });
        }

        // Close cart modal
        function closeCartModal() {
            cartModal.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Initialize the app
        init();