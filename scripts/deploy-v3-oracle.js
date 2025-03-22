require("dotenv").config();

const { ethers } = require("hardhat");

async function main() {
  const UniswapV3PriceFeed = await ethers.getContractFactory(
    "UniswapV3PriceFeed"
  );
  const oracle = await UniswapV3PriceFeed.deploy("0x80680b0670a330a99509b68b1273f93864d4ecf4"); // EDU/USDC Uniswap V3 Pool address here

  await oracle.waitForDeployment();

  const oracleAddress = await oracle.getAddress();

  console.log("Oracle Address deployed to: ", oracleAddress);
}

main();

//npx hardhat run scripts/deploy-v3-oracle.js --network educhain