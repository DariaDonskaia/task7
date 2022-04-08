//SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./ACDMToken.sol";


contract ACDMPlatform
{
    enum Round{
        SALE,
        TRADE
    }

    struct ACDMCycle {    
        uint256 totalSupplyACDM;
        uint256 lastPriceACMD;
        uint256 totalBuyACDM;
        uint256 totalSupplyETH;
        uint256 timeStart;
        uint256 timeRound;
        Round round;
    }

    struct Order {
        address owner;
        uint256 ACDMtokens;
        uint256 price;
    }

    struct Refers {
        address owner;
        address refer;
        uint procent;
        uint coefficient;
    }

    address acdmToken;
    uint256 public roundTime;
    uint256 public idOrder;

    ACDMCycle acdmCycle;
    
    mapping(address => Refers) public refers;
    mapping(uint256 => Order) public orders;
    
    event TransferSent(address from, address to, uint amount);
    event BuyACDM(address buyer, uint amount);
    event AddOrder(address addOrder, uint amount, uint price);
    event RemoveOrder(uint idOrder);
    event ReedemOrder(address reception, uint amount);
    event Register(address mainRefer, address refer);

    constructor(address ACDMToken_, uint roundTime_){
        acdmToken = ACDMToken_;
        roundTime = roundTime_;
    }

    function register(address refer) public {
        refers[msg.sender] = Refers({owner: msg.sender, refer: address(0), procent: 0, coefficient: 0 });
        emit Register(msg.sender, refer);
    }

    function startSaleRound() public {
        require(acdmCycle.round == Round.SALE, "This round don't be TRADE");
        if (acdmCycle.timeStart == 0){
            acdmCycle = ACDMCycle(1000, 1/1000 , 0, 0, block.timestamp, roundTime, Round.SALE);
        } 
        else{
            //some problem when i try plus uint and double
            acdmCycle = ACDMCycle((acdmCycle.totalSupplyETH / acdmCycle.lastPriceACMD) , ((acdmCycle.lastPriceACMD * 103 / 100) + (4/1000000) * 1000000), 0, 0, block.timestamp, roundTime, Round.SALE); 
        }

    }

    function buyACDM(uint256 amount) payable public {
        require(acdmCycle.totalSupplyACDM - acdmCycle.totalBuyACDM >= amount, "Dont have enough ACDMtokens");
        require(msg.value >= acdmCycle.lastPriceACMD * amount, "You dont have ETH");
        require(acdmCycle.round == Round.SALE, "Sale round now");

        if(refers[msg.sender].owner != address(0)) {
            emit TransferSent(address(this), msg.sender, msg.value * 50 / 1000);
            if(refers[msg.sender].refer != address(0)){
                emit TransferSent(address(this), refers[msg.sender].refer , msg.value * 30 / 1000);
            }
        } 

        IERC20(acdmToken).transfer(msg.sender, amount); 
        acdmCycle.totalBuyACDM += amount;
        emit BuyACDM(msg.sender, amount);
    }

    function startTradeRound() public{
        require(acdmCycle.timeStart + roundTime <= block.timestamp, "Sale round not finished");
        require(acdmCycle.round == Round.SALE, "Sale round now");

        acdmCycle.round = Round.TRADE;
        acdmCycle.timeStart = block.timestamp;
        ACDMToken(acdmToken).burn(address(this), acdmCycle.totalBuyACDM);
        acdmCycle.totalBuyACDM = 0;

    }

    function addOrder(uint256 amount, uint256 price) public {
        require(acdmCycle.round == Round.TRADE, "Trade round now");
        require(ACDMToken(acdmToken).balanceOf(msg.sender) >= amount, "You dont have enough ACDMtokens");

        idOrder++;
        orders[idOrder] = Order(msg.sender, amount, price);
        IERC20(acdmToken).transferFrom(msg.sender, address(this), amount);
        emit AddOrder(msg.sender, amount, price);
    }

    function removeOrder(uint256 idOrder) public {
        IERC20(acdmToken).transfer(msg.sender, orders[idOrder].ACDMtokens);
        orders[idOrder].ACDMtokens = 0;
        emit RemoveOrder(idOrder);
    }

    function redeemOrder(uint256 idOrder, uint256 amount) public payable {
        require(orders[idOrder].ACDMtokens >= amount, "Order dont have enough tokens");
        require(msg.value >= orders[idOrder].price, "You dont have enough ETH");

        IERC20(acdmToken).transfer(msg.sender, amount);

        if(refers[msg.sender].owner != address(0)) {
            emit TransferSent(address(this), msg.sender, amount * 25 / 1000);
            if(refers[msg.sender].refer != address(0)){
                emit TransferSent(address(this), refers[msg.sender].refer , amount * 30 / 1000);
            }
        } 

        emit TransferSent(address(this), orders[idOrder].owner, orders[idOrder].price * amount * 950 / 1000);
        orders[idOrder].ACDMtokens -= amount;
        acdmCycle.totalBuyACDM += amount;
        acdmCycle.totalSupplyETH += amount;
        emit ReedemOrder(msg.sender, amount);

    }

}