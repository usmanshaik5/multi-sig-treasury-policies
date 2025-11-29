# 🎬 Multi-Signature Treasury - Video Walkthrough Script

## 📝 Complete Script for Hackathon Submission

**Duration:** ~13 minutes  
**Sections:** 8 segments  
**Required Materials:** Screen recording software (OBS, Loom, QuickTime)

---

## 🎯 INTRO SLIDE (30 seconds)

**[Show Title Screen]**

### Script:
> "Hello! I'm presenting the **Multi-Signature Treasury System** - a secure, programmable treasury management platform built on Sui blockchain for DAOs and organizations."

**[Show Problem Statement Slide]**

> "Traditional multi-sig wallets lack flexibility. Our solution provides programmable spending policies, time-locked proposals, category budgets, and emergency procedures - all while maintaining security through multi-signature approval."

**Key Points to Show:**
- Project name and logo
- Problem: DAO treasury management complexity
- Solution: Programmable multi-sig with policies

---

## 📦 PART 1: Contract Deployment (2 minutes)

**[Show Terminal Window]**

### Script:
> "Let's start by deploying our Move smart contracts to Sui testnet. Our system consists of four core modules."

**[Navigate to project directory]**

```bash
cd move-contracts
ls sources/
```

> "We have four modules:
> - **Treasury** - Manages funds and executions
> - **Proposal** - Handles spending proposals with time-locks
> - **Policy Manager** - Enforces spending rules
> - **Emergency** - Handles emergency withdrawals"

**[Show code briefly - treasury.move]**

```bash
cat sources/treasury.move | head -30
```

> "The Treasury module holds funds, tracks signers, and maintains a threshold for approvals."

**[Build contracts]**

```bash
sui move build
```

> "First, we build the contracts to verify there are no errors."

**[Wait for build success]**

> "Build successful! Now let's deploy to testnet."

**[Deploy to testnet]**

```bash
sui client publish --gas-budget 100000000
```

> "Publishing to Sui testnet... This will take a moment."

**[Wait for deployment - show output]**

> "Deployment complete! Here's our Package ID: [READ PACKAGE ID FROM OUTPUT]"

**[Open Sui Explorer]**

```
https://suiexplorer.com/object/YOUR_PACKAGE_ID?network=testnet
```

> "We can verify the deployment on Sui Explorer. Here we see all four modules published successfully."

**Key Points:**
- ✅ Show all 4 module files
- ✅ Demonstrate successful build
- ✅ Show deployment transaction
- ✅ Display Package ID prominently
- ✅ Open and show Sui Explorer page

---

## ⚙️ PART 2: Frontend Setup (1 minute)

**[Show Code Editor - .env.local file]**

### Script:
> "Now let's connect our frontend to the deployed contracts."

**[Create/edit .env.local]**

```env
NEXT_PUBLIC_SUI_PACKAGE_ID=0x1234567890abcdef...
NEXT_PUBLIC_SUI_NETWORK=testnet
```

> "We add our Package ID to the environment variables."

**[Show sui-config.ts file]**

```typescript
export const PACKAGE_ID = process.env.NEXT_PUBLIC_SUI_PACKAGE_ID;
```

> "Our configuration automatically uses this Package ID for all contract interactions."

**[Show terminal - start dev server]**

```bash
npm run dev
```

> "Starting the development server... and we're live at localhost:3000."

**[Open browser to localhost:3000]**

> "Here's our Multi-Sig Treasury interface. Let's connect a wallet."

**[Click "Connect Wallet" button]**

> "I'm connecting my Sui Wallet configured for testnet."

**[Show wallet connection success with balance]**

> "Connected! We can see my testnet address and SUI balance."

**Key Points:**
- ✅ Show Package ID configuration
- ✅ Display frontend loading
- ✅ Demonstrate wallet connection
- ✅ Show testnet network indicator

---

## 🏦 PART 3: Creating a Treasury (2 minutes)

**[Navigate to Dashboard page]**

### Script:
> "Let's create our first multi-signature treasury."

**[Click "Create Treasury" button]**

> "The treasury creation dialog lets us configure signers and threshold."

**[Fill out form]**

**Treasury Name:** `DAO Main Treasury`

> "I'll name this 'DAO Main Treasury'."

**[Add signer addresses]**

```
Signer 1: 0x[YOUR_ADDRESS_1]
Signer 2: 0x[YOUR_ADDRESS_2]  
Signer 3: 0x[YOUR_ADDRESS_3]
```

> "Adding three signer addresses - these will be the only addresses authorized to approve spending."

**[Set threshold]**

**Threshold:** `2 of 3`

> "Setting the threshold to 2 of 3, meaning any two signers can approve a transaction."

**[Click "Create Treasury"]**

> "Submitting the transaction..."

**[Show wallet approval popup]**

