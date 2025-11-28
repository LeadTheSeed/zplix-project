# مخطط قاعدة البيانات لمنصة نقاطي | Niqati Platform Database Schema

## Core Tables Structure

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    country_code VARCHAR(2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    
    -- Wallet information
    wallet_address VARCHAR(42) UNIQUE,
    wallet_private_key_encrypted TEXT,
    points_balance DECIMAL(18, 2) DEFAULT 0,
    usdt_balance DECIMAL(18, 6) DEFAULT 0,
    locked_balance DECIMAL(18, 6) DEFAULT 0,
    
    -- KYC/AML
    kyc_status VARCHAR(20) DEFAULT 'pending',
    kyc_level INTEGER DEFAULT 0,
    kyc_documents JSONB,
    
    -- Account status
    status VARCHAR(20) DEFAULT 'active',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);
```

### USDT Transactions Table

```sql
CREATE TABLE usdt_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL, -- buy, sell, transfer, settlement
    
    -- Amounts
    points_amount DECIMAL(18, 2),
    usdt_amount DECIMAL(18, 6) NOT NULL,
    local_currency_amount DECIMAL(18, 2),
    currency VARCHAR(3),
    exchange_rate DECIMAL(10, 6) NOT NULL,
    platform_fee DECIMAL(18, 6) DEFAULT 0,
    net_amount DECIMAL(18, 6),
    
    -- Blockchain details
    blockchain_network VARCHAR(10), -- TRC20, ERC20
    tx_hash VARCHAR(66) UNIQUE,
    from_address VARCHAR(42),
    to_address VARCHAR(42),
    confirmations INTEGER DEFAULT 0,
    gas_fee DECIMAL(18, 6),
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'pending',
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    failed_at TIMESTAMP
);
```

### Bank Transfers Table (Phase 1 - Primary Payment Method)

```sql
CREATE TABLE bank_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES usdt_transactions(id),
    
    -- Transfer details
    amount DECIMAL(18, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    bank_name VARCHAR(100),
    sender_account VARCHAR(50),
    sender_name VARCHAR(255),
    
    -- Verification
    proof_document_url TEXT,
    proof_uploaded_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    verification_notes TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending',
    expires_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Merchant Accounts Table

```sql
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_registration VARCHAR(100),
    business_type VARCHAR(50),
    
    -- Settlement preferences
    settlement_currency VARCHAR(3) DEFAULT 'USDT',
    settlement_wallet_address VARCHAR(42),
    settlement_frequency VARCHAR(20) DEFAULT 'daily',
    minimum_settlement_amount DECIMAL(18, 6) DEFAULT 100,
    
    -- Fees
    merchant_fee_percentage DECIMAL(5, 2) DEFAULT 2.5,
    
    -- Status
    verification_status VARCHAR(20) DEFAULT 'pending',
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Merchant Settlements Table

```sql
CREATE TABLE merchant_settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    
    -- Settlement details
    usdt_amount DECIMAL(18, 6) NOT NULL,
    platform_fee DECIMAL(18, 6) DEFAULT 0,
    net_amount DECIMAL(18, 6) NOT NULL,
    wallet_address VARCHAR(42) NOT NULL,
    
    -- Blockchain details
    tx_hash VARCHAR(66) UNIQUE,
    network VARCHAR(10) DEFAULT 'TRC20',
    confirmations INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    confirmed_at TIMESTAMP
);
```

### Products Table

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(id),
    
    -- Product details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    subcategory VARCHAR(50),
    
    -- Pricing
    points_price DECIMAL(18, 2) NOT NULL,
    usdt_value DECIMAL(18, 6) NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    
    -- Inventory
    stock_quantity INTEGER DEFAULT 0,
    unlimited_stock BOOLEAN DEFAULT FALSE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Order details
    total_points DECIMAL(18, 2) NOT NULL,
    total_usdt DECIMAL(18, 6) NOT NULL,
    platform_fee DECIMAL(18, 6) DEFAULT 0,
    
    -- Payment
    payment_method VARCHAR(20), -- bank_transfer, wallet, usdt
    payment_status VARCHAR(20) DEFAULT 'pending',
    
    -- Status
    order_status VARCHAR(20) DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP
);
```

### Order Items Table

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    
    -- Item details
    quantity INTEGER NOT NULL,
    points_price DECIMAL(18, 2) NOT NULL,
    usdt_value DECIMAL(18, 6) NOT NULL,
    
    -- Delivery
    delivery_status VARCHAR(20) DEFAULT 'pending',
    delivery_code TEXT,
    delivered_at TIMESTAMP
);
```

### Exchange Rates Table

```sql
CREATE TABLE exchange_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    currency_pair VARCHAR(10) NOT NULL, -- e.g., USDT/AED
    rate DECIMAL(10, 6) NOT NULL,
    buy_rate DECIMAL(10, 6) NOT NULL, -- Rate for buying USDT
    sell_rate DECIMAL(10, 6) NOT NULL, -- Rate for selling USDT
    source VARCHAR(50), -- Exchange or API source
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Admin Users Table

```sql
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL, -- super_admin, admin, support, finance
    permissions JSONB,
    
    -- Security
    two_factor_enabled BOOLEAN DEFAULT TRUE,
    two_factor_secret VARCHAR(255),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);
```

## Database Indexes

```sql
-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_transactions_user_id ON usdt_transactions(user_id);
CREATE INDEX idx_transactions_status ON usdt_transactions(status);
CREATE INDEX idx_transactions_tx_hash ON usdt_transactions(tx_hash);
CREATE INDEX idx_bank_transfers_reference ON bank_transfers(reference_number);
CREATE INDEX idx_bank_transfers_status ON bank_transfers(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
```

## Entity Relationship Diagram (ERD)

```
Users 1:N USDT Transactions
Users 1:1 Merchants
Merchants 1:N Products
Merchants 1:N Merchant Settlements
Users 1:N Orders
Orders 1:N Order Items
Products 1:N Order Items
USDT Transactions 1:1 Bank Transfers (Phase 1)
```

## Data Flow

1. **User Registration Flow**:
   - User signs up → User record created → Wallet created → KYC verification

2. **Bank Transfer Payment Flow (Phase 1)**:
   - User initiates points purchase → USDT transaction created (pending) → Bank transfer record created → User uploads proof → Admin verifies → Transaction completed → Points credited

3. **Points to USDT Conversion**:
   - 1 USDT = 1 Point (base rate)
   - Platform adds 5% margin when selling points
   - Example: 100 USDT = 105 Points when buying
