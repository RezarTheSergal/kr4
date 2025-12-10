const Upgrade = require('../models/Upgrade');
const Player = require('../models/Player');

function getAllUpgrades(req, res) {
  try {
    const { category } = req.query;
    
    let upgrades;
    if (category) {
      upgrades = Upgrade.filterByCategory(category);
    } else {
      upgrades = Upgrade.getAllUpgrades();
    }

    res.json({
      success: true,
      count: upgrades.length,
      data: upgrades
    });
  } catch (error) {
    console.error('Ошибка в getAllUpgrades:', error);
    res.status(500).json({ 
      error: 'Ошибка при получении списка улучшений',
      message: error.message 
    });
  }
}

function getUpgradeById(req, res) {
  try {
    const { upgradeId } = req.params;
    const upgrade = Upgrade.findById(upgradeId);

    if (!upgrade) {
      return res.status(404).json({ 
        error: 'Улучшение не найдено' 
      });
    }

    res.json({
      success: true,
      data: upgrade
    });
  } catch (error) {
    console.error('Ошибка в getUpgradeById:', error);
    res.status(500).json({ 
      error: 'Ошибка при получении улучшения',
      message: error.message 
    });
  }
}

function purchaseUpgrade(req, res) {
  try {
    const { playerId } = req.params;
    const { upgradeId } = req.body;

    const player = Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ 
        error: 'Игрок не найден' 
      });
    }

    const upgrade = Upgrade.findById(upgradeId);
    if (!upgrade) {
      return res.status(404).json({ 
        error: 'Улучшение не найдено' 
      });
    }

    if (player.upgrades.includes(upgradeId)) {
      return res.status(400).json({ 
        error: 'Это улучшение уже куплено' 
      });
    }

    if (player.coins < upgrade.cost) {
      return res.status(400).json({ 
        error: 'Недостаточно монет',
        required: upgrade.cost,
        current: player.coins
      });
    }

    const updatedPlayer = Player.purchaseUpgrade(
      playerId, 
      upgradeId, 
      upgrade.cost, 
      upgrade.benefits
    );

    res.json({
      success: true,
      message: `Улучшение "${upgrade.name}" успешно куплено`,
      data: updatedPlayer,
      upgrade: upgrade
    });
  } catch (error) {
    console.error('Ошибка в purchaseUpgrade:', error);
    res.status(500).json({ 
      error: 'Ошибка при покупке улучшения',
      message: error.message 
    });
  }
}

module.exports = {
  getAllUpgrades,
  getUpgradeById,
  purchaseUpgrade
};