const { expect } = require("chai");

describe("Pay3", function () {
  let pay3;
  let owner;
  let user;

  const mintAmount = ethers.utils.parseEther("1");

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const Pay3 = await ethers.getContractFactory("Pay3", owner);
    pay3 = await Pay3.deploy();
    await pay3.deployed();
  });

  it("should deploy the contract", async function () {
    expect(pay3.address).to.not.equal(ethers.constants.AddressZero);
  });

  it("should mint a new token", async function () {
    await expect(() => pay3.connect(user).mint({ value: mintAmount })).to.changeEtherBalance(user, ethers.BigNumber.from(0).sub(mintAmount));
    expect(await pay3.balanceOf(await user.getAddress())).to.equal(1);
  });
//ここから追記。
it("should add ETH to the charged value of the token", async function() {
  await pay3.connect(user).mint();
  const tokenID = 1
  const value = ethers.utils.parseEther("1");
  const initialChargedValue = await pay3.getTokenChargedValue(tokenID);
  await pay3.connect(owner).usersendETH(tokenID, { value });
  const newChargedValue = await pay3.getTokenChargedValue(tokenID);
  expect(newChargedValue).to.equal(initialChargedValue.add(value));
});
  
});
