// Authentication check script
(function() {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('zplix_auth');
    
    if (isAuthenticated !== 'true') {
        // Not authenticated, redirect to login page
        window.location.href = '../index.html';
    }
    
    // Add logout button to the page
    document.addEventListener('DOMContentLoaded', function() {
        // Create logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'تسجيل الخروج';
        logoutBtn.className = 'logout-btn';
        logoutBtn.style.position = 'fixed';
        logoutBtn.style.top = '10px';
        logoutBtn.style.right = '10px';
        logoutBtn.style.zIndex = '9999';
        logoutBtn.style.padding = '8px 16px';
        logoutBtn.style.backgroundColor = '#fd397a';
        logoutBtn.style.color = 'white';
        logoutBtn.style.border = 'none';
        logoutBtn.style.borderRadius = '4px';
        logoutBtn.style.cursor = 'pointer';
        logoutBtn.style.fontWeight = 'bold';
        
        // Add logout functionality
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('zplix_auth');
            window.location.href = '../index.html';
        });
        
        // Add button to the page
        document.body.appendChild(logoutBtn);
    });
})();
