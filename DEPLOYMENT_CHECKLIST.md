# 🚀 Multi-Signature Treasury - Complete Deployment Checklist

## ✅ Task 1: Deploy Move Contracts to SUI Testnet

### Prerequisites
- [ ] Sui CLI installed ([Installation Guide](https://docs.sui.io/build/install))
- [ ] Sui Wallet configured with testnet
- [ ] Testnet SUI tokens (get from [faucet](https://discord.com/channels/916379725201563759/1037811694564560966))

### Step 1.1: Verify Environment
```bash
# Check Sui CLI version
sui --version

# Check active environment
sui client active-env

# Switch to testnet if needed
sui client switch --env testnet

# Check your address
sui client active-address

# Check your balance (you need at least 1 SUI)
sui client gas
```

### Step 1.2: Build Move Contracts
```bash
cd move-contracts
sui move build
```

**Expected Output:**
```
BUILDING MultiSigTreasury
Successfully verified dependencies on-chain against source.
```

### Step 1.3: Deploy to Testnet
```bash
# From move-contracts directory
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

**OR manually deploy:**
```bash
sui client publish --gas-budget 100000000
```

### Step 1.4: Save Deployment Information

After deployment, you'll receive output like:
```json
{
  "objectChanges": [
    {
      "type": "published",
      "packageId": "0x1234567890abcdef...",
      "version": "1",
      "digest": "..."
    }
  ],
  "transactionDigest": "ABC123XYZ..."
}
```

**📝 RECORD THESE VALUES:**

| Item | Value | Where to Find |
|------|-------|---------------|
| **Package ID** | `0x...` | `objectChanges[].packageId where type == "published"` |
| **Transaction Digest** | `ABC123...` | `transactionDigest` |
| **Deployer Address** | `0x...` | Your active address from `sui client active-address` |

**Explorer Links:**
- Package: `https://suiexplorer.com/object/YOUR_PACKAGE_ID?network=testnet`
- Transaction: `https://suiexplorer.com/txblock/YOUR_TX_DIGEST?network=testnet`

---

## ✅ Task 2: Connect Frontend to Deployed Package ID

### Step 2.1: Update Environment Variables
```bash
# In project root
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUI_PACKAGE_ID=YOUR_PACKAGE_ID_HERE
NEXT_PUBLIC_SUI_NETWORK=testnet
```

### Step 2.2: Update Configuration File
Edit `src/lib/sui-config.ts`:
```typescript
export const PACKAGE_ID = process.env.NEXT_PUBLIC_SUI_PACKAGE_ID || "YOUR_PACKAGE_ID_HERE";
export const NETWORK = "testnet";
```

### Step 2.3: Verify Module Paths
All module paths in hooks should automatically use:
```typescript
`${PACKAGE_ID}::treasury::create_treasury`
`${PACKAGE_ID}::proposal::create_proposal`
`${PACKAGE_ID}::policy_manager::set_spending_limit`
`${PACKAGE_ID}::emergency::emergency_withdraw`
```

### Step 2.4: Test Frontend Connection
```bash
npm run dev
```

Visit `http://localhost:3000` and:
- [ ] Connect Sui Wallet
- [ ] Check that wallet shows testnet network
- [ ] Verify balance displays correctly

---

## ✅ Task 3: End-to-End Transaction Testing

### Test 3.1: Create Treasury 🏦

**CLI Command:**
```bash
sui client call \
  --package YOUR_PACKAGE_ID \
  --module treasury \
  --function create_treasury \
  --args '["SIGNER_ADDRESS_1", "SIGNER_ADDRESS_2", "SIGNER_ADDRESS_3"]' 2 "My DAO Treasury" \
  --gas-budget 10000000
```

**Frontend:** Go to Dashboard → "Create Treasury" button

**Expected Output:**
```json
{
  "objectChanges": [
    {
      "type": "created",
      "objectType": "YOUR_PACKAGE_ID::treasury::Treasury",
      "objectId": "0xTREASURY_OBJECT_ID",
      ...
    }
  ],
  "transactionDigest": "CREATE_TREASURY_TX_DIGEST"
}
```

**📝 RECORD:**
- Treasury Object ID: `0x...`
- Transaction Digest: `CREATE_TREASURY_TX_DIGEST`

---

### Test 3.2: Deposit Funds 💰

**CLI Command:**
```bash
sui client call \
  --package YOUR_PACKAGE_ID \
  --module treasury \
  --function deposit \
  --args TREASURY_OBJECT_ID YOUR_COIN_OBJECT_ID \
  --gas-budget 10000000
```

**Frontend:** Dashboard → "Deposit Funds" button

**Expected Output:**
```json
{
  "effects": {
    "status": {
      "status": "success"
    }
  },
  "transactionDigest": "DEPOSIT_TX_DIGEST"
}
```

**Verify:**
```bash
sui client object TREASURY_OBJECT_ID
# Check balance field increased
```

**📝 RECORD:**
- Deposit Amount: `1000000000` (1 SUI)
- Transaction Digest: `DEPOSIT_TX_DIGEST`

---

### Test 3.3: Create Proposal 📝

**CLI Command:**
```bash
sui client call \
  --package YOUR_PACKAGE_ID \
  --module proposal \
  --function create_proposal \
  --args TREASURY_OBJECT_ID "RECIPIENT_ADDRESS" 500000000 "Marketing Campaign" "Q2 2024 campaign budget" 86400 \
  --gas-budget 10000000
```

**Frontend:** Proposals → "Create Proposal" button

**Expected Output:**
```json
{
  "objectChanges": [
    {
      "type": "created",
      "objectType": "YOUR_PACKAGE_ID::proposal::Proposal",
      "objectId": "0xPROPOSAL_OBJECT_ID",
      ...
    }
  ],
  "transactionDigest": "CREATE_PROPOSAL_TX_DIGEST"
}
```

**📝 RECORD:**
- Proposal Object ID: `0x...`
- Transaction Digest: `CREATE_PROPOSAL_TX_DIGEST`
- Amount: `500000000` (0.5 SUI)
- Time-lock: `86400` seconds (24 hours)

---

### Test 3.4: Sign Proposal (Multiple Signers) ✍️

**Signer 1:**
```bash
sui client call \
  --package YOUR_PACKAGE_ID \
  --module proposal \
  --function approve_proposal \
  --args PROPOSAL_OBJECT_ID \
  --gas-budget 10000000
```

**Switch to Signer 2:**
```bash
sui client switch --address SIGNER_2_ADDRESS
```

**Signer 2:**
```bash
sui client call \
  --package YOUR_PACKAGE_ID \
  --module proposal \
  --function approve_proposal \
  --args PROPOSAL_OBJECT_ID \
  --gas-budget 10000000
```

**Frontend:** Proposals → Select proposal → "Sign Proposal" button

**Expected Output (each signer):**
```json
{
  "effects": {
    "status": {
      "status": "success"
    }
  },
  "transactionDigest": "SIGN_1_TX_DIGEST"
}
```

**Verify Signatures:**
```bash
sui client object PROPOSAL_OBJECT_ID
# Check approvals vector length
```

**📝 RECORD:**
- Signer 1 TX: `SIGN_1_TX_DIGEST`
- Signer 2 TX: `SIGN_2_TX_DIGEST`
- Total Signatures: `2/2` (threshold met)

---

### Test 3.5: Execute Proposal ✅

**Wait for time-lock to expire:**
```bash
# Check current time vs proposal created_at + time_lock_duration
```

**Execute:**
```bash
sui client call \
  --package YOUR_PACKAGE_ID \
  --module proposal \
  --function execute_proposal \
  --args PROPOSAL_OBJECT_ID TREASURY_OBJECT_ID \
  --gas-budget 10000000
```

**Frontend:** Proposals → "Execute Proposal" button

**Expected Output:**
```json
{
  "effects": {
    "status": {
      "status": "success"
    }
  },
  "events": [
    {
      "type": "YOUR_PACKAGE_ID::proposal::ProposalExecuted",
      "proposal_id": "...",
      "amount": 500000000,
      "recipient": "..."
    }
  ],
  "transactionDigest": "EXECUTE_TX_DIGEST"
}
```

**Verify:**
```bash
# Check recipient received funds
sui client gas --address RECIPIENT_ADDRESS

# Check treasury balance decreased
sui client object TREASURY_OBJECT_ID

# Check proposal status changed to "executed"
sui client object PROPOSAL_OBJECT_ID
```

**📝 RECORD:**
- Execution TX: `EXECUTE_TX_DIGEST`
- Final Treasury Balance: `500000000` (0.5 SUI remaining)
- Proposal Status: `executed`

---

### Additional Tests (Optional)

**Test 3.6: Configure Spending Policy**
```bash
sui client call \
  --package YOUR_PACKAGE_ID \
  --module policy_manager \
  --function set_spending_limit \
  --args TREASURY_OBJECT_ID 1000000000 86400 \
  --gas-budget 10000000
```

**Test 3.7: Add to Whitelist**
```bash
sui client call \
  --package YOUR_PACKAGE_ID \
  --module policy_manager \
  --function add_to_whitelist \
  --args TREASURY_OBJECT_ID "RECIPIENT_ADDRESS" \
  --gas-budget 10000000
```

**Test 3.8: Emergency Withdraw**
```bash
sui client call \
  --package YOUR_PACKAGE_ID \
  --module emergency \
  --function emergency_withdraw \
  --args TREASURY_OBJECT_ID "EMERGENCY_ADDRESS" 100000000 "Critical security issue" \
  --gas-budget 10000000
```

---

## ✅ Task 4: Create Video Walkthrough Script

See `VIDEO_WALKTHROUGH_SCRIPT.md` for complete script.

---

## 📊 Final Submission Checklist

### Deployment Information
- [ ] Package ID: `0x...`
- [ ] Transaction Digest (Deploy): `...`
- [ ] Sui Explorer Link (Package): `https://suiexplorer.com/object/...?network=testnet`

### Treasury Creation
- [ ] Treasury Object ID: `0x...`
- [ ] Transaction Digest: `...`
- [ ] Signers: `[0x..., 0x..., 0x...]`
- [ ] Threshold: `2`

### Deposit Transaction
- [ ] Amount: `1 SUI`
- [ ] Transaction Digest: `...`
- [ ] Treasury Balance After: `1 SUI`

### Proposal Creation
- [ ] Proposal Object ID: `0x...`
- [ ] Transaction Digest: `...`
- [ ] Amount: `0.5 SUI`
- [ ] Recipient: `0x...`

### Signing Transactions
- [ ] Signer 1 TX: `...`
- [ ] Signer 2 TX: `...`
- [ ] Signatures Collected: `2/2`

### Execution Transaction
- [ ] Transaction Digest: `...`
- [ ] Final Status: `executed`
- [ ] Treasury Balance After: `0.5 SUI`

### Video & Documentation
- [ ] Video Walkthrough: `[YouTube/Loom Link]`
- [ ] GitHub Repository: `[Your Repo URL]`
- [ ] README.md with instructions
- [ ] PROJECT_DOCUMENTATION.md

---

## 🎬 Recording Your Video

Use this checklist while recording:

1. **Introduction (30 sec)**
   - Show project overview
   - Explain Multi-Sig Treasury concept

2. **Contract Deployment (2 min)**
   - Show `sui move build` output
   - Show `sui client publish` command
   - Display Package ID on explorer

3. **Frontend Setup (1 min)**
   - Show .env.local configuration
   - Show wallet connection

4. **Treasury Creation (2 min)**
   - Fill out treasury form
   - Submit transaction
   - Show treasury on explorer

5. **Proposal Workflow (4 min)**
   - Create proposal
   - Sign from multiple accounts
   - Execute after time-lock

6. **Policy Configuration (2 min)**
   - Show spending limits
   - Show whitelist management

7. **Emergency Workflow (1 min)**
   - Demonstrate emergency action
   - Show higher threshold requirement

8. **Conclusion (30 sec)**
   - Recap key features
   - Show transaction history

**Total Duration:** ~13 minutes

---

## 🆘 Troubleshooting

### Issue: "Insufficient gas"
**Solution:** Get more testnet SUI from faucet or increase `--gas-budget`

### Issue: "Object not found"
**Solution:** Verify object ID is correct with `sui client object OBJECT_ID`

### Issue: "Threshold not met"
**Solution:** Collect more signatures before attempting execution

### Issue: "Time-lock not expired"
**Solution:** Wait for time-lock duration or check `created_at + time_lock_duration`

### Issue: "Package not found"
**Solution:** Verify PACKAGE_ID in .env.local matches deployed package

---

## 📞 Support Resources

- Sui Documentation: https://docs.sui.io
- Sui Discord: https://discord.gg/sui
- Sui Explorer (Testnet): https://suiexplorer.com/?network=testnet
- GitHub Issues: [Your Repo]/issues

---

**✅ Once all checkboxes are complete, you're ready to submit your hackathon project!** 🎉
