const Player = require('../models/Player');

function getPlayer(req, res) {
  try {
    const { playerId } = req.params;
    const player = Player.findById(playerId);

    if (!player) {
      return res.status(404).json({ 
        error: 'Игрок не найден' 
      });
    }

    res.json({
      success: true,
      data: player
    });
  } catch (error) {
    console.error('Ошибка в getPlayer:', error);
    res.status(500).json({ 
      error: 'Ошибка при получении данных игрока',
      message: error.message 
    });
  }
}

function createPlayer(req, res) {
  try {
    const { name } = req.body;
    const newPlayer = Player.create(name);

    res.status(201).json({
      success: true,
      message: 'Игрок успешно создан',
      data: newPlayer
    });
  } catch (error) {
    console.error('Ошибка в createPlayer:', error);
    res.status(500).json({ 
      error: 'Ошибка при создании игрока',
      message: error.message 
    });
  }
}

function handleClick(req, res) {
  try {
    const { playerId } = req.params;
    const amount = parseInt(req.query.amount) || 1;

    const player = Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ 
        error: 'Игрок не найден' 
      });
    }

    const coinsToAdd = player.clickPower * amount;
    const updatedPlayer = Player.addCoins(playerId, coinsToAdd);

    res.json({
      success: true,
      message: `Добавлено ${coinsToAdd} монет`,
      data: updatedPlayer
    });
  } catch (error) {
    console.error('Ошибка в handleClick:', error);
    res.status(500).json({ 
      error: 'Ошибка при обработке клика',
      message: error.message 
    });
  }
}

function updatePlayer(req, res) {
  try {
    const { playerId } = req.params;
    const updates = req.body;

    const player = Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ 
        error: 'Игрок не найден' 
      });
    }

    const updatedPlayer = Player.update(playerId, updates);

    res.json({
      success: true,
      message: 'Данные игрока обновлены',
      data: updatedPlayer
    });
  } catch (error) {
    console.error('Ошибка в updatePlayer:', error);
    res.status(500).json({ 
      error: 'Ошибка при обновлении данных игрока',
      message: error.message 
    });
  }
}

function deletePlayer(req, res) {
  try {
    const { playerId } = req.params;

    const deleted = Player.delete(playerId);
    if (!deleted) {
      return res.status(404).json({ 
        error: 'Игрок не найден' 
      });
    }

    res.json({
      success: true,
      message: 'Игрок успешно удален'
    });
  } catch (error) {
    console.error('Ошибка в deletePlayer:', error);
    res.status(500).json({ 
      error: 'Ошибка при удалении игрока',
      message: error.message 
    });
  }
}

function getAllPlayers(req, res) {
  try {
    const players = Player.getAllPlayers();
    
    res.json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (error) {
    console.error('Ошибка в getAllPlayers:', error);
    res.status(500).json({ 
      error: 'Ошибка при получении списка игроков',
      message: error.message 
    });
  }
}

module.exports = {
  getPlayer,
  createPlayer,
  handleClick,
  updatePlayer,
  deletePlayer,
  getAllPlayers
};