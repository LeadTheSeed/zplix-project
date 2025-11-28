# Niqati Platform - Technical Implementation Guide

## 🎯 Core Business Model
**Niqati is a USDT cryptocurrency exchange platform disguised as a digital points marketplace.**

Users purchase "points" (which are actually USDT tokens) and merchants receive settlements in USDT. This approach provides a familiar interface for users who may not be comfortable with direct cryptocurrency transactions.

## 🏗️ Quick Start for Development

### Prerequisites
- Node.js 18+ and npm/yarn
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+
- Git

### Initial Setup

1. **Clone the repository**
```bash
git clone https://github.com/niqati/platform.git
cd platform
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start infrastructure with Docker**
```bash
docker-compose up -d
```

4. **Install dependencies**
```bash
npm install
# or
yarn install
```

5. **Run database migrations**
```bash
npm run migrate
```

6. **Start development server**
```bash
npm run dev
```

## 📁 Project Structure

```
niqati-platform/
├── src/
│   ├── api/              # API endpoints
│   ├── services/         # Business logic
│   │   ├── usdt/        # USDT/blockchain operations
│   │   ├── points/      # Points conversion engine
│   │   └── payment/     # Payment processing
│   ├── models/          # Database models
│   ├── middleware/      # Express middleware
│   ├── utils/           # Utility functions
│   └── config/          # Configuration files
├── blockchain/
│   ├── contracts/       # Smart contracts
│   ├── scripts/         # Deployment scripts
│   └── monitor/         # Blockchain monitoring service
├── admin/               # Admin dashboard (React)
├── public/             # Static files
├── tests/              # Test files
├── docs/               # Documentation
└── docker/             # Docker configurations
```

## 💰 USDT Integration Details

### Wallet Architecture
```javascript
// Wallet configuration
const walletConfig = {
  hot_wallet: {
    percentage: 5,  // 5% of total funds
    purpose: "Immediate transactions",
    security: "Multi-sig 2-of-3"
  },
  cold_wallet: {
    percentage: 95,  // 95% of total funds
    purpose: "Secure storage",
    security: "Hardware wallet + multi-sig"
  }
};
```

### Points to USDT Conversion
```javascript
// Core conversion logic
const PLATFORM_MARGIN = 0.05; // 5% margin

function calculatePointsPrice(usdtAmount) {
  return usdtAmount * (1 + PLATFORM_MARGIN);
}

function calculateUSDTValue(points) {
  return points / (1 + PLATFORM_MARGIN);
}
```

## 🔐 Security Implementation

### Critical Security Measures
1. **Multi-signature wallets** for all USDT transactions
2. **Cold storage** for 95% of funds
3. **Rate limiting** on all API endpoints
4. **KYC/AML** compliance for transactions > $1000
5. **2FA** for all user accounts
6. **Encryption** for sensitive data (AES-256)

### Environment Variables (Required)
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/niqati

# Blockchain
TRON_API_KEY=your_tron_api_key
TRON_NODE_URL=https://api.trongrid.io
HOT_WALLET_PRIVATE_KEY=encrypted_private_key
COLD_WALLET_ADDRESS=TRX_cold_wallet_address

# Security
JWT_SECRET=your_jwt_secret_min_32_chars
ENCRYPTION_KEY=your_encryption_key

# Payment Gateway (Initial Phase - Bank Transfer)
BANK_ACCOUNT_NUMBER=local_bank_account
BANK_IBAN=bank_iban
```

## 🚀 Deployment Strategy

### Phase 1: MVP Launch (Bank Transfer Only)
```yaml
Features:
  - User registration with email/phone
  - Bank transfer payment only
  - Manual payment verification
  - Basic points purchase/redemption
  - Simple admin dashboard

Timeline: 6-8 weeks
```

### Phase 2: USDT Integration
```yaml
Features:
  - USDT wallet creation
  - Automated USDT settlements
  - Multi-signature security
  - Real-time exchange rates

Timeline: 8-10 weeks
```

### Phase 3: Full Platform
```yaml
Features:
  - Multiple payment methods
  - Advanced fraud detection
  - Complete merchant portal
  - Analytics dashboard

Timeline: 10-12 weeks
```

