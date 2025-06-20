#!/bin/bash

# Load environment variables if .env exists
if [ -f .env ]; then
    source .env
fi

# Check if CHECK_ADDRESS is provided
if [ -z "$CHECK_ADDRESS" ]; then
    echo "Error: CHECK_ADDRESS environment variable is required"
    echo "Usage: CHECK_ADDRESS=0x... ./check-minter-role.sh"
    exit 1
fi

echo "Checking MINTER_ROLE for address: $CHECK_ADDRESS"
echo "Contract address: $CONTRACT_ADDRESS"
echo ""

# MINTER_ROLE hash
MINTER_ROLE="0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"

# Check if address has MINTER_ROLE
echo "Checking MINTER_ROLE..."
HAS_MINTER_ROLE=$(cast call $CONTRACT_ADDRESS \
  "hasRole(bytes32,address)" \
  $MINTER_ROLE \
  $CHECK_ADDRESS \
  --rpc-url $RPC_URL)

if [ "$HAS_MINTER_ROLE" = "0x0000000000000000000000000000000000000000000000000000000000000001" ]; then
    echo "✅ Address HAS MINTER_ROLE"
else
    echo "❌ Address does NOT have MINTER_ROLE"
fi

# Check if address has DEFAULT_ADMIN_ROLE
echo ""
echo "Checking DEFAULT_ADMIN_ROLE..."
DEFAULT_ADMIN_ROLE="0x0000000000000000000000000000000000000000000000000000000000000000"

HAS_ADMIN_ROLE=$(cast call $CONTRACT_ADDRESS \
  "hasRole(bytes32,address)" \
  $DEFAULT_ADMIN_ROLE \
  $CHECK_ADDRESS \
  --rpc-url $RPC_URL)

if [ "$HAS_ADMIN_ROLE" = "0x0000000000000000000000000000000000000000000000000000000000000001" ]; then
    echo "✅ Address HAS DEFAULT_ADMIN_ROLE (can grant/revoke roles)"
else
    echo "❌ Address does NOT have DEFAULT_ADMIN_ROLE"
fi 