const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/players.json');

class Player {
  constructor(id, name, coins = 0, clickPower = 1, autoClickRate = 0, upgrades = []) {
    this.id = id;
    this.name = name;
    this.coins = coins;
    this.clickPower = clickPower;
    this.autoClickRate = autoClickRate;
    this.upgrades = upgrades;
    this.createdAt = new Date().toISOString();
    this.lastUpdate = new Date().toISOString();
  }

  static ensureDataFile() {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({ players: [] }, null, 2));
    }
  }

  static getAllPlayers() {
    this.ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data).players || [];
  }

  static savePlayers(players) {
    this.ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify({ players }, null, 2));
  }

  static findById(id) {
    const players = this.getAllPlayers();
    return players.find(p => p.id === id);
  }

  static create(name) {
    const players = this.getAllPlayers();
    const id = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPlayer = new Player(id, name);
    players.push(newPlayer);
    this.savePlayers(players);
    return newPlayer;
  }

  static update(id, updates) {
    const players = this.getAllPlayers();
    const index = players.findIndex(p => p.id === id);
    
    if (index === -1) return null;

    players[index] = {
      ...players[index],
      ...updates,
      lastUpdate: new Date().toISOString()
    };

    this.savePlayers(players);
    return players[index];
  }

  static delete(id) {
    const players = this.getAllPlayers();
    const filteredPlayers = players.filter(p => p.id !== id);
    
    if (players.length === filteredPlayers.length) return false;
    
    this.savePlayers(filteredPlayers);
    return true;
  }

  static addCoins(id, amount) {
    const player = this.findById(id);
    if (!player) return null;

    return this.update(id, { 
      coins: player.coins + amount 
    });
  }

  static purchaseUpgrade(id, upgradeId, cost, benefits) {
    const player = this.findById(id);
    if (!player) return null;

    if (player.coins < cost) {
      throw new Error('Недостаточно монет');
    }

    const newCoins = player.coins - cost;
    const newClickPower = player.clickPower + (benefits.clickPower || 0);
    const newAutoClickRate = player.autoClickRate + (benefits.autoClickRate || 0);
    const newUpgrades = [...player.upgrades, upgradeId];

    return this.update(id, {
      coins: newCoins,
      clickPower: newClickPower,
      autoClickRate: newAutoClickRate,
      upgrades: newUpgrades
    });
  }
}

module.exports = Player;