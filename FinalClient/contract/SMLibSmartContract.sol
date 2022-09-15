//  SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract cVND is ERC20, Ownable {
    constructor() ERC20("C Viet Nam Dong", "cVND") {}
    
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
    
    function depositFor(address sender, address recipient, uint256 amount) public onlyOwner virtual returns (bool) {
        emit Transfer(sender, recipient, amount);
        _mint(recipient, amount);
        return true;
    }
    
    function withdrawTo(address account, uint256 amount) public onlyOwner virtual returns (bool) {
        _burn(_msgSender(), amount);
        emit Withdraw(account, amount);
        return true;
    }

    event Withdraw(address indexed from, uint256 value);
}