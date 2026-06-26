const header = document.querySelector('.tf-header');
const nav = document.querySelector('.tf-nav');
const menu = document.querySelector('.tf-menu');
const links = [...document.querySelectorAll('.tf-nav a[href^="#"]')];

document.getElementById('year').textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});

links.forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55%' });

document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));

const cursor = document.querySelector('.tf-cursor');
window.addEventListener('pointermove', event => {
  if (window.innerWidth < 800) return;
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
}, { passive: true });

document.querySelectorAll('.asset-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    document.querySelectorAll('.asset-dot').forEach(item => item.classList.remove('selected'));
    dot.classList.add('selected');
  });
});
