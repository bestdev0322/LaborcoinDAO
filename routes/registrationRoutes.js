const express = require('express');
const router = express.Router();
const { verifyWallet, register } = require('../controllers/registrationController');

// Registration routes
router.post('/verify-wallet', verifyWallet);
router.post('/register', register);

module.exports = router;