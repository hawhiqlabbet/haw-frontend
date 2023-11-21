const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const gameController = require('../controllers/gameController');

// auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
//router.get('/profile', authController.extractUsernameFromToken);

// game routes
router.post('/game/host', gameController.hostGame);
router.post('/game/join', gameController.joinGame);
router.delete('/game/close', gameController.closeLobby);
router.post('/game/leave', gameController.leaveGame);
router.get('/game/gameData', gameController.getGameData)

module.exports = router;

