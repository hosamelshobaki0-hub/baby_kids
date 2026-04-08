// State Management
export const state = {
  masterAccount: JSON.parse(localStorage.getItem('masterAccount') || 'null'),
  currentProfile: JSON.parse(localStorage.getItem('currentProfile') || 'null'),
  currentUser: JSON.parse(localStorage.getItem('kidsUser') || 'null'),
  gameData: JSON.parse(localStorage.getItem('gameData') || '{}'),
  settings: JSON.parse(localStorage.getItem('appSettings') || '{"sound": true}')
};

// --- Profile System 👥 ---
export function getProfileMode(age) {
  if (age <= 8) return 'KID';
  if (age <= 18) return 'TEEN';
  return 'ADULT';
}

export function createProfile(name, age, avatar) {
  if (!state.masterAccount) return null;
  
  const newProfile = {
    id: Date.now().toString(),
    name,
    age,
    avatar,
    mode: getProfileMode(age),
    xp: 0,
    level: 1,
    completedLessons: [],
    parentalControls: { timeLimit: 0 }
  };

  if (!state.masterAccount.profiles) state.masterAccount.profiles = [];
  state.masterAccount.profiles.push(newProfile);
  saveMasterAccount();
  return newProfile;
}

export function switchProfile(profileId) {
  if (!state.masterAccount) return false;
  const profile = state.masterAccount.profiles.find(p => p.id === profileId);
  if (profile) {
    state.currentProfile = profile;
    localStorage.setItem('currentProfile', JSON.stringify(profile));
    return true;
  }
  return false;
}

export function updateProfile(profileId, updates) {
  if (!state.masterAccount) return false;
  const index = state.masterAccount.profiles.findIndex(p => p.id === profileId);
  if (index !== -1) {
    state.masterAccount.profiles[index] = { ...state.masterAccount.profiles[index], ...updates };
    saveMasterAccount();
    return true;
  }
  return false;
}

export function deleteProfile(profileId) {
  if (!state.masterAccount) return false;
  state.masterAccount.profiles = state.masterAccount.profiles.filter(p => p.id !== profileId);
  saveMasterAccount();
  if (state.currentProfile && state.currentProfile.id === profileId) {
    localStorage.removeItem('currentProfile');
  }
  return true;
}

// Auth Logic
export function login(email, password) {
  if (email === 'test@test.com' && password === '123') {
    // Create master account structure if not exists
    let account = state.masterAccount || { 
      email, 
      name: 'مدير العائلة', 
      profiles: [] 
    };
    state.masterAccount = account;
    state.currentUser = { role: 'parent', name: 'ولي الأمر' }; // Legacy support
    saveUser();
    saveMasterAccount();
    return { success: true };
  }
  return { success: false };
}

export function register(data) {
  if (data.childName && data.childAge) {
    // Create Master Account
    state.masterAccount = {
      id: 'master_' + Date.now(),
      name: data.parentName,
      email: data.parentEmail,
      profiles: []
    };
    
    // Create First Profile
    createProfile(data.childName, parseInt(data.childAge), '👶');
    
    // Legacy support
    state.currentUser = data;
    
    saveUser();
    saveMasterAccount();
    return { success: true };
  }
  return { success: false };
}

export function logout() {
  localStorage.removeItem('kidsUser');
  localStorage.removeItem('masterAccount');
  localStorage.removeItem('currentProfile');
  state.masterAccount = null;
  state.currentProfile = null;
  state.currentUser = null;
}

function saveUser() {
  localStorage.setItem('kidsUser', JSON.stringify(state.currentUser));
}

function saveMasterAccount() {
  localStorage.setItem('masterAccount', JSON.stringify(state.masterAccount));
}

function saveCurrentProfile() {
  if (!state.masterAccount || !state.currentProfile) return;
  const index = state.masterAccount.profiles.findIndex(p => p.id === state.currentProfile.id);
  if (index !== -1) {
    state.masterAccount.profiles[index] = state.currentProfile;
    saveMasterAccount();
    localStorage.setItem('currentProfile', JSON.stringify(state.currentProfile));
  }
}

// Progress Logic
export function addStar() {
  // Legacy
  state.gameData.stars = (state.gameData.stars || 0) + 1;
  localStorage.setItem('gameData', JSON.stringify(state.gameData));
  
  // New System
  if (state.currentProfile) {
    state.currentProfile.xp = (state.currentProfile.xp || 0) + 10;
    saveCurrentProfile();
  }
  
  return state.gameData.stars;
}

export function getStars() {
  return state.gameData.stars || 0;
}

export function completeLesson(lessonId) {
  if (!state.gameData.completedLessons) state.gameData.completedLessons = [];
  if (!state.gameData.completedLessons.includes(lessonId)) {
    state.gameData.completedLessons.push(lessonId);
    localStorage.setItem('gameData', JSON.stringify(state.gameData));
  }
  
  // New System
  if (state.currentProfile) {
    if (!state.currentProfile.completedLessons) state.currentProfile.completedLessons = [];
    if (!state.currentProfile.completedLessons.includes(lessonId)) state.currentProfile.completedLessons.push(lessonId);
    saveCurrentProfile();
  }
}

// Data Providers
export const lessons = {
  red: { title: '🔴 اللون الأحمر', text: 'ده اللون الأحمر الجميل! 🔴 زي الطماطم والتفاح', visual: '🔴🔴🔴' },
  blue: { title: '🔵 اللون الأزرق', text: 'ده اللون الأزرق.. زي البحر والسما! 🔵', visual: '🔵🔵🔵' },
  alphabet: { title: '🅰️ حرف الألف', text: 'ألف.. أرنب بيجري ويلعب 🅰️🐇', visual: '🅰️🐇' },
  shapes: { title: '🔴 الدايرة', text: 'الدايرة مدورة وزي الكورة 🔴 بتلف وتلف', visual: '🔴⚪🔴' },
  // Teen/Adult Lessons
  coding: { title: '💻 البرمجة', text: 'البرمجة هي اللغة اللي بيفهمها الكمبيوتر.. يلا نتعلم نأمره!', visual: '👨‍💻' },
  finance: { title: '💰 تحويش المصروف', text: 'إزاي تحوش وتصرف مصروفك صح وتجيب اللي نفسك فيه؟', visual: '📊' }
};

export function getLessonData(type) {
  return lessons[type] || { title: 'درس جديد', text: 'يلا نتعلم حاجة جديدة!', visual: '📚' };
}

export function getColorGameData() {
  return [
    { name: 'red', emoji: '🔴', bg: '#ef4444' },
    { name: 'blue', emoji: '🔵', bg: '#3b82f6' },
    { name: 'green', emoji: '🟢', bg: '#10b981' },
    { name: 'yellow', emoji: '🟡', bg: '#facc15' }
  ];
}

export function getAnimalGameData() {
  return [
    { id: 'lion', emoji: '🦁' },
    { id: 'elephant', emoji: '🐘' },
    { id: 'monkey', emoji: '🐵' },
    { id: 'cat', emoji: '🐱' }
  ];
}

export function getMemoryGameData() {
  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
  return [...emojis, ...emojis].sort(() => Math.random() - 0.5);
}

// Audio
export function playSound(type) {
  if (type === 'correct') {
    try {
      new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLI...").play();
    } catch(e) {}
  }
}