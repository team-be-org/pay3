const hre = require("hardhat");
const fs = require("fs");
const { artifacts } = require("hardhat");

async function main() {

  const BadgeToken = await hre.ethers.getContractFactory("Pay3");
  console.log('Deploying Contract...');
  const token = await BadgeToken.deploy();
  await token.deployed();

  fs.writeFileSync(
    "frontend/src/utils/contractAddress.json",
    '{"contractAddress": "' + token.address + '"}'
  )
  fs.copyFileSync("artifacts/contracts/Pay3.sol/Pay3.json", "frontend/src/utils/Pay3.json")
  console.log("Pay3 deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });