# Clicker Game API

Полноценное Express.js приложение для кликер-игры с REST API и веб-интерфейсом.

![alt text](image.png)

![alt text](image-1.png)

## Описание проекта

Это полнофункциональное приложение на Express.js, которое реализует кликер-игру с системой улучшений, автоматической генерацией монет и полноценным API для управления игровыми данными.

## Основные возможности

- Создание и управление игроками
- Система кликов с накоплением монет
- Улучшения двух типов: увеличение силы клика и автоматическая генерация
- Сохранение прогресса в JSON файле
- Полноценный веб-интерфейс
- RESTful API с поддержкой GET, POST, PUT, DELETE
- Валидация данных через middleware
- Логирование всех запросов

## Структура проекта

```
clicker-game/
├── src/
│   ├── config/            # Конфигурация (не используется в текущей версии)
│   ├── controllers/       # Бизнес-логика
│   │   ├── gameController.js
│   │   └── upgradeController.js
│   ├── middleware/        # Пользовательские middleware
│   │   ├── logger.js
│   │   └── validator.js
│   ├── models/           # Модели данных
│   │   ├── Player.js
│   │   └── Upgrade.js
│   ├── routes/           # Маршруты API
│   │   ├── gameRoutes.js
│   │   └── upgradeRoutes.js
│   └── app.js            # Главный файл приложения
├── public/               # Статические файлы
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── game.js
│   └── index.html
├── data/                 # Хранилище данных
│   └── players.json
├── package.json
├── server.js             # Точка входа
└── README.md
```

## Установка

Клонируйте репозиторий:

```bash
git clone https://github.com/rezarthesergal/kr5.git
cd clicker-game
```

Установите зависимости:

```bash
npm install
```

Запустите сервер:

```bash
npm start
```

