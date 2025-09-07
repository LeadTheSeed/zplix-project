/**
 * Couponati - Seller Interface JavaScript
 * Handles seller dashboard functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html?login=true';
        return;
    }
    
    // Check if user is a seller
    if (currentUser.role !== 'seller') {
        window.location.href = 'index.html';
        return;
    }
    
    // Global variables
    let currentOrderId = null;
    
    // Initialize the dashboard
    initializeDashboard();
    setupEventListeners();
    
    /**
     * Initialize the seller dashboard
     */
    function initializeDashboard() {
        // Update user name
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && currentUser.name) {
            userNameElement.textContent = currentUser.name;
        }
        
        // Load orders and coupons
        loadPendingOrders();
        loadRecentCoupons();
        updateStats();
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Refresh orders button
        const refreshButton = document.getElementById('refresh-orders');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                loadPendingOrders();
                updateStats();
            });
        }
        
        // Modal functionality
        setupModalListeners();
        
        // Generate code button
        const generateCodeButton = document.getElementById('generate-code');
        if (generateCodeButton) {
            generateCodeButton.addEventListener('click', generateCouponCode);
        }
        
        // Approve order form
        const approveOrderForm = document.getElementById('approve-order-form');
        if (approveOrderForm) {
            approveOrderForm.addEventListener('submit', handleApproveOrder);
        }
        
        // Reject order button
        const rejectOrderButton = document.getElementById('reject-order');
        if (rejectOrderButton) {
            rejectOrderButton.addEventListener('click', handleRejectOrder);
        }
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
     * Load pending orders
     */
    function loadPendingOrders() {
        const orders = getAllOrders();
        
        // Filter orders with approved payment (ready for seller approval)
        const pendingOrders = orders.filter(order => order.status === 'approved');
        
        // Get table elements
        const pendingOrdersList = document.getElementById('pending-orders-list');
        const noPendingOrdersMessage = document.getElementById('no-pending-orders');
        
        if (pendingOrdersList && noPendingOrdersMessage) {
            if (pendingOrders.length > 0) {
                // Show orders table and hide message
                document.getElementById('pending-orders-table').style.display = 'table';
                noPendingOrdersMessage.style.display = 'none';
                
                // Clear existing rows
                pendingOrdersList.innerHTML = '';
                
                // Add order rows
                pendingOrders.forEach(order => {
                    const row = document.createElement('tr');
                    
                    // Get user info
                    const user = getUserById(order.userId);
                    const userName = user ? user.name : 'غير معروف';
                    
                    row.innerHTML = `
                        <td>${order.id}</td>
                        <td>${userName}</td>
                        <td>$${order.amount.toFixed(2)}</td>
                        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                        <td><span class="badge badge-success">${getStatusText(order.status)}</span></td>
                        <td>
                            <button class="btn btn-sm btn-primary approve-btn" data-id="${order.id}">
                                إصدار كوبون
                            </button>
                        </td>
                    `;
                    
                    pendingOrdersList.appendChild(row);
                });
                
                // Add event listeners to approve buttons
                document.querySelectorAll('.approve-btn').forEach(button => {
                    button.addEventListener('click', () => {
                        const orderId = button.getAttribute('data-id');
                        openApproveOrderModal(orderId);
                    });
                });
            } else {
                // Hide orders table and show message
                document.getElementById('pending-orders-table').style.display = 'none';
                noPendingOrdersMessage.style.display = 'block';
            }
        }
    }
    
    /**
     * Load recently issued coupons
     */
    function loadRecentCoupons() {
        const allCoupons = getAllCoupons();
        
        // Sort by date (newest first) and take the 10 most recent
        const recentCoupons = allCoupons
            .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt))
            .slice(0, 10);
        
        // Get table elements
        const couponsList = document.getElementById('coupons-list');
        const noCouponsMessage = document.getElementById('no-coupons');
        
        if (couponsList && noCouponsMessage) {
            if (recentCoupons.length > 0) {
                // Show coupons table and hide message
                document.getElementById('coupons-table').style.display = 'table';
                noCouponsMessage.style.display = 'none';
                
                // Clear existing rows
                couponsList.innerHTML = '';
                
                // Add coupon rows
                recentCoupons.forEach(coupon => {
                    const row = document.createElement('tr');
                    
                    // Get user info
                    const user = getUserById(coupon.userId);
                    const userName = user ? user.name : 'غير معروف';
                    
                    row.innerHTML = `
                        <td>${coupon.code}</td>
                        <td>${userName}</td>
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
     * Update dashboard statistics
     */
    function updateStats() {
        const orders = getAllOrders();
        const allCoupons = getAllCoupons();
        
        // Pending orders count (ready for seller approval)
        const pendingOrders = orders.filter(order => order.status === 'approved');
        document.getElementById('pending-orders-count').textContent = pendingOrders.length;
        
        // Issued coupons count
        document.getElementById('issued-coupons-count').textContent = allCoupons.length;
        
        // Calculate total sales
        let totalSales = 0;
        allCoupons.forEach(coupon => {
            totalSales += coupon.amount;
        });
        
        document.getElementById('total-sales').textContent = `$${totalSales.toFixed(2)}`;
    }
    
    /**
     * Open the approve order modal
     * @param {string} orderId - The ID of the order to approve
     */
    function openApproveOrderModal(orderId) {
        const order = getOrderById(orderId);
        if (!order) {
            showToast('تعذر العثور على الطلب', 'error');
            return;
        }
        
        // Store current order ID for later use
        currentOrderId = orderId;
        
        // Get user info
        const user = getUserById(order.userId);
        const userName = user ? user.name : 'غير معروف';
        
        // Update modal content
        document.getElementById('order-id').textContent = order.id;
        document.getElementById('order-user').textContent = userName;
        document.getElementById('order-amount').textContent = `$${order.amount.toFixed(2)}`;
        
        // Clear form fields
        document.getElementById('coupon-code').value = '';
        document.getElementById('coupon-notes').value = '';
        
        // Open modal
        openModal('approve-order-modal');
    }
    
    /**
     * Generate a random coupon code
     */
    function generateCouponCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        
        // Format: XXXX-XXXX-XXXX
        for (let i = 0; i < 12; i++) {
            if (i > 0 && i % 4 === 0) code += '-';
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        document.getElementById('coupon-code').value = code;
    }
    
    /**
     * Handle order approval form submission
     * @param {Event} e - Form submission event
     */
    function handleApproveOrder(e) {
        e.preventDefault();
        
        if (!currentOrderId) {
            showToast('حدث خطأ أثناء معالجة الطلب', 'error');
            return;
        }
        
        const couponCode = document.getElementById('coupon-code').value.trim();
        const notes = document.getElementById('coupon-notes').value.trim();
        
        if (!couponCode) {
            showToast('يرجى إدخال رمز الكوبون أو إنشاء رمز تلقائي', 'error');
            return;
        }
        
        // Get the order
        const order = getOrderById(currentOrderId);
        if (!order) {
            showToast('تعذر العثور على الطلب', 'error');
            return;
        }
        
        // Check if coupon code already exists
        const allCoupons = getAllCoupons();
        if (allCoupons.some(coupon => coupon.code === couponCode)) {
            showToast('رمز الكوبون موجود بالفعل، يرجى إنشاء رمز جديد', 'error');
            return;
        }
        
        // Create new coupon
        const coupon = {
            id: 'COUP' + Date.now().toString().slice(-6),
            code: couponCode,
            userId: order.userId,
            amount: order.amount,
            orderId: order.id,
            status: 'valid',
            issuedAt: new Date().toISOString(),
            notes: notes
        };
        
        // Save coupon
        saveCoupon(coupon);
        
        // Update order status
        updateOrderStatus(order.id, 'completed');
        
        // Close modal
        closeAllModals();
        
        // Refresh data
        loadPendingOrders();
        loadRecentCoupons();
        updateStats();
        
        showToast('تم إصدار الكوبون بنجاح', 'success');
    }
    
    /**
     * Handle order rejection
     */
    function handleRejectOrder() {
        if (!currentOrderId) {
            showToast('حدث خطأ أثناء معالجة الطلب', 'error');
            return;
        }
        
        if (confirm('هل أنت متأكد من رفض هذا الطلب؟')) {
            // Update order status
            updateOrderStatus(currentOrderId, 'rejected');
            
            // Close modal
            closeAllModals();
            
            // Refresh data
            loadPendingOrders();
            updateStats();
            
            showToast('تم رفض الطلب', 'success');
        }
    }
    
    /**
     * Save a coupon
     * @param {Object} coupon - The coupon to save
     */
    function saveCoupon(coupon) {
        // Add to all coupons
        const allCoupons = getAllCoupons();
        allCoupons.push(coupon);
        localStorage.setItem('couponati_all_coupons', JSON.stringify(allCoupons));
        
        // Add to user's coupons
        const userCoupons = getUserCoupons(coupon.userId);
        userCoupons.push(coupon);
        localStorage.setItem(`couponati_coupons_${coupon.userId}`, JSON.stringify(userCoupons));
    }
    
    /**
     * Update an order's status
     * @param {string} orderId - The ID of the order to update
     * @param {string} status - The new status
     */
    function updateOrderStatus(orderId, status) {
        // Get all orders
        const allOrders = getAllOrders();
        
        // Find the order
        const orderIndex = allOrders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return;
        
        // Update the order
        allOrders[orderIndex].status = status;
        allOrders[orderIndex].updatedAt = new Date().toISOString();
        
        // Save back
        localStorage.setItem('couponati_all_orders', JSON.stringify(allOrders));
        
        // Also update in user's orders
        const userId = allOrders[orderIndex].userId;
        const userOrders = getUserOrders(userId);
        
        const userOrderIndex = userOrders.findIndex(o => o.id === orderId);
        if (userOrderIndex !== -1) {
            userOrders[userOrderIndex].status = status;
            userOrders[userOrderIndex].updatedAt = new Date().toISOString();
            
            localStorage.setItem(`couponati_orders_${userId}`, JSON.stringify(userOrders));
        }
    }
    
    /**
     * Get all orders
     * @returns {Array} - All orders
     */
    function getAllOrders() {
        const ordersJson = localStorage.getItem('couponati_all_orders');
        return ordersJson ? JSON.parse(ordersJson) : [];
    }
    
    /**
     * Get all coupons
     * @returns {Array} - All coupons
     */
    function getAllCoupons() {
        const couponsJson = localStorage.getItem('couponati_all_coupons');
        return couponsJson ? JSON.parse(couponsJson) : [];
    }
    
    /**
     * Get an order by ID
     * @param {string} orderId - The order ID
     * @returns {Object|null} - The order or null if not found
     */
    function getOrderById(orderId) {
        const orders = getAllOrders();
        return orders.find(order => order.id === orderId) || null;
    }
    
    /**
     * Get a user by ID
     * @param {string} userId - The user ID
     * @returns {Object|null} - The user or null if not found
     */
    function getUserById(userId) {
        const users = getAllUsers();
        return users.find(user => user.id === userId) || null;
    }
    
    /**
     * Get all users
     * @returns {Array} - All users
     */
    function getAllUsers() {
        const usersJson = localStorage.getItem('couponati_users');
        return usersJson ? JSON.parse(usersJson) : [];
    }
    
    /**
     * Get a user's orders
     * @param {string} userId - The user ID
     * @returns {Array} - The user's orders
     */
    function getUserOrders(userId) {
        const ordersJson = localStorage.getItem(`couponati_orders_${userId}`);
        return ordersJson ? JSON.parse(ordersJson) : [];
    }
    
    /**
     * Get a user's coupons
     * @param {string} userId - The user ID
     * @returns {Array} - The user's coupons
     */
    function getUserCoupons(userId) {
        const couponsJson = localStorage.getItem(`couponati_coupons_${userId}`);
        return couponsJson ? JSON.parse(couponsJson) : [];
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
            case 'completed':
                return 'مكتمل';
            default:
                return status;
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