> "Approving in my Sui Wallet..."

**[Wait for transaction confirmation]**

> "Treasury created successfully! Here's our Treasury Object ID."

**[Show Treasury Object ID]**

```
Treasury ID: 0xabcdef123456...
```

**[Open Sui Explorer - show treasury object]**

```
https://suiexplorer.com/object/TREASURY_ID?network=testnet
```

> "On Sui Explorer, we can inspect the treasury object. We see:
> - Three signers
> - Threshold of 2
> - Initial balance of 0
> - Empty transaction history"

**[Back to Dashboard - show treasury details]**

> "Back on our dashboard, the treasury is now visible with all its details."

**Key Points:**
- ✅ Show form with all fields
- ✅ Demonstrate signer management
- ✅ Display transaction signing
- ✅ Show Treasury Object on explorer
- ✅ Verify treasury appears in UI

---

## 💰 PART 4: Depositing Funds (1.5 minutes)

**[On Dashboard - click "Deposit Funds"]**

### Script:
> "Now let's fund our treasury with some SUI."

**[Deposit dialog opens]**

**Amount:** `1.0 SUI`

> "I'll deposit 1 SUI into the treasury."

**[Click "Deposit"]**

> "Submitting the deposit transaction..."

**[Approve in wallet]**

> "Confirming in wallet... deposit complete!"

**[Show updated balance]**

> "Our treasury balance is now 1.0 SUI, ready for spending proposals."

**[Show transaction on explorer]**

```
TX Digest: ABC123XYZ...
```

> "Here's the deposit transaction on Sui Explorer showing the coin transfer."

**Key Points:**
- ✅ Show deposit amount entry
- ✅ Display transaction confirmation
- ✅ Show balance update in real-time
- ✅ Link to transaction on explorer

---

## 📝 PART 5: Creating & Signing Proposal (4 minutes)

**[Navigate to Proposals page]**

### Script:
> "Now comes the core workflow - creating a spending proposal."

**[Click "Create Proposal"]**

### 5.1: Create Proposal

**[Fill out proposal form]**

**Treasury:** `DAO Main Treasury`

> "Selecting our treasury..."

**Title:** `Marketing Campaign Q2 2024`

> "Title: Marketing Campaign for Q2 2024"

**Description:**
```
Budget allocation for social media marketing, 
content creation, and community engagement initiatives.
```

> "Adding a detailed description for transparency."

**Amount:** `0.5 SUI`

> "Amount: 0.5 SUI - half of our treasury."

**Category:** `Marketing`

> "Category: Marketing"

**Recipient:** `0x9876543210...`

> "Recipient address for the marketing team."

**[Show Policy Validation section]**

> "Before submission, our system validates against all active policies:
> - ✅ Within daily spending limit
> - ✅ Category budget available  
> - ⏰ Time-lock: 24 hours required
> - 👥 Requires 2 of 3 signatures"

**[Click "Submit Proposal"]**

> "Submitting proposal..."

**[Approve in wallet]**

> "Transaction confirmed! Proposal created."

**[Show proposal in list with "Pending" status]**

> "Our proposal appears with 'Pending' status and shows 0 of 2 signatures needed."

### 5.2: First Signature

**[Click on proposal to view details]**

> "Let's review the proposal details before signing."

**[Show proposal details dialog]**

> "We see all proposal information:
> - Amount and recipient
> - Time-lock countdown: 24 hours remaining
> - Signature progress: 0 of 2"

**[Click "Sign Proposal"]**

> "As the first signer, I'll approve this proposal."

**[Approve in wallet]**

> "Signing with my wallet... signature recorded!"

**[Show updated signature count: 1 of 2]**

> "Signature count updated: 1 of 2. We need one more signer."

**[Show signer list with first signer marked as "Signed"]**

> "In the signer list, my address is now marked as 'Signed'."

### 5.3: Second Signature (Switch Account)

**[Disconnect wallet and switch to second account]**

> "Now I'll switch to the second signer's account to provide the final signature."

**[Connect with second wallet]**

> "Connected as the second signer."

**[Navigate back to Proposals page]**

> "The proposal is still showing as 'Pending' because we need one more signature."

**[Open proposal details]**

**[Click "Sign Proposal"]**

> "Signing as the second approver..."

**[Approve in wallet]**

> "Second signature confirmed!"

**[Show signature count: 2 of 2]**

> "Excellent! We now have 2 of 2 signatures - threshold met!"

**[Show status change to "Ready"]**

> "The proposal status changed to 'Ready to Execute' - but we still have a time-lock."

**[Show time-lock countdown]**

> "The time-lock is still active: 23 hours remaining. This prevents rushed decisions."

**Key Points:**
- ✅ Complete proposal form with all fields
- ✅ Show policy validation
- ✅ Demonstrate multi-account signing
- ✅ Display signature collection progress
- ✅ Show status transitions (Pending → Ready)

