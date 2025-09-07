/**
 * Couponati - Dashboard JavaScript
 * Handles customer dashboard functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html?login=true';
        return;
    }
    
    // Initialize dashboard
    initializeDashboard();
    setupEventListeners();
    
    /**
     * Initialize the dashboard
     */
    function initializeDashboard() {
        // Update user name
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && currentUser.name) {
            userNameElement.textContent = currentUser.name;
        }
        
        // Load user data
        loadUserData();
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Buy new coupon button
        const buyNewCouponBtn = document.getElementById('buy-new-coupon');
        if (buyNewCouponBtn) {
            buyNewCouponBtn.addEventListener('click', () => {
                openModal('buy-coupon-modal');
            });
        }
        
        // Buy first coupon button
        const buyFirstCouponBtn = document.getElementById('buy-first-coupon');
        if (buyFirstCouponBtn) {
            buyFirstCouponBtn.addEventListener('click', () => {
                openModal('buy-coupon-modal');
            });
        }
        
        // Coupon table row click
        const couponsTable = document.getElementById('coupons-table');
        if (couponsTable) {
            couponsTable.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                if (row && row.dataset.couponId) {
                    viewCoupon(row.dataset.couponId);
                }
            });
        }
        
        // Modal functionality
        setupModalListeners();
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
        
        // Buy coupon form
        const buyCouponForm = document.getElementById('buy-coupon-form');
        if (buyCouponForm) {
            buyCouponForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const amount = document.getElementById('coupon-amount').value;
                window.location.href = `payment.html?amount=${amount}`;
            });
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
                
                checkCoupon(couponCode);
            });
        }
        
        // Coupon code click to copy
        const couponCodeElement = document.getElementById('modal-coupon-code');
        if (couponCodeElement) {
            couponCodeElement.addEventListener('click', () => {
                const code = couponCodeElement.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    showToast('تم نسخ الكود', 'success');
                }).catch(() => {
                    showToast('فشل نسخ الكود', 'error');
                });
            });
        }
    }
    
    /**
     * Load user data including coupons and pending orders
     */
    function loadUserData() {
        // In a real app, this would fetch data from a server
        // For demo, we'll use localStorage
        
        loadCoupons();
        loadPendingOrders();
        updateStats();
    }
    
    /**
     * Load user's coupons
     */
    function loadCoupons() {
        const coupons = getUserCoupons();
        const couponsList = document.getElementById('coupons-list');
        const noCouponsMessage = document.getElementById('no-coupons-message');
        
        if (couponsList && noCouponsMessage) {
            if (coupons.length > 0) {
                // Show coupons table and hide message
                document.getElementById('coupons-table').style.display = 'table';
                noCouponsMessage.style.display = 'none';
                
                // Clear existing rows
                couponsList.innerHTML = '';
                
                // Add coupon rows
                coupons.forEach(coupon => {
                    const row = document.createElement('tr');
                    row.dataset.couponId = coupon.id;
                    row.style.cursor = 'pointer';
                    
                    row.innerHTML = `
                        <td>${coupon.code}</td>
                        <td>$${coupon.amount.toFixed(2)}</td>
                        <td>${new Date(coupon.issuedAt).toLocaleDateString()}</td>
                        <td><span class="badge badge-${coupon.status === 'valid' ? 'success' : 'error'}">${getStatusText(coupon.status)}</span></td>
                    `;
                    
                    couponsList.appendChild(row);
                });
            } else {
                // Hide coupons table and show message
                document.getElementById('coupons-table').style.display = 'none';
                noCouponsMessage.style.display = 'block';
            }
        }
    }
    
    /**
     * Load user's pending orders
     */
    function loadPendingOrders() {
        const orders = getUserPendingOrders();
        const pendingList = document.getElementById('pending-list');
        const noPendingMessage = document.getElementById('no-pending-message');
        
        if (pendingList && noPendingMessage) {
            if (orders.length > 0) {
                // Show pending table and hide message
                document.getElementById('pending-table').style.display = 'table';
                noPendingMessage.style.display = 'none';
                
                // Clear existing rows
                pendingList.innerHTML = '';
                
                // Add order rows
                orders.forEach(order => {
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${order.id}</td>
                        <td>$${order.amount.toFixed(2)}</td>
                        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                        <td><span class="badge badge-${getBadgeClass(order.status)}">${getStatusText(order.status)}</span></td>
                    `;
                    
                    pendingList.appendChild(row);
                });
            } else {
                // Hide pending table and show message
                document.getElementById('pending-table').style.display = 'none';
                noPendingMessage.style.display = 'block';
            }
        }
    }
    
    /**
     * Update dashboard statistics
     */
    function updateStats() {
        const coupons = getUserCoupons();
        const pendingOrders = getUserPendingOrders();
        
        // Update coupons count
        const validCoupons = coupons.filter(coupon => coupon.status === 'valid');
        document.getElementById('coupons-count').textContent = validCoupons.length;
        
        // Update pending count
        document.getElementById('pending-count').textContent = pendingOrders.length;
        
        // Calculate total spent
        let totalSpent = 0;
        coupons.forEach(coupon => {
            totalSpent += coupon.amount;
        });
        pendingOrders.forEach(order => {
            totalSpent += order.amount;
        });
        
        document.getElementById('total-spent').textContent = `$${totalSpent.toFixed(2)}`;
    }
    
    /**
     * Get user's coupons
     * @returns {Array} - The user's coupons
     */
    function getUserCoupons() {
        // In a real app, this would fetch data from a server
        // For demo, we'll use localStorage
        const couponsJson = localStorage.getItem(`couponati_coupons_${currentUser.id}`);
        const coupons = couponsJson ? JSON.parse(couponsJson) : [];
        
        // Sort by date (newest first)
        return coupons.sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
    }
    
    /**
     * Get user's pending orders
     * @returns {Array} - The user's pending orders
     */
    function getUserPendingOrders() {
        // In a real app, this would fetch data from a server
        // For demo, we'll use localStorage
        const ordersJson = localStorage.getItem(`couponati_orders_${currentUser.id}`);
        const allOrders = ordersJson ? JSON.parse(ordersJson) : [];
        
        // Filter pending orders
        const pendingStatuses = ['pending', 'processing', 'approved'];
        const pendingOrders = allOrders.filter(order => pendingStatuses.includes(order.status));
        
        // Sort by date (newest first)
        return pendingOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    /**
     * View coupon details
     * @param {string} couponId - The ID of the coupon to view
     */
    function viewCoupon(couponId) {
        const coupons = getUserCoupons();
        const coupon = coupons.find(c => c.id === couponId);
        
        if (!coupon) {
            showToast('تعذر العثور على الكوبون', 'error');
            return;
        }
        
        // Update modal content
        document.getElementById('modal-coupon-code').textContent = coupon.code;
        document.getElementById('modal-coupon-value').textContent = `$${coupon.amount.toFixed(2)}`;
        document.getElementById('modal-coupon-date').textContent = new Date(coupon.issuedAt).toLocaleDateString();
        
        const statusElement = document.getElementById('modal-coupon-status');
        statusElement.textContent = getStatusText(coupon.status);
        statusElement.className = `badge badge-${coupon.status === 'valid' ? 'success' : 'error'}`;
        
        // Open modal
        openModal('view-coupon-modal');
    }
    
    /**
     * Check coupon validity
     * @param {string} couponCode - The coupon code to check
     */
    function checkCoupon(couponCode) {
        // Show loading state
        const resultContainer = document.getElementById('coupon-result');
        if (resultContainer) {
            resultContainer.innerHTML = '<div class="loader"></div>';
            resultContainer.style.display = 'block';
        }
        
        // Simulate API call delay
        setTimeout(() => {
            // In a real app, this would call an API
            // For demo, we'll check against user's coupons
            const coupons = getUserCoupons();
            const coupon = coupons.find(c => c.code === couponCode);
            
            // Get result elements
            const statusElement = document.getElementById('coupon-status');
            const valueElement = document.getElementById('coupon-value');
            const dateElement = document.getElementById('coupon-date');
            
            // Update UI
            if (resultContainer && statusElement && valueElement && dateElement) {
                resultContainer.innerHTML = document.getElementById('coupon-result').innerHTML;
                resultContainer.style.display = 'block';
                
                if (coupon) {
                    // Coupon found
                    statusElement.textContent = getStatusText(coupon.status);
                    statusElement.className = `badge badge-${coupon.status === 'valid' ? 'success' : 'error'}`;
                    valueElement.textContent = `$${coupon.amount.toFixed(2)}`;
                    dateElement.textContent = new Date(coupon.issuedAt).toLocaleDateString();
                    
                    showToast('تم التحقق من الكوبون بنجاح', 'success');
                } else {
                    // Coupon not found
                    statusElement.textContent = 'غير موجود';
                    statusElement.className = 'badge badge-error';
                    valueElement.textContent = '$0.00';
                    dateElement.textContent = 'غير متوفر';
                    
                    showToast('الكوبون غير موجود', 'error');
                }
            }
        }, 1000);
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
     * Get status text based on status code
     * @param {string} status - The status code
     * @returns {string} - The status text in Arabic
     */
    function getStatusText(status) {
        switch (status) {
            case 'valid':
                return 'صالح';
            case 'used':
                return 'مستخدم';
            case 'expired':
                return 'منتهي الصلاحية';
            case 'pending':
                return 'قيد الانتظار';
            case 'processing':
                return 'قيد المعالجة';
            case 'approved':
                return 'تمت الموافقة';
            case 'rejected':
                return 'مرفوض';
            default:
                return status;
        }
    }
    
    /**
     * Get badge class based on status
     * @param {string} status - The status code
     * @returns {string} - The badge class name
     */
    function getBadgeClass(status) {
        switch (status) {
            case 'valid':
            case 'approved':
                return 'success';
            case 'pending':
            case 'processing':
                return 'warning';
            case 'used':
            case 'expired':
            case 'rejected':
                return 'error';
            default:
                return 'warning';
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
