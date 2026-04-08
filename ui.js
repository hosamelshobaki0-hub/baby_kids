import * as GameLogic from './gameLogic.js';

// --- Global Navigation & Auth ---

window.showScreen = function(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(screenId).classList.remove('hidden');
};

window.showLogin = () => window.showScreen('login-screen');
window.showRegister = () => window.showScreen('register-screen');
window.showChild = () => {
  window.showScreen('child-dashboard');
  updateDisplays();
};
window.showParent = () => {
  window.showScreen('parent-dashboard');
  updateDisplays();
};
window.showLearning = () => window.showScreen('learning-screen');
window.showGames = () => window.showScreen('games-screen');
window.showProgress = () => {
  window.showScreen('progress-screen');
  updateDisplays();
};
window.backToChild = () => window.showChild();

window.login = function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (GameLogic.login(email, password)) {
    window.showParent();
  } else {
    alert('بيانات خاطئة! جرب: test@test.com / 123');
  }
};

window.register = function() {
  const data = {
    parentName: document.getElementById('parent-name').value,
    parentEmail: document.getElementById('parent-email').value,
    childName: document.getElementById('child-name').value,
    childAge: document.getElementById('child-age').value
  };
  if (GameLogic.register(data)) {
    window.showChild();
    GameLogic.addStar(); // Welcome star
    updateDisplays();
  }
};

window.logout = function() {
  GameLogic.logout();
  window.showLogin();
};

// --- Shared UI Updates ---

