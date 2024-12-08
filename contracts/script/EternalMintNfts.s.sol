// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {EternalMintNfts} from "../src/EternalMintNfts.sol";

contract EternalMintNftsScript is Script {
    EternalMintNfts public eternalMintNfts;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        eternalMintNfts = new EternalMintNfts();

        vm.stopBroadcast();
    }
}
