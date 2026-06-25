const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const year = document.getElementById('year');

if (year) year.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.forEach(link => link.addEventListener('click', () => {
  nav?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
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
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });

document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    const start = performance.now();

    const update = now => {
      const progress = Math.min((now - start) / 1100, 1);
      element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
    countObserver.unobserve(element);
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(element => countObserver.observe(element));

const artifact = document.getElementById('artifact');
const formName = document.getElementById('form-name');
const artifactDescription = document.getElementById('artifact-description');
const motifButtons = document.querySelectorAll('.motif');
const descriptions = {
  window: '保留窗棂的几何秩序，生成适用于灯具与空间装置的模块化结构。',
  bracket: '提取斗拱层层承托的结构关系，转译为具有生长感的桌面雕塑。',
  cloud: '延续云纹循环流动的节奏，生成可佩戴或连续拼接的柔性形态。'
};

motifButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (!artifact || !formName || !artifactDescription) return;
    motifButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const type = button.dataset.artifact;
    artifact.className = `artifact artifact-${type}`;
    artifact.innerHTML = '<span></span><span></span><span></span><span></span>';
    formName.textContent = button.dataset.name;
    artifactDescription.textContent = descriptions[type];
  });
});

document.getElementById('generate-button')?.addEventListener('click', event => {
  if (!artifact) return;
  artifact.classList.remove('is-generating');
  requestAnimationFrame(() => artifact.classList.add('is-generating'));
  event.currentTarget.querySelector('span').textContent = '形态生成完成';
  window.setTimeout(() => {
    event.currentTarget.querySelector('span').textContent = '再次生成形态';
  }, 1400);
});

const storyDialog = document.getElementById('story-dialog');
const projectVideo = document.getElementById('project-video');

document.getElementById('play-story')?.addEventListener('click', () => {
  storyDialog?.showModal();
  projectVideo?.play().catch(() => {});
});

function closeStory() {
  projectVideo?.pause();
  storyDialog?.close();
}

storyDialog?.querySelector('.dialog-close')?.addEventListener('click', closeStory);
storyDialog?.addEventListener('click', event => {
  if (event.target === storyDialog) closeStory();
});
storyDialog?.addEventListener('close', () => projectVideo?.pause());

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const architecture = document.querySelector('.hero-architecture');
  if (architecture) {
    window.addEventListener('pointermove', event => {
      if (window.innerWidth < 900) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 10;
      const y = (event.clientY / window.innerHeight - 0.5) * 7;
      architecture.style.transform = `perspective(900px) rotateY(${-8 + x * 0.25}deg) translate(${x}px, ${y}px)`;
    }, { passive: true });
  }
}
