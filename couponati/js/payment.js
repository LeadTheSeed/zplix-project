/**
 * Couponati - Payment Processing JavaScript
 * Handles payment processing functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html?login=true';
        return;
    }
    
    // Get order amount from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const amount = parseFloat(urlParams.get('amount') || '0');
    
    // Redirect if no amount
    if (!amount) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Initialize payment page
    initializePaymentPage(amount);
    setupEventListeners();
    
    /**
     * Initialize the payment page
     * @param {number} amount - The order amount in USD
     */
    function initializePaymentPage(amount) {
        // Initialize order summary
        updateOrderSummary(amount);
        
        // Initialize bank details
        updateBankDetails();
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Payment method selector
        const bankTransferRadio = document.querySelector('input[value="bank-transfer"]');
        const creditCardRadio = document.querySelector('input[value="credit-card"]');
        const bankTransferForm = document.getElementById('bank-transfer-form');
        const creditCardForm = document.getElementById('credit-card-form');
        
        if (bankTransferRadio && creditCardRadio && bankTransferForm && creditCardForm) {
            bankTransferRadio.addEventListener('change', () => {
                bankTransferForm.style.display = 'block';
                creditCardForm.style.display = 'none';
            });
            
            creditCardRadio.addEventListener('change', () => {
                bankTransferForm.style.display = 'none';
                creditCardForm.style.display = 'block';
            });
        }
        
        // Cancel payment button
        const cancelPaymentBtn = document.getElementById('cancel-payment');
        if (cancelPaymentBtn) {
            cancelPaymentBtn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من إلغاء عملية الدفع؟')) {
                    window.location.href = 'dashboard.html';
                }
            });
        }
        
        // Confirm payment button
        const confirmPaymentBtn = document.getElementById('confirm-payment');
        if (confirmPaymentBtn) {
            confirmPaymentBtn.addEventListener('click', () => {
                const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
                
                if (selectedMethod === 'bank-transfer') {
                    const transactionId = document.getElementById('transaction-id').value.trim();
                    if (!transactionId) {
                        showToast('يرجى إدخال رقم العملية', 'error');
                        return;
                    }
                    
                    processPayment(selectedMethod, { transactionId });
                } else if (selectedMethod === 'credit-card') {
                    const cardNumber = document.getElementById('card-number').value.trim();
                    const expiryDate = document.getElementById('expiry-date').value.trim();
                    const cvv = document.getElementById('cvv').value.trim();
                    const cardName = document.getElementById('card-name').value.trim();
                    
                    if (!cardNumber || !expiryDate || !cvv || !cardName) {
                        showToast('يرجى إدخال جميع بيانات البطاقة', 'error');
                        return;
                    }
                    
                    processPayment(selectedMethod, { cardNumber, expiryDate, cvv, cardName });
                }
            });
        }
        
        // Go to dashboard button in success modal
        const gotoDashboardBtn = document.getElementById('goto-dashboard');
        if (gotoDashboardBtn) {
            gotoDashboardBtn.addEventListener('click', () => {
                window.location.href = 'dashboard.html';
            });
        }
        
        // Modal functionality
        setupModalListeners();
    }
    
    /**
     * Update order summary
     * @param {number} amount - The order amount in USD
     */
    function updateOrderSummary(amount) {
        // Get elements
        const orderAmountElement = document.getElementById('order-amount');
        const localAmountElement = document.getElementById('order-local-amount').querySelector('.amount');
        const currencyElement = document.getElementById('order-local-amount').querySelector('.currency');
        const totalAmountElement = document.getElementById('order-total').querySelector('.amount');
        const totalCurrencyElement = document.getElementById('order-total').querySelector('.currency');
        
        // Detect currency based on timezone
        const currencyInfo = getLocalCurrency();
        const localAmount = amount * currencyInfo.rate * 1.01; // Adding 1% markup
        
        // Update elements
        if (orderAmountElement) orderAmountElement.textContent = `$${amount.toFixed(2)}`;
        if (localAmountElement) localAmountElement.textContent = localAmount.toFixed(2);
        if (currencyElement) currencyElement.textContent = currencyInfo.name;
        if (totalAmountElement) totalAmountElement.textContent = localAmount.toFixed(2);
        if (totalCurrencyElement) totalCurrencyElement.textContent = currencyInfo.name;
    }
    
    /**
     * Update bank details based on detected region
     */
    function updateBankDetails() {
        const bankNameElement = document.getElementById('bank-name');
        const bankAccountElement = document.getElementById('bank-account');
        const bankIbanElement = document.getElementById('bank-iban');
        
        // Get bank details based on region
        const region = getDetectedRegion();
        const bankDetails = getBankDetails(region);
        
        // Update elements
        if (bankNameElement) bankNameElement.textContent = bankDetails.bankName;
        if (bankAccountElement) bankAccountElement.textContent = bankDetails.accountNumber;
        if (bankIbanElement) bankIbanElement.textContent = bankDetails.iban;
    }
    
    /**
     * Process the payment
     * @param {string} method - The payment method (bank-transfer or credit-card)
     * @param {Object} data - The payment data
     */
    function processPayment(method, data) {
        // Show processing modal
        openModal('processing-modal');
        
        // Get payment details
        const urlParams = new URLSearchParams(window.location.search);
        const amount = parseFloat(urlParams.get('amount') || '0');
        
        // Simulate payment processing
        setTimeout(() => {
            // Create order
            const order = {
                id: 'ORD' + Date.now().toString().slice(-6),
                userId: currentUser.id,
                amount: amount,
                paymentMethod: method,
                paymentData: data,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Save order
            saveOrder(order);
            
            // Close processing modal and open success modal
            closeAllModals();
            
            // Update order ID in success modal
            document.getElementById('order-id').textContent = order.id;
            
            // Open success modal
            openModal('success-modal');
        }, 2000);
    }
    
    /**
     * Save order to localStorage
     * @param {Object} order - The order to save
     */
    function saveOrder(order) {
        // Get existing orders
        const ordersJson = localStorage.getItem(`couponati_orders_${currentUser.id}`);
        const orders = ordersJson ? JSON.parse(ordersJson) : [];
        
        // Add new order
        orders.push(order);
        
        // Save to localStorage
        localStorage.setItem(`couponati_orders_${currentUser.id}`, JSON.stringify(orders));
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
     * Get current logged-in user
     * @returns {Object|null} - The current user or null if not logged in
     */
    function getCurrentUser() {
        const userJson = localStorage.getItem('couponati_user');
        return userJson ? JSON.parse(userJson) : null;
    }
    
    /**
     * Get detected region based on timezone or browser language
     * @returns {string} - The detected region code
     */
    function getDetectedRegion() {
        // In a real app, this would use geolocation API
        // For demo, we'll use browser settings
        
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language || navigator.userLanguage;
        
        if (timezone.includes('Asia/Riyadh') || language.includes('sa')) {
            return 'SA';
        } else if (timezone.includes('Asia/Dubai') || language.includes('ae')) {
            return 'AE';
        } else if (timezone.includes('Asia/Qatar')) {
            return 'QA';
        } else if (timezone.includes('Asia/Kuwait')) {
            return 'KW';
        } else if (timezone.includes('Asia/Bahrain')) {
            return 'BH';
        } else if (timezone.includes('Asia/Muscat')) {
            return 'OM';
        } else if (timezone.includes('Asia/Amman') || language.includes('jo')) {
            return 'JO';
        } else if (timezone.includes('Africa/Cairo') || language.includes('eg')) {
            return 'EG';
        }
        
        // Default to Saudi Arabia
        return 'SA';
    }
    
    /**
     * Get local currency information based on region
     * @returns {Object} - Currency info with code, name, and exchange rate
     */
    function getLocalCurrency() {
        const region = getDetectedRegion();
        
        switch (region) {
            case 'SA':
                return { code: 'SAR', name: 'ريال سعودي', rate: 3.75 };
            case 'AE':
                return { code: 'AED', name: 'درهم إماراتي', rate: 3.67 };
            case 'QA':
                return { code: 'QAR', name: 'ريال قطري', rate: 3.64 };
            case 'KW':
                return { code: 'KWD', name: 'دينار كويتي', rate: 0.31 };
            case 'BH':
                return { code: 'BHD', name: 'دينار بحريني', rate: 0.38 };
            case 'OM':
                return { code: 'OMR', name: 'ريال عماني', rate: 0.38 };
            case 'JO':
                return { code: 'JOD', name: 'دينار أردني', rate: 0.71 };
            case 'EG':
                return { code: 'EGP', name: 'جنيه مصري', rate: 30.90 };
            default:
                return { code: 'USD', name: 'دولار أمريكي', rate: 1.0 };
        }
    }
    
    /**
     * Get bank details for a specific region
     * @param {string} region - The region code
     * @returns {Object} - Bank details for the region
     */
    function getBankDetails(region) {
        switch (region) {
            case 'SA':
                return {
                    bankName: 'البنك الأهلي السعودي',
                    accountNumber: '1234567890',
                    iban: 'SA1234567890123456789012'
                };
            case 'AE':
                return {
                    bankName: 'بنك الإمارات دبي الوطني',
                    accountNumber: '2345678901',
                    iban: 'AE123456789012345678901'
                };
            case 'QA':
                return {
                    bankName: 'بنك قطر الوطني',
                    accountNumber: '3456789012',
                    iban: 'QA12QNBA123456789012345678901234'
                };
            case 'KW':
                return {
                    bankName: 'بنك الكويت الوطني',
                    accountNumber: '4567890123',
                    iban: 'KW12NBKK1234567890123456789012'
                };
            case 'BH':
                return {
                    bankName: 'بنك البحرين الوطني',
                    accountNumber: '5678901234',
                    iban: 'BH12NBOB12345678901234'
                };
            case 'OM':
                return {
                    bankName: 'بنك مسقط',
                    accountNumber: '6789012345',
                    iban: 'OM12BANK1234567890123456'
                };
            case 'JO':
                return {
                    bankName: 'البنك العربي',
                    accountNumber: '7890123456',
                    iban: 'JO12ARAB1234567890123456789012'
                };
            case 'EG':
                return {
                    bankName: 'البنك التجاري الدولي',
                    accountNumber: '8901234567',
                    iban: 'EG1234567890123456789012345'
                };
            default:
                return {
                    bankName: 'البنك الدولي',
                    accountNumber: '9012345678',
                    iban: 'GB12CRED12345678901234'
                };
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
