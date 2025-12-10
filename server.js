const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Clicker Game API запущен на порту ${PORT}`);
  console.log(`Откройте браузер: http://localhost:${PORT}`);
});