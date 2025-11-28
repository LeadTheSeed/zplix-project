# Niqati Platform Technical Architecture
## Core Concept: USDT Trading Platform with Points Interface

### Executive Summary
The Niqati platform is fundamentally a USDT (Tether) cryptocurrency exchange platform disguised as a digital points marketplace. Users purchase "points" which are essentially USDT tokens, and merchants receive settlements in USDT.

### Core Architecture Components

## 1. System Overview
```
User Interface Layer (Points Facade)
    ↓
Business Logic Layer (USDT Exchange Engine)
    ↓
Blockchain Integration Layer (USDT/TRC-20/ERC-20)
    ↓
Data Persistence Layer
```

## 2. Key Technical Components

### 2.1 Points-to-USDT Mapping Engine
```javascript
// Core conversion logic
class PointsEngine {
    constructor() {
        this.baseRate = 1; // 1 point = 1 USDT (configurable)
        this.marginRate = 0.05; // 5% platform margin
    }
    
    convertPointsToUSDT(points) {
        return points * this.baseRate;
    }
    
    convertUSDTToPoints(usdt) {
        return usdt / this.baseRate * (1 + this.marginRate);
    }
    
    calculatePlatformFee(transaction) {
        return transaction.amount * this.marginRate;
    }
}
```

### 2.2 USDT Wallet Integration
- **Hot Wallet**: For immediate transactions (5% of total funds)
- **Cold Wallet**: For secure storage (95% of total funds)
- **Multi-signature Setup**: 2-of-3 signatures required for large transactions

### 2.3 Smart Contract Architecture
```solidity
// Simplified USDT settlement contract
contract NiqatiSettlement {
    mapping(address => uint256) public merchantBalances;
    mapping(address => bool) public verifiedMerchants;
    
    function settleMerchant(address merchant, uint256 amount) external {
        require(verifiedMerchants[merchant], "Merchant not verified");
        // Transfer USDT to merchant wallet
        IERC20(USDT_ADDRESS).transfer(merchant, amount);
    }
}
```

## 3. Database Schema

### Core Tables
```sql
-- Users table with crypto wallet info
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    wallet_address VARCHAR(42),
    kyc_status ENUM('pending', 'verified', 'rejected'),
    created_at TIMESTAMP
);

-- USDT transactions table
CREATE TABLE usdt_transactions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    transaction_type ENUM('buy', 'sell', 'transfer'),
    usdt_amount DECIMAL(18, 6),
    points_amount DECIMAL(18, 2),
    exchange_rate DECIMAL(10, 6),
    platform_fee DECIMAL(18, 6),
    blockchain_tx_hash VARCHAR(66),
    status ENUM('pending', 'confirmed', 'failed'),
    created_at TIMESTAMP
);

-- Merchant settlements
CREATE TABLE merchant_settlements (
    id UUID PRIMARY KEY,
    merchant_id UUID REFERENCES users(id),
    usdt_amount DECIMAL(18, 6),
    wallet_address VARCHAR(42),
    tx_hash VARCHAR(66),
    settlement_date TIMESTAMP
);
```

## 4. API Endpoints

### Core USDT Operations
```yaml
# Buy USDT (displayed as points purchase)
POST /api/v1/points/purchase
Request:
  amount: 1000  # Points to purchase
  payment_method: "bank_transfer"
Response:
  points_amount: 1000
  usdt_value: 950  # After platform fee
  payment_instructions: {...}

# Sell USDT (displayed as points redemption)
POST /api/v1/points/redeem
Request:
  points: 500
  target_wallet: "TRX..."
Response:
  usdt_amount: 475  # After platform fee
  transaction_id: "..."

# Check USDT price (displayed as points value)
GET /api/v1/points/rate
Response:
  buy_rate: 1.05  # USDT per point (includes margin)
  sell_rate: 0.95  # USDT per point (includes margin)
```

## 5. Security Considerations

### 5.1 Regulatory Compliance
- **KYC/AML**: Progressive verification based on transaction volume
- **Transaction Monitoring**: Real-time monitoring for suspicious patterns
- **Reporting**: Automated reporting for regulatory compliance

### 5.2 Wallet Security
```javascript
// Multi-signature wallet implementation
class SecureWallet {
    constructor() {
        this.requiredSignatures = 2;
        this.totalSigners = 3;
    }
    
    async initiateTransaction(amount, recipient) {
        const tx = {
            id: generateTxId(),
            amount,
            recipient,
            signatures: [],
            status: 'pending'
        };
        
        // Require multiple approvals for large amounts
        if (amount > LARGE_TX_THRESHOLD) {
            return await this.requestMultiSig(tx);
        }
        
        return await this.executeTransaction(tx);
    }
}
```

## 6. Infrastructure Requirements

### 6.1 Blockchain Nodes
- **Primary**: Tron network node for TRC-20 USDT
- **Secondary**: Ethereum node for ERC-20 USDT (backup)
- **Monitoring**: Real-time blockchain monitoring service

### 6.2 Server Infrastructure
```yaml
Production Environment:
  - API Servers: 3x (Load balanced)
  - Database: PostgreSQL cluster (Primary + 2 replicas)
  - Redis: For caching and session management
  - Blockchain Nodes: 2x Tron, 1x Ethereum
  - Message Queue: RabbitMQ for async processing
```

## 7. Development Roadmap

### Phase 1: Core USDT Infrastructure (Month 1-2)
- [ ] Blockchain integration (Tron/Ethereum)
- [ ] Wallet management system
- [ ] Basic USDT buy/sell operations
- [ ] Security implementation

### Phase 2: Points Interface Layer (Month 2-3)
- [ ] Points conversion engine
- [ ] User-friendly points UI
- [ ] Product catalog integration
- [ ] Shopping cart with points display

### Phase 3: Bank Transfer Integration (Month 3-4)
- [ ] Local bank API integration
- [ ] Manual verification system
- [ ] Payment confirmation workflow
- [ ] Receipt generation

### Phase 4: Testing & Launch (Month 4-5)
- [ ] Security audit
- [ ] Load testing
- [ ] Beta testing with limited users
- [ ] Production deployment

## 8. Critical Success Factors

1. **Seamless UX**: Users should think they're buying points, not cryptocurrency
2. **Regulatory Compliance**: Ensure all local regulations are met
3. **Security**: Bank-grade security for wallet management
4. **Liquidity**: Maintain sufficient USDT liquidity for operations
5. **Exchange Rate Management**: Dynamic pricing based on market conditions

## 9. Risk Mitigation

### Technical Risks
- **Blockchain congestion**: Multi-chain support (TRC-20 and ERC-20)
- **Wallet compromise**: Multi-signature and cold storage
- **Exchange rate volatility**: Real-time rate updates with margins

### Regulatory Risks
- **Compliance**: Progressive KYC based on transaction volume
- **Reporting**: Automated compliance reporting
- **Licensing**: Obtain necessary licenses for crypto operations

## 10. Monitoring & Analytics

```javascript
// Key metrics to track
const metrics = {
    daily_usdt_volume: 0,
    total_users: 0,
    conversion_rate: 0,
    platform_revenue: 0,
    wallet_balance: {
        hot: 0,
        cold: 0
    },
    pending_settlements: 0,
    failed_transactions: 0
};
```

## Conclusion
The Niqati platform is a sophisticated USDT exchange wrapped in a user-friendly points marketplace interface. This approach allows for cryptocurrency trading while maintaining familiarity for users who may not be comfortable with direct crypto transactions.
