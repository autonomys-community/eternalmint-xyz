# Change the contract address and name if needed

forge verify-contract  \
    --verifier blockscout  \
    --verifier-url https://blockscout.taurus.autonomys.xyz/api -e ""  \
    --evm-version london --chain 490000 --compiler-version 0.8.28  \
    --watch  \
    0x4d10aDC6901ADeA435F30d41dB3383c38b9254CF  \
    EternalMintNftsScript