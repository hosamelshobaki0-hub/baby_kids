// kidsApp Global Sync System
window.kidsApp = {
  data: JSON.parse(localStorage.getItem('kidsApp') || '{"stars":0, "level":1, "unlockedPages":[], "badges":[], "completedTasks":0}'),
  
  updateStars: function(stars = 1) {
    this.data.stars += stars;
    this.sync();
    this.showConfetti();
    speechSynthesis.speak(new SpeechSynthesisUtterance('مبروك نجمة جديدة!'));
  },
  
  sync: function() {
    localStorage.setItem('kidsApp', JSON.stringify(this.data));
    document.querySelectorAll('#live-stars, #live-stars-nav').forEach(el => el.textContent = this.data.stars);
  },
  
  showConfetti: function() {
    for (let i = 0; i < 50; i++) {
      const c = document.createElement('div');
      c.textContent = ['⭐','🌟','✨','🎉'][Math.floor(Math.random()*4)];
      c.style.cssText = 'position:fixed;left:'+Math.random()*100+'vw;top:-10vh;font-size:2rem;z-index:9999;pointer-events:none;animation:confetti-fall 3s linear forwards';
      document.body.appendChild(c);
      setTimeout(()=>c.remove(), 3000);
    }
  },
  
  playSuccess: function() {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    o.frequency.value = 800;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.3);
  }
};

// Load mascot voice
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('synced');
  kidsApp.sync();
  if (document.querySelector('[data-mascot]')) {
    setTimeout(() => speakEgyptian('welcome'), 1000);
  }
});
