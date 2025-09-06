// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentSection = 'dashboard';
    
    // Elements
    const sidebarLinks = document.querySelectorAll('.admin-nav a');
    const adminSections = document.querySelectorAll('.admin-section');
    const adminUser = document.querySelector('.admin-user');
    const adminDropdown = document.querySelector('.admin-dropdown');
    
    // Load dashboard data on page load
    loadDashboardData();
    
    // Refresh data every 5 seconds
    setInterval(() => {
        if (currentSection === 'dashboard') {
            loadDashboardData();
        }
    }, 5000);
    
    // Sidebar navigation
    if (sidebarLinks.length > 0) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('data-section')) {
                    e.preventDefault();
                    
                    // Remove active class from all links
                    sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
                    
                    // Add active class to clicked link
                    this.parentElement.classList.add('active');
                    
                    // Show corresponding section
                    const sectionId = this.getAttribute('data-section');
                    showSection(sectionId);
                }
            });
        });
    }
    
    // Show section
    function showSection(sectionId) {
        if (currentSection === sectionId) return;
        
        // Hide all sections
        adminSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            currentSection = sectionId;
            
            // Load section-specific data
            if (sectionId === 'dashboard') {
                loadDashboardData();
            } else if (sectionId === 'orders') {
                loadOrdersData();
            } else if (sectionId === 'redemptions') {
                loadRedemptionsData();
            }
        }
    }
    
    // Load dashboard data from localStorage
    function loadDashboardData() {
        // Get data from localStorage
        const pendingTickets = JSON.parse(localStorage.getItem('pendingTickets')) || [];
        const completedTransactions = JSON.parse(localStorage.getItem('completedTransactions')) || [];
        
        // Calculate statistics
        const totalOrders = pendingTickets.length + completedTransactions.length;
        const pendingOrders = pendingTickets.length;
        const completedOrders = completedTransactions.filter(t => t.status === 'approved').length;
        const redeemedCoupons = completedTransactions.filter(t => t.status === 'redeemed').length;
        
        // Calculate revenue (sum of all completed transactions)
        const totalRevenue = completedTransactions
            .filter(t => t.status === 'approved' || t.status === 'redeemed')
            .reduce((sum, t) => {
                const amount = parseFloat(t.totalAmount?.replace(/[^0-9.-]+/g, '') || 0);
                return sum + amount;
            }, 0);
        
        // Update dashboard widgets
        const totalOrdersEl = document.querySelector('.widget:nth-child(1) .widget-value');
        const pendingOrdersEl = document.querySelector('.widget:nth-child(2) .widget-value');
        const completedOrdersEl = document.querySelector('.widget:nth-child(3) .widget-value');
        const totalRevenueEl = document.querySelector('.widget:nth-child(4) .widget-value');
        
        if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
        if (pendingOrdersEl) pendingOrdersEl.textContent = pendingOrders;
        if (completedOrdersEl) completedOrdersEl.textContent = completedOrders;
        if (totalRevenueEl) totalRevenueEl.textContent = `$${totalRevenue.toFixed(2)}`;
        
        // Update recent orders table
        updateRecentOrdersTable(pendingTickets, completedTransactions);
        
        // Update recent redemptions table
        updateRecentRedemptionsTable(completedTransactions);
    }
    
    // Update recent orders table
    function updateRecentOrdersTable(pendingTickets, completedTransactions) {
        const ordersTableBody = document.querySelector('.orders-table tbody');
        if (!ordersTableBody) return;
        
        // Combine and sort all orders by date
        const allOrders = [...pendingTickets, ...completedTransactions]
            .sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp))
            .slice(0, 5); // Show only last 5 orders
        
        // Clear existing rows
        ordersTableBody.innerHTML = '';
        
        // Add new rows
        allOrders.forEach(order => {
            const row = document.createElement('tr');
            const status = order.status === 'pending' ? 'معلق' : 
                          order.status === 'approved' ? 'مكتمل' : 
                          order.status === 'redeemed' ? 'مستخدم' : 'غير معروف';
            const statusClass = order.status === 'pending' ? 'pending' : 
                               order.status === 'approved' ? 'completed' : 
                               order.status === 'redeemed' ? 'redeemed' : '';
            
            row.innerHTML = `
                <td>${order.ticketNumber}</td>
                <td>${order.productName || 'منتج غير محدد'}</td>
                <td>${order.totalAmount || '0.00'}</td>
                <td><span class="status ${statusClass}">${status}</span></td>
                <td>${new Date(order.createdAt || order.timestamp).toLocaleDateString('ar-SA')}</td>
                <td>
                    <button class="btn-icon view-btn" title="عرض"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon edit-btn" title="تعديل"><i class="fas fa-edit"></i></button>
                </td>
            `;
            ordersTableBody.appendChild(row);
        });
    }
    
    // Update recent redemptions table
    function updateRecentRedemptionsTable(completedTransactions) {
        const redemptionsTableBody = document.querySelector('.redemptions-table tbody');
        if (!redemptionsTableBody) return;
        
        // Filter only redeemed transactions
        const redemptions = completedTransactions
            .filter(t => t.status === 'redeemed')
            .sort((a, b) => new Date(b.redeemedAt || b.createdAt) - new Date(a.redeemedAt || a.createdAt))
            .slice(0, 5); // Show only last 5 redemptions
        
        // Clear existing rows
        redemptionsTableBody.innerHTML = '';
        
        // Add new rows
        redemptions.forEach(redemption => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${redemption.ticketNumber}</td>
                <td>${redemption.couponCode || 'N/A'}</td>
                <td>${redemption.productName || 'منتج غير محدد'}</td>
                <td><span class="status completed">مكتمل</span></td>
                <td>${new Date(redemption.redeemedAt || redemption.createdAt).toLocaleDateString('ar-SA')}</td>
                <td>
                    <button class="btn-icon view-btn" title="عرض"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon process-btn" title="معالجة"><i class="fas fa-cog"></i></button>
                </td>
            `;
            redemptionsTableBody.appendChild(row);
        });
    }
    
    // Load orders data
    function loadOrdersData() {
        // Similar to dashboard but for all orders
        const pendingTickets = JSON.parse(localStorage.getItem('pendingTickets')) || [];
        const completedTransactions = JSON.parse(localStorage.getItem('completedTransactions')) || [];
        updateRecentOrdersTable(pendingTickets, completedTransactions);
    }
    
    // Load redemptions data
    function loadRedemptionsData() {
        const completedTransactions = JSON.parse(localStorage.getItem('completedTransactions')) || [];
        updateRecentRedemptionsTable(completedTransactions);
    }
    
    // Admin user dropdown
    if (adminUser) {
        adminUser.addEventListener('click', function() {
            adminDropdown.style.display = adminDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!adminUser.contains(e.target)) {
                adminDropdown.style.display = 'none';
            }
        });
    }
    
    // Select all checkbox functionality
    const selectAllCheckboxes = document.querySelectorAll('.select-all');
    if (selectAllCheckboxes.length > 0) {
        selectAllCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const table = this.closest('table');
                const checkboxes = table.querySelectorAll('.select-item');
                
                checkboxes.forEach(item => {
                    item.checked = this.checked;
                });
            });
        });
    }
    
    // Widget buttons functionality
    const widgetActionBtns = document.querySelectorAll('.widget-actions .btn-icon');
    if (widgetActionBtns.length > 0) {
        widgetActionBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Create dropdown
                const dropdown = document.createElement('div');
                dropdown.className = 'widget-dropdown';
                dropdown.innerHTML = `
                    <ul>
                        <li><a href="#"><i class="fas fa-sync-alt"></i> تحديث</a></li>
                        <li><a href="#"><i class="fas fa-download"></i> تصدير البيانات</a></li>
                        <li><a href="#"><i class="fas fa-cog"></i> إعدادات</a></li>
                    </ul>
                `;
                
                // Remove existing dropdowns
                document.querySelectorAll('.widget-dropdown').forEach(d => d.remove());
                
                // Position and show dropdown
                this.parentNode.appendChild(dropdown);
                
                // Close dropdown when clicking outside
                document.addEventListener('click', function closeDropdown(e) {
                    if (!dropdown.contains(e.target) && e.target !== btn) {
                        dropdown.remove();
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            });
        });
    }
    
    // Add custom styles for dynamically added elements
    const style = document.createElement('style');
    style.textContent = `
        .widget-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background-color: white;
            min-width: 180px;
            box-shadow: var(--box-shadow-md);
            border-radius: var(--border-radius-md);
            overflow: hidden;
            z-index: 10;
        }
        
        .widget-dropdown ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .widget-dropdown ul li a {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-sm);
            color: var(--dark-color);
            transition: var(--transition);
        }
        
        .widget-dropdown ul li a:hover {
            background-color: var(--light-gray);
        }
    `;
    document.head.appendChild(style);
    
    // Initialize view-all links
    const viewAllLinks = document.querySelectorAll('.view-all');
    if (viewAllLinks.length > 0) {
        viewAllLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Navigate to corresponding section
                const sectionId = this.getAttribute('data-section');
                if (sectionId) {
                    // Find sidebar link and trigger click
                    const sidebarLink = document.querySelector(`.admin-nav a[data-section="${sectionId}"]`);
                    if (sidebarLink) {
                        sidebarLink.click();
                    }
                }
            });
        });
    }
    
    // Handle table action buttons
    const actionButtons = document.querySelectorAll('.orders-table .btn-icon, .redemptions-table .btn-icon');
    if (actionButtons.length > 0) {
        actionButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const action = this.classList.contains('view-btn') ? 'عرض' : 
                              this.classList.contains('edit-btn') ? 'تعديل' : 
                              this.classList.contains('process-btn') ? 'معالجة' : '';
                              
                const row = this.closest('tr');
                const id = row.querySelector('td:first-child').textContent;
                
                alert(`سيتم ${action} الطلب ${id}`);
                
                // In a real app, this would open a modal or navigate to a detail page
            });
        });
    }
    
    // Date range filter
    const dateRangeSelector = document.getElementById('date-range');
    if (dateRangeSelector) {
        dateRangeSelector.addEventListener('change', function() {
            const value = this.value;
            
            // In a real app, this would filter the dashboard data
            console.log(`Filtering dashboard by: ${value}`);
            
            // Show custom date picker if "custom" is selected
            if (value === 'custom') {
                // Create a modal for custom date range
                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.style.display = 'block';
                modal.innerHTML = `
                    <div class="modal-content" style="max-width: 400px;">
                        <div class="modal-header">
                            <h3>اختر نطاق التاريخ</h3>
                            <button class="close-modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label>من تاريخ:</label>
                                <input type="date" id="date-from" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>إلى تاريخ:</label>
                                <input type="date" id="date-to" class="form-control">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn-primary" id="apply-date-filter">تطبيق</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                // Set default dates
                const today = new Date();
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                
                document.getElementById('date-from').valueAsDate = lastMonth;
                document.getElementById('date-to').valueAsDate = today;
                
                // Close modal
                modal.querySelector('.close-modal').addEventListener('click', function() {
                    document.body.removeChild(modal);
                    dateRangeSelector.value = 'week'; // Reset to default
                });
                
                // Apply filter
                document.getElementById('apply-date-filter').addEventListener('click', function() {
                    const fromDate = document.getElementById('date-from').value;
                    const toDate = document.getElementById('date-to').value;
                    
                    // In a real app, this would filter the dashboard data
                    console.log(`Custom date range: ${fromDate} to ${toDate}`);
                    
                    document.body.removeChild(modal);
                });
            }
        });
    }
});
