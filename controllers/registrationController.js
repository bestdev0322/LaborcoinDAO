const { web3, config, LABR_TOKEN_ABI, DAO_ABI, LABRV_TOKEN_ABI } = require('../config');
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

        // Create DAO contract instance
        const daoContract = new web3.eth.Contract(DAO_ABI, config.web3.daoAddress);

        // Create LABRV token contract instance
        const labrvContract = new web3.eth.Contract(LABRV_TOKEN_ABI, config.web3.labrvTokenAddress);

        try {
            // Get the admin wallet from config
            const adminWallet = web3.eth.accounts.privateKeyToAccount(config.web3.adminPrivateKey);

            // 1. Add member to 'The People' voting group
            const addMemberTx = daoContract.methods.addMemberToGroup('The People', address);

            // Get gas estimate for adding member
            const addMemberGas = await addMemberTx.estimateGas({ from: adminWallet.address });

            // Sign and send the transaction
            const signedAddMemberTx = await adminWallet.signTransaction({
                to: config.web3.daoAddress,
                data: addMemberTx.encodeABI(),
                gas: addMemberGas,
                gasPrice: await web3.eth.getGasPrice(),
                nonce: await web3.eth.getTransactionCount(adminWallet.address)
            });

            // Send the signed transaction
            const addMemberReceipt = await web3.eth.sendSignedTransaction(signedAddMemberTx.rawTransaction);

            if (!addMemberReceipt.status) {
                throw new Error('Failed to add member to group');
            }

            // 2. Issue 1 LABRV token to the new member
            const mintTx = labrvContract.methods.mint(address, web3.utils.toWei('1', 'ether')); // 1 LABRV token

            // Get gas estimate for minting
            const mintGas = await mintTx.estimateGas({ from: adminWallet.address });

            // Sign and send the transaction
            const signedMintTx = await adminWallet.signTransaction({
                to: config.web3.labrvTokenAddress,
                data: mintTx.encodeABI(),
                gas: mintGas,
                gasPrice: await web3.eth.getGasPrice(),
                nonce: await web3.eth.getTransactionCount(adminWallet.address, 'latest')
            });

            // Send the signed transaction
            const mintReceipt = await web3.eth.sendSignedTransaction(signedMintTx.rawTransaction);

            if (!mintReceipt.status) {
                throw new Error('Failed to mint LABRV token');
            }

            res.json({
                success: true,
                address,
                addMemberTxHash: addMemberReceipt.transactionHash,
                mintTxHash: mintReceipt.transactionHash
            });

        } catch (error) {
            console.error('DAO contract interaction error:', error);
            return res.status(500).json({ error: 'Failed to complete registration process' });
        }

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

module.exports = {
    verifyWallet,
    register
};