#!/bin/bash

# Load environment variables if .env exists
if [ -f .env ]; then
    source .env
fi

# Check if REVOKE_FROM_ADDRESS is provided
if [ -z "$REVOKE_FROM_ADDRESS" ]; then
    echo "Error: REVOKE_FROM_ADDRESS environment variable is required"
    echo "Usage: REVOKE_FROM_ADDRESS=0x... ./revoke-minter-role.sh"
    exit 1
fi

echo "Revoking MINTER_ROLE from: $REVOKE_FROM_ADDRESS"
echo "Contract address: $CONTRACT_ADDRESS"

# Calculate MINTER_ROLE hash dynamically using cast
echo "Calculating MINTER_ROLE hash..."
MINTER_ROLE=$(cast keccak "MINTER_ROLE")
echo "MINTER_ROLE hash: $MINTER_ROLE"

# Use cast send (the method that works)
echo "Calling revokeRole..."
cast send $CONTRACT_ADDRESS \
  "revokeRole(bytes32,address)" \
  $MINTER_ROLE \
  $REVOKE_FROM_ADDRESS \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

echo "Done!" 