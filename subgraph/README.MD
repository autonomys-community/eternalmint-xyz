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

### Deploying to The Graph Studio

If you see this in the logs:

```
Subgraph writer failed, error: store error: No rows affected. This could be due to an attempt to revert beyond earliest_block + reorg_threshold, runner_index: 1660
```

Or

```
Subgraph failed with non-deterministic error: Failed to transact block operations: store error: No rows affected. This could be due to an attempt to revert beyond earliest_block + reorg_threshold, retry_delay_s: 129, attempt: 0, runner_index: 1660
```

It indicates that there has been a reorg that affected blocks the subgraph has already indexed.

Mitigation strategies

- Redeploy with a higher start block (+50-100)?
- Redeploy later after we should not see the reorg? (this works)