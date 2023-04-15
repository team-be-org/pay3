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
  


//追加箇所（userWithdraw）
it("should add ETH to the charged value of the token", async function() {
  await pay3.connect(user).mint();
  const tokenID = 1
  const value = ethers.utils.parseEther("1");
  const initialChargedValue = await pay3.getTokenChargedValue(tokenID);
  await pay3.connect(owner).usersendETH(tokenID, { value });
  const newChargedValue = await pay3.getTokenChargedValue(tokenID);
  expect(newChargedValue).to.equal(initialChargedValue.add(value));
});

it("should userWithdraw ETH from the charged value of the token", async function() {
  await pay3.connect(user).mint();
  const tokenID = 1
  const initialChargedValue = await pay3.getTokenChargedValue(tokenID);
  await pay3.connect(user).userWithdraw(tokenID);
  const newChargedValue = await pay3.getTokenChargedValue(tokenID);
  expect(newChargedValue).to.equal(0);
});

//追加箇所（moneyCollection）

it("should subtract serviceFee from tokenChargedValue and add to servicerWallet when calling moneyCollection()", async function() {
  // Mint some tokens and set their subscribeState to true
  await pay3.connect(user).mint();
  await pay3.connect(user).subscribe(1, true);

  // send ETH to tokenChargeValue
  await pay3.connect(user).usersendETH(1, { value: ethers.utils.parseEther("1") });
  // Check initial values of tokenChargedValue and servicerWallet
  const initialToken1Value = await pay3.getTokenChargedValue(1);
  const initialServicerWallet = await pay3.servicerWallet();

  // Call moneyCollection
  await pay3.connect(owner).moneyCollection();

  // subscriotState to true
  await pay3.connect(user).subscribe(1, true);

  // Check new values of tokenChargedValue and servicerWallet
  const newToken1Value = await pay3.getTokenChargedValue(1);
  const newServicerWallet = await pay3.servicerWallet();
  const serviceFee = ethers.utils.parseEther("0.01")
  console.log(initialToken1Value);
  console.log(newToken1Value);
  // Check that tokenChargedValue has been reduced by serviceFee for both tokens
  expect(newToken1Value).to.equal(initialToken1Value.sub(serviceFee));

  // Check that servicerWallet has increased by serviceFee for both tokens
  expect(newServicerWallet).to.equal(initialServicerWallet.add(serviceFee));
});

it("should withdraw the servicer fee from the contract", async function () {
  // Mint a token and add ETH to its charged value
  await pay3.connect(user).mint();
  const tokenID = 1;
  const value = ethers.utils.parseEther("1");
  await pay3.connect(user).usersendETH(tokenID, { value });

  // Check initial values of servicerWallet and contract balance
  const initialServicerWallet = await pay3.servicerWallet();
  const initialBalance = await ethers.provider.getBalance(pay3.address);

  // Call withdrawServicerFee
  await pay3.withdrawServicerFee();

  // Check new values of servicerWallet and contract balance
  const newServicerWallet = await pay3.servicerWallet();
  const newBalance = await ethers.provider.getBalance(pay3.address);

  // Check that the servicer fee has been withdrawn and transferred to the owner's wallet
  expect(newServicerWallet).to.equal(0);
  expect(newBalance).to.equal(initialBalance.sub(initialServicerWallet));
});


});