Для режима разработки с автоперезагрузкой:

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:3000`

## API Endpoints

### Game Routes (`/api/game`)

#### GET `/api/game/players`
Получить список всех игроков

**Ответ:**
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

#### GET `/api/game/player/:playerId`
Получить данные конкретного игрока

**Параметры:**
- `playerId` (string) - ID игрока

**Ответ:**
```json
{
  "success": true,
  "data": {
    "id": "player_123",
    "name": "Игрок",
    "coins": 150,
    "clickPower": 5,
    "autoClickRate": 10,
    "upgrades": ["upgrade_cursor"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastUpdate": "2024-01-01T00:05:00.000Z"
  }
}
```

#### POST `/api/game/player`
Создать нового игрока

**Body:**
```json
{
  "name": "Новый игрок"
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "Игрок успешно создан",
  "data": {...}
}
```

#### POST `/api/game/click/:playerId`
Выполнить клик (добавить монеты)

**Параметры:**
- `playerId` (string) - ID игрока

**Query параметры:**
- `amount` (number, optional) - Количество кликов (по умолчанию 1)

**Пример:** `/api/game/click/player_123?amount=5`

**Ответ:**
```json
{
  "success": true,
  "message": "Добавлено 25 монет",
  "data": {...}
}
```

#### PUT `/api/game/player/:playerId`
Обновить данные игрока

**Параметры:**
- `playerId` (string) - ID игрока

**Body:**
```json
{
  "coins": 1000,
  "clickPower": 10
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "Данные игрока обновлены",
  "data": {...}
}
```

#### DELETE `/api/game/player/:playerId`
Удалить игрока

**Параметры:**
- `playerId` (string) - ID игрока

**Ответ:**
```json
{
  "success": true,
  "message": "Игрок успешно удален"
}
```

### Upgrade Routes (`/api/upgrades`)

#### GET `/api/upgrades`
Получить список всех улучшений

**Query параметры:**
- `category` (string, optional) - Фильтр по категории (`click` или `auto`)

**Пример:** `/api/upgrades?category=auto`

**Ответ:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": "upgrade_cursor",
      "name": "Улучшенный курсор",
      "description": "Увеличивает силу клика на 1",
      "cost": 10,
      "benefits": {
        "clickPower": 1
      },
      "category": "click"
    }
  ]
}
```

#### GET `/api/upgrades/:upgradeId`
Получить конкретное улучшение

**Параметры:**
- `upgradeId` (string) - ID улучшения

**Ответ:**
```json
{
  "success": true,
  "data": {...}
}
```

#### POST `/api/upgrades/purchase/:playerId`
Купить улучшение

**Параметры:**
- `playerId` (string) - ID игрока

**Body:**
```json
{
  "upgradeId": "upgrade_cursor"
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "Улучшение \"Улучшенный курсор\" успешно куплено",
  "data": {...},
  "upgrade": {...}
}
```

## Middleware

### Logger (`src/middleware/logger.js`)
Логирует все входящие запросы с указанием метода, URL, IP-адреса и статуса ответа.

**Пример вывода:**
```
[2024-01-01T00:00:00.000Z] POST /api/game/player - IP: ::1
[2024-01-01T00:00:00.000Z] Ответ: 201
```

### Validator (`src/middleware/validator.js`)
Валидирует данные запросов:

- `validatePlayerData` - проверяет имя игрока (2-20 символов)
- `validatePurchase` - проверяет наличие upgradeId
- `validatePlayerId` - проверяет корректность playerId

## Модели

### Player (`src/models/Player.js`)
Модель игрока с методами:
- `getAllPlayers()` - получить всех игроков
- `findById(id)` - найти игрока по ID
- `create(name)` - создать нового игрока
- `update(id, updates)` - обновить данные игрока
- `delete(id)` - удалить игрока
- `addCoins(id, amount)` - добавить монеты
- `purchaseUpgrade(id, upgradeId, cost, benefits)` - купить улучшение

### Upgrade (`src/models/Upgrade.js`)
Модель улучшения с предопределенным списком:
- Улучшения для клика (увеличение силы)
- Улучшения для автогенерации (пассивный доход)

## Веб-интерфейс

Интерфейс игры включает:

1. Экран приветствия с вводом имени
2. Игровой экран с:
   - Отображением статистики (монеты, сила клика, автогенерация)
   - Большой кнопкой для клика
   - Списком улучшений с фильтрацией
   - Кнопкой сброса прогресса

3. Автоматическое сохранение прогресса в localStorage
4. Автоматическая генерация монет (если куплены соответствующие улучшения)

## Особенности реализации

### Работа с параметрами
- `req.params` - для ID ресурсов (playerId, upgradeId)
- `req.query` - для опциональных параметров (amount, category)
- `req.body` - для передачи данных в POST/PUT запросах

### Обработка данных
- `express.json()` - парсинг JSON в body
- `express.urlencoded()` - парсинг URL-encoded данных

### Статические файлы
- `express.static()` - раздача файлов из папки public

### Модульная архитектура
- Разделение на routes, controllers, models
- Централизованная обработка ошибок
- Middleware для логирования и валидации

## Скриншоты

### Главный экран
![Главный экран](https://via.placeholder.com/800x500/667eea/ffffff?text=Start+Screen)

### Игровой процесс
![Игра](https://via.placeholder.com/800x500/667eea/ffffff?text=Game+Screen)

### Улучшения
![Улучшения](https://via.placeholder.com/800x500/667eea/ffffff?text=Upgrades)

## Технологии

- Node.js 14+
- Express.js 4.18+
- Vanilla JavaScript (фронтенд)
- CSS3 с градиентами и анимациями
- JSON для хранения данных

## Примеры использования API

### Создание игрока с помощью curl

```bash
curl -X POST http://localhost:3000/api/game/player \
  -H "Content-Type: application/json" \
  -d '{"name":"Тестовый игрок"}'
```

### Выполнение клика

```bash
curl -X POST http://localhost:3000/api/game/click/player_123
```

### Покупка улучшения

```bash
curl -X POST http://localhost:3000/api/upgrades/purchase/player_123 \
  -H "Content-Type: application/json" \
  -d '{"upgradeId":"upgrade_cursor"}'
```

### Получение списка улучшений автогенерации

```bash
curl http://localhost:3000/api/upgrades?category=auto
```

## Разработка

Для разработки используйте nodemon:

```bash
npm run dev
```

Это автоматически перезапустит сервер при изменении файлов.

## Тестирование

Вы можете протестировать API используя:
- Postman
- curl
- Веб-интерфейс браузера
- Любой HTTP-клиент

## Возможные улучшения

- Добавить базу данных (MongoDB, PostgreSQL)
- Реализовать систему достижений
- Добавить мультиплеер с рейтингом
- Реализовать систему событий
- Добавить анимации и звуковые эффекты
- Внедрить WebSocket для real-time обновлений

## Лицензия

MIT

## Автор

Ваше имя

## Поддержка

Если у вас возникли вопросы или проблемы, создайте issue в репозитории.