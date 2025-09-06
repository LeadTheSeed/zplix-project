// Payment Gateway JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    
    // Elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const receiptModal = document.getElementById('receiptModal');
    const viewFullBtns = document.querySelectorAll('.view-full');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const actionBtns = document.querySelectorAll('.action-btn');
    const copyBtn = document.querySelector('.copy-btn');
    const searchBox = document.querySelector('.search-box');
    const sortBy = document.querySelector('.sort-by select');
    const paymentRequests = document.querySelector('.payment-requests');
    
    // Check for pending tickets from localStorage
    checkPendingTickets();
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }
    
    // View full receipt
    if (viewFullBtns.length > 0) {
        viewFullBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const receiptImg = this.closest('.receipt-image').querySelector('img').src;
                document.querySelector('.full-receipt img').src = receiptImg;
                receiptModal.style.display = 'block';
            });
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
    
    // Action buttons functionality
    if (actionBtns.length > 0) {
        actionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const paymentCard = this.closest('.payment-card');
                const ticketNumber = paymentCard.querySelector('.ticket-number h3 span').textContent;
                
                if (this.classList.contains('reject-btn')) {
                    if (confirm(`هل أنت متأكد من رفض الطلب ${ticketNumber}؟`)) {
                        // Simulate API request
                        showLoading(this);
                        
                        setTimeout(() => {
                            hideLoading(this);
                            paymentCard.remove();
                            showToast('تم رفض الطلب بنجاح');
                        }, 1500);
                    }
                } 
                else if (this.classList.contains('approve-btn')) {
                    // Simulate API request
                    showLoading(this);
                    
                    setTimeout(() => {
                        hideLoading(this);
                        
                        // Change card status
                        paymentCard.classList.remove('new');
                        paymentCard.classList.add('pending');
                        
                        // Update status badge
                        const statusBadge = paymentCard.querySelector('.status-badge');
                        statusBadge.textContent = 'قيد المعالجة';
                        statusBadge.classList.remove('new');
                        statusBadge.classList.add('pending');
                        
                        // Generate activation code
                        const activationCode = generateActivationCode();
                        
                        // Update card actions
                        const actionsDiv = paymentCard.querySelector('.payment-actions');
                        actionsDiv.classList.add('payment-details-actions');
                        actionsDiv.innerHTML = `
                            <div class="activation-code-section">
                                <span>كود التفعيل:</span>
                                <span class="activation-code">${activationCode}</span>
                                <button class="copy-btn"><i class="fas fa-copy"></i></button>
                            </div>
                            <button class="action-btn complete-btn"><i class="fas fa-check-double"></i> إكمال المعاملة</button>
                        `;
                        
                        // Add copy functionality
                        actionsDiv.querySelector('.copy-btn').addEventListener('click', function() {
                            copyToClipboard(activationCode);
                            showToast('تم نسخ كود التفعيل');
                        });
                        
                        // Add complete functionality
                        actionsDiv.querySelector('.complete-btn').addEventListener('click', function() {
                            completeTransaction(this, paymentCard);
                        });
                        
                        showToast('تم قبول الطلب وإرسال كود التفعيل');
                    }, 1500);
                }
                else if (this.classList.contains('complete-btn')) {
                    completeTransaction(this, paymentCard);
                }
            });
        });
    }
    
    // Copy activation code
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const code = this.previousElementSibling.textContent;
            copyToClipboard(code);
            showToast('تم نسخ كود التفعيل');
        });
    }
    
    // Complete transaction function
    function completeTransaction(btn, card) {
        if (confirm('هل أنت متأكد من إكمال المعاملة؟')) {
            // Simulate API request
            showLoading(btn);
            
            setTimeout(() => {
                hideLoading(btn);
                card.remove();
                showToast('تم إكمال المعاملة بنجاح');
            }, 1500);
        }
    }
    
    // Search functionality
    if (searchBox) {
        const searchInput = searchBox.querySelector('input');
        const searchButton = searchBox.querySelector('button');
        
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                search(query);
            }
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    search(query);
                }
            }
        });
    }
    
    // Sort functionality
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            const value = this.value;
            sortPayments(value);
        });
    }
    
    // Search function
    function search(query) {
        const paymentCards = document.querySelectorAll('.payment-card');
        let found = false;
        
        paymentCards.forEach(card => {
            const ticketNumber = card.querySelector('.ticket-number h3 span').textContent;
            
            if (ticketNumber.includes(query)) {
                card.style.display = 'block';
                found = true;
                
                // Highlight the match
                card.classList.add('highlight-search');
                setTimeout(() => {
                    card.classList.remove('highlight-search');
                }, 2000);
            } else {
                card.style.display = 'none';
            }
        });
        
        if (!found) {
            showToast('لم يتم العثور على نتائج');
        }
    }
    
    // Sort function
    function sortPayments(criteria) {
        const paymentCards = document.querySelectorAll('.payment-card');
        const cardsArray = Array.from(paymentCards);
        const container = document.querySelector('.payment-requests');
        
        switch (criteria) {
            case 'newest':
                cardsArray.sort((a, b) => {
                    const dateA = a.querySelector('.timestamp span').textContent;
                    const dateB = b.querySelector('.timestamp span').textContent;
                    return dateB.localeCompare(dateA);
                });
                break;
            case 'oldest':
                cardsArray.sort((a, b) => {
                    const dateA = a.querySelector('.timestamp span').textContent;
                    const dateB = b.querySelector('.timestamp span').textContent;
                    return dateA.localeCompare(dateB);
                });
                break;
            case 'amount-high':
                cardsArray.sort((a, b) => {
                    const amountA = parseFloat(a.querySelector('.detail-row.highlight .value').textContent);
                    const amountB = parseFloat(b.querySelector('.detail-row.highlight .value').textContent);
                    return amountB - amountA;
                });
                break;
            case 'amount-low':
                cardsArray.sort((a, b) => {
                    const amountA = parseFloat(a.querySelector('.detail-row.highlight .value').textContent);
                    const amountB = parseFloat(b.querySelector('.detail-row.highlight .value').textContent);
                    return amountA - amountB;
                });
                break;
        }
        
        // Remove all cards
        cardsArray.forEach(card => container.removeChild(card));
        
        // Add sorted cards
        cardsArray.forEach(card => container.appendChild(card));
    }
    
    // Helper functions
    function showLoading(element) {
        const originalText = element.innerHTML;
        element.setAttribute('data-original-text', originalText);
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
        element.disabled = true;
    }
    
    function hideLoading(element) {
        const originalText = element.getAttribute('data-original-text');
        element.innerHTML = originalText;
        element.disabled = false;
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }
    
    function generateActivationCode() {
        const prefix = 'ACT-';
        const part1 = Math.floor(1000 + Math.random() * 9000);
        const part2 = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}${part1}-${part2}`;
    }
    
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
    
    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #1c3c6d;
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
        
        .highlight-search {
            animation: highlightSearch 2s ease;
        }
        
        @keyframes highlightSearch {
            0%, 100% { box-shadow: none; }
            50% { box-shadow: 0 0 15px rgba(28, 60, 109, 0.5); }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize pagination
    const paginationBtns = document.querySelectorAll('.pagination .page-btn');
    if (paginationBtns.length > 0) {
        paginationBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.classList.contains('active') || 
                    this.classList.contains('prev') || 
                    this.classList.contains('next')) {
                    return;
                }
                
                // Remove active class from all buttons
                paginationBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // In a real app, this would load the corresponding page
                // For this demo, we'll just show a message
                showToast(`تم الانتقال إلى الصفحة ${this.textContent}`);
            });
        });
    }
    
    // Filter date
    const filterDate = document.querySelector('.filter-date input');
    if (filterDate) {
        filterDate.addEventListener('change', function() {
            const date = this.value;
            
            // In a real app, this would filter the completed payments by date
            // For this demo, we'll just show a message
            showToast(`تم تصفية المدفوعات المكتملة حسب التاريخ: ${date}`);
        });
    }
    
    // Check for pending tickets from localStorage
    function checkPendingTickets() {
        const pendingTicket = localStorage.getItem('pendingTicket');
        const ticketTimestamp = localStorage.getItem('ticketTimestamp');
        
        if (pendingTicket && ticketTimestamp && paymentRequests) {
            // Create a new payment card for the pending ticket
            const timestamp = new Date(ticketTimestamp);
            const formattedDate = `${timestamp.getDate().toString().padStart(2, '0')}-${(timestamp.getMonth() + 1).toString().padStart(2, '0')}-${timestamp.getFullYear()}, ${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;
            
            // Calculate remaining time (for demo purposes, we'll assume 45 minutes left)
            const remainingMinutes = 45;
            const remainingSeconds = 0;
            const remainingTime = `${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            
            // Create new payment card HTML
            const newPaymentCard = document.createElement('div');
            newPaymentCard.className = 'payment-card new';
            newPaymentCard.innerHTML = `
                <div class="payment-header">
                    <div class="ticket-number">
                        <h3>رقم التذكرة: <span>${pendingTicket}</span></h3>
                        <span class="status-badge new">جديد</span>
                    </div>
                    <div class="timestamp">
                        <i class="far fa-clock"></i>
                        <span>${formattedDate}</span>
                    </div>
                </div>
                
                <div class="payment-details">
                    <div class="product-details">
                        <h4>تفاصيل المنتج</h4>
                        <div class="detail-row">
                            <span class="label">المنتج:</span>
                            <span class="value">نقاط ببجي</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">الكمية:</span>
                            <span class="value">2,500 نقطة</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">السعر:</span>
                            <span class="value">$45.00</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">عمولة البوابة:</span>
                            <span class="value">$0.45</span>
                        </div>
                        <div class="detail-row highlight">
                            <span class="label">المجموع (دينار أردني):</span>
                            <span class="value">32.32 د.أ</span>
                        </div>
                    </div>
                    
                    <div class="payment-receipt">
                        <h4>إيصال الدفع</h4>
                        <div class="receipt-image">
                            <img src="img/receipt-placeholder.svg" alt="Receipt">
                            <button class="view-full"><i class="fas fa-search-plus"></i></button>
                        </div>
                    </div>
                    
                    <div class="payment-timer">
                        <h4>الوقت المتبقي</h4>
                        <div class="countdown-timer">${remainingTime}</div>
                        <p class="timer-note">سيتم إلغاء الطلب تلقائياً بعد انتهاء المدة</p>
                    </div>
                </div>
                
                <div class="payment-actions">
                    <button class="action-btn reject-btn"><i class="fas fa-times"></i> رفض</button>
                    <button class="action-btn approve-btn"><i class="fas fa-check"></i> تأكيد الدفع وإرسال الكود</button>
                </div>
            `;
            
            // Add the new payment card to the beginning of the list
            if (paymentRequests.firstChild) {
                paymentRequests.insertBefore(newPaymentCard, paymentRequests.firstChild);
            } else {
                paymentRequests.appendChild(newPaymentCard);
            }
            
            // Add event listeners to the new buttons
            const newViewFullBtn = newPaymentCard.querySelector('.view-full');
            if (newViewFullBtn) {
                newViewFullBtn.addEventListener('click', function() {
                    const receiptImg = this.closest('.receipt-image').querySelector('img').src;
                    document.querySelector('.full-receipt img').src = receiptImg;
                    receiptModal.style.display = 'block';
                });
            }
            
            const newActionBtns = newPaymentCard.querySelectorAll('.action-btn');
            if (newActionBtns.length > 0) {
                newActionBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        if (this.classList.contains('approve-btn')) {
                            approvePayment(pendingTicket, newPaymentCard);
                        } else if (this.classList.contains('reject-btn')) {
                            rejectPayment(pendingTicket, newPaymentCard);
                        }
                    });
                });
            }
        }
    }
    
    // Approve payment function
    function approvePayment(ticketNumber, card) {
        // Show loading
        const approveBtn = card.querySelector('.approve-btn');
        showLoading(approveBtn);
        
        // Generate activation code
        const activationCode = generateActivationCode();
        
        // Store activation code in localStorage (in a real app, this would be in a database)
        localStorage.setItem(`activationCode_${ticketNumber}`, activationCode);
        
        // Simulate API request
        setTimeout(() => {
            // Update card status
            card.classList.remove('new');
            card.classList.add('pending');
            
            // Update status badge
            const statusBadge = card.querySelector('.status-badge');
            statusBadge.textContent = 'تم التأكيد';
            statusBadge.classList.remove('new');
            statusBadge.classList.add('completed');
            
            // Update card actions
            const actionsDiv = card.querySelector('.payment-actions');
            actionsDiv.classList.add('payment-details-actions');
            actionsDiv.innerHTML = `
                <div class="activation-code-section">
                    <span>كود التفعيل:</span>
                    <span class="activation-code">${activationCode}</span>
                    <button class="copy-btn"><i class="fas fa-copy"></i></button>
                </div>
                <button class="action-btn complete-btn"><i class="fas fa-check-double"></i> إكمال المعاملة</button>
            `;
            
            // Add copy functionality
            actionsDiv.querySelector('.copy-btn').addEventListener('click', function() {
                copyToClipboard(activationCode);
                showToast('تم نسخ كود التفعيل');
            });
            
            // Add complete functionality
            actionsDiv.querySelector('.complete-btn').addEventListener('click', function() {
                completeTransaction(this, card, ticketNumber);
            });
            
            showToast('تم تأكيد الدفع وإرسال كود التفعيل');
        }, 2000);
    }
    
    // Reject payment function
    function rejectPayment(ticketNumber, card) {
        if (confirm(`هل أنت متأكد من رفض الطلب ${ticketNumber}؟`)) {
            // Show loading
            const rejectBtn = card.querySelector('.reject-btn');
            showLoading(rejectBtn);
            
            // Simulate API request
            setTimeout(() => {
                // Remove ticket from localStorage
                localStorage.removeItem('pendingTicket');
                localStorage.removeItem('ticketTimestamp');
                
                // Remove card from UI
                card.remove();
                
                showToast('تم رفض الطلب');
            }, 1500);
        }
    }
    
    // Complete transaction function
    function completeTransaction(btn, card, ticketNumber) {
        if (confirm('هل أنت متأكد من إكمال المعاملة؟')) {
            // Show loading
            showLoading(btn);
            
            // Simulate API request
            setTimeout(() => {
                // Remove ticket from localStorage
                localStorage.removeItem('pendingTicket');
                localStorage.removeItem('ticketTimestamp');
                
                // Remove card from UI
                card.remove();
                
                showToast('تم إكمال المعاملة بنجاح');
            }, 1500);
        }
    }
    
    // Generate activation code
    function generateActivationCode() {
        const prefix = 'ACT-';
        const part1 = Math.floor(1000 + Math.random() * 9000);
        const part2 = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}${part1}-${part2}`;
    }
});
