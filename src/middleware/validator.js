const validatePlayerData = (req, res, next) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ 
      error: 'Имя игрока обязательно и должно быть строкой' 
    });
  }

  if (name.trim().length < 2 || name.trim().length > 20) {
    return res.status(400).json({ 
      error: 'Имя должно быть от 2 до 20 символов' 
    });
  }

  next();
};

const validatePurchase = (req, res, next) => {
  const { upgradeId } = req.body;

  if (!upgradeId || typeof upgradeId !== 'string') {
    return res.status(400).json({ 
      error: 'ID улучшения обязательно и должно быть строкой' 
    });
  }

  next();
};

const validatePlayerId = (req, res, next) => {
  const { playerId } = req.params;

  if (!playerId || playerId.trim().length === 0) {
    return res.status(400).json({ 
      error: 'ID игрока некорректен' 
    });
  }

  next();
};

module.exports = {
  validatePlayerData,
  validatePurchase,
  validatePlayerId
};