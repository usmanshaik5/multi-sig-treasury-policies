# Multi-Signature Treasury - Move Contracts

This directory contains the Sui Move smart contracts for the Multi-Signature Treasury system.

## 📁 Structure

```
move-contracts/
├── Move.toml                    # Package configuration
├── sources/
│   ├── treasury.move           # Main treasury module
│   ├── proposal.move           # Proposal management
│   ├── policy_manager.move     # Policy enforcement
│   └── emergency.move          # Emergency procedures
├── scripts/
│   └── deploy.sh              # Deployment script
└── tests/                     # Unit tests (to be added)
```

## 🚀 Quick Start

### Prerequisites

1. **Install Sui CLI**
   ```bash
   cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
   ```

2. **Configure Sui Client**
   ```bash
   sui client
   # Follow prompts to create wallet
   ```

3. **Get Testnet SUI**
   ```bash
   sui client faucet
   # Or use Discord faucet: https://discord.gg/sui
   ```

### Build

```bash
cd move-contracts
sui move build
```

### Deploy to Testnet

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

This will:
- Build the Move package
- Deploy to Sui testnet
- Output the Package ID
- Save deployment info to `deployment-info.json`

### Manual Deployment

```bash
sui client publish --gas-budget 100000000
```

## 📝 Module Overview

### 1. Treasury Module (`treasury.move`)

**Purpose:** Main treasury holding funds and executing approved transactions

**Key Functions:**
- `create_treasury(owners, threshold)` - Create new treasury
- `deposit(treasury, coin)` - Deposit SUI into treasury
- `execute_withdrawal(treasury, recipient, amount, category)` - Execute approved withdrawal
- `freeze_treasury(treasury, admin_cap)` - Freeze treasury operations
- `get_balance(treasury)` - View treasury balance

**Events:**
- `TreasuryCreated`
- `DepositMade`
- `WithdrawalExecuted`
- `TreasuryFrozen`

### 2. Proposal Module (`proposal.move`)

**Purpose:** Manage spending proposals with multi-sig approval

**Key Functions:**
- `create_proposal(treasury, recipient, amount, category, description, time_lock)` - Create proposal
- `sign_proposal(proposal, treasury)` - Sign/approve proposal
- `execute_proposal(proposal, treasury)` - Execute after threshold + time-lock met
- `cancel_proposal(proposal)` - Cancel proposal (proposer only)

**Events:**
- `ProposalCreated`
- `ProposalSigned`
- `ProposalExecuted`
- `ProposalCancelled`

### 3. PolicyManager Module (`policy_manager.move`)

**Purpose:** Manage and enforce spending policies

**Key Functions:**
- `create_policy_config(treasury_id, limits...)` - Create policy configuration
- `set_category_limit(config, category, period, limit)` - Set spending limits
- `add_to_whitelist(config, recipient, expiration)` - Whitelist recipient
- `add_to_blacklist(config, recipient)` - Blacklist recipient
- `validate_transaction(config, recipient, amount, category)` - Validate against policies
- `calculate_time_lock(config, amount)` - Calculate required time-lock
- `add_threshold_tier(config, max_amount, required_sigs)` - Add amount-based threshold

**Events:**
- `PolicyConfigCreated`
- `SpendingLimitSet`
- `PolicyViolation`
- `WhitelistUpdated`

### 4. Emergency Module (`emergency.move`)

**Purpose:** Handle emergency withdrawals with higher security

**Key Functions:**
- `create_emergency_config(treasury_id, signers, threshold, cooldown)` - Setup emergency config
- `create_emergency_proposal(config, treasury, recipient, amount, justification)` - Create emergency proposal
- `sign_emergency_proposal(proposal, config)` - Sign emergency proposal
- `execute_emergency_withdrawal(proposal, config, treasury)` - Execute emergency withdrawal

**Events:**
- `EmergencyConfigCreated`
- `EmergencyProposalCreated`
- `EmergencyWithdrawalExecuted`
- `EmergencyCooldownViolation`

## 🧪 Testing

### Unit Tests

```bash
sui move test
```

### Integration Testing

See `tests/` directory for integration test scenarios.

## 📖 Usage Examples

### Example 1: Create Treasury

```bash
sui client call \
  --package $PACKAGE_ID \
  --module treasury \
  --function create_treasury \
  --args '["0x123...","0x456...","0x789..."]' 2 \
  --gas-budget 10000000
```

### Example 2: Deposit Funds

```bash
sui client call \
  --package $PACKAGE_ID \
  --module treasury \
  --function deposit \
  --args $TREASURY_ID $COIN_ID \
  --gas-budget 10000000
```

### Example 3: Create Proposal

```bash
sui client call \
  --package $PACKAGE_ID \
  --module proposal \
  --function create_proposal \
  --args $TREASURY_ID "0xRECIPIENT" 1000000000 "Marketing" "Q1 Marketing Campaign" 86400000 \
  --gas-budget 10000000
```

### Example 4: Sign Proposal

```bash
sui client call \
  --package $PACKAGE_ID \
  --module proposal \
  --function sign_proposal \
  --args $PROPOSAL_ID $TREASURY_ID \
  --gas-budget 10000000
```

### Example 5: Execute Proposal

```bash
sui client call \
  --package $PACKAGE_ID \
  --module proposal \
  --function execute_proposal \
  --args $PROPOSAL_ID $TREASURY_ID \
  --gas-budget 10000000
```

## 🔒 Security Features

1. **Multi-Signature Verification** - Cryptographically sound signature collection
2. **Time-Lock Enforcement** - Mandatory waiting period before execution
3. **Policy Validation** - All transactions validated against active policies
4. **Signature Replay Protection** - Each signer can only sign once
5. **Access Control** - Proper capability management
6. **Audit Trail** - Complete event logging for all actions

## 🎯 Policy System

### Spending Limits
- Daily/Weekly/Monthly limits per category
- Global limits across all categories
- Per-transaction caps

### Whitelist/Blacklist
- Approved recipient addresses
- Temporary whitelist with expiration
- Blacklist support

### Time-Lock Policies
- Base time-lock + amount-based increase
- Formula: `time_lock = base + (amount / factor)`

### Amount Thresholds
- Different signature requirements by amount
- Example: <1000 SUI: 2/5, 1000-10000: 3/5, >10000: 4/5

## 📊 Gas Optimization

- Efficient storage patterns using `Table` instead of `vector` for lookups
- Minimal computational overhead
- Batch processing support (up to 50 transactions)
- Smart use of Sui's object model

## 🐛 Error Codes

### Treasury Module
- `1` - Invalid threshold
- `2` - Invalid owners
- `3` - Insufficient balance
- `4` - Treasury frozen
- `5` - Unauthorized

### Proposal Module
- `1` - Not owner
- `2` - Already signed
- `3` - Time-lock not expired
- `4` - Threshold not met
- `5` - Proposal already executed
- `6` - Proposal cancelled
- `7` - Invalid amount
- `8` - Not proposer

### PolicyManager Module
- `1` - Policy violation
- `2` - Invalid policy
- `3` - Unauthorized

### Emergency Module
- `1` - Not emergency signer
- `2` - Cooldown not expired
- `3` - Emergency threshold not met
- `4` - Already signed
- `5` - Proposal executed

## 📚 Additional Resources

- [Sui Documentation](https://docs.sui.io/)
- [Move Book](https://move-book.com/)
- [Sui Explorer](https://suiexplorer.com/)
- [Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript)

## 🤝 Contributing

See main project README for contribution guidelines.

## 📄 License

MIT License - See LICENSE file for details.
