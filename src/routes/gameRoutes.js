const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { validatePlayerData, validatePlayerId } = require('../middleware/validator');

router.get('/players', gameController.getAllPlayers);

router.get('/player/:playerId', validatePlayerId, gameController.getPlayer);

router.post('/player', validatePlayerData, gameController.createPlayer);

router.post('/click/:playerId', validatePlayerId, gameController.handleClick);

router.put('/player/:playerId', validatePlayerId, gameController.updatePlayer);

router.delete('/player/:playerId', validatePlayerId, gameController.deletePlayer);

module.exports = router;