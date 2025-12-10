class Upgrade {
  constructor(id, name, description, cost, benefits, category) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.cost = cost;
    this.benefits = benefits;
    this.category = category;
  }

  static getAllUpgrades() {
    return [
      new Upgrade(
        'upgrade_cursor',
        'Улучшенный курсор',
        'Увеличивает силу клика на 1',
        10,
        { clickPower: 1 },
        'click'
      ),
      new Upgrade(
        'upgrade_double_cursor',
        'Двойной курсор',
        'Удваивает силу клика',
        50,
        { clickPower: 2 },
        'click'
      ),
      new Upgrade(
        'upgrade_grandma',
        'Бабушка',
        'Генерирует 1 монету в секунду',
        100,
        { autoClickRate: 1 },
        'auto'
      ),
      new Upgrade(
        'upgrade_farm',
        'Ферма',
        'Генерирует 5 монет в секунду',
        500,
        { autoClickRate: 5 },
        'auto'
      ),
      new Upgrade(
        'upgrade_mine',
        'Шахта',
        'Генерирует 20 монет в секунду',
        2000,
        { autoClickRate: 20 },
        'auto'
      ),
      new Upgrade(
        'upgrade_factory',
        'Фабрика',
        'Генерирует 50 монет в секунду',
        10000,
        { autoClickRate: 50 },
        'auto'
      ),
      new Upgrade(
        'upgrade_bank',
        'Банк',
        'Генерирует 100 монет в секунду',
        50000,
        { autoClickRate: 100 },
        'auto'
      ),
      new Upgrade(
        'upgrade_golden_click',
        'Золотой клик',
        'Увеличивает силу клика на 10',
        1000,
        { clickPower: 10 },
        'click'
      )
    ];
  }

  static findById(id) {
    const upgrades = this.getAllUpgrades();
    return upgrades.find(u => u.id === id);
  }

  static filterByCategory(category) {
    const upgrades = this.getAllUpgrades();
    return upgrades.filter(u => u.category === category);
  }
}

module.exports = Upgrade;