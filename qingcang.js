const header = document.querySelector('.qc-header');
const nav = document.querySelector('.qc-nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = [...document.querySelectorAll('.qc-nav a[href^="#"]')];
document.getElementById('year').textContent = new Date().getFullYear();
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30), { passive: true });
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('visible');
  revealObserver.unobserve(entry.target);
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
}), { rootMargin: '-35% 0px -55%' });
document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', event => {
  if (window.innerWidth < 800) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
}, { passive: true });

const swapVisual = document.querySelector('.swap-visual');
const swapArticles = [...document.querySelectorAll('[data-swap-info]')];
let swapIndex = 0;
document.getElementById('swap-trigger').addEventListener('click', () => {
  swapVisual.classList.toggle('activated');
  swapArticles.forEach(article => article.classList.remove('active'));
  swapIndex = (swapIndex + 1) % swapArticles.length;
  swapArticles[swapIndex].classList.add('active');
});
document.querySelectorAll('.module-pin').forEach(pin => pin.addEventListener('click', () => {
  const target = document.querySelector(`[data-swap-info="${pin.dataset.module}"]`);
  swapArticles.forEach(article => article.classList.remove('active'));
  target?.classList.add('active');
  document.getElementById('system').scrollIntoView({ behavior: 'smooth' });
}));

const presets = {
  race: { name:'RACE SPEC', weight:'248', flight:'6.5', agility:'96', price:'$699', speed:'96%', durability:'62%', range:'48%', image:'assets/qingcang/prototype-hand.jpeg' },
  freestyle: { name:'FREESTYLE SPEC', weight:'286', flight:'7.2', agility:'84', price:'$649', speed:'82%', durability:'94%', range:'58%', image:'assets/qingcang/prototype-vertical.jpeg' },
  explorer: { name:'EXPLORER SPEC', weight:'318', flight:'11.5', agility:'68', price:'$599', speed:'66%', durability:'80%', range:'96%', image:'assets/qingcang/prototype-detail.jpeg' }
};
document.querySelectorAll('.preset').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.preset').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const p = presets[button.dataset.preset];
  document.getElementById('build-name').textContent = p.name;
  document.getElementById('metric-weight').innerHTML = `${p.weight}<small>g</small>`;
  document.getElementById('metric-flight').innerHTML = `${p.flight}<small>min</small>`;
  document.getElementById('metric-agility').innerHTML = `${p.agility}<small>/100</small>`;
  document.getElementById('metric-price').textContent = p.price;
  document.getElementById('bar-speed').style.width = p.speed;
  document.getElementById('bar-durability').style.width = p.durability;
  document.getElementById('bar-range').style.width = p.range;
  document.getElementById('config-image').src = p.image;
}));
const preview = document.querySelector('.config-preview');
document.querySelectorAll('.swatch').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.swatch').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  preview.dataset.color = button.dataset.color;
}));

const dialog = document.getElementById('flight-dialog');
const video = document.getElementById('flight-video');
document.getElementById('play-flight').addEventListener('click', () => {
  dialog.showModal();
  video.play().catch(() => {});
});
const closeDialog = () => { video.pause(); dialog.close(); };
dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
