# Subgraph

## EternalMintNfts Contract on Taurus Auto EVM

EternalMintNfts contract deployed on Taurus Auto EVM with Alchemy.

### Deployed Subgraph

- [Subgraph on Alchemy for EternalMintNfts Contract](https://subgraphs.alchemy.com/subgraphs/2676)

### Move to the subgraph directory and install dependencies

```bash
cd subgraph
yarn global add @graphprotocol/graph-cli
yarn
```

### Deploy the subgraph

```bash
graph codegen && graph build
graph deploy eternal-mint-nfts-taurus --version-label <versionTag> --node https://subgraphs.alchemy.com/api/subgraphs/deploy --deploy-key <deploymentKey> --ipfs https://ipfs.satsuma.xyz
```
