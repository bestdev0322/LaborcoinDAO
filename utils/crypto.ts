import { web3 } from '../config';

const verifySignature = async (message: string, signature: string, address: string): Promise<boolean> => {
    try {
        const recoveredAddress = web3.eth.accounts.recover(message, signature);
        return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
};

export {
    verifySignature
}; 
 