---

## ⚡ PART 6: Executing Proposal (1.5 minutes)

**[Fast-forward explanation or show time-lock expired]**

### Script:
> "For demo purposes, let's assume the 24-hour time-lock has expired."

**[Show proposal with status "Ready" and time-lock "Complete"]**

> "Our proposal now shows:
> - ✅ 2 of 2 signatures collected
> - ✅ Time-lock complete
> - Status: Ready to Execute"

**[Click "Execute Proposal"]**

> "Any signer can now execute this proposal. Executing..."

**[Approve in wallet]**

> "Confirming execution transaction..."

**[Wait for confirmation]**

> "Proposal executed successfully!"

**[Show status change to "Executed"]**

> "Status changed to 'Executed' - funds have been transferred."

**[Show updated treasury balance]**

**Before:** `1.0 SUI`  
**After:** `0.5 SUI`

> "Treasury balance decreased from 1.0 to 0.5 SUI as expected."

**[Open transaction on Sui Explorer]**

```
https://suiexplorer.com/txblock/TX_DIGEST?network=testnet
```

> "On Sui Explorer, we can see the execution transaction with all events:
> - Proposal status updated
> - Funds transferred to recipient
> - Spending tracker updated"

**[Show recipient address balance increased]**

> "And we can verify the recipient received exactly 0.5 SUI."

**Key Points:**
- ✅ Show time-lock completion
- ✅ Demonstrate execution process
- ✅ Display balance changes
- ✅ Show transaction details on explorer
- ✅ Verify recipient received funds

---

## 🛡️ PART 7: Policy Configuration (2 minutes)

**[Navigate to Policies page]**

### Script:
> "Let's configure our spending policies to add governance rules."

### 7.1: Spending Limits

**[Show Spending Limits section]**

> "We can set daily, weekly, and monthly limits."

**[Edit daily limit]**

**Daily Limit:** `2.0 SUI`

> "Setting a daily limit of 2 SUI to prevent excessive spending."

**[Show usage tracking]**

**Current Usage:** `0.5 SUI / 2.0 SUI` (25%)

> "Our system automatically tracks spending. We've used 0.5 SUI today - 25% of the limit."

### 7.2: Whitelist Management

**[Show Whitelist section]**

> "We can whitelist trusted recipients for faster approvals."

**[Add to whitelist]**

**Address:** `0xTRUSTED_PARTNER...`

> "Adding a trusted partner address to the whitelist."

**[Set expiry]**

**Expires:** `30 days`

> "This whitelist entry will expire in 30 days for security."

**[Submit]**

> "Whitelist updated!"

### 7.3: Category Policies

**[Show Category Policies section]**

> "Each spending category can have its own rules."

**[Show categories]**

- **Operations:** 1.0 SUI limit, 2 signatures required
- **Marketing:** 0.8 SUI limit, 2 signatures required
- **Development:** 2.0 SUI limit, 3 signatures required

> "Development spending requires all 3 signers due to higher amounts and criticality."

### 7.4: Amount Thresholds

**[Show Amount Thresholds section]**

> "We can configure escalating thresholds based on amount."

**Threshold Ranges:**
- `< 0.5 SUI`: 2 of 3 signatures
- `0.5 - 2.0 SUI`: 2 of 3 signatures  
- `> 2.0 SUI`: 3 of 3 signatures (unanimous)

> "Large transactions over 2 SUI require unanimous approval for maximum security."

**Key Points:**
- ✅ Show all policy types
- ✅ Demonstrate editing policies
- ✅ Show usage tracking
- ✅ Explain policy logic and benefits

---

## 🚨 PART 8: Emergency Workflow (1.5 minutes)

**[Navigate to Dashboard - Emergency Settings]**

### Script:
> "Finally, let's look at emergency procedures for critical situations."

**[Show Emergency Module section]**

> "Our emergency module has higher security requirements."

**[Configure emergency settings]**

**Emergency Threshold:** `3 of 3` (unanimous)

> "Emergency actions require all signers - unanimous approval for maximum security."

**[Show emergency signer designation]**

> "We can designate specific emergency signers with additional verification."

### Simulate Emergency Scenario

**[Create emergency proposal]**

> "Let's simulate a security incident requiring emergency withdrawal."

**[Emergency Withdrawal form]**

**Reason:** `Critical smart contract vulnerability detected`

**Amount:** `All remaining funds (0.5 SUI)`

**Emergency Address:** `0xSECURE_COLD_WALLET...`

> "Moving all funds to a secure cold wallet immediately."

**[Show emergency proposal]**

> "Emergency proposals bypass time-locks but require higher approval threshold."

**[Collect 3 of 3 signatures rapidly]**

> "All three signers must approve. Collecting signatures..."

