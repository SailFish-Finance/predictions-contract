require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // Focus only on Oracle contracts and exclude v3-core and other problematic contracts
  paths: {
    sources: "./contracts",
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    opencampus: {
      url: `https://rpc.open-campus-codex.gelato.digital/`,
      accounts: [process.env.PRIVATE_KEY],
    },
    educhain: {
      url: "https://rpc.edu-chain.raas.gelato.cloud",
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 1000000000,
      gas: 80000000,
    },
  },
  etherscan: {
    apiKey: {
      opencampus: "your-etherscan-api-key",
      educhain: "your-etherscan-api-key",
    },
    customChains: [
      {
        network: "opencampus",
        chainId: 656476,
        urls: {
          apiURL: "https://edu-chain-testnet.blockscout.com/api/",
          browserURL: "https://edu-chain-testnet.blockscout.com/",
        },
        accounts: [process.env.PRIVATE_KEY],
      },
      {
        network: "educhain",
        chainId: 41923,
        urls: {
          apiURL: "https://educhain.blockscout.com/api/",
          browserURL: "https://educhain.blockscout.com/",
        },
        accounts: [process.env.PRIVATE_KEY],
      },
    ],
  },
};
