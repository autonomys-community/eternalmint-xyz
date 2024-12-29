// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract EternalMintNfts is ERC1155("https://eternal-mint.xyz/token/{id}"), AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Struct to store token details
    struct Token {
        uint256 supply;
        address creator;
        string cid;
    }

    // Mapping from token ID to metadata
    mapping(uint256 => Token) public tokens;

    // Array of all token IDs
    uint256[] public tokenIds;

    event NftMinted(address indexed creator, uint256 indexed tokenId, uint256 supply);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Grants the MINTER_ROLE to a specified account.
     *
     * Requirements:
     * - The caller must have the DEFAULT_ADMIN_ROLE.
     *
     * @param account The address to be granted the MINTER_ROLE.
     */
    function addMinter(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, account);
    }

    /**
     * @dev Revokes the MINTER_ROLE from a specified account.
     *
     * Requirements:
     * - The caller must have the DEFAULT_ADMIN_ROLE.
     *
     * @param account The address from which the MINTER_ROLE will be revoked.
     */
    function removeMinter(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, account);
    }

    /**
     * @dev Generates a unique token ID based on the provided Content Identifier (CID).
     *
     * This function uses the keccak256 hash of the CID to ensure uniqueness.
     *
     * @param cid The Content Identifier associated with the NFT.
     * @return The generated unique token ID as a uint256.
     */
    function getTokenId(string memory cid) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(cid)));
    }

    /**
     * @dev Mints a new NFT with the specified CID and supply to the designated creator.
     *
     * The tokenId is derived from the `getTokenId` function using the CID.
     * This function ensures that a token with the same CID doesn't already exist.
     *
     * Requirements:
     * - The caller must have the MINTER_ROLE.
     *
     * @param creator The address that will be the creator of the minted NFT.
     * @param cid The Content Identifier associated with the NFT.
     * @param supply The number of tokens to mint.
     */
    function mint(address creator, string memory cid, uint256 supply) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = getTokenId(cid);
        require(tokens[tokenId].supply == 0, "Token with this CID already exists");

        tokens[tokenId] = Token({supply: supply, creator: creator, cid: cid});
        tokenIds.push(tokenId);
        _mint(creator, tokenId, supply, "");
        emit NftMinted(creator, tokenId, supply);
    }

    /**
     * @dev Retrieves the Content Identifier (CID) associated with a specific token ID.
     *
     * @param tokenId The ID of the token for which the CID is requested.
     * @return The CID string linked to the provided token ID.
     */
    function getCID(uint256 tokenId) public view returns (string memory) {
        return tokens[tokenId].cid;
    }

    /**
     * @dev Retrieves the total supply of a specific token ID.
     *
     * @param tokenId The ID of the token for which the supply is requested.
     * @return The total number of tokens minted for the specified token ID.
     */
    function getSupply(uint256 tokenId) public view returns (uint256) {
        return tokens[tokenId].supply;
    }

    /**
     * @dev Retrieves the creator of a specific token ID.
     *
     * @param tokenId The ID of the token for which the creator is requested.
     * @return The address of the creator associated with the specified token ID.
     */
    function getCreator(uint256 tokenId) public view returns (address) {
        return tokens[tokenId].creator;
    }

    /**
     * @dev Retrieves the complete Token struct for a specific token ID.
     *
     * @param tokenId The ID of the token for which the details are requested.
     * @return The Token struct containing supply, creator, and CID information.
     */
    function getToken(uint256 tokenId) public view returns (Token memory) {
        return tokens[tokenId];
    }

    /**
     * @dev Retrieves a token ID from its index in the tokenIds array.
     *
     * @param index The index of the token ID to retrieve.
     * @return The token ID at the specified index.
     */
    function getTokenIdByIndex(uint256 index) public view returns (uint256) {
        return tokenIds[index];
    }

    /**
     * @dev Retrieves a Token struct from its index in the tokenIds array.
     *
     * @param index The index of the token for which the details are requested.
     * @return The Token struct containing supply, creator, and CID information.
     */
    function getTokenByIndex(uint256 index) public view returns (Token memory) {
        return tokens[tokenIds[index]];
    }

    /**
     * @dev Returns the total number of tokens.
     * @return The total number of tokens.
     */
    function getTokenCount() public view returns (uint256) {
        return tokenIds.length;
    }

    /**
     * @dev Checks if a specific interface is supported by this contract.
     *
     * This function overrides the supportsInterface function from both ERC1155 and AccessControl.
     *
     * @param interfaceId The interface identifier, as specified in ERC-165.
     * @return `true` if the contract implements the specified interface, `false` otherwise.
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
