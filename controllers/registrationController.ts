import { Request, Response } from 'express';
import { web3, config, LABR_TOKEN_ABI, DAO_ABI, LABRV_TOKEN_ABI } from '../config';
import { verifySignature } from '../utils/crypto';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import {
    Configuration,
    PlaidApi,
    PlaidEnvironments,
    CountryCode,
    Products,
    // IncomeVerificationCreateRequest,
    // IncomeVerificationCreateResponse,
    // VerificationStatus
} from 'plaid';
import { User, IUser } from '../models/User';

// Initialize Plaid client
const plaidConfig = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SANDBOX_SECRET,
        },
    },
});

const plaidClient = new PlaidApi(plaidConfig);

// Plaid configuration
const PLAID_PRODUCTS = [Products.IncomeVerification];
const PLAID_COUNTRY_CODES = [CountryCode.Us];
const PLAID_LANGUAGE = 'en';
const INCOME_THRESHOLDS = {
    MINIMUM_ANNUAL_INCOME: 30000,
    MINIMUM_MONTHLY_INCOME: 2500,
};

// Define the contract method types
interface TokenContractMethods {
    balanceOf(address: string): {
        call(): Promise<string>;
    };
}

interface DaoContractMethods {
    addMemberToGroup(groupName: string, member: string): {
        encodeABI(): string;
        estimateGas(options: { from: string }): Promise<number>;
    };
}

interface LabrvContractMethods {
    mint(to: string, amount: string): {
        encodeABI(): string;
        estimateGas(options: { from: string }): Promise<number>;
    };
}

type TokenContract = Contract<AbiItem[]> & { methods: TokenContractMethods };
type DaoContract = Contract<AbiItem[]> & { methods: DaoContractMethods };
type LabrvContract = Contract<AbiItem[]> & { methods: LabrvContractMethods };

// Request interfaces
interface VerifyWalletRequest {
    walletAddress: string;
}

interface RegisterRequest {
    address: string;
    signature: string;
    message: string;
}

interface InitiateIncomeVerificationRequest {
    walletAddress: string;
}

interface VerifyIncomeRequest {
    walletAddress: string;
    publicToken: string;
}

