const express = require('express');
const AuthController = require('../controllers/AuthController');
const { authMiddleware, getCurrentUser } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
