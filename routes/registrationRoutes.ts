import express from 'express';
import {
    verifyWallet,
    register,
    initiateIncomeVerification,
    verifyIncome,
    handleIncomeWebhook
} from '../controllers/registrationController';

const router = express.Router();

// Wallet verification route
router.post('/verify-wallet', verifyWallet);

// Income verification routes
router.post('/income/initiate', initiateIncomeVerification);
router.post('/income/verify', verifyIncome);
router.post('/income-webhook', handleIncomeWebhook);

// Registration route
router.post('/register', register);

export default router;