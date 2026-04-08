// أرنوب الذكي - لهجة مصرية بيور
window.mascotVoice = {
  welcome: ['أهلاً يا حبيبي وحشني قوي! يلا نلعب النهاردة؟', 'يا أهلاً يا بطل، جاهز تجمع نجوم كتير؟', 'مساء الخير يا جامد، عايز تتعلم حاجة جديدة؟'],
  success: ['عاش يا بطل أيوه كده!', 'يا لعيب شاطر جداً!', 'مية مية يا حبيبي!', 'جامد أوي يا معلم!', 'إنت بطل حقيقي!'],
  help: ['دوس على الزر الأحمر ده!', 'وريني هتعرف تختار إيه?', 'فين اللي شبه دي يا شاطر؟', 'يلا نجرب التاني!'],
  error: ['لأ.. فكر تاني يا بطل', 'قربت خلاص جرب كمان مرة', 'ولا يهمك حاول تاني', 'هتقدر المرة الجاية!'],
  numbers: ['واحد', 'اتنين', 'تلاتة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'تمنية', 'تسعة', 'عشرة'],
  letters: ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر'],
  objects: ['أرنب', 'بطة', 'تفاحة', 'جزرة', 'حصان', 'دجاجة']
};

function speakEgyptian(type, param) {
  let text = '';
  
  switch(type) {
    case 'welcome': text = mascotVoice.welcome[Math.floor(Math.random()*mascotVoice.welcome.length)]; break;
    case 'success': text = mascotVoice.success[Math.floor(Math.random()*mascotVoice.success.length)]; break;
    case 'help': text = mascotVoice.help[Math.floor(Math.random()*mascotVoice.help.length)]; break;
    case 'error': text = mascotVoice.error[Math.floor(Math.random()*mascotVoice.error.length)]; break;
    case 'number': 
      text = `ده رقم ${mascotVoice.numbers[param-1] || param}!`; break;
    case 'letter': 
      text = `حرف ${mascotVoice.letters[param] || param}`; break;
    case 'count': 
      text = `دوس كام مرة ${param}؟`; break;
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.2;
  speechSynthesis.speak(utterance);
}

// Auto welcome
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => speakEgyptian('welcome'), 1000);
});

// Export for games
window.speakEgyptian = speakEgyptian;

