// Payment Gateway JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const paymentRequestsContainer = document.getElementById('paymentRequests');
    const receiptModal = document.getElementById('receiptModal');

    // =============================================
    // INITIALIZATION
    // =============================================
    loadPendingTickets();
    
    // Make loadPendingTickets available globally for same-window communication
    window.loadPendingTickets = loadPendingTickets;
    window.paymentGatewayLoaded = true;
    
    // Listen for localStorage changes in other tabs/windows
    window.addEventListener('storage', (e) => {
        if (e.key === 'pendingTickets' || e.key === 'pendingTicketsTimestamp') {
            loadPendingTickets();
        }
    });
    
    // Check for new tickets every 5 seconds as a fallback
    setInterval(loadPendingTickets, 5000);

    // =============================================
    // CORE FUNCTIONS
    // =============================================

    function loadPendingTickets() {
        console.log('Loading pending tickets...');
        const tickets = JSON.parse(localStorage.getItem('pendingTickets')) || [];
        console.log('Found', tickets.length, 'pending tickets');
        
        // Clear previous timers to prevent memory leaks
        if (paymentRequestsContainer) {
            Array.from(paymentRequestsContainer.children).forEach(card => {
                const timerId = card.dataset.timerIntervalId;
                if (timerId) {
                    clearInterval(parseInt(timerId));
                }
            });

            paymentRequestsContainer.innerHTML = ''; // Clear the view

            if (tickets.length === 0) {
                paymentRequestsContainer.innerHTML = '<p class="no-requests">لا توجد طلبات دفع حالية.</p>';
                return;
            }

            // Sort tickets by timestamp (newest first)
            tickets.sort((a, b) => b.timestamp - a.timestamp);
            
            tickets.forEach(ticket => {
                const newPaymentCard = createPaymentCard(ticket);
                paymentRequestsContainer.appendChild(newPaymentCard);
            });
        } else {
            console.error('Payment requests container not found!');
        }
    }

    function createPaymentCard(ticket) {
        const newPaymentCard = document.createElement('div');
        newPaymentCard.className = 'payment-card new';
        newPaymentCard.dataset.ticketNumber = ticket.ticketNumber;

        newPaymentCard.innerHTML = `
            <div class="payment-header">
                <div class="ticket-number"><h3>رقم التذكرة: <span>${ticket.ticketNumber}</span></h3><span class="status-badge new">جديد</span></div>
                <div class="timestamp"><i class="far fa-clock"></i><span>${new Date(ticket.timestamp).toLocaleString('ar-SA')}</span></div>
            </div>
            <div class="payment-details">
                <div class="product-details">
                    <h4>تفاصيل المنتج</h4>
                    <div class="detail-row"><span class="label">المنتج:</span><span class="value">${ticket.productName || 'N/A'}</span></div>
                    <div class="detail-row"><span class="label">الكمية:</span><span class="value">${ticket.quantity || 1}</span></div>
                    <div class="detail-row highlight"><span class="label">المجموع:</span><span class="value">${ticket.totalAmount || 'N/A'} ${ticket.currency || ''}</span></div>
                </div>
                <div class="receipt-image">
                    <h4>إيصال الدفع</h4>
                    <img src="img/receipt-placeholder.svg" alt="إيصال الدفع">
                    <button class="view-full"><i class="fas fa-expand"></i> عرض كامل</button>
                </div>
                <div class="timer-details">
                    <h4>الوقت المتبقي</h4>
                    <div class="countdown-timer" id="timer-${ticket.ticketNumber}">--:--</div>
                    <p>سيتم إلغاء الطلب تلقائياً.</p>
                </div>
            </div>
            <div class="payment-actions">
                <button class="action-btn approve-btn"><i class="fas fa-check-circle"></i> تأكيد وإرسال الكود</button>
                <button class="action-btn reject-btn"><i class="fas fa-times-circle"></i> رفض</button>
            </div>
        `;

        // --- Synchronized Timer Logic ---
        const timerElement = newPaymentCard.querySelector(`#timer-${ticket.ticketNumber}`);
        const totalDuration = 60 * 60 * 1000; // 60 minutes
        const endTime = ticket.timestamp + totalDuration;

        const timerInterval = setInterval(() => {
            const timeLeft = endTime - Date.now();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerElement.textContent = '00:00';
                timerElement.style.color = '#fd397a';
                return;
            }
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);

        newPaymentCard.dataset.timerIntervalId = timerInterval;

        // --- Add Event Listeners for the new card ---
        newPaymentCard.querySelector('.approve-btn').addEventListener('click', () => approvePayment(ticket.ticketNumber, newPaymentCard));
        newPaymentCard.querySelector('.reject-btn').addEventListener('click', () => rejectPayment(ticket.ticketNumber, newPaymentCard));
        newPaymentCard.querySelector('.view-full').addEventListener('click', () => {
            const receiptImg = newPaymentCard.querySelector('.receipt-image img').src;
            document.querySelector('.full-receipt img').src = receiptImg;
            receiptModal.style.display = 'block';
        });

        return newPaymentCard;
    }

    // =============================================
    // ACTION HANDLERS
    // =============================================

    function approvePayment(ticketNumber, card) {
        const activationCode = 'AC' + Math.random().toString(36).substr(2, 8).toUpperCase();
        
        // Update localStorage: move ticket from pending to completed
        let pendingTickets = JSON.parse(localStorage.getItem('pendingTickets')) || [];
        const ticketToComplete = pendingTickets.find(t => t.ticketNumber === ticketNumber);
        if (!ticketToComplete) return;

        pendingTickets = pendingTickets.filter(t => t.ticketNumber !== ticketNumber);
        localStorage.setItem('pendingTickets', JSON.stringify(pendingTickets));
        // Update timestamp to trigger storage events
        localStorage.setItem('pendingTicketsTimestamp', Date.now());

        let completedTransactions = JSON.parse(localStorage.getItem('completedTransactions')) || [];
        ticketToComplete.status = 'approved';
        ticketToComplete.activationCode = activationCode;
        ticketToComplete.approvedAt = new Date().toISOString();
        completedTransactions.push(ticketToComplete);
        localStorage.setItem('completedTransactions', JSON.stringify(completedTransactions));
        // Update timestamp for completed transactions
        localStorage.setItem('completedTransactionsTimestamp', Date.now());

        // Update UI
        const statusBadge = card.querySelector('.status-badge');
        statusBadge.textContent = 'تم التأكيد';
        statusBadge.classList.remove('new');
        statusBadge.classList.add('completed');

        const actionsDiv = card.querySelector('.payment-actions');
        actionsDiv.innerHTML = `<div class="activation-code-section"><span>كود التفعيل:</span><span class="activation-code">${activationCode}</span></div>`;
        
        showToast('تم تأكيد الدفع وإرسال الكود بنجاح');
    }

    function rejectPayment(ticketNumber, card) {
        if (!confirm(`هل أنت متأكد من رفض الطلب ${ticketNumber}؟`)) return;

        // Update localStorage
        let pendingTickets = JSON.parse(localStorage.getItem('pendingTickets')) || [];
        const ticketToReject = pendingTickets.find(t => t.ticketNumber === ticketNumber);
        
        if (ticketToReject) {
            // Remove from pending tickets
            pendingTickets = pendingTickets.filter(t => t.ticketNumber !== ticketNumber);
            localStorage.setItem('pendingTickets', JSON.stringify(pendingTickets));
            localStorage.setItem('pendingTicketsTimestamp', Date.now());
            
            // Add to rejected transactions
            let rejectedTransactions = JSON.parse(localStorage.getItem('rejectedTransactions')) || [];
            ticketToReject.status = 'rejected';
            ticketToReject.rejectedAt = new Date().toISOString();
            rejectedTransactions.push(ticketToReject);
            localStorage.setItem('rejectedTransactions', JSON.stringify(rejectedTransactions));
            localStorage.setItem('rejectedTransactionsTimestamp', Date.now());
        }

        // Update UI
        card.remove();
        showToast('تم رفض الطلب');
    }

    // =============================================
    // HELPER FUNCTIONS
    // =============================================

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => { toast.classList.add('show'); }, 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { if (document.body.contains(toast)) { document.body.removeChild(toast); } }, 300);
        }, 3000);
    }
});
