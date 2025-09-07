/**
 * Couponati - Main Application JavaScript
 * Minimalist coupon management system
 */

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize global variables
    const currentUser = getCurrentUser();
    let currentLanguage = localStorage.getItem('couponati_language') || 'ar';
    let currentCurrency = 'USD';
    let exchangeRates = {};
    
    // Initialize user interface
    initializeUI();
    setupEventListeners();
    detectLocationAndCurrency();
    
    /**
     * Initialize the user interface based on user state
     */
    function initializeUI() {
        // Update authentication UI
        updateAuthUI();
        
        // Update language
        setLanguage(currentLanguage);
        
        // Show appropriate modals if URL parameters exist
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('login')) {
            openModal('login-modal');
        } else if (urlParams.has('register')) {
            openModal('register-modal');
        } else if (urlParams.has('buy')) {
            openModal('buy-coupon-modal');
        } else if (urlParams.has('check')) {
            openModal('check-coupon-modal');
        }
    }
    
    /**
     * Set up all event listeners for the application
     */
    function setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navList = document.querySelector('.nav-list');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                navList.classList.toggle('active');
            });
        }
        
        // Modal controls
        setupModalListeners();
        
        // Form submissions
        setupFormListeners();
        
        // Language switcher
        const languageSwitcher = document.getElementById('language-switcher');
        if (languageSwitcher) {
            languageSwitcher.addEventListener('click', (e) => {
                e.preventDefault();
                toggleLanguage();
            });
        }
        
        // Button listeners
        setupButtonListeners();
    }
    
    /**
     * Set up modal-related event listeners
     */
    function setupModalListeners() {
        // Close modal buttons
        document.querySelectorAll('.modal-close').forEach(button => {
            button.addEventListener('click', () => {
                closeAllModals();
            });
        });
        
        // Modal backdrop clicks
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    closeAllModals();
                }
            });
        });
        
        // Show login/register modal switch
        document.getElementById('show-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            openModal('register-modal');
        });
        
        document.getElementById('show-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            openModal('login-modal');
        });
    }
    
    /**
     * Set up form submission handlers
     */
    function setupFormListeners() {
        // Buy coupon form
        const buyCouponForm = document.getElementById('buy-coupon-form');
        if (buyCouponForm) {
            buyCouponForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const amount = document.getElementById('coupon-amount').value;
                
                if (!currentUser) {
                    showToast('يجب تسجيل الدخول أولاً', 'error');
                    closeAllModals();
                    openModal('login-modal');
                    return;
                }
                
                // Redirect to payment processor interface
                window.location.href = `payment.html?amount=${amount}&currency=${currentCurrency}`;
            });
            
            // Update local amount when coupon amount changes
            const couponAmountInput = document.getElementById('coupon-amount');
            if (couponAmountInput) {
                couponAmountInput.addEventListener('input', updateLocalAmount);
            }
        }
        
        // Check coupon form
        const checkCouponForm = document.getElementById('check-coupon-form');
        if (checkCouponForm) {
            checkCouponForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const couponCode = document.getElementById('coupon-code').value.trim();
                
                if (!couponCode) {
                    showToast('يرجى إدخال رمز الكوبون', 'error');
                    return;
                }
                
                // Simulate coupon check (in a real app, this would be a server API call)
                checkCoupon(couponCode);
            });
        }
    }
    
    /**
     * Set up button event listeners
     */
    function setupButtonListeners() {
        // Buy coupon button
        const buyCouponBtn = document.getElementById('buy-coupon-btn');
        if (buyCouponBtn) {
            buyCouponBtn.addEventListener('click', () => {
                openModal('buy-coupon-modal');
            });
        }
        
        // Check coupon button
        const checkCouponBtn = document.getElementById('check-coupon-btn');
        if (checkCouponBtn) {
            checkCouponBtn.addEventListener('click', () => {
                openModal('check-coupon-modal');
            });
        }
        
        // Login/register links
        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                openModal('login-modal');
            });
        }
        
        const registerLink = document.getElementById('register-link');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                openModal('register-modal');
            });
        }
        
        // Check coupon link
        const checkCouponLink = document.getElementById('check-coupon-link');
        if (checkCouponLink) {
            checkCouponLink.addEventListener('click', (e) => {
                e.preventDefault();
                openModal('check-coupon-modal');
            });
        }
    }
    
    /**
     * Open a modal by ID
     * @param {string} modalId - The ID of the modal to open
     */
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            closeAllModals();
            modal.classList.add('active');
        }
    }
    
    /**
     * Close all open modals
     */
    function closeAllModals() {
        document.querySelectorAll('.modal-backdrop').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    /**
     * Toggle between Arabic and English
     */
    function toggleLanguage() {
        const newLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
        setLanguage(newLanguage);
    }
    
    /**
     * Set the language for the application
     * @param {string} language - The language code ('ar' or 'en')
     */
    function setLanguage(language) {
        currentLanguage = language;
        localStorage.setItem('couponati_language', language);
        
        // Set HTML dir attribute and lang
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        
        // Update language switcher text
        const languageSwitcher = document.getElementById('language-switcher');
        if (languageSwitcher) {
            languageSwitcher.textContent = language === 'ar' ? 'English' : 'العربية';
        }
        
        // In a full implementation, this would update all text content
        // based on translations stored in a separate file
    }
    
    /**
     * Detect user location and set currency
     */
    function detectLocationAndCurrency() {
        // For demo purposes, we'll use a simplified approach
        // In production, this would use a geolocation API
        
        // Fetch exchange rates
        fetchExchangeRates().then(() => {
            // Detect currency based on timezone or IP (simplified)
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            // Middle East country detection (simplified)
            if (timezone.includes('Asia/Riyadh')) {
                currentCurrency = 'SAR';
            } else if (timezone.includes('Asia/Dubai')) {
                currentCurrency = 'AED';
            } else if (timezone.includes('Asia/Qatar')) {
                currentCurrency = 'QAR';
            } else if (timezone.includes('Asia/Kuwait')) {
                currentCurrency = 'KWD';
            } else if (timezone.includes('Asia/Bahrain')) {
                currentCurrency = 'BHD';
            } else if (timezone.includes('Asia/Muscat')) {
                currentCurrency = 'OMR';
            } else if (timezone.includes('Asia/Amman')) {
                currentCurrency = 'JOD';
            } else if (timezone.includes('Africa/Cairo')) {
                currentCurrency = 'EGP';
            }
            
            // Update UI with detected currency
            updateLocalAmount();
        });
    }
    
    /**
     * Fetch exchange rates
     * @returns {Promise} - A promise that resolves when rates are fetched
     */
    function fetchExchangeRates() {
        // In a real app, this would call an external API
        // For demo, we'll use static rates
        return new Promise(resolve => {
            exchangeRates = {
                USD: 1,
                SAR: 3.75,  // Saudi Riyal
                AED: 3.67,  // UAE Dirham
                QAR: 3.64,  // Qatari Riyal
                KWD: 0.31,  // Kuwaiti Dinar
                BHD: 0.38,  // Bahraini Dinar
                OMR: 0.38,  // Omani Rial
                JOD: 0.71,  // Jordanian Dinar
                EGP: 30.90  // Egyptian Pound
            };
            resolve();
        });
    }
    
    /**
     * Update local amount display
     */
    function updateLocalAmount() {
        const amountInput = document.getElementById('coupon-amount');
        const localAmountContainer = document.getElementById('local-amount');
        
        if (amountInput && localAmountContainer) {
            const usdAmount = parseFloat(amountInput.value);
            if (!isNaN(usdAmount)) {
                const rate = exchangeRates[currentCurrency] || 1;
                
                // Add 1% to the exchange rate for our markup
                const localAmount = usdAmount * rate * 1.01;
                
                // Update the display
                const amountElement = localAmountContainer.querySelector('.amount');
                const currencyElement = localAmountContainer.querySelector('.currency');
                
                if (amountElement && currencyElement) {
                    amountElement.textContent = localAmount.toFixed(2);
                    
                    // Set currency name
                    const currencyNames = {
                        SAR: 'ريال سعودي',
                        AED: 'درهم إماراتي',
                        QAR: 'ريال قطري',
                        KWD: 'دينار كويتي',
                        BHD: 'دينار بحريني',
                        OMR: 'ريال عماني',
                        JOD: 'دينار أردني',
                        EGP: 'جنيه مصري',
                        USD: 'دولار أمريكي'
                    };
                    
                    currencyElement.textContent = currencyNames[currentCurrency] || currentCurrency;
                }
            }
        }
    }
    
    /**
     * Check coupon validity
     * @param {string} couponCode - The coupon code to check
     */
    function checkCoupon(couponCode) {
        // Simulate API call with a loader
        const resultContainer = document.getElementById('coupon-result');
        
        // Show loading state
        if (resultContainer) {
            resultContainer.innerHTML = '<div class="loader"></div>';
            resultContainer.style.display = 'block';
        }
        
        // Simulate network delay
        setTimeout(() => {
            // For demo purposes, we'll validate based on the code format
            // In a real app, this would check against a database
            const isValidFormat = /^[A-Z0-9]{4}(-[A-Z0-9]{4}){2,3}$/.test(couponCode);
            
            // Get result elements
            const statusElement = document.getElementById('coupon-status');
            const valueElement = document.getElementById('coupon-value');
            const dateElement = document.getElementById('coupon-date');
            
            // Update UI
            if (resultContainer && statusElement && valueElement && dateElement) {
                resultContainer.innerHTML = document.getElementById('coupon-result').innerHTML;
                resultContainer.style.display = 'block';
                
                if (isValidFormat) {
                    // Valid coupon for demo
                    statusElement.textContent = 'صالح';
                    statusElement.className = 'badge badge-success';
                    
                    // Generate random value (in a real app, this would come from the database)
                    const values = [5, 10, 20, 50, 100];
                    const randomValue = values[Math.floor(Math.random() * values.length)];
                    valueElement.textContent = `$${randomValue.toFixed(2)}`;
                    
                    // Generate a recent date (in a real app, this would come from the database)
                    const today = new Date();
                    const daysAgo = Math.floor(Math.random() * 30);
                    const issueDate = new Date(today.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
                    dateElement.textContent = issueDate.toISOString().split('T')[0];
                    
                    showToast('تم التحقق من الكوبون بنجاح', 'success');
                } else {
                    // Invalid coupon
                    statusElement.textContent = 'غير صالح';
                    statusElement.className = 'badge badge-error';
                    valueElement.textContent = '$0.00';
                    dateElement.textContent = 'غير متوفر';
                    
                    showToast('الكوبون غير صالح', 'error');
                }
            }
        }, 1000);
    }
    
    /**
     * Get current logged-in user
     * @returns {Object|null} - The current user or null if not logged in
     */
    function getCurrentUser() {
        const userJson = localStorage.getItem('couponati_user');
        return userJson ? JSON.parse(userJson) : null;
    }
    
    /**
     * Update authentication UI based on user state
     */
    function updateAuthUI() {
        const loginItem = document.getElementById('login-item');
        const registerItem = document.getElementById('register-item');
        const dashboardItem = document.getElementById('dashboard-item');
        const logoutItem = document.getElementById('logout-item');
        
        if (currentUser) {
            // User is logged in
            if (loginItem) loginItem.style.display = 'none';
            if (registerItem) registerItem.style.display = 'none';
            if (dashboardItem) dashboardItem.style.display = 'block';
            if (logoutItem) logoutItem.style.display = 'block';
        } else {
            // User is not logged in
            if (loginItem) loginItem.style.display = 'block';
            if (registerItem) registerItem.style.display = 'block';
            if (dashboardItem) dashboardItem.style.display = 'none';
            if (logoutItem) logoutItem.style.display = 'none';
        }
    }
    
    /**
     * Show a toast notification
     * @param {string} message - The message to show
     * @param {string} type - The type of notification (success, error, warning)
     */
    function showToast(message, type = 'success') {
        // Remove any existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => {
            document.body.removeChild(toast);
        });
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        // Add to body
        document.body.appendChild(toast);
        
        // Show with animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            
            // Remove from DOM after animation
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
});
