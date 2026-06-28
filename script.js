const levels = [
  { title: 'Level 1 · 1–10', file: 'level1_01_10.json' },
  { title: 'Level 1 · 11–20', file: 'level1_11_20.json' },
  { title: 'Level 1 · 21–30', file: 'level1_21_30.json' },
  { title: 'Level 1 · 31–40', file: 'level1_31_40.json' },
  { title: 'Level 1 · 41–52', file: 'level1_41_52.json' }
];

let deck = [];
let order = [];
let currentIndex = 0;
let currentCard = null;
let activeLevelIndex = 0;

const englishPrompt = document.getElementById('englishPrompt');
const japaneseAnswer = document.getElementById('japaneseAnswer');
const answerCard = document.getElementById('answerCard');
const revealButton = document.getElementById('revealButton');
const nextButton = document.getElementById('nextButton');
const resetButton = document.getElementById('resetButton');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const chipRow = document.getElementById('chipRow');
const noteText = document.getElementById('noteText');
const levelTitle = document.getElementById('levelTitle');
const levelButtons = document.querySelectorAll('.level-button');

async function loadDeck(levelIndex = 0) {
  activeLevelIndex = levelIndex;
  const selectedLevel = levels[activeLevelIndex];

  try {
    englishPrompt.textContent = 'Loading...';
    answerCard.classList.add('hidden');
    revealButton.classList.add('hidden');
    chipRow.innerHTML = '';
    noteText.textContent = '';

    const response = await fetch(selectedLevel.file);
    if (!response.ok) throw new Error(`Could not load ${selectedLevel.file}.`);

    deck = await response.json();
    levelTitle.textContent = selectedLevel.title;
    updateLevelButtons();
    shuffleDeck();
    showCard();
  } catch (error) {
    englishPrompt.textContent = `Could not load ${selectedLevel.file}. Check the JSON file is in the same folder as index.html.`;
    levelTitle.textContent = 'File missing';
    progressText.textContent = '0 / 0';
    progressBar.style.width = '0%';
    revealButton.classList.add('hidden');
  }
}

function updateLevelButtons() {
  levelButtons.forEach((button, index) => {
    button.classList.toggle('active', index === activeLevelIndex);
  });
}

function shuffleDeck() {
  order = [...Array(deck.length).keys()];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  currentIndex = 0;
}

function showCard() {
  if (!deck.length) return;

  if (currentIndex >= order.length) {
    shuffleDeck();
  }

  currentCard = deck[order[currentIndex]];
  englishPrompt.textContent = currentCard.english;
  japaneseAnswer.textContent = currentCard.japanese;
  noteText.textContent = currentCard.note || '';
  answerCard.classList.add('hidden');
  revealButton.classList.remove('hidden');
  renderChips(currentCard.tags || []);
  updateProgress();
}

function renderChips(tags) {
  chipRow.innerHTML = '';
  tags.forEach((tag, index) => {
    const chip = document.createElement('span');
    chip.className = `chip ${['pink', 'blue', 'yellow'][index % 3]}`;
    chip.innerHTML = `<i class="bi ${tag.icon}"></i> ${tag.label}`;
    chipRow.appendChild(chip);
  });
}

function updateProgress() {
  const seen = Math.min(currentIndex + 1, deck.length);
  progressText.textContent = `${seen} / ${deck.length}`;
  progressBar.style.width = `${(seen / deck.length) * 100}%`;
}

levelButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    loadDeck(index);
  });
});

revealButton.addEventListener('click', () => {
  answerCard.classList.remove('hidden');
  revealButton.classList.add('hidden');
});

nextButton.addEventListener('click', () => {
  currentIndex += 1;
  showCard();
});

resetButton.addEventListener('click', () => {
  shuffleDeck();
  showCard();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}

loadDeck(0);
