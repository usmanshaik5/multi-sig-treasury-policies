# ⚡ Quick Deployment Guide - Multi-Sig Treasury

## 🚀 Deploy in 5 Minutes

### Prerequisites
```bash
# Install Sui CLI
curl -fsSL https://sui.io/install.sh | sh

# Verify installation
sui --version

# Create testnet wallet (if needed)
sui client new-address ed25519

# Switch to testnet
sui client switch --env testnet

# Get testnet SUI
# Visit Discord: https://discord.com/channels/916379725201563759/1037811694564560966
# Request: "!faucet YOUR_ADDRESS"
```

---

## 📦 STEP 1: Deploy Contracts (2 min)

```bash
cd move-contracts
sui move build
sui client publish --gas-budget 100000000 --json > deployment-output.json
```

**Extract Package ID:**
```bash
cat deployment-output.json | jq -r '.objectChanges[] | select(.type == "published") | .packageId'
```

**Save this value!** Example: `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

---

## ⚙️ STEP 2: Configure Frontend (30 sec)

Edit `.env.local`:
```env
NEXT_PUBLIC_SUI_PACKAGE_ID=0xYOUR_PACKAGE_ID_HERE
NEXT_PUBLIC_SUI_NETWORK=testnet
```

Start frontend:
```bash
npm run dev
```

---

## 🏦 STEP 3: Create Treasury (1 min)

**Option A - CLI:**
```bash
sui client call \
  --package YOUR_PACKAGE_ID \
  --module treasury \
  --function create_treasury \
  --args '["0xSIGNER1", "0xSIGNER2", "0xSIGNER3"]' 2 "My Treasury" \
  --gas-budget 10000000 \
  --json > treasury-creation.json
```

**Extract Treasury ID:**
```bash
cat treasury-creation.json | jq -r '.objectChanges[] | select(.objectType | contains("treasury::Treasury")) | .objectId'
```

**Option B - Frontend:**
- Go to http://localhost:3000/dashboard
- Click "Create Treasury"
- Add signers and set threshold
- Submit transaction

**Save Treasury ID!** Example: `0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890`

---

## 💰 STEP 4: Deposit Funds (30 sec)

```bash
# Get a coin object ID
sui client gas --json | jq -r '.[0].gasCoinId'

# Deposit
sui client call \
  --package YOUR_PACKAGE_ID \
  --module treasury \
  --function deposit \
  --args TREASURY_ID COIN_OBJECT_ID \
  --gas-budget 10000000
```

**Or via Frontend:**
- Dashboard → "Deposit Funds"
- Enter amount → Submit

---

## 📝 STEP 5: Full Proposal Workflow (2 min)

### Create Proposal
```bash
sui client call \
  --package YOUR_PACKAGE_ID \
  --module proposal \
  --function create_proposal \
  --args TREASURY_ID "0xRECIPIENT" 500000000 "Test Proposal" "Testing workflow" 60 \
  --gas-budget 10000000 \
  --json > proposal-creation.json
```

**Extract Proposal ID:**
```bash
cat proposal-creation.json | jq -r '.objectChanges[] | select(.objectType | contains("proposal::Proposal")) | .objectId'
```

### Sign (Signer 1)
```bash
sui client call \
  --package YOUR_PACKAGE_ID \
  --module proposal \
  --function approve_proposal \
  --args PROPOSAL_ID \
  --gas-budget 10000000
```

### Sign (Signer 2)
```bash
# Switch to second signer
sui client switch --address SIGNER_2_ADDRESS

# Sign
sui client call \
  --package YOUR_PACKAGE_ID \
  --module proposal \
  --function approve_proposal \
  --args PROPOSAL_ID \
  --gas-budget 10000000
```

### Execute (after time-lock expires)
```bash
# Wait 60 seconds, then execute
sui client call \
  --package YOUR_PACKAGE_ID \
  --module proposal \
  --function execute_proposal \
  --args PROPOSAL_ID TREASURY_ID \
  --gas-budget 10000000
