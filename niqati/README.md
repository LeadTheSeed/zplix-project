# Niqati (نقاطي) Website

A standalone responsive HTML, CSS, and JavaScript website for purchasing and redeeming digital points.

## Overview

Niqati (meaning "My Points" in Arabic) is a platform that allows users to purchase digital points for various services like games (PUBG, Roblox), social media (TikTok), and online shopping (Amazon gift cards). The website features three main interfaces:

1. **Customer Interface**: For browsing and purchasing digital points
2. **UAE Company Admin Interface**: For managing orders and coupons
3. **Jordanian Payment Gateway Interface**: For processing payment requests

## Features

### Customer Interface
- Responsive design for both mobile and desktop
- Bilingual support (Arabic and English)
- Interactive product catalog with filtering
- Shopping cart functionality
- Checkout process with ticket generation
- Coupon verification and redemption

### Admin Interface
- Dashboard with sales analytics
- Order management
- Coupon generation and tracking
- Redemption request handling

### Payment Gateway Interface
- Payment request processing
- Activation code generation
- Transaction history

## Technologies Used

- HTML5
- CSS3 with modern features (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (ES6+)
- Bootstrap 5 (for responsive grid and components)
- Font Awesome (for icons)
- Google Fonts (Cairo font)

## Project Structure

```
niqati-website/
├── css/
│   ├── style.css
│   ├── admin.css
│   └── payment-gateway.css
├── js/
│   ├── main.js
│   ├── admin.js
│   └── payment-gateway.js
├── img/
│   └── ... (images)
├── index.html
├── index-en.html
├── redeem.html
├── admin.html
├── payment-gateway.html
└── README.md
```

## Getting Started

1. Clone this repository or download the files
2. Open `index.html` in your web browser to view the Arabic version
3. Open `index-en.html` in your web browser to view the English version

## Page Descriptions

### Main Pages
- **index.html / index-en.html**: Homepage with product catalog
- **redeem.html**: Coupon verification and redemption
- **admin.html**: UAE company admin interface
- **payment-gateway.html**: Jordanian payment gateway interface

## Implementation Notes

- The website is purely frontend with simulated API calls
- All interactions (adding to cart, checkout, etc.) are handled with vanilla JavaScript
- For a production implementation, backend services would be needed for:
  - User authentication
  - Payment processing
  - Database storage
  - Coupon generation and validation

## Design Choices

- Minimalist, clean design following modern UI/UX trends
- Color scheme using gradients of blue and purple for a trustworthy, premium feel
- Mobile-first approach for responsive design
- Intuitive interface for a seamless user experience
- Bilingual support with RTL (right-to-left) layout for Arabic

## Future Enhancements

- User authentication system
- Email integration for order confirmation
- Real payment gateway integration
- Admin dashboard with advanced analytics
- Mobile app integration