**[Execute emergency withdrawal]**

> "All signatures collected - executing emergency withdrawal immediately!"

**[Show treasury frozen state]**

> "After emergency execution, the treasury enters a cooldown period preventing new proposals for 24 hours."

**[Show audit log]**

> "All emergency actions are recorded in an immutable audit log for transparency."

**Key Points:**
- ✅ Show higher threshold requirement
- ✅ Demonstrate emergency bypass
- ✅ Show cooldown mechanism
- ✅ Display audit trail

---

## 🎯 CONCLUSION (30 seconds)

**[Show Dashboard overview]**

### Script:
> "Let's recap what we've built:"

**[Show feature checklist]**

> "✅ **Multi-signature treasury** with flexible thresholds  
> ✅ **Time-locked proposals** preventing rushed decisions  
> ✅ **Programmable spending policies** - limits, categories, whitelists  
> ✅ **Emergency procedures** with higher security requirements  
> ✅ **Complete audit trail** on Sui blockchain"

**[Show transaction history page]**

> "Every action is recorded on-chain with complete transparency."

**[Show architecture diagram]**

> "Our modular architecture makes it easy to extend with new policy types."

**[Show final stats]**

**System Metrics:**
- ✅ Gas cost per proposal: < 0.05 SUI
- ✅ All security tests passed
- ✅ 4 smart contract modules deployed
- ✅ Full frontend integration
- ✅ Production-ready on Sui testnet

**[Show GitHub repo and docs]**

> "Complete source code, documentation, and deployment guides are available in our GitHub repository."

**[Thank you slide]**

> "Thank you! This Multi-Signature Treasury system provides secure, flexible, and programmable treasury management for DAOs on Sui blockchain."

**[Show contact/links]**

- **GitHub:** github.com/your-repo
- **Live Demo:** your-deployment-url
- **Documentation:** Full docs included

---

## 📋 POST-PRODUCTION CHECKLIST

### Required Footage:
- [ ] Clear terminal output for all commands
- [ ] Sui Explorer pages for all objects
- [ ] Wallet transaction approvals
- [ ] Balance changes in real-time
- [ ] All policy configurations
- [ ] Signature collection from multiple accounts

### Video Quality:
- [ ] 1080p resolution minimum
- [ ] Clear audio narration
- [ ] Smooth transitions between sections
- [ ] On-screen text for key information
- [ ] Highlighted mouse cursor
- [ ] Zoom in on important details

### Required Information Display:
- [ ] Package ID shown prominently
- [ ] All transaction digests visible
- [ ] Object IDs readable
- [ ] Explorer links shown
- [ ] GitHub repo URL displayed

### Editing Tips:
- Speed up deployment/build sections (2x)
- Add captions for technical terms
- Highlight important transactions
- Add background music (subtle)
- Include timestamps in description

---

## 🎬 RECORDING SETUP

### Tools:
- **Screen Recording:** OBS Studio, Loom, or QuickTime
- **Video Editing:** DaVinci Resolve, iMovie, or Premiere Pro
- **Microphone:** Clear audio required
- **Screen Resolution:** 1920x1080 or higher

### Browser Setup:
- Zoom level: 100%
- Hide bookmarks bar
- Clear browsing history
- Have all tabs ready:
  - localhost:3000 (frontend)
  - Sui Explorer
  - GitHub repo
  - Documentation

### Terminal Setup:
- Use a clean terminal theme
- Increase font size (16-18pt)
- Clear history before recording
- Have all commands ready in a script

### Multiple Wallets:
- Wallet 1: Primary signer
- Wallet 2: Second signer  
- Wallet 3: Third signer (for unanimous scenarios)
- All funded with testnet SUI

---

## 📤 UPLOAD & SUBMISSION

### Video Platforms:
- **YouTube** (unlisted or public)
- **Loom** (easy sharing)
- **Vimeo** (professional)

### Video Description Template:
```
Multi-Signature Treasury - Secure DAO Treasury Management on Sui

This video demonstrates a complete multi-signature treasury system built on Sui blockchain, featuring:
- Programmable spending policies
- Time-locked proposals
- Multi-signer approval workflows
- Emergency procedures
- Complete audit trail

🔗 Links:
- GitHub: [your-repo]
- Package ID: 0x...
- Live Demo: [url]
- Documentation: [url]

⏱️ Timestamps:
0:00 - Introduction
0:30 - Contract Deployment
2:30 - Frontend Setup
3:30 - Creating Treasury
5:30 - Depositing Funds
7:00 - Creating Proposal
9:00 - Signing (Multiple Accounts)
11:00 - Executing Proposal
12:00 - Policy Configuration
13:30 - Emergency Workflow
15:00 - Conclusion

Built for [Hackathon Name] 2024
```

---

**🎉 You're ready to record your hackathon submission video!** 🚀
