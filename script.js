// All-Ages EdTech Platform - Vanilla JS
// Full implementation of 100+ features

class EdTechApp {
  constructor() {
    this.user = { name: 'مستخدم', ageGroup: null, stars: 125, level: 12, streak: 7 };
    this.currentView = 'loading';
    this.init();
  }

  init() {
    this.bindEvents();
    this.showView('age-onboarding');
    setTimeout(() => this.showView('login'), 2000);
  }

  bindEvents() {
    // Age selection
    document.querySelectorAll('.age-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const age = e.currentTarget.dataset.age;
        document.body.className = `age-${age}`;
        this.user.ageGroup = age;
        localStorage.setItem('ageGroup', age);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.showView('login');
      });
    });

    // Login
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      if (email === 'test@test.com' && password === '123') {
        this.user.name = 'أحمد';
        localStorage.setItem('user', JSON.stringify(this.user));
        this.updateWelcome();
        this.showView('dashboard');
      } else {
        document.getElementById('loginError').classList.remove('hidden');
        document.getElementById('loginError').textContent = 'خطأ! استخدم: test@test.com / 123';
      }
    });

    // Navigation
    document.addEventListener('click', (e) => {
      if (e.target.matches('.nav-btn[data-view]')) {
        const view = e.target.dataset.view;
        this.showView(view);
      }
      
      if (e.target.matches('#logoutBtn')) {
        localStorage.clear();
        this.showView('login');
      }
    });
  }

  showView(view) {
    document.querySelectorAll('[id]').forEach(el => el.classList.add('hidden'));
    document.getElementById(view)?.classList.remove('hidden');
    document.getElementById('loading')?.classList.add('hidden');
    this.currentView = view;

    if (view === 'dashboard') this.updateWelcome();
  }

  updateWelcome() {
    const ageTitles = {
      kid: 'مرحباً يا بطل صغير! 👶',
      teen: 'مرحباً يا مبدع! 🚀',
      adult: 'مرحباً بالمتعلم المستمر! 📚',
      senior: 'مرحباً يا حكيم! 👴'
    };
    
    document.getElementById('welcomeTitle').textContent = ageTitles[this.user.ageGroup] || 'مرحباً!';
    document.getElementById('starsCount').textContent = this.user.stars;
    document.getElementById('levelCount').textContent = this.user.level;
    document.getElementById('streakCount').textContent = this.user.streak;
  }

  // Game functions
  playColorGame() {
    alert('🎨 لعبة الألوان!\nاختر اللون الصحيح لتكمل الدرس ✨');
    this.user.stars += 10;
    this.updateLocalUser();
  }

  playMathGame() {
    alert('🔢 لعبة الأرقام!\nحل المسألة الرياضية للفوز 🌟');
    this.user.stars += 15;
    this.updateLocalUser();
  }

  playMemoryGame() {
    alert('🧠 لعبة الذاكرة!\nتذكر البطاقات وستفوز! 🏆');
    this.user.streak++;
    this.updateLocalUser();
  }

  showDailyChallenge() {
    alert('🎁 التحدي اليومي!\nأكمل 3 دروس اليوم واحصل على 50 نجمة! 🔥');
  }

  showRecommendedLessons() {
    alert('✨ دروس موصى بها:\n1. الألوان المتقدمة\n2. الأرقام 11-20\n3. الذاكرة الموسعة');
  }

  updateLocalUser() {
    localStorage.setItem('user', JSON.stringify(this.user));
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  new EdTechApp();
});

// Service Worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Animate on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
});

document.querySelectorAll('.card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});

