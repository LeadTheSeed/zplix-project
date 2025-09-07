/**
 * Couponati - Authentication System
 * Simple authentication system using localStorage
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize auth forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutLink = document.getElementById('logout-link');
    
    // Set up event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
    
    /**
     * Handle login form submission
     * @param {Event} e - The form submission event
     */
    function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        
        // Validate input
        if (!email || !password) {
            showAuthMessage('login-form', 'يرجى تعبئة جميع الحقول', 'error');
            return;
        }
        
        // Check credentials against stored users
        const users = JSON.parse(localStorage.getItem('couponati_users') || '[]');
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            // Create a sanitized user object without password
            const sanitizedUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'customer'
            };
            
            // Store in localStorage
            localStorage.setItem('couponati_user', JSON.stringify(sanitizedUser));
            
            // Show success message
            showAuthMessage('login-form', 'تم تسجيل الدخول بنجاح', 'success');
            
            // Redirect based on role
            setTimeout(() => {
                redirectBasedOnRole(sanitizedUser.role);
            }, 1000);
        } else {
            showAuthMessage('login-form', 'البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
        }
    }
    
    /**
     * Handle register form submission
     * @param {Event} e - The form submission event
     */
    function handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // Validate input
        if (!name || !email || !password || !confirmPassword) {
            showAuthMessage('register-form', 'يرجى تعبئة جميع الحقول', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showAuthMessage('register-form', 'كلمة المرور وتأكيدها غير متطابقين', 'error');
            return;
        }
        
        // Check if email is already registered
        const users = JSON.parse(localStorage.getItem('couponati_users') || '[]');
        if (users.some(user => user.email === email)) {
            showAuthMessage('register-form', 'هذا البريد الإلكتروني مسجل بالفعل', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: generateId(),
            name,
            email,
            password,
            role: 'customer',
            createdAt: new Date().toISOString()
        };
        
        // Add to users array
        users.push(newUser);
        localStorage.setItem('couponati_users', JSON.stringify(users));
        
        // Create a sanitized user object without password
        const sanitizedUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        };
        
        // Log user in
        localStorage.setItem('couponati_user', JSON.stringify(sanitizedUser));
        
        // Show success message
        showAuthMessage('register-form', 'تم إنشاء الحساب وتسجيل الدخول بنجاح', 'success');
        
        // Redirect based on role
        setTimeout(() => {
            redirectBasedOnRole(sanitizedUser.role);
        }, 1000);
    }
    
    /**
     * Handle logout
     * @param {Event} e - The click event
     */
    function handleLogout(e) {
        e.preventDefault();
        
        // Clear user from localStorage
        localStorage.removeItem('couponati_user');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
    
    /**
     * Show authentication message
     * @param {string} formId - The ID of the form to show the message on
     * @param {string} message - The message to show
     * @param {string} type - The type of message (success, error)
     */
    function showAuthMessage(formId, message, type) {
        const form = document.getElementById(formId);
        
        // Remove any existing message
        const existingMessage = form.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `auth-message ${type}`;
        messageElement.textContent = message;
        
        // Add to form
        form.appendChild(messageElement);
        
        // Auto-remove after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }
    
    /**
     * Generate a random ID
     * @returns {string} - A random ID
     */
    function generateId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    
    /**
     * Redirect user based on role
     * @param {string} role - The user's role
     */
    function redirectBasedOnRole(role) {
        switch(role) {
            case 'admin':
                window.location.href = 'admin.html';
                break;
            case 'processor':
                window.location.href = 'processor.html';
                break;
            case 'seller':
                window.location.href = 'seller.html';
                break;
            case 'customer':
            default:
                window.location.href = 'dashboard.html';
                break;
        }
    }
    
    /**
     * Initialize admin users if needed
     * This is for demo purposes only - in a real app, admin users would be created in a secure way
     */
    function initializeAdminUsers() {
        const users = JSON.parse(localStorage.getItem('couponati_users') || '[]');
        
        // Check if we already have our sample users
        if (users.some(user => user.role === 'processor' || user.role === 'seller')) {
            return;
        }
        
        // Create sample users for each role
        const sampleUsers = [
            {
                id: 'processor1',
                name: 'شركة التحصيل',
                email: 'processor@couponati.com',
                password: 'processor123',
                role: 'processor',
                createdAt: new Date().toISOString()
            },
            {
                id: 'seller1',
                name: 'شركة البيع',
                email: 'seller@couponati.com',
                password: 'seller123',
                role: 'seller',
                createdAt: new Date().toISOString()
            },
            {
                id: 'admin1',
                name: 'المشرف',
                email: 'admin@couponati.com',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString()
            }
        ];
        
        // Add sample users to users array
        users.push(...sampleUsers);
        localStorage.setItem('couponati_users', JSON.stringify(users));
    }
    
    // Initialize admin users
    initializeAdminUsers();
});
