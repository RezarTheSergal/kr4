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