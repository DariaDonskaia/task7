const { task } = require("hardhat/config");
const fetch = require("node-fetch");
const { ethers } = require("ethers");

task("register", "Add refer")
.addParam("refer address", "referrer address to be added")
.setAction(async function (taskArguments, hre) {
    const ACDM = await ethers.getContractFactory("ACDMPlatform");
    ACDMToken = await ethers.getContractFactory("ACDMToken");
    acdmToken = await ACDMToken.connect(owner).deploy(); 
    acdm = await ACDM.deploy(acdmToken, 3);  
    await acdm.deposit(taskArguments.address);
    console.log('You add ', taskArguments.address, " reffer!");
});

task("startSaleRound", "Start sale round")
.setAction(async function (taskArguments, hre) {
    const ACDM = await ethers.getContractFactory("ACDMPlatform");
    ACDMToken = await ethers.getContractFactory("ACDMToken");
    acdmToken = await ACDMToken.connect(owner).deploy(); 
    acdm = await ACDM.deploy(acdmToken, 3);  
    await acdm.startSaleRound();
    console.log("Start sale round!");
});

task("buyACDM", "Buy ACDM tokens")
.addParam("amount", "Count tokens")
.setAction(async function (taskArguments, hre) {
    const ACDM = await ethers.getContractFactory("ACDMPlatform");
    ACDMToken = await ethers.getContractFactory("ACDMToken");
    acdmToken = await ACDMToken.connect(owner).deploy(); 
    acdm = await ACDM.deploy(acdmToken, 3);  
    await acdm.buyACDM(taskArguments.amount);
    console.log("You buy ", taskArguments.amount, "ACDM tokens!");
});

task("startTradeRound", "Start trade round!")
.setAction(async function (taskArguments, hre) {
    const ACDM = await ethers.getContractFactory("ACDMPlatform");
    ACDMToken = await ethers.getContractFactory("ACDMToken");
    acdmToken = await ACDMToken.connect(owner).deploy(); 
    acdm = await ACDM.deploy(acdmToken, 3);  
    await acdm.startTradeRound();
    console.log("Start trade round!");
});

task("addOrder", "Add order")
.addParam("amount", "Count tokens")
.addParam("price", "Price token")
.setAction(async function (taskArguments, hre) {
    const ACDM = await ethers.getContractFactory("ACDMPlatform");
    ACDMToken = await ethers.getContractFactory("ACDMToken");
    acdmToken = await ACDMToken.connect(owner).deploy(); 
    acdm = await ACDM.deploy(acdmToken, 3);  
    await acdm.addOrder(taskArguments.amount, taskArguments.price);
    console.log("You add order!");
});

task("removeOrder", "Remove order")
.addParam("idOrder", "Id removing order")
.setAction(async function (taskArguments, hre) {
    const ACDM = await ethers.getContractFactory("ACDMPlatform");
    ACDMToken = await ethers.getContractFactory("ACDMToken");
    acdmToken = await ACDMToken.connect(owner).deploy(); 
    acdm = await ACDM.deploy(acdmToken, 3);  
    await acdm.removeOrder(taskArguments.idOrder);
    console.log("You remove order!");
});

task("redeemOrder", "Redeem order")
.addParam("idOrder", "Id redeeming order")
.addParam("amount", "Count buying ACDM token")
.setAction(async function (taskArguments, hre) {
    const ACDM = await ethers.getContractFactory("ACDMPlatform");
    ACDMToken = await ethers.getContractFactory("ACDMToken");
    acdmToken = await ACDMToken.connect(owner).deploy(); 
    acdm = await ACDM.deploy(acdmToken, 3);  
    await acdm.removeOrder(taskArguments.idOrder, taskArguments.amount);
    console.log("You redeem order!");
});