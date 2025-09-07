// Fix for product card expansion issues
document.addEventListener('DOMContentLoaded', function() {
    console.log('Card fix script loaded');
    
    // Direct handling of expand buttons
    document.querySelectorAll('.expand-card').forEach(button => {
        console.log('Found expand button:', button);
        
        // Remove any existing click event listeners
        button.replaceWith(button.cloneNode(true));
        
        // Re-get the button after replacing it
        const newButton = button.parentElement.querySelector('.expand-card');
        
        // Add our new event listener
        newButton.addEventListener('click', function(e) {
            console.log('Expand button clicked:', this);
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.product-card');
            console.log('Found card:', card);
            
            // Close other cards
            document.querySelectorAll('.product-card.expanded').forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                    const controls = otherCard.querySelector('.product-controls');
                    const expandBtn = otherCard.querySelector('.expand-card');
                    if (controls) controls.style.display = 'none';
                    if (expandBtn) expandBtn.style.display = 'block';
                }
            });
            
            // Expand this card
            card.classList.add('expanded');
            this.style.display = 'none';
            
            const controls = card.querySelector('.product-controls');
            if (controls) {
                controls.style.display = 'block';
                console.log('Controls displayed');
            } else {
                console.error('Product controls not found in card');
            }
        });
    });
    
    // Direct handling of collapse buttons
    document.querySelectorAll('.collapse-card').forEach(button => {
        console.log('Found collapse button:', button);
        
        // Remove any existing click event listeners
        button.replaceWith(button.cloneNode(true));
        
        // Re-get the button after replacing it
        const newButton = button.parentElement.querySelector('.collapse-card');
        
        // Add our new event listener
        newButton.addEventListener('click', function(e) {
            console.log('Collapse button clicked:', this);
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.product-card');
            console.log('Collapsing card:', card);
            
            // Collapse this card
            card.classList.remove('expanded');
            const controls = card.querySelector('.product-controls');
            const expandBtn = card.querySelector('.expand-card');
            
            if (controls) controls.style.display = 'none';
            if (expandBtn) expandBtn.style.display = 'block';
        });
    });
    
    // Direct handling of add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        console.log('Found add to cart button:', button);
        
        // Remove any existing click event listeners
        button.replaceWith(button.cloneNode(true));
        
        // Re-get the button after replacing it
        const newButton = button.parentElement.querySelector('.add-to-cart');
        
        // Add our new event listener
        newButton.addEventListener('click', function(e) {
            console.log('Add to cart button clicked:', this);
            e.preventDefault();
            e.stopPropagation();
            
            // Process add to cart functionality
            // (This would need to work with the existing cart functionality)
        });
    });
    
    // Make sure expand buttons are visible
    document.querySelectorAll('.expand-card').forEach(button => {
        button.style.display = 'block';
    });
    
    // Make product-controls properly displayed when a card is expanded
    document.querySelectorAll('.product-card.expanded').forEach(card => {
        const controls = card.querySelector('.product-controls');
        if (controls) controls.style.display = 'block';
    });
    
    console.log('Card fix script initialization complete');
});
