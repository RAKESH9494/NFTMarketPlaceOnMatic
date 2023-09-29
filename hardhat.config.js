require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "mumbai_matic",
  networks: {
    hardhat: {},
    mumbai_matic: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
}
