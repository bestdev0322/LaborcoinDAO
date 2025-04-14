const { web3 } = require('../config');

const verifySignature = async (message, signature, address) => {
    try {
        const recoveredAddress = web3.eth.accounts.recover(message, signature);
        return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
};

module.exports = {
    verifySignature
};