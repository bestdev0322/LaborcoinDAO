const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const { Web3 } = require('web3');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Web3 setup
const web3 = new Web3(process.env.WEB3_PROVIDER_URL || 'https://eth-mainnet.g.alchemy.com/v2/your-api-key');

// LABR Token Contract ABI (minimum required for balance checking)
const LABR_TOKEN_ABI = [
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    }
];

const LABR_TOKEN_ADDRESS = process.env.LABR_TOKEN_ADDRESS;
const MINIMUM_LABR_BALANCE = web3.utils.toWei('1', 'ether'); // 1 LABR token

// Registration flow endpoints
app.post('/api/verify-wallet', async (req, res) => {
    try {
        const { walletAddress } = req.body;

        if (!web3.utils.isAddress(walletAddress)) {
            return res.status(400).json({ error: 'Invalid wallet address' });
        }

        // Create token contract instance
        const tokenContract = new web3.eth.Contract(LABR_TOKEN_ABI, LABR_TOKEN_ADDRESS);

        // Check LABR balance
        const balance = await tokenContract.methods.balanceOf(walletAddress).call();

        if (BigInt(balance) < BigInt(MINIMUM_LABR_BALANCE)) {
            return res.status(400).json({
                error: 'Insufficient LABR balance',
                required: '1.00 LABR',
                current: web3.utils.fromWei(balance, 'ether')
            });
        }

        res.json({
            success: true,
            walletAddress,
            balance: web3.utils.fromWei(balance, 'ether')
        });
    } catch (error) {
        console.error('Wallet verification error:', error);
        res.status(500).json({ error: 'Failed to verify wallet' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});