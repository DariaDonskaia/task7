//SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ACDMToken is ERC20 {
    
    string _name = "ACDMToken";
    string _symbol = "ACDM";
    constructor() ERC20(_name, _symbol) { }

    function mint(address _to, uint _value)  public {
        _mint(_to, _value);
    }

    function burn(address _from, uint _value) public {
        _burn(_from, _value);
    }

}