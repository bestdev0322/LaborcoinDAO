const { web3, config, LABR_TOKEN_ABI } = require('../config');
const { verifySignature } = require('../utils/crypto');

const verifyWallet = async (req, res) => {
    try {
        const { walletAddress } = req.body;

        if (!web3.utils.isAddress(walletAddress)) {
            return res.status(400).json({ error: 'Invalid wallet address' });
        }

        // Create token contract instance
        const tokenContract = new web3.eth.Contract(LABR_TOKEN_ABI, config.web3.labrTokenAddress);

        // Check LABR balance
        const balance = await tokenContract.methods.balanceOf(walletAddress).call();

        if (BigInt(balance) < BigInt(config.web3.minimumLabrBalance)) {
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
};

const register = async (req, res) => {
    try {
        const { address, signature, message } = req.body;

        // Verify wallet address
        if (!web3.utils.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid wallet address' });
        }

        // Verify signature
        const isValidSignature = await verifySignature(message, signature, address);
        if (!isValidSignature) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // Create token contract instance
        const tokenContract = new web3.eth.Contract(LABR_TOKEN_ABI, config.web3.labrTokenAddress);

        // Check LABR balance
        const balance = await tokenContract.methods.balanceOf(address).call();

        if (BigInt(balance) < BigInt(config.web3.minimumLabrBalance)) {
            return res.status(400).json({
                error: 'Insufficient LABR balance',
                required: '1.00 LABR',
                current: web3.utils.fromWei(balance, 'ether')
            });
        }

        // TODO: Add registration logic here (e.g., save to database)

        res.json({
            success: true,
            address,
            balance: web3.utils.fromWei(balance, 'ether')
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

module.exports = {
    verifyWallet,
    register
};