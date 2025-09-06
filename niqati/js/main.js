// Main JavaScript for Niqati Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const cart = [];
    let currentLanguage = 'ar';
    
    // Elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const pointsSliders = document.querySelectorAll('.points-slider');
    const pointsInputs = document.querySelectorAll('.points-input');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const expandCardBtns = document.querySelectorAll('.expand-card');
    const collapseCardBtns = document.querySelectorAll('.collapse-card');
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cartModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const clearCartBtn = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('checkout');
    const checkoutModal = document.getElementById('checkoutModal');
    const langSwitcher = document.getElementById('langSwitcher');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Exchange rate (JOD to USD)
    const JOD_TO_USD_RATE = 0.71;

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }
    
    // Expand card functionality
    if (expandCardBtns.length > 0) {
        expandCardBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Close any other expanded cards
                document.querySelectorAll('.product-card.expanded').forEach(card => {
                    if (card !== this.closest('.product-card')) {
                        card.classList.remove('expanded');
                        card.querySelector('.product-controls').style.display = 'none';
                        card.querySelector('.expand-card').style.display = 'block';
                    }
                });
                
                // Expand this card
                const card = this.closest('.product-card');
                card.classList.add('expanded');
                this.style.display = 'none';
                card.querySelector('.product-controls').style.display = 'block';
            });
        });
    }
    
    // Collapse card functionality
    if (collapseCardBtns.length > 0) {
        collapseCardBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.product-card');
                card.classList.remove('expanded');
                card.querySelector('.product-controls').style.display = 'none';
                card.querySelector('.expand-card').style.display = 'block';
            });
        });
    }

    // Product filtering
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Filter products
                productCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else {
                        if (card.getAttribute('data-category') === filter) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }

    // Points sliders and inputs synchronization
    if (pointsSliders.length > 0) {
        pointsSliders.forEach((slider, index) => {
            const input = pointsInputs[index];
            const priceElement = slider.closest('.product-controls').querySelector('.total-price');
            const pricePerUnit = parseFloat(slider.closest('.product-info').querySelector('.price-per-unit').textContent.match(/\$([0-9.]+)/)[1]);
            
            // Update input value when slider changes
            slider.addEventListener('input', function() {
                input.value = this.value;
                updateTotalPrice(this.value, pricePerUnit, priceElement);
            });
            
            // Update slider value when input changes
            input.addEventListener('input', function() {
                if (this.value < parseInt(slider.min)) {
                    this.value = slider.min;
                } else if (this.value > parseInt(slider.max)) {
                    this.value = slider.max;
                }
                slider.value = this.value;
                updateTotalPrice(this.value, pricePerUnit, priceElement);
            });
            
            // Initial price calculation
            updateTotalPrice(slider.value, pricePerUnit, priceElement);
        });
    }
    
    // Calculate total price
    function updateTotalPrice(quantity, pricePerUnit, priceElement) {
        const total = (quantity * pricePerUnit).toFixed(2);
        priceElement.textContent = `$${total}`;
    }

    // Add to cart functionality
    if (addToCartBtns.length > 0) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productQuantity = parseInt(productCard.querySelector('.points-input').value);
                const pricePerUnit = parseFloat(productCard.querySelector('.price-per-unit').textContent.match(/\$([0-9.]+)/)[1]);
                const totalPrice = parseFloat(productCard.querySelector('.total-price').textContent.match(/\$([0-9.]+)/)[1]);
                const productImage = productCard.querySelector('.product-image img').getAttribute('src');
                const productCategory = productCard.getAttribute('data-category');
                
                // Check if product is already in cart
                const existingProduct = cart.find(item => item.name === productName);
                
                if (existingProduct) {
                    // Update quantity and price
                    existingProduct.quantity += productQuantity;
                    existingProduct.price += totalPrice;
                } else {
                    // Add new product to cart
                    cart.push({
                        name: productName,
                        quantity: productQuantity,
                        pricePerUnit: pricePerUnit,
                        price: totalPrice,
                        image: productImage,
                        category: productCategory
                    });
                }
                
                // Update cart count
                updateCartCount();
                
                // Show feedback to user
                showToast(`تمت إضافة ${productName} إلى السلة`);
            });
        });
    }

    // Update cart count
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + 1, 0);
        cartCount.textContent = count;
    }

    // Show toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Open cart modal
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            updateCartModal();
            cartModal.style.display = 'block';
        });
    }

    // Close modals
    if (closeModalBtns.length > 0) {
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                modal.style.display = 'none';
            });
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Update cart modal
    function updateCartModal() {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = `<p class="empty-cart">${currentLanguage === 'ar' ? 'سلة المشتريات فارغة' : 'Your cart is empty'}</p>`;
            cartTotal.textContent = '$0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-details">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-name">
                        <h4>${item.name}</h4>
                        <p>${item.quantity} ${getUnitName(item.category)}</p>
                    </div>
                </div>
                <div class="cart-item-price">
                    $${item.price.toFixed(2)}
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners for remove buttons
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCartCount();
                updateCartModal();
            });
        });
    }

    // Get unit name based on category
    function getUnitName(category) {
        switch(category) {
            case 'gaming':
                return currentLanguage === 'ar' ? 'نقطة' : 'points';
            case 'social':
                return currentLanguage === 'ar' ? 'عملة' : 'coins';
            case 'shopping':
                return currentLanguage === 'ar' ? 'دولار' : 'dollars';
            default:
                return '';
        }
    }

    // Clear cart
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            cart.length = 0;
            updateCartCount();
            updateCartModal();
        });
    }

    // Checkout functionality
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                return;
            }
            
            cartModal.style.display = 'none';
            
            // Update checkout modal with cart items
            const checkoutItems = document.getElementById('checkoutItems');
            checkoutItems.innerHTML = '';
            
            let subtotal = 0;
            
            cart.forEach(item => {
                subtotal += item.price;
                
                const checkoutItem = document.createElement('div');
                checkoutItem.className = 'checkout-item';
                checkoutItem.innerHTML = `
                    <span>${item.name} (${item.quantity} ${getUnitName(item.category)})</span>
                    <span>$${item.price.toFixed(2)}</span>
                `;
                
                checkoutItems.appendChild(checkoutItem);
            });
            
            // Calculate fee and total
            const fee = subtotal * 0.01;
            const total = subtotal + fee;
            const jordanianTotal = total / JOD_TO_USD_RATE;
            
            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('paymentFee').textContent = `$${fee.toFixed(2)}`;
            document.getElementById('finalTotal').textContent = `$${total.toFixed(2)}`;
            document.getElementById('jordanianTotal').textContent = `${jordanianTotal.toFixed(2)} دينار`;
            
            // Generate ticket number
            const ticketNumber = generateTicketNumber();
            document.getElementById('ticketNumber').textContent = ticketNumber;
            
            // Set amount to pay in JOD
            document.getElementById('amountToPay').textContent = jordanianTotal.toFixed(2);
            
            // Show checkout modal
            checkoutModal.style.display = 'block';
            
            // Start payment timer with current timestamp for synchronization
            const currentOrderTimestamp = Date.now();
            initPaymentTimer(currentOrderTimestamp);
            
            // Store timestamp for later use
            sessionStorage.setItem('currentOrderTimestamp', currentOrderTimestamp);
        });
    }

    // Generate ticket number
    function generateTicketNumber() {
        const prefix = 'TK';
        const timestamp = new Date().getTime().toString().slice(-5);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${prefix}${timestamp}${random}`;
    }

    // Initialize payment timer with synchronization
    function initPaymentTimer(orderTimestamp) {
        const timerElement = document.getElementById('paymentTimer');
        const paymentStatus = document.querySelector('.payment-status');
        
        if (!timerElement) return;
        
        // Use the provided timestamp or current time
        const startTime = orderTimestamp || Date.now();
        const totalDuration = 60 * 60 * 1000; // 60 minutes in milliseconds
        const endTime = startTime + totalDuration;
        
        const timerInterval = setInterval(() => {
            const now = Date.now();
            const timeLeft = endTime - now;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerElement.textContent = '00:00';
                timerElement.style.color = '#fd397a';
                
                // Show expired message
                if (paymentStatus) {
                    paymentStatus.style.display = 'block';
                    paymentStatus.innerHTML = `
                        <div class="status-message error">
                            <i class="fas fa-times-circle"></i>
                            <p>انتهت مدة الدفع. يرجى إعادة المحاولة.</p>
                        </div>
                    `;
                }
                return;
            }
            
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
        
        return timerInterval;
    }

    // Language switcher
    if (langSwitcher) {
        langSwitcher.addEventListener('click', function(e) {
            e.preventDefault();
            currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
            
            if (currentLanguage === 'ar') {
                document.documentElement.setAttribute('lang', 'ar');
                document.documentElement.setAttribute('dir', 'rtl');
                this.textContent = 'English';
            } else {
                document.documentElement.setAttribute('lang', 'en');
                document.documentElement.setAttribute('dir', 'ltr');
                this.textContent = 'العربية';
            }
            
            // In a real app, this would trigger a language change
            // For this demo, we'll just show a message
            showToast(currentLanguage === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English');
        });
    }
    
    // Payment confirmation
    const confirmPaymentBtn = document.getElementById('confirmPayment');
    const cancelPaymentBtn = document.getElementById('cancelPayment');
    const paymentStatus = document.querySelector('.payment-status');
    
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', function() {
            // Get ticket number
            const ticketNumber = document.getElementById('ticketNumber').textContent;
            
            // Show payment verification in progress
            paymentStatus.style.display = 'block';
            
            // Clear any existing tickets with the same number to avoid duplicates
            let existingTickets = JSON.parse(localStorage.getItem('pendingTickets')) || [];
            existingTickets = existingTickets.filter(t => t.ticketNumber !== ticketNumber);
            localStorage.setItem('pendingTickets', JSON.stringify(existingTickets));
            
            // Simulate sending ticket to payment gateway
            simulateTicketSubmission(ticketNumber);
            
            console.log('Payment confirmation sent for ticket:', ticketNumber);
            
            // Show waiting message
            paymentStatus.innerHTML = `
                <div class="status-message pending">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>تم إرسال طلبك إلى بوابة الدفع</p>
                    <div class="verification-message">
                        <p>سيتم التحقق من الدفع وإرسال كود التفعيل قريباً</p>
                        <p class="ticket-info">رقم التذكرة: <strong>${ticketNumber}</strong></p>
                        <p class="note">يمكنك متابعة حالة طلبك من خلال صفحة التحقق</p>
                        <button class="btn-primary" onclick="window.location.href='redeem.html'">الذهاب إلى صفحة التحقق</button>
                    </div>
                </div>
            `;
        });
    }
    
    // Send ticket to payment gateway
    function simulateTicketSubmission(ticketNumber) {
        // Use the stored timestamp for synchronization
        const storedTimestamp = sessionStorage.getItem('currentOrderTimestamp');
        const orderTimestamp = storedTimestamp ? parseInt(storedTimestamp) : Date.now();
        
        // Get cart details for the order
        const orderDetails = {
            ticketNumber: ticketNumber,
            timestamp: orderTimestamp, // Use synchronized timestamp
            productName: cart.map(item => item.name).join(', '),
            quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
            price: document.getElementById('cartSubtotal').textContent,
            gatewayFee: document.getElementById('paymentFee').textContent,
            totalAmount: document.getElementById('finalTotal').textContent,
            currency: 'USD',
            status: 'pending',
            paymentMethod: document.querySelector('input[name="payment-method"]:checked')?.value || 'bank',
            customerPhone: document.getElementById('customerPhone')?.value || '',
            createdAt: new Date().toISOString()
        };

        // Store in pendingTickets array for payment gateway
        let pendingTickets = JSON.parse(localStorage.getItem('pendingTickets')) || [];
        pendingTickets.push(orderDetails);
        localStorage.setItem('pendingTickets', JSON.stringify(pendingTickets));
        
        // Also store for quick access
        localStorage.setItem('lastTicketNumber', ticketNumber);
        
        console.log('Ticket submitted to payment gateway:', orderDetails);
        
        // No need to manually dispatch storage event - it will be triggered automatically
        // when localStorage is changed in other tabs/windows
        // But we need to make sure we're using a unique key each time to force an update
        localStorage.setItem('pendingTicketsTimestamp', Date.now());
        
        // For same-window updates, we need to call loadPendingTickets directly
        // if the payment gateway is in the same window
        if (window.paymentGatewayLoaded) {
            window.loadPendingTickets && window.loadPendingTickets();
        }
    }
    
    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener('click', function() {
            if (confirm('هل أنت متأكد من إلغاء الطلب؟')) {
                // Close the modal
                document.getElementById('checkoutModal').style.display = 'none';
                // Clear cart
                cart.length = 0;
                updateCartCount();
                showToast('تم إلغاء الطلب');
            }
        });
    }
    
    // Generate activation code
    function generateActivationCode() {
        const prefix = 'ACT-';
        const part1 = Math.floor(1000 + Math.random() * 9000);
        const part2 = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}${part1}-${part2}`;
    }

    // Tabs functionality (for redeem page)
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding content
                const tabId = this.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }

    // Form submissions (for redeem page)
    const checkCouponForm = document.getElementById('check-coupon-form');
    if (checkCouponForm) {
        checkCouponForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const couponCode = document.getElementById('coupon-code').value;
            
            if (couponCode.length < 8) {
                alert('يرجى إدخال رمز كوبون صحيح');
                return;
            }
            
            // Simulate API request
            simulateApiRequest().then(() => {
                // Show coupon details
                document.querySelector('.coupon-result').style.display = 'block';
                
                // Populate with dummy data
                document.getElementById('coupon-type').textContent = getRandomCouponType();
                document.getElementById('coupon-points').textContent = getRandomPointsAmount();
                document.getElementById('coupon-status').textContent = 'صالح';
                
                // Scroll to result
                document.querySelector('.coupon-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });
    }

    const activateCouponForm = document.getElementById('activate-coupon-form');
    if (activateCouponForm) {
        activateCouponForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const ticketNumber = document.getElementById('ticket-number').value;
            const activationCode = document.getElementById('activation-code').value;
            
            if (!ticketNumber || !activationCode) {
                alert('يرجى إدخال جميع البيانات المطلوبة');
                return;
            }
            
            // Show loading
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحقق...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Check in completed transactions
                const completedTransactions = JSON.parse(localStorage.getItem('completedTransactions')) || [];
                const transaction = completedTransactions.find(t => 
                    t.ticketNumber === ticketNumber && 
                    t.activationCode === activationCode
                );
                
                // Check in pending tickets if not found in completed
                const pendingTickets = JSON.parse(localStorage.getItem('pendingTickets')) || [];
                const pendingTicket = pendingTickets.find(t => t.ticketNumber === ticketNumber);
                
                if (transaction && transaction.status === 'approved') {
                    // Valid activation - show result
                    document.querySelector('.activation-result').style.display = 'block';
                    
                    // Load crypto helper script if not already loaded
                    if (!window.cryptoHelper) {
                        const script = document.createElement('script');
                        script.src = '/niqati/js/crypto-helper.js';
                        script.onload = function() {
                            generateSecureCoupon(transaction);
                        };
                        document.head.appendChild(script);
                    } else {
                        generateSecureCoupon(transaction);
                    }
                    
                    // Generate secure coupon and display it
                    function generateSecureCoupon(transaction) {
                        // Use the crypto helper if available, otherwise fallback
                        const generateCouponPromise = window.cryptoHelper ? 
                            window.cryptoHelper.generateSecureCoupon(transaction) : 
                            Promise.resolve(generateCouponCode());
                            
                        generateCouponPromise.then(couponCode => {
                            // Display the coupon code
                            document.getElementById('generated-coupon-code').textContent = couponCode;
                            
                            // Populate with actual transaction data
                            document.getElementById('activated-coupon-type').textContent = transaction.productName || 'منتج غير محدد';
                            document.getElementById('activated-coupon-points').textContent = transaction.quantity + ' وحدة';
                            
                            // Mark as redeemed
                            transaction.status = 'redeemed';
                            transaction.redeemedAt = new Date().toISOString();
                            transaction.couponCode = couponCode;
                            localStorage.setItem('completedTransactions', JSON.stringify(completedTransactions));
                            localStorage.setItem('completedTransactionsTimestamp', Date.now());
                            
                            // Scroll to result
                            document.querySelector('.activation-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            
                            // Copy button functionality
                            const copyBtn = document.getElementById('copy-coupon');
                            if (copyBtn) {
                                copyBtn.onclick = function() {
                                    navigator.clipboard.writeText(couponCode).then(() => {
                                        showToast('تم نسخ الكوبون إلى الحافظة');
                                    });
                                };
                            }
                        }).catch(error => {
                            console.error('Error generating coupon:', error);
                            alert('حدث خطأ في إنشاء الكوبون. يرجى المحاولة مرة أخرى.');
                        });
                    }
                } else if (pendingTicket) {
                    // Ticket exists but not yet approved
                    alert('لم يتم تأكيد الدفع بعد. يرجى الانتظار حتى يتم التحقق من الدفع.');
                } else if (transaction && transaction.status === 'redeemed') {
                    // Already redeemed
                    alert('تم استخدام هذا الكود مسبقاً.');
                } else {
                    // Not found or wrong code
                    alert('رقم التذكرة أو كود التفعيل غير صحيح. يرجى التحقق والمحاولة مرة أخرى.');
                }
            }, 1500);
        });
        
        // Check if there's a last ticket and pre-fill the form
        const lastTicketNumber = localStorage.getItem('lastTicketNumber');
        if (lastTicketNumber) {
            document.getElementById('ticket-number').value = lastTicketNumber;
        }
    }

    const redeemForm = document.getElementById('redeem-form');
    if (redeemForm) {
        redeemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const redeemCode = document.getElementById('redeem-code').value;
            
            if (!redeemCode) {
                alert('يرجى إدخال رمز الكوبون');
                return;
            }
            
            // Simulate API request
            simulateApiRequest().then(() => {
                // Show redemption result
                document.querySelector('.redemption-result').style.display = 'block';
                
                // Generate reference number
                const refNumber = `REF-${Math.floor(Math.random() * 100000)}`;
                document.getElementById('redemption-ref').textContent = refNumber;
                
                // Get current date
                const now = new Date();
                const dateStr = now.toLocaleDateString('ar-EG') + ', ' + now.toLocaleTimeString('ar-EG');
                document.getElementById('redemption-date').textContent = dateStr;
                
                // Scroll to result
                document.querySelector('.redemption-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });
    }

    // Helper functions for demo
    function simulateApiRequest() {
        return new Promise(resolve => {
            // Simulate loading
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }

    function getRandomCouponType() {
        const types = ['نقاط ببجي', 'عملات تيك توك', 'بطاقة أمازون', 'روبوكس'];
        return types[Math.floor(Math.random() * types.length)];
    }

    function getRandomPointsAmount() {
        const amounts = ['1,000', '2,500', '5,000', '10,000', '$25', '$50', '$100'];
        return amounts[Math.floor(Math.random() * amounts.length)];
    }

    function generateCouponCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 24; i++) {
            if (i > 0 && i % 6 === 0) code += '-';
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // Add toast styling
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 2000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        }
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});
