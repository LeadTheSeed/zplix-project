/**
 * Couponati - Payment Processor Interface JavaScript
 * Handles payment processor dashboard functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html?login=true';
        return;
    }
    
    // Check if user is a processor
    if (currentUser.role !== 'processor') {
        window.location.href = 'index.html';
        return;
    }
    
    // Global variables
    let currentTransactionId = null;
    
    // Initialize the dashboard
    initializeDashboard();
    setupEventListeners();
    
    /**
     * Initialize the processor dashboard
     */
    function initializeDashboard() {
        // Update user name
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && currentUser.name) {
            userNameElement.textContent = currentUser.name;
        }
        
        // Load transactions
        loadPendingTransactions();
        loadRecentTransactions();
        updateStats();
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Refresh transactions button
        const refreshButton = document.getElementById('refresh-transactions');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                loadPendingTransactions();
                loadRecentTransactions();
                updateStats();
            });
        }
        
        // Modal functionality
        setupModalListeners();
        
        // Transaction approval button
        const approveTransactionButton = document.getElementById('approve-transaction');
        if (approveTransactionButton) {
            approveTransactionButton.addEventListener('click', handleApproveTransaction);
        }
        
        // Transaction rejection button
        const rejectTransactionButton = document.getElementById('reject-transaction');
        if (rejectTransactionButton) {
            rejectTransactionButton.addEventListener('click', handleRejectTransaction);
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
     * Load pending transactions
     */
    function loadPendingTransactions() {
        const orders = getAllOrders();
        
        // Filter orders with pending status
        const pendingTransactions = orders.filter(order => order.status === 'pending');
        
        // Get table elements
        const pendingTransactionsList = document.getElementById('pending-transactions-list');
        const noPendingTransactionsMessage = document.getElementById('no-pending-transactions');
        
        if (pendingTransactionsList && noPendingTransactionsMessage) {
            if (pendingTransactions.length > 0) {
                // Show transactions table and hide message
                document.getElementById('pending-transactions-table').style.display = 'table';
                noPendingTransactionsMessage.style.display = 'none';
                
                // Clear existing rows
                pendingTransactionsList.innerHTML = '';
                
                // Add transaction rows
                pendingTransactions.forEach(transaction => {
                    const row = document.createElement('tr');
                    
                    // Get user info
                    const user = getUserById(transaction.userId);
                    const userName = user ? user.name : 'غير معروف';
                    
                    row.innerHTML = `
                        <td>${transaction.id}</td>
                        <td>${userName}</td>
                        <td>$${transaction.amount.toFixed(2)}</td>
                        <td>${new Date(transaction.createdAt).toLocaleDateString()}</td>
                        <td>${getPaymentMethodText(transaction.paymentMethod)}</td>
                        <td>
                            <button class="btn btn-sm btn-primary view-transaction-btn" data-id="${transaction.id}">
                                عرض التفاصيل
                            </button>
                        </td>
                    `;
                    
                    pendingTransactionsList.appendChild(row);
                });
                
                // Add event listeners to view buttons
                document.querySelectorAll('.view-transaction-btn').forEach(button => {
                    button.addEventListener('click', () => {
                        const transactionId = button.getAttribute('data-id');
                        openTransactionDetailsModal(transactionId);
                    });
                });
            } else {
                // Hide transactions table and show message
                document.getElementById('pending-transactions-table').style.display = 'none';
                noPendingTransactionsMessage.style.display = 'block';
            }
        }
    }
    
    /**
     * Load recent transactions
     */
    function loadRecentTransactions() {
        const orders = getAllOrders();
        
        // Filter completed or rejected transactions
        const recentTransactions = orders.filter(order => 
            order.status === 'approved' || 
            order.status === 'rejected' || 
            order.status === 'completed'
        );
        
        // Sort by date (newest first) and take the 10 most recent
        const sortedTransactions = recentTransactions
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 10);
        
        // Get table elements
        const recentTransactionsList = document.getElementById('recent-transactions-list');
        const noRecentTransactionsMessage = document.getElementById('no-recent-transactions');
        
        if (recentTransactionsList && noRecentTransactionsMessage) {
            if (sortedTransactions.length > 0) {
                // Show transactions table and hide message
                document.getElementById('recent-transactions-table').style.display = 'table';
                noRecentTransactionsMessage.style.display = 'none';
                
                // Clear existing rows
                recentTransactionsList.innerHTML = '';
                
                // Add transaction rows
                sortedTransactions.forEach(transaction => {
                    const row = document.createElement('tr');
                    
                    // Get user info
                    const user = getUserById(transaction.userId);
                    const userName = user ? user.name : 'غير معروف';
                    
                    row.innerHTML = `
                        <td>${transaction.id}</td>
                        <td>${userName}</td>
                        <td>$${transaction.amount.toFixed(2)}</td>
                        <td>${new Date(transaction.createdAt).toLocaleDateString()}</td>
                        <td>${getPaymentMethodText(transaction.paymentMethod)}</td>
                        <td><span class="badge badge-${getStatusBadge(transaction.status)}">${getStatusText(transaction.status)}</span></td>
                    `;
                    
                    recentTransactionsList.appendChild(row);
                });
            } else {
                // Hide transactions table and show message
                document.getElementById('recent-transactions-table').style.display = 'none';
                noRecentTransactionsMessage.style.display = 'block';
            }
        }
    }
    
    /**
     * Update dashboard statistics
     */
    function updateStats() {
        const orders = getAllOrders();
        
        // Pending transactions count
        const pendingTransactions = orders.filter(order => order.status === 'pending');
        document.getElementById('pending-transactions-count').textContent = pendingTransactions.length;
        
        // Approved transactions count
        const approvedTransactions = orders.filter(order => 
            order.status === 'approved' || 
            order.status === 'completed'
        );
        document.getElementById('approved-transactions-count').textContent = approvedTransactions.length;
        
        // Calculate total value
        let totalValue = 0;
        approvedTransactions.forEach(transaction => {
            totalValue += transaction.amount;
        });
        
        document.getElementById('total-value').textContent = `$${totalValue.toFixed(2)}`;
    }
    
    /**
     * Open transaction details modal
     * @param {string} transactionId - The ID of the transaction to view
     */
    function openTransactionDetailsModal(transactionId) {
        const transaction = getOrderById(transactionId);
        if (!transaction) {
            showToast('تعذر العثور على المعاملة', 'error');
            return;
        }
        
        // Store current transaction ID for later use
        currentTransactionId = transactionId;
        
        // Get user info
        const user = getUserById(transaction.userId);
        const userName = user ? user.name : 'غير معروف';
        
        // Update modal content
        document.getElementById('transaction-id').textContent = transaction.id;
        document.getElementById('transaction-user').textContent = userName;
        document.getElementById('transaction-amount').textContent = `$${transaction.amount.toFixed(2)}`;
        document.getElementById('transaction-date').textContent = new Date(transaction.createdAt).toLocaleDateString();
        document.getElementById('transaction-method').textContent = getPaymentMethodText(transaction.paymentMethod);
        
        // Show relevant payment details
        const bankTransferDetails = document.getElementById('bank-transfer-details');
        const creditCardDetails = document.getElementById('credit-card-details');
        
        if (transaction.paymentMethod === 'bank-transfer') {
            bankTransferDetails.style.display = 'block';
            creditCardDetails.style.display = 'none';
            
            // Update bank transfer details
            document.getElementById('transaction-reference').textContent = 
                transaction.paymentData ? transaction.paymentData.transactionId : 'غير متوفر';
        } else if (transaction.paymentMethod === 'credit-card') {
            bankTransferDetails.style.display = 'none';
            creditCardDetails.style.display = 'block';
            
            // Update credit card details
            if (transaction.paymentData && transaction.paymentData.cardNumber) {
                const cardNumber = transaction.paymentData.cardNumber;
                // Show only last 4 digits
                document.getElementById('card-number').textContent = 
                    '**** **** **** ' + cardNumber.slice(-4);
            } else {
                document.getElementById('card-number').textContent = 'غير متوفر';
            }
        } else {
            bankTransferDetails.style.display = 'none';
            creditCardDetails.style.display = 'none';
        }
        
        // Open modal
        openModal('transaction-details-modal');
    }
    
    /**
     * Handle transaction approval
     */
    function handleApproveTransaction() {
        if (!currentTransactionId) {
            showToast('حدث خطأ أثناء معالجة المعاملة', 'error');
            return;
        }
        
        // Update transaction status
        updateOrderStatus(currentTransactionId, 'approved');
        
        // Close modal
        closeAllModals();
        
        // Refresh data
        loadPendingTransactions();
        loadRecentTransactions();
        updateStats();
        
        showToast('تمت الموافقة على المعاملة وإرسالها إلى البائع', 'success');
    }
    
    /**
     * Handle transaction rejection
     */
    function handleRejectTransaction() {
        if (!currentTransactionId) {
            showToast('حدث خطأ أثناء معالجة المعاملة', 'error');
            return;
        }
        
        if (confirm('هل أنت متأكد من رفض هذه المعاملة؟')) {
            // Update transaction status
            updateOrderStatus(currentTransactionId, 'rejected');
            
            // Close modal
            closeAllModals();
            
            // Refresh data
            loadPendingTransactions();
            loadRecentTransactions();
            updateStats();
            
            showToast('تم رفض المعاملة', 'success');
        }
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
        
        // Save back to local storage for all orders
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
        const ordersJson = localStorage.getItem('couponati_all_orders') || '[]';
        let allOrders = JSON.parse(ordersJson);
        
        // If no all_orders record exists yet, collect from user orders
        if (allOrders.length === 0) {
            const users = getAllUsers();
            users.forEach(user => {
                const userOrders = getUserOrders(user.id);
                allOrders = [...allOrders, ...userOrders];
            });
            
            // Save to all_orders for future use
            localStorage.setItem('couponati_all_orders', JSON.stringify(allOrders));
        }
        
        return allOrders;
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
     * Get payment method text
     * @param {string} method - Payment method code
     * @returns {string} - Payment method text in Arabic
     */
    function getPaymentMethodText(method) {
        switch (method) {
            case 'bank-transfer':
                return 'تحويل بنكي';
            case 'credit-card':
                return 'بطاقة ائتمان';
            default:
                return method;
        }
    }
    
    /**
     * Get status badge class
     * @param {string} status - Status code
     * @returns {string} - Badge class
     */
    function getStatusBadge(status) {
        switch (status) {
            case 'approved':
            case 'completed':
                return 'success';
            case 'pending':
            case 'processing':
                return 'warning';
            case 'rejected':
                return 'error';
            default:
                return 'warning';
        }
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
