// ===== KOYAL WEBSITE — app.js =====

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// Nav scroll shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 20
    ? 'rgba(9,9,11,0.97)'
    : 'rgba(9,9,11,0.85)';
}, { passive: true });

// Animated wave on hover of hero
const heroWave = document.getElementById('heroWave');
if (heroWave) {
  let waving = false;
  const bars = heroWave.querySelectorAll('i');
  heroWave.addEventListener('mouseenter', () => {
    if (waving) return;
    waving = true;
    bars.forEach((bar, i) => {
      bar.style.animationDuration = (0.8 + Math.random() * 0.6) + 's';
    });
    setTimeout(() => { waving = false; }, 2000);
  });
}

// Mascot parallax
const mascot = document.getElementById('mascotImg');
if (mascot) {
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    mascot.style.transform = `translateY(${sy * 0.15}px)`;
  }, { passive: true });
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    navToggle.classList.toggle('active');
  });
  navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMobile.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });
}

// Smooth demo type animation
function typeWriter(element, text, speed = 30) {
  let i = 0;
  element.textContent = '';
  const timer = setInterval(() => {
    element.textContent += text[i++];
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

// Trigger demo when demo window enters viewport
const demoWindow = document.querySelector('.demo-window');
if (demoWindow) {
  const demoObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      demoObserver.disconnect();
      // small animation to indicate "live"
      const badge = demoWindow.querySelector('.demo-badge');
      if (badge) {
        badge.style.animation = 'pulse 1s ease 3';
      }
    }
  }, { threshold: 0.5 });
  demoObserver.observe(demoWindow);
}

console.log('%cKoyal 🐦', 'color:#c8ff00;font-size:20px;font-weight:bold;');
console.log('%cYou talk. Koyal transcribes.', 'color:#71717a;font-size:12px;');
