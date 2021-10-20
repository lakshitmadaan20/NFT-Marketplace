// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    constructor() ERC20("Test", "TST") {
        _mint(msg.sender, 10000000000000000000000);
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}