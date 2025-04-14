require('dotenv').config();
const { Web3 } = require('web3');

const config = {
    port: process.env.PORT || 5000,
    web3: {
        providerUrl: process.env.WEB3_PROVIDER_URL || 'https://polygon-rpc.com',
        labrTokenAddress: process.env.LABR_TOKEN_ADDRESS,
        minimumLabrBalance: '1000000000000000000' // 1 LABR in wei
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true
    }
};

// LABR Token ABI
const LABR_TOKEN_ABI = [
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    }
];

// Initialize Web3
const web3 = new Web3(config.web3.providerUrl);

module.exports = {
    config,
    web3,
    LABR_TOKEN_ABI
};