function updateStarsDisplay() {
  const stars = GameLogic.getStars();
  const starString = '⭐'.repeat(stars);
  
  const els = {
    'stars-display': starString,
    'total-stars': starString,
    'stars-count': '⭐ ' + stars,
    'parent-stars': stars
  };

  for (const [id, val] of Object.entries(els)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
}

function updateDisplays() {
  const user = GameLogic.state.currentUser;
  const gameData = GameLogic.state.gameData;

  if (document.getElementById('child-greeting')) {
    document.getElementById('child-greeting').textContent = 'مرحبا ' + (user ? user.childName : '') + '! 👋';
  }
  
  if (document.getElementById('parent-child-name')) {
    document.getElementById('parent-child-name').textContent = 'الاسم: ' + (user ? user.childName : '');
    document.getElementById('parent-child-age').textContent = 'العمر: ' + (user ? user.childAge + ' سنة' : '');
    
    document.getElementById('parent-activity').innerHTML = `
      الدروس: ${gameData.completedLessons ? gameData.completedLessons.length : 0}<br>
      النجوم: ${GameLogic.getStars()}
    `;
  }

  const lessonsEl = document.getElementById('completed-lessons');
  if (lessonsEl) {
    lessonsEl.innerHTML = gameData.completedLessons ? 
      gameData.completedLessons.map(id => "✅ درس " + id).join('<br>') : 'لا توجد دروس بعد';
  }

  updateStarsDisplay();
}

// --- Lessons ---

let currentLesson = {};

window.startLesson = function(type) {
  const data = GameLogic.getLessonData(type);
  currentLesson = {
    type: type,
    step: 0,
    steps: [
      { content: data.text + ' اضغط فهمته!', visual: data.visual },
      { content: 'ممتاز! ⭐', visual: '⭐⭐⭐' }
    ]
  };
  document.getElementById('lesson-title').textContent = data.title;
  nextLessonStep();
  window.showScreen('lesson-screen');
};

function nextLessonStep() {
  const step = currentLesson.steps[currentLesson.step];
  document.getElementById('lesson-content').textContent = step.content;
  document.getElementById('lesson-visual').innerHTML = step.visual;
  
  document.getElementById('lesson-next').onclick = function() {
    currentLesson.step++;
    if (currentLesson.step >= currentLesson.steps.length) {
      GameLogic.addStar();
      GameLogic.completeLesson(currentLesson.type);
      window.showChild();
    } else {
      nextLessonStep();
    }
  };
}

// --- Color Game ---

let gameScore = 0;
let targetColor = null;

window.startColorGame = function() {
  gameScore = 0;
  window.showScreen('color-game');
  generateColorRound();
};

function generateColorRound() {
  const colors = GameLogic.getColorGameData();
  targetColor = colors[Math.floor(Math.random() * colors.length)];
  
  const targetDisplay = document.getElementById('target-color-display');
  targetDisplay.style.backgroundColor = targetColor.bg;
  targetDisplay.innerHTML = targetColor.emoji;
  
  const optionsContainer = document.getElementById('color-options');
  optionsContainer.innerHTML = '';
  
  // Shuffle
  const shuffled = [...colors].sort(() => Math.random() - 0.5).slice(0, 4);
  
  shuffled.forEach(color => {
    const btn = document.createElement('button');
    btn.className = 'kid-btn w-32 h-32 rounded-full p-0 m-2 flex items-center justify-center text-4xl shadow-2xl hover:shadow-3xl';
    btn.style.backgroundColor = color.bg;
    btn.style.border = '5px solid white';
    btn.onclick = () => checkColor(color);
    btn.innerHTML = color.emoji;
    optionsContainer.appendChild(btn);
  });
  
  document.getElementById('game-score').textContent = 'النقاط: ' + gameScore + ' ⭐';
}

function checkColor(selected) {
  if (selected.name === targetColor.name) {
    gameScore += 10;
    GameLogic.addStar();
    GameLogic.playSound('correct');
    
    document.body.style.animation = 'none';
    setTimeout(() => {
      document.body.style.background = targetColor.bg;
      setTimeout(() => {
        document.body.style.background = '';
        generateColorRound();
      }, 500);
    }, 200);
  } else {
    document.body.style.animation = 'shake 0.5s';
  }
  updateStarsDisplay();
}

// --- Animal Game ---

let animalScore = 0;

window.startAnimalGame = function() {
  animalScore = 0;
  window.showScreen('animal-game');
  document.getElementById('animal-score').textContent = 'النقاط: 0 ⭐';
  generateAnimalRound();
};

function generateAnimalRound() {
  const animals = GameLogic.getAnimalGameData();
  const sources = document.getElementById('animal-sources');
  const targets = document.getElementById('animal-targets');
  sources.innerHTML = '';
  targets.innerHTML = '';

  const animalNames = {
    lion: 'أسد',
    elephant: 'فيل',
    monkey: 'قرد',
    cat: 'قطة'
  };

  animals.forEach(animal => {
    const el = document.createElement('div');
    el.className = 'draggable-item text-6xl p-4 bg-white rounded-full shadow-xl';
    el.draggable = true;
    el.id = 'drag-' + animal.id;
    el.textContent = animal.emoji;
    el.ondragstart = (e) => e.dataTransfer.setData("text", animal.id);
    sources.appendChild(el);
  });

  const shuffled = [...animals].sort(() => Math.random() - 0.5);
  shuffled.forEach(animal => {
    const el = document.createElement('div');
    el.className = 'drop-zone w-32 h-32 border-4 border-dashed border-white rounded-2xl flex items-center justify-center text-6xl relative';
    el.id = 'drop-' + animal.id;
    
    const shadow = document.createElement('span');
    shadow.textContent = animal.emoji;
    shadow.style.filter = 'brightness(0) opacity(0.4)';
    shadow.style.pointerEvents = 'none';
    el.appendChild(shadow);

    el.ondragover = (e) => { e.preventDefault(); el.classList.add('drag-over'); };
    el.ondragleave = () => el.classList.remove('drag-over');
    el.ondrop = (e) => handleAnimalDrop(e, animal.id);
    targets.appendChild(el);
  });
}

function handleAnimalDrop(e, targetId) {
  e.preventDefault();
  const zone = document.getElementById('drop-' + targetId);
  zone.classList.remove('drag-over');
  
  const draggedId = e.dataTransfer.getData("text");
  if (draggedId === targetId) {
    const dragEl = document.getElementById('drag-' + draggedId);
    if (dragEl) dragEl.remove();
    
    zone.innerHTML = document.getElementById('drop-' + targetId).innerText;
    zone.style.backgroundColor = '#4ade80';
    zone.style.borderStyle = 'solid';
    zone.style.color = 'white';
    zone.style.filter = 'none';
    
    animalScore += 10;
    GameLogic.addStar();
    document.getElementById('animal-score').textContent = 'النقاط: ' + animalScore + ' ⭐';
    GameLogic.playSound('correct');
  }
}

// --- Initialization ---

window.onload = function() {
  if (GameLogic.state.currentUser) {
    window.showChild();
  } else {
    window.showLogin();
  }
  updateDisplays();
};