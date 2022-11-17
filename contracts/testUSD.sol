// SPDX-License-Identifier: Chainlink Hackathon Fall 2022
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract testUSD is Ownable, ERC20 {

    constructor() ERC20("Test USD", "testUSD") {
        _mint(address(this), 1000000000000000000000000000000000000000);
    }

    function Mintuint _amount) public {
        _mint(msg.sender, _amount);
    }     
    //Ownerless for testing purposes
    function bankTransfer(address to, uint256 amount) external returns (bool) {
        _transfer(address(this), to, amount);
        return true;
    }

}
