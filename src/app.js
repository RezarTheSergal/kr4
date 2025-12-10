const express = require('express');
const path = require('path');
const loggerMiddleware = require('./middleware/logger');
const gameRoutes = require('./routes/gameRoutes');
const upgradeRoutes = require('./routes/upgradeRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerMiddleware);

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/game', gameRoutes);
app.use('/api/upgrades', upgradeRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Маршрут не найден',
    path: req.path 
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Внутренняя ошибка сервера',
    message: err.message 
  });
});

module.exports = app;