#!/bin/bash

# Load environment variables if .env exists
if [ -f .env ]; then
    source .env
fi

# Set default values
CONTRACT_ADDRESS=${CONTRACT_ADDRESS:-"0x346201D2A8eB53807991AF04f7842334674B8793"}

# Check if NEW_MINTER_ADDRESS is provided
if [ -z "$NEW_MINTER_ADDRESS" ]; then
    echo "Error: NEW_MINTER_ADDRESS environment variable is required"
    echo "Usage: NEW_MINTER_ADDRESS=0x... ./grant-minter-role.sh"
    exit 1
fi

echo "Granting MINTER_ROLE to: $NEW_MINTER_ADDRESS"
echo "Contract address: $CONTRACT_ADDRESS"

# Calculate MINTER_ROLE hash dynamically using cast
echo "Calculating MINTER_ROLE hash..."
MINTER_ROLE=$(cast keccak "MINTER_ROLE")
echo "MINTER_ROLE hash: $MINTER_ROLE"

# Use cast send (the method that works)
echo "Calling grantRole..."
cast send $CONTRACT_ADDRESS \
  "grantRole(bytes32,address)" \
  $MINTER_ROLE \
  $NEW_MINTER_ADDRESS \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

echo "Done!" 