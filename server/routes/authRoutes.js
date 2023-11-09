const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login, (req, res) => {
    console.log('Login function called');

});

router.get('/profile', authController.extractUsernameFromToken);

module.exports = router;
