// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.1;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMarketPlace is ERC721URIStorage{
    address payable owner;

    using Counters  for Counters.Counter;
    Counters.Counter private NFTCount;

    uint256 ProductPrice = 0.01 ether;

    constructor() ERC721("NFTMarketPlace","NFTM"){
        owner = payable(msg.sender);

    }

    //User Info
    struct User{
        string FName;
        string LName;
        string profilePic;
        address owner;
        uint timestamp;
        string password;
    }

    mapping(address => User) Users;

    //NFT Info    
    struct NFTProperties{
        uint256 NFTId;
        string NFTUri;
        address payable owner;
        address payable seller;
        uint256 price;
        bool status;
        string NFTName;
        string Description;
    }
    mapping(uint256 => NFTProperties) private NFTs;

    
    //NFT minting
    function MintNFT(string memory NFTURI , uint256 price , string memory name,string memory Description) public payable{
        require(checksignup(msg.sender),"User Not Found");
        require(price > 0 ,"Price Can't be negative");
        NFTCount.increment();
        uint256 currentNFTid = NFTCount.current();
        
        _safeMint(msg.sender , currentNFTid);

        _setTokenURI(currentNFTid,NFTURI);

        NFTs[currentNFTid] = NFTProperties(currentNFTid,NFTURI,payable(address(this)),payable(msg.sender),price,true,name,Description);    
        
        _transfer(msg.sender,address(this),currentNFTid);
    }

    //Buying NFT
    function SaleNFT(uint NFTId) public payable{
        uint price = NFTs[NFTId].price;
        address seller = NFTs[NFTId].seller;
        NFTs[NFTId].status = false;
        NFTs[NFTId].seller = payable(msg.sender);
        NFTs[NFTId].owner = payable(msg.sender);
        _transfer(address(this),msg.sender,NFTId);
        approve(address(this),NFTId);
        payable(seller).transfer(price);
    }

    function Resale(uint NFTId,uint256 price,string memory Description,string memory Name)public payable{
        NFTs[NFTId].NFTName = Name;
        NFTs[NFTId].Description = Description;
        NFTs[NFTId].status = true;
        NFTs[NFTId].owner = payable(address(this));
        NFTs[NFTId].seller=payable(msg.sender);
        NFTs[NFTId].price = price;
        _transfer(msg.sender,address(this),NFTId);
    }

    //Buying Multiple NFTs
    function BuyNFT(uint256[] memory NFTIds) public payable{
        for(uint i=0;i<NFTIds.length;i++){
            SaleNFT(NFTIds[i]);
        }
        payable(owner).transfer(msg.value);
    }

    //Getting All NFts
    function GetAllNFTs() public view returns(NFTProperties[] memory){
        uint TotalNFTs = NFTCount.current();
        NFTProperties[] memory AllNFTsArray = new NFTProperties[](TotalNFTs);
        
        uint CIndex = 0;

        for(uint i=0;i<TotalNFTs;i++){
            uint CId= i + 1;
            NFTProperties storage Item =   NFTs[CId];
            AllNFTsArray[CIndex] = Item;
            CIndex=CIndex+1;
        }
        return AllNFTsArray;     
    } 

    //Get User NFTS
    function getMyNFTs() public view returns(NFTProperties[] memory){
        uint TotalNFTs = NFTCount.current();
        uint UserNFTsCount;
        uint CurrentIndex = 0;
        for(uint i=0;i<TotalNFTs;i++){
            if(NFTs[i+1].owner == msg.sender || NFTs[i+1].seller == msg.sender){
                UserNFTsCount++;
            }
        }
        NFTProperties[] memory UserNFTs = new NFTProperties[](UserNFTsCount);
        for(uint i=0;i<UserNFTsCount;i++){
            if(NFTs[i+1].owner == msg.sender || NFTs[i+1].seller == msg.sender){
                uint CId = i+1;
                NFTProperties storage CItem = NFTs[CId];
                UserNFTs[CurrentIndex] = CItem;
                CurrentIndex = CurrentIndex + 1; 
            }
        }
        return UserNFTs;
    }
    //User Login
    function Login(address userKey,string memory password) public view returns(bool){
        require(checksignup(userKey),"User Not Found");
        if(keccak256(abi.encodePacked(Users[userKey].password))!=keccak256(abi.encodePacked(password))) revert("Password Incorrect");
        return true;
    }

    //Check user is already exist
    function checksignup(address pubkey) public view returns(bool){
        if(Users[pubkey].timestamp!=0){
            return true;
        }
        return false;
    }

    //Signup function for the user
    function SignUp(string memory FirstName,string memory LastName,string memory Profile,address userKey,string memory password) public payable{
        require(!checksignup(userKey),"You have already SignUp");
        Users[userKey]=User(FirstName,LastName,Profile,userKey,block.timestamp,password);
    }

    //Getting User Info
    function GetUserData(address pubkey) public view returns(User memory) {
        return Users[pubkey];
       
    }
}