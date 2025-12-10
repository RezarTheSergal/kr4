const express = require('express');
const router = express.Router();
const upgradeController = require('../controllers/upgradeController');
const { validatePurchase, validatePlayerId } = require('../middleware/validator');

// Проверка что контроллер загружен
if (!upgradeController.getAllUpgrades) {
  console.error('ОШИБКА: getAllUpgrades не найден в upgradeController');
  console.log('Доступные экспорты:', Object.keys(upgradeController));
}

router.get('/', upgradeController.getAllUpgrades);

router.get('/:upgradeId', upgradeController.getUpgradeById);

router.post('/purchase/:playerId', validatePlayerId, validatePurchase, upgradeController.purchaseUpgrade);

module.exports = router;