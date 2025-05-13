import express, { Router } from 'express';
import { verifyWallet, register } from '../controllers/registrationController';

const router: Router = express.Router();

// Registration routes
router.post('/verify-wallet', verifyWallet);
router.post('/register', register);

export default router; 