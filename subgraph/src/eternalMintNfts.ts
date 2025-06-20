import { Bytes } from "@graphprotocol/graph-ts";
import {
    BatchDistribution as BatchDistributionEvent,
    NftMinted as NftMintedEvent,
    RoleGranted as RoleGrantedEvent,
    RoleRevoked as RoleRevokedEvent,
    SingleDistribution as SingleDistributionEvent,
} from "../generated/EternalMintNfts/EternalMintNfts";
import { BatchDistribution, NftMinted, RoleGranted, RoleRevoked, SingleDistribution } from "../generated/schema";

export function handleNftMinted(event: NftMintedEvent): void {
  let entity = new NftMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.creator = event.params.creator;
  entity.tokenId = event.params.tokenId;
  entity.supply = event.params.supply;
  entity.cid = event.params.cid;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleBatchDistribution(event: BatchDistributionEvent): void {
  let entity = new BatchDistribution(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.distributor = event.params.distributor;
  entity.tokenIds = event.params.tokenIds;
  
  // Convert Address[] to Bytes[]
  let recipients: Bytes[] = [];
  for (let i = 0; i < event.params.recipients.length; i++) {
    recipients.push(event.params.recipients[i]);
  }
  entity.recipients = recipients;
  
  entity.amounts = event.params.amounts;
  entity.timestamp = event.params.timestamp;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSingleDistribution(event: SingleDistributionEvent): void {
  let entity = new SingleDistribution(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.distributor = event.params.distributor;
  entity.tokenId = event.params.tokenId;
  entity.recipient = event.params.recipient;
  entity.amount = event.params.amount;
  entity.timestamp = event.params.timestamp;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.account = event.params.account;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.account = event.params.account;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
