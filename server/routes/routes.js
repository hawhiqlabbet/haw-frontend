const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');

// auth routes
router.post('/auth/register', authController.register);
router.post('/login', authController.login);
//router.get('/profile', authController.extractUsernameFromToken);

// home routes
router.post('/join', homeController.joinRoom);
router.get('/host', homeController.hostRoom);

module.exports = router;

