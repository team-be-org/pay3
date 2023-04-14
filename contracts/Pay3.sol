//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Pay3 is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    //subsribe state map
    mapping(uint256 => bool) public subscribeState;

    constructor() ERC721("Pay3", "PAY3") {}

    function mint() public payable returns (uint256) {
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        _safeMint(msg.sender, newItemId);
        return newItemId;
    }

    function subscribe(uint256 tokenId, bool state) public {
        subscribeState[tokenId] = state;
    }
}
