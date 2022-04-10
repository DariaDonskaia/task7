const { expect } = require("chai");
const { ethers, waffle, network} = require("hardhat");
const provider = waffle.provider;
const { parseEther } = require("ethers/lib/utils");

describe("ACDMPlatform contract", function () {

    beforeEach(async function () {
      const BALANCE = parseEther('10');
      primaryTotalSupply = parseEther("10000");
      [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

      ACDMPlatform = await ethers.getContractFactory("ACDMPlatform"); 
      ACDMToken = await ethers.getContractFactory("ACDMToken");
      acdmToken = await ACDMToken.connect(owner).deploy(); 
      acdmPlatform = await ACDMPlatform.connect(owner).deploy(acdmToken.address, 30);
    });

    it("ACDMPlatform contract: Test register(address refer) function", async function () {

        await acdmPlatform.connect(owner).register(addr2.address);
        addr2.address = await acdmPlatform.connect(owner).getRefer(addr2.address);
        expect(await  addr2.address).to.equal(addr2.address);
    });

    it("ACDMPlatform contract: Test startSaleRound() function", async function () {
        await acdmPlatform.connect(owner).startSaleRound();
        await expect(acdmPlatform.connect(owner).addOrder(10, 10)).to.be.revertedWith("ACDMPlatform: Trade round now");
        
    });

    it("ACDMPlatform contract: Test buyACDM(uint256 amount) function", async function () {
      await acdmToken.connect(owner).mint(acdmPlatform.address, 20);
      await acdmPlatform.connect(owner).startSaleRound();
      await acdmPlatform.connect(owner).buyACDM(10);
      await expect(acdmPlatform.connect(owner).startTradeRound()).to.be.revertedWith("ACDMPlatform: Sale round not finished");
      
  });

  it("ACDMPlatform contract: Test startTradeRound() function", async function () {
    await acdmToken.connect(owner).mint(acdmPlatform.address, 20);
    await acdmPlatform.connect(owner).startSaleRound();
    await acdmPlatform.connect(owner).buyACDM(10);
    await expect(acdmPlatform.connect(owner).startTradeRound()).to.be.revertedWith("ACDMPlatform: Sale round not finished");
    await network.provider.send("evm_increaseTime", [1000]);
    await network.provider.send("evm_mine");
    await acdmPlatform.connect(owner).startTradeRound();
    
  });

  it("ACDMPlatform contract: Test addOrder(uint256 amount, uint256 price) function", async function () {
    await acdmToken.connect(owner).mint(acdmPlatform.address, 20);
    await acdmPlatform.connect(owner).startSaleRound();
    await acdmPlatform.connect(owner).buyACDM(10);
    await expect(acdmPlatform.connect(owner).startTradeRound()).to.be.revertedWith("ACDMPlatform: Sale round not finished");
    await network.provider.send("evm_increaseTime", [1000]);
    await network.provider.send("evm_mine");
    await acdmPlatform.connect(owner).startTradeRound();
    await acdmToken.connect(owner).approve(acdmPlatform.address, 10);
    await acdmPlatform.connect(owner).addOrder(5, 5);
    
  });

  it("ACDMPlatform contract: Test removeOrder(uint256 idOrder) function", async function () {
    await acdmToken.connect(owner).mint(acdmPlatform.address, 20);
    await acdmPlatform.connect(owner).startSaleRound();
    await acdmPlatform.connect(owner).buyACDM(10);
    await expect(acdmPlatform.connect(owner).startTradeRound()).to.be.revertedWith("ACDMPlatform: Sale round not finished");
    await network.provider.send("evm_increaseTime", [1000]);
    await network.provider.send("evm_mine");
    await acdmPlatform.connect(owner).startTradeRound();
    await acdmToken.connect(owner).approve(acdmPlatform.address, 10);
    await acdmPlatform.connect(owner).addOrder(5, 5);
    await acdmPlatform.connect(owner).removeOrder(1);
    
  });

  it("ACDMPlatform contract: Test redeemOrder(uint256 idOrder, uint256 amount) function", async function () {
    await acdmToken.connect(owner).mint(acdmPlatform.address, 20);
    await acdmPlatform.connect(owner).startSaleRound();
    await acdmPlatform.connect(owner).buyACDM(10);
    await expect(acdmPlatform.connect(owner).startTradeRound()).to.be.revertedWith("ACDMPlatform: Sale round not finished");
    await network.provider.send("evm_increaseTime", [1000]);
    await network.provider.send("evm_mine");
    await acdmPlatform.connect(owner).startTradeRound();
    await acdmToken.connect(owner).approve(acdmPlatform.address, 10);
    await acdmPlatform.connect(owner).addOrder(5, 5);
    await acdmPlatform.connect(addr1).redeemOrder(1, 5); 
  });

});
  
    
  