const verifyWallet = async (req: Request<{}, {}, VerifyWalletRequest>, res: Response) => {
    try {
        const { walletAddress } = req.body;

        if (!web3.utils.isAddress(walletAddress)) {
            return res.status(400).json({ error: 'Invalid wallet address' });
        }

        // Create token contract instance
        const tokenContract = new web3.eth.Contract(LABR_TOKEN_ABI as AbiItem[], config.web3.labrTokenAddress!) as unknown as TokenContract;

        // Check LABR balance
        const balance = await tokenContract.methods.balanceOf(walletAddress).call();

        if (BigInt(balance) < BigInt(config.web3.minimumLabrBalance)) {
            return res.status(400).json({
                error: 'Insufficient LABR balance',
                required: '1.00 LABR',
                current: web3.utils.fromWei(balance, 'ether')
            });
        }

        // Create or update user record
        await User.findOneAndUpdate(
            { walletAddress: walletAddress.toLowerCase() },
            {
                walletAddress: walletAddress.toLowerCase(),
                labrBalance: balance,
                $setOnInsert: { isRegistered: false }
            },
            { upsert: true, new: true }
        );

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

const initiateIncomeVerification = async (req: Request<{}, {}, InitiateIncomeVerificationRequest>, res: Response) => {
    try {
        const { walletAddress } = req.body;

        if (!web3.utils.isAddress(walletAddress)) {
            return res.status(400).json({ error: 'Invalid wallet address' });
        }

        // Check if user exists and has sufficient LABR balance
        const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
        if (!user) {
            return res.status(400).json({ error: 'Wallet not verified' });
        }

        // Check if user already has a completed verification
        if (user.incomeVerification?.status === 'completed') {
            return res.json({
                success: true,
                status: 'already_verified',
                verificationId: user.incomeVerification.verificationId
            });
        }

        // Create Plaid link token
        const request = {
            user: {
                client_user_id: walletAddress,
            },
            client_name: 'Laborcoin DAO',
            products: PLAID_PRODUCTS,
            country_codes: PLAID_COUNTRY_CODES,
            language: PLAID_LANGUAGE,
            webhook: `${process.env.API_URL}/api/register/income-webhook`,
        };

        const response = await plaidClient.linkTokenCreate(request);

        // Update user with verification initiation
        await User.findOneAndUpdate(
            { walletAddress: walletAddress.toLowerCase() },
            {
                'incomeVerification.verificationId': response.data.link_token,
                'incomeVerification.status': 'pending'
            }
        );

        res.json({
            success: true,
            linkToken: response.data.link_token,
            status: 'pending'
        });
    } catch (error) {
        console.error('Income verification initiation error:', error);
        res.status(500).json({ error: 'Failed to initiate income verification' });
    }
};

const verifyIncome = async (req: Request<{}, {}, VerifyIncomeRequest>, res: Response) => {
    try {
        const { walletAddress, publicToken } = req.body;

        if (!web3.utils.isAddress(walletAddress)) {
            return res.status(400).json({ error: 'Invalid wallet address' });
        }

        // Exchange public token for access token
        const exchangeResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = exchangeResponse.data.access_token;
        const itemId = exchangeResponse.data.item_id;

        // Get income verification data
        const incomeRequest = {
            access_token: accessToken
        } as any;

        const incomeResponse = await plaidClient.incomeVerificationCreate(incomeRequest);
        const verificationId = incomeResponse.data.income_verification_id;

        // Update user with verification data
        await User.findOneAndUpdate(
            { walletAddress: walletAddress.toLowerCase() },
            {
                'incomeVerification.verificationId': verificationId,
                'incomeVerification.status': 'pending',
                'incomeVerification.accessToken': accessToken,
                'incomeVerification.itemId': itemId
            }
        );

        res.json({
            success: true,
            verificationId,
            message: 'Income verification process started'
        });
    } catch (error) {
        console.error('Error verifying income:', error);
        res.status(500).json({ error: 'Failed to verify income' });
    }
};

const handleIncomeWebhook = async (req: Request, res: Response) => {
    try {
        const { webhook_type, webhook_code, item_id, verification_id, error } = req.body;

        if (webhook_type === 'INCOME_VERIFICATION') {
            const user = await User.findOne({ 'incomeVerification.itemId': item_id });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            switch (webhook_code) {
                case 'INCOME_VERIFICATION_COMPLETED':
                    try {
                        // Get income verification details
                        const incomeRequest = {
                            access_token: user.incomeVerification?.accessToken || ''
                        } as any;

                        const verificationResponse = await plaidClient.incomeVerificationCreate(incomeRequest);
                        const verificationData = verificationResponse.data;

                        // Calculate income from verification data
                        // Note: The actual income calculation will depend on the structure of verificationData
                        // This is a placeholder - you'll need to adjust based on the actual response structure
                        const annualIncome = 0; // TODO: Calculate from verificationData
                        const monthlyIncome = 0; // TODO: Calculate from verificationData

                        const meetsRequirements =
                            annualIncome >= INCOME_THRESHOLDS.MINIMUM_ANNUAL_INCOME &&
                            monthlyIncome >= INCOME_THRESHOLDS.MINIMUM_MONTHLY_INCOME;

                        // Update user verification status
                        await User.findOneAndUpdate(
                            { 'incomeVerification.itemId': item_id },
                            {
                                'incomeVerification.status': meetsRequirements ? 'completed' : 'failed',
                                'incomeVerification.annualIncome': annualIncome,
                                'incomeVerification.monthlyIncome': monthlyIncome,
                                'incomeVerification.verifiedAt': new Date()
                            }
                        );

                        // TODO: Implement notification system for verification status
                    } catch (error) {
                        console.error('Error processing income verification:', error);
                        await User.findOneAndUpdate(
                            { 'incomeVerification.itemId': item_id },
                            { 'incomeVerification.status': 'failed' }
                        );
                    }
                    break;

                case 'INCOME_VERIFICATION_FAILED':
                    await User.findOneAndUpdate(
                        { 'incomeVerification.itemId': item_id },
                        { 'incomeVerification.status': 'failed' }
                    );
                    console.error('Income verification failed:', error);
                    break;
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Income webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};

const register = async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
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

        // Check user and income verification status
        const user = await User.findOne({ walletAddress: address.toLowerCase() });
        if (!user) {
            return res.status(400).json({ error: 'Wallet not verified' });
        }

        if (user.isRegistered) {
            return res.status(400).json({ error: 'User already registered' });
        }

        // Check income verification status
        if (!user.incomeVerification || user.incomeVerification.status !== 'completed') {
            return res.status(400).json({ 
                error: 'Income verification required',
                status: user.incomeVerification?.status || 'pending'
            });
        }

        // Create DAO contract instance
        const daoContract = new web3.eth.Contract(DAO_ABI as AbiItem[], config.web3.daoAddress!) as unknown as DaoContract;

        // Create LABRV token contract instance
        const labrvContract = new web3.eth.Contract(LABRV_TOKEN_ABI as AbiItem[], config.web3.labrvTokenAddress!) as unknown as LabrvContract;

        try {
            // Get the admin wallet from config
            const adminWallet = web3.eth.accounts.privateKeyToAccount(config.web3.adminPrivateKey!);

            // 1. Add member to 'The People' voting group
            const addMemberTx = daoContract.methods.addMemberToGroup('The People', address);

            // Get gas estimate for adding member
            const addMemberGas = await addMemberTx.estimateGas({ from: adminWallet.address });

            // Sign and send the transaction
            const signedAddMemberTx = await adminWallet.signTransaction({
                to: config.web3.daoAddress!,
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
                to: config.web3.labrvTokenAddress!,
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

            // Update user registration status
            await User.findOneAndUpdate(
                { walletAddress: address.toLowerCase() },
                {
                    isRegistered: true,
                    registrationDate: new Date()
                }
            );

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

export {
    verifyWallet,
    register,
    initiateIncomeVerification,
    verifyIncome,
    handleIncomeWebhook
};