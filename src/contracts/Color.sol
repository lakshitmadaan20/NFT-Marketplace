pragma solidity ^0.5.5;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";


contract Color is ERC721Full {
    
    string[] public colors;
    address owner;
    mapping(string => bool) _colorExists;
    
    constructor() ERC721Full("Color", "COLOR") public {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    function mint(string memory _color) public onlyOwner {
        require(!_colorExists[_color]);
        uint _id = colors.push(_color);
        _mint(msg.sender, _id);
        _colorExists[_color] = true;
    }
}
