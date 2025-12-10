let currentPlayer = null;
let upgrades = [];
let autoClickInterval = null;
let clickCount = 0;

const API_BASE = '/api';

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const playerInfo = document.getElementById('player-info');
const nameInput = document.getElementById('name-input');
const startButton = document.getElementById('start-button');
const playerNameSpan = document.getElementById('player-name');
const coinsSpan = document.getElementById('coins');
const clickPowerSpan = document.getElementById('click-power');
const autoRateSpan = document.getElementById('auto-rate');
const clickButton = document.getElementById('click-button');
const upgradesList = document.getElementById('upgrades-list');
const resetButton = document.getElementById('reset-button');
const tabButtons = document.querySelectorAll('.tab-button');
const statsPanel = document.getElementById('stats');          // ← НОВОЕ
const upgradesPanel = document.getElementById('upgrades-panel'); // ← НОВОЕ

async function createPlayer(name) {
  try {
    const response = await fetch(`${API_BASE}/game/player`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    const result = await response.json();
    
    if (result.success) {
      currentPlayer = result.data;
      localStorage.setItem('playerId', currentPlayer.id);
      startGame();
    } else {
      alert('Ошибка при создании игрока');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Ошибка соединения с сервером');
  }
}

async function loadPlayer(playerId) {
  try {
    const response = await fetch(`${API_BASE}/game/player/${playerId}`);
    const result = await response.json();
    
    if (result.success) {
      currentPlayer = result.data;
      startGame();
    } else {
      localStorage.removeItem('playerId');
      showStartScreen();
    }
  } catch (error) {
    console.error('Ошибка:', error);
    localStorage.removeItem('playerId');
    showStartScreen();
  }
}

async function loadUpgrades() {
  try {
    const response = await fetch(`${API_BASE}/upgrades`);
    const result = await response.json();
    
    if (result.success) {
      upgrades = result.data;
      renderUpgrades();
    }
  } catch (error) {
    console.error('Ошибка загрузки улучшений:', error);
  }
}

async function handleClick() {
  if (!currentPlayer) return;

  clickCount++;

  if (clickCount >= 3) {
    statsPanel.classList.remove('hidden');
    upgradesPanel.classList.add('visible'); // ← Добавляем класс visible
  }

  try {
    const response = await fetch(`${API_BASE}/game/click/${currentPlayer.id}`, {
      method: 'POST'
    });
    const result = await response.json();
    
    if (result.success) {
      currentPlayer = result.data;
      updateUI();
      
      clickButton.classList.add('clicked');
      setTimeout(() => clickButton.classList.remove('clicked'), 200);
    }
  } catch (error) {
    console.error('Ошибка клика:', error);
  }
}

async function purchaseUpgrade(upgradeId) {
  if (!currentPlayer) return;

  try {
    const response = await fetch(`${API_BASE}/upgrades/purchase/${currentPlayer.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ upgradeId })
    });
    const result = await response.json();
    
    if (result.success) {
      currentPlayer = result.data;
      updateUI();
      renderUpgrades();
      alert(`Куплено: ${result.upgrade.name}`);
    } else {
      alert(result.error || 'Ошибка покупки');
    }
  } catch (error) {
    console.error('Ошибка покупки:', error);
    alert('Ошибка соединения с сервером');
  }
}

function updateUI() {
  if (!currentPlayer) return;
  coinsSpan.textContent = Math.floor(currentPlayer.coins);
  clickPowerSpan.textContent = currentPlayer.clickPower;
  autoRateSpan.textContent = currentPlayer.autoClickRate;
  playerNameSpan.textContent = currentPlayer.name;
}

function renderUpgrades(category = 'all') {
  upgradesList.innerHTML = '';
  
  const filteredUpgrades = category === 'all' 
    ? upgrades 
    : upgrades.filter(u => u.category === category);

  filteredUpgrades.forEach(upgrade => {
    const owned = currentPlayer.upgrades.includes(upgrade.id);
    const canAfford = currentPlayer.coins >= upgrade.cost;
    
    const card = document.createElement('div');
    card.className = 'upgrade-card';
    if (owned) card.classList.add('owned');
    if (!canAfford && !owned) card.classList.add('cannot-afford');
    
    card.innerHTML = `
      <div class="upgrade-name">${upgrade.name}</div>
      <div class="upgrade-description">${upgrade.description}</div>
      <div class="upgrade-cost">💰 ${upgrade.cost}</div>
      <button class="upgrade-button" ${owned ? 'disabled' : ''} data-id="${upgrade.id}">
        ${owned ? 'Куплено' : 'Купить'}
      </button>
    `;
    
    const button = card.querySelector('.upgrade-button');
    if (!owned) {
      button.addEventListener('click', () => purchaseUpgrade(upgrade.id));
    }
    
    upgradesList.appendChild(card);
  });
}

function startAutoClicker() {
  if (autoClickInterval) {
    clearInterval(autoClickInterval);
  }
  
  autoClickInterval = setInterval(async () => {
    if (!currentPlayer || currentPlayer.autoClickRate === 0) return;
    
    try {
      const response = await fetch(
        `${API_BASE}/game/click/${currentPlayer.id}?amount=${currentPlayer.autoClickRate}`,
        { method: 'POST' }
      );
      const result = await response.json();
      
      if (result.success) {
        currentPlayer = result.data;
        updateUI();
        renderUpgrades(getCurrentCategory());
      }
    } catch (error) {
      console.error('Ошибка автоклика:', error);
    }
  }, 1000);
}

function getCurrentCategory() {
  const activeTab = document.querySelector('.tab-button.active');
  return activeTab ? activeTab.dataset.category : 'all';
}

function showStartScreen() {
  startScreen.classList.remove('hidden');
  gameScreen.classList.add('hidden');
  playerInfo.classList.add('hidden');
  statsPanel.classList.add('hidden');
  upgradesPanel.classList.add('hidden');
}

function startGame() {
  clickCount = 0;
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  playerInfo.classList.remove('hidden');
  statsPanel.classList.add('hidden');
  // upgradesPanel.classList.remove('visible'); // ← Скрываем магазин при старте
  // upgradesPanel.classList.add('hidden'); — не нужно, мы управляем через .visible
  updateUI();
  loadUpgrades();
  startAutoClicker();
}

async function resetGame() {
  if (!currentPlayer) return;
  
  if (!confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
    return;
  }
  
  try {
    await fetch(`${API_BASE}/game/player/${currentPlayer.id}`, {
      method: 'DELETE'
    });
    
    localStorage.removeItem('playerId');
    currentPlayer = null;
    
    if (autoClickInterval) {
      clearInterval(autoClickInterval);
    }
    
    showStartScreen();
  } catch (error) {
    console.error('Ошибка сброса:', error);
  }
}

startButton.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name.length < 2 || name.length > 20) {
    alert('Имя должно быть от 2 до 20 символов');
    return;
  }
  createPlayer(name);
});

nameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    startButton.click();
  }
});

clickButton.addEventListener('click', handleClick);

resetButton.addEventListener('click', resetGame);

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    renderUpgrades(button.dataset.category);
  });
});

const savedPlayerId = localStorage.getItem('playerId');
if (savedPlayerId) {
  loadPlayer(savedPlayerId);
} else {
  showStartScreen();
}