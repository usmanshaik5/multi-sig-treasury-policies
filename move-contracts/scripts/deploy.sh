#!/bin/bash

# Multi-Signature Treasury Deployment Script
# This script builds and deploys the Move contracts to Sui testnet

set -e

echo "======================================"
echo "Multi-Sig Treasury Deployment Script"
echo "======================================"
echo ""

# Check if sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo "❌ Error: Sui CLI is not installed"
    echo "Please install from: https://docs.sui.io/build/install"
    exit 1
fi

echo "✅ Sui CLI found"
echo ""

# Check active environment
echo "Checking Sui environment..."
ACTIVE_ENV=$(sui client active-env)
echo "Active environment: $ACTIVE_ENV"
echo ""

if [ "$ACTIVE_ENV" != "testnet" ]; then
    echo "⚠️  Warning: Not on testnet. Switching to testnet..."
    sui client switch --env testnet
    echo "✅ Switched to testnet"
    echo ""
fi

# Get active address
ACTIVE_ADDRESS=$(sui client active-address)
echo "Active address: $ACTIVE_ADDRESS"
echo ""

# Check balance
echo "Checking SUI balance..."
sui client gas
echo ""

# Build the Move package
echo "📦 Building Move package..."
cd "$(dirname "$0")/.."
sui move build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi
echo ""

# Publish to testnet
echo "🚀 Publishing to Sui testnet..."
echo "This will create:"
echo "  - Treasury module"
echo "  - Proposal module"
echo "  - PolicyManager module"
echo "  - Emergency module"
echo ""

PUBLISH_OUTPUT=$(sui client publish --gas-budget 100000000 --json)

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    
    # Extract package ID
    PACKAGE_ID=$(echo $PUBLISH_OUTPUT | jq -r '.objectChanges[] | select(.type == "published") | .packageId')
    
    echo "======================================"
    echo "DEPLOYMENT INFORMATION"
    echo "======================================"
    echo ""
    echo "📦 Package ID: $PACKAGE_ID"
    echo ""
    echo "Save this Package ID! You'll need it for:"
    echo "  1. Frontend configuration (src/lib/sui-config.ts)"
    echo "  2. Interacting with the contracts"
    echo "  3. Creating treasuries and proposals"
    echo ""
    
    # Save to file
    echo "{" > deployment-info.json
    echo "  \"packageId\": \"$PACKAGE_ID\"," >> deployment-info.json
    echo "  \"network\": \"testnet\"," >> deployment-info.json
    echo "  \"deployer\": \"$ACTIVE_ADDRESS\"," >> deployment-info.json
    echo "  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"" >> deployment-info.json
    echo "}" >> deployment-info.json
    
    echo "💾 Deployment info saved to: deployment-info.json"
    echo ""
    
    # Instructions
    echo "======================================"
    echo "NEXT STEPS"
    echo "======================================"
    echo ""
    echo "1. Update frontend configuration:"
    echo "   Edit src/lib/sui-config.ts"
    echo "   Set PACKAGE_ID = \"$PACKAGE_ID\""
    echo ""
    echo "2. Create a treasury:"
    echo "   sui client call --package $PACKAGE_ID \\"
    echo "     --module treasury \\"
    echo "     --function create_treasury \\"
    echo "     --args '[\"0xADDRESS1\",\"0xADDRESS2\"]' 2 \\"
    echo "     --gas-budget 10000000"
    echo ""
    echo "3. View on Sui Explorer:"
    echo "   https://suiexplorer.com/object/$PACKAGE_ID?network=testnet"
    echo ""
    
else
    echo "❌ Deployment failed"
    exit 1
fi
