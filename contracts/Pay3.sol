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
    mapping(uint256 => uint256) public tokenChargedValue;
    uint256 public servicerWallet;
    uint256 public serviceFee;

    constructor() ERC721("Pay3", "PAY3") {
        serviceFee = 0.01 ether;
    }

    function mint() public payable returns (uint256) {
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        _safeMint(msg.sender, newItemId);
        return newItemId;
    }

    function subscribe(uint256 tokenId, bool state) public {
        subscribeState[tokenId] = state;
    }
   function usersendETH(uint256 tokenID) public payable {
        require(msg.value > 0, "You need to send some Ether");
        console.log("msg.value is %s", msg.value);
        tokenChargedValue[tokenID] += msg.value;
    }

    function getTokenChargedValue(uint256 tokenID) public view returns (uint256) {
        console.log("tokenChargedValue[tokenID] is %s", tokenChargedValue[tokenID]);
    return tokenChargedValue[tokenID];
    }

  function userWithdraw(uint256 tokenID) public {
    // check tokenID is owned by msg.sender
    require(ownerOf(tokenID) == msg.sender, "You are not the owner of this token");

    uint256 amount = tokenChargedValue[tokenID];
    bool success = false;
    address payable recipient = payable(msg.sender);
    (success, ) = recipient.call{value: amount}("");
    require(success, "Failed to transfer Ether");
    tokenChargedValue[tokenID] = 0;
  }

  function moneyCollection() public {
    console.log(currentTokenId.current());
    for(uint256 i = 1; i <= currentTokenId.current(); i++) {
    if(subscribeState[i] == true) {
        if(tokenChargedValue[i] > serviceFee){
        tokenChargedValue[i]-= serviceFee;
        servicerWallet += serviceFee;
        }
    }
}
  }
}