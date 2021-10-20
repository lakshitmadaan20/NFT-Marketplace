// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTMarketplace is ERC721URIStorage, IERC721Receiver{
    
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    
    struct TokenPrice{
        address currency;
        uint256 price;
    }
    
    mapping(uint256 => TokenPrice) public prices;
    mapping(uint256 => bool) public sold;
    
    event Mint(uint256 id, uint256 price, string tokenUri, address owner, address currency);
    event Buy(address buyer, uint256 price, uint256 id, string uri, address currency);
    
    constructor() ERC721("Lakshit", "LK") {}
    
    
    function mintToken(string memory uri, uint256 _price, address _currency) public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
         TokenPrice storage _tokenPrice = prices[newItemId];
        _tokenPrice.price = _price;
        _tokenPrice.currency = _currency;
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, uri);
        
        emit Mint(newItemId, _price, uri, _currency, msg.sender);
    }
    
    function burn(uint256 tokenId) public returns (bool) {
        _burn(tokenId);
        return true;
    }
    
    
    function buy(uint256 _id) public payable {
        TokenPrice storage _tokenPrice =  prices[_id];
        
        require(msg.sender != ownerOf(_id), "Seller cannot be the buyer");
        require(_exists(_id), "Error, wrong Token id");
        require(msg.value == _tokenPrice.price,"Error, Token costs should be equal");

        
        if (_tokenPrice.currency == address(0x0)) {
            payable(ownerOf(_id)).transfer(_tokenPrice.price);
        }else {
            IERC20(_tokenPrice.currency).transfer(ownerOf(_id), _tokenPrice.price);
        }
        
        _transfer(ownerOf(_id), msg.sender, _id);
        
        emit Buy(msg.sender,_tokenPrice.price, _id, tokenURI(_id), _tokenPrice.currency);
    }
    
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}