## 📊 Database Schema (Core Tables)

```sql
-- Users with crypto wallet
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(42) UNIQUE,
    wallet_private_key_encrypted TEXT,
    points_balance DECIMAL(18, 2) DEFAULT 0,
    usdt_balance DECIMAL(18, 6) DEFAULT 0,
    kyc_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USDT transactions
CREATE TABLE usdt_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(20) NOT NULL, -- 'buy', 'sell', 'transfer'
    points_amount DECIMAL(18, 2),
    usdt_amount DECIMAL(18, 6) NOT NULL,
    exchange_rate DECIMAL(10, 6) NOT NULL,
    platform_fee DECIMAL(18, 6) NOT NULL,
    blockchain_network VARCHAR(10), -- 'TRC20', 'ERC20'
    tx_hash VARCHAR(66),
    from_address VARCHAR(42),
    to_address VARCHAR(42),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP
);

-- Bank transfers (Phase 1)
CREATE TABLE bank_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    transaction_id UUID REFERENCES usdt_transactions(id),
    amount DECIMAL(18, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    reference_number VARCHAR(50) UNIQUE,
    proof_document_url TEXT,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 API Workflow Example

### Purchase Points (Buy USDT) Flow
```javascript
// 1. User initiates purchase
POST /api/points/purchase
{
  "amount": 1000,  // AED
  "payment_method": "bank_transfer"
}

// 2. System response
{
  "order_id": "ORD-123456",
  "points_to_receive": 952.38,  // After 5% margin
  "usdt_value": 952.38,
  "payment_instructions": {
    "bank_name": "Emirates NBD",
    "account_number": "1234567890",
    "iban": "AE123456789012345678901",
    "reference": "ORD-123456",
    "amount": 1000,
    "validity_hours": 48
  }
}

// 3. User uploads payment proof
POST /api/transactions/ORD-123456/confirm
{
  "proof_image": "base64_encoded_image",
  "transfer_reference": "BANK-REF-789"
}

// 4. Admin verifies payment
POST /api/admin/verify-payment
{
  "transaction_id": "ORD-123456",
  "verified": true
}

// 5. System credits points/USDT
{
  "status": "completed",
  "points_credited": 952.38,
  "usdt_balance": 952.38,
  "wallet_address": "TRX123..."
}
```

## 🛠️ Development Commands

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run test               # Run tests
npm run lint               # Run linter

# Database
npm run migrate            # Run migrations
npm run seed               # Seed database
npm run db:reset           # Reset database

# Blockchain
npm run deploy:contracts   # Deploy smart contracts
npm run monitor:blockchain # Start blockchain monitor

# Docker
docker-compose up          # Start all services
docker-compose down        # Stop all services
docker-compose logs -f api # View API logs
```

## 📈 Monitoring & Analytics

### Key Metrics to Track
```javascript
const metrics = {
  // Business metrics
  daily_volume_usdt: 0,
  total_users: 0,
  active_users_24h: 0,
  conversion_rate: 0,
  
  // Technical metrics
  api_response_time: 0,
  blockchain_confirmation_time: 0,
  failed_transactions: 0,
  
  // Financial metrics
  platform_revenue: 0,
  total_usdt_locked: 0,
  pending_settlements: 0
};
```

## 🚨 Emergency Procedures

### Wallet Compromise
1. Immediately freeze all transactions
2. Move funds from hot to cold wallet
3. Generate new wallet addresses
4. Audit all recent transactions
5. Notify affected users

### System Outage
1. Switch to backup servers
2. Enable maintenance mode
3. Process critical transactions manually
4. Monitor blockchain for pending transactions
5. Communicate with users via email/SMS

## 📞 Support Contacts

- **Technical Lead**: tech@niqati.com
- **Security Team**: security@niqati.com
- **DevOps**: devops@niqati.com
- **Emergency Hotline**: +971-XXX-XXXX

## 📝 License & Compliance

- Platform operates under UAE financial regulations
- KYC/AML compliance required for all users
- Regular security audits by third-party firms
- Smart contracts audited by CertiK/similar

---

**Remember: The platform's success depends on maintaining the balance between user-friendly "points" interface and robust USDT backend operations.**