```

---

## 📊 Quick Commands Reference

### View Object
```bash
sui client object OBJECT_ID
```

### View Transaction
```bash
sui client tx-block TX_DIGEST
```

### Check Balance
```bash
sui client balance
```

### List Owned Objects
```bash
sui client objects
```

### Switch Account
```bash
sui client addresses  # List all addresses
sui client switch --address 0xYOUR_ADDRESS
```

---

## 🌐 Explorer Links

Replace with your actual IDs:

**Package:**
```
https://suiexplorer.com/object/YOUR_PACKAGE_ID?network=testnet
```

**Treasury:**
```
https://suiexplorer.com/object/YOUR_TREASURY_ID?network=testnet
```

**Proposal:**
```
https://suiexplorer.com/object/YOUR_PROPOSAL_ID?network=testnet
```

**Transaction:**
```
https://suiexplorer.com/txblock/YOUR_TX_DIGEST?network=testnet
```

---

## 📝 Record These for Submission

### Deployment
- [ ] Package ID: `0x...`
- [ ] Deploy TX Digest: `...`
- [ ] Deployer Address: `0x...`

### Treasury
- [ ] Treasury ID: `0x...`
- [ ] Creation TX: `...`
- [ ] Signers: `[0x..., 0x..., 0x...]`
- [ ] Threshold: `2`

### Deposit
- [ ] Deposit TX: `...`
- [ ] Amount: `1000000000` (1 SUI)

### Proposal
- [ ] Proposal ID: `0x...`
- [ ] Creation TX: `...`
- [ ] Sign TX 1: `...`
- [ ] Sign TX 2: `...`
- [ ] Execute TX: `...`

---

## 🐛 Quick Troubleshooting

**"Insufficient gas"**
```bash
# Get more testnet SUI from faucet
# Discord: !faucet YOUR_ADDRESS
```

**"Object not found"**
```bash
# Verify object exists
sui client object OBJECT_ID
```

**"Module not found"**
```bash
# Verify package ID is correct
# Check .env.local has correct NEXT_PUBLIC_SUI_PACKAGE_ID
```

**"Threshold not met"**
```bash
# Check how many signatures collected
sui client object PROPOSAL_ID | grep approvals
```

---

## 🎬 Ready to Record Video?

1. ✅ Deploy contracts → Get Package ID
2. ✅ Create treasury → Get Treasury ID
3. ✅ Deposit funds → Get TX digest
4. ✅ Create proposal → Get Proposal ID
5. ✅ Sign from 2 accounts → Get TX digests
6. ✅ Execute proposal → Get final TX digest

Use `VIDEO_WALKTHROUGH_SCRIPT.md` as your recording guide!

---

## 📤 Final Submission Format

```markdown
# Multi-Signature Treasury Submission

## Deployment Information
- **Package ID:** 0x...
- **Network:** Sui Testnet
- **Deploy Transaction:** https://suiexplorer.com/txblock/...?network=testnet

## Treasury Details
- **Treasury ID:** 0x...
- **Signers:** 3 addresses
- **Threshold:** 2 of 3
- **Balance:** 1.0 SUI

## Test Transactions
1. **Treasury Creation:** https://suiexplorer.com/txblock/...
2. **Deposit Funds:** https://suiexplorer.com/txblock/...
3. **Create Proposal:** https://suiexplorer.com/txblock/...
4. **Sign Proposal (1):** https://suiexplorer.com/txblock/...
5. **Sign Proposal (2):** https://suiexplorer.com/txblock/...
6. **Execute Proposal:** https://suiexplorer.com/txblock/...

## Links
- **Video Demo:** [YouTube/Loom Link]
- **GitHub Repo:** [Your Repo]
- **Live Frontend:** [Deployed URL]
- **Documentation:** See README.md
```

---

**⚡ Total Time: ~5-10 minutes to deploy everything!** 🚀
