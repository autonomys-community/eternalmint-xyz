import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  afterAll,
  assert,
  beforeAll,
  clearStore,
  describe,
  test,
} from "matchstick-as";
import { NftMinted as NftMintedEvent } from "../generated/EternalMintNfts/EternalMintNfts";
import { NftMinted } from "../generated/schema";
import { handleNftMinted } from "../src/eternalMintNfts";
import { createNftMintedEvent } from "./eternalMintNfts-utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    let tokenId = BigInt.fromI32(234);
    let supply = BigInt.fromI32(234);
    let cid = "QmQn321";
    let newNftMintedEvent = createNftMintedEvent(creator, tokenId, supply, cid);
    handleNftMinted(newNftMintedEvent);
  });

  afterAll(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("NftMinted created and stored", () => {
    assert.entityCount("NftMinted", 1);

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "NftMinted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals(
      "NftMinted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    );

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  });
});
