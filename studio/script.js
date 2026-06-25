const header = document.querySelector('.portal-header');
const menuToggle = document.querySelector('.portal-menu-toggle');
const nav = document.querySelector('.portal-nav');
const cursor = document.querySelector('.cursor-orbit');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

if (cursor && !window.matchMedia('(pointer: coarse)').matches) {
  window.addEventListener('pointermove', event => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }, { passive: true });

  document.querySelectorAll('a, button, .member-card').forEach(element => {
    element.addEventListener('pointerenter', () => {
      cursor.style.width = '46px';
      cursor.style.height = '46px';
    });
    element.addEventListener('pointerleave', () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
    });
  });
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const sun = document.querySelector('.digital-sun');
  const mountains = document.querySelectorAll('.mountain');
  window.addEventListener('pointermove', event => {
    if (window.innerWidth < 900) return;
    const x = event.clientX / window.innerWidth - .5;
    const y = event.clientY / window.innerHeight - .5;
    if (sun) sun.style.transform = `translate(${x * 16}px, ${y * 12}px)`;
    mountains.forEach((mountain, index) => {
      mountain.style.translate = `${x * (index + 1) * -10}px ${y * (index + 1) * -5}px`;
    });
  }, { passive: true });
}

document.getElementById('year').textContent = new Date().getFullYear();
