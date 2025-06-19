#!/bin/bash

# Load environment variables from .env
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

forge script EternalMintNftsScript.s.sol:EternalMintNftsScript \
            --rpc-url $RPC_URL \
            --private-key $PRIVATE_KEY \
            --evm-version london \
            --broadcast