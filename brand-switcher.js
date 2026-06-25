(() => {
  const brands = [
    {
      id: 'lanting',
      name: '岚亭',
      en: 'LANTING STUDIO',
      kicker: '文化原点 / HERITAGE ORIGIN',
      description: '让非遗走进当代生活，在人与物之间续写文化的温度。',
      href: 'lanting.html',
      image: 'assets/lanting/image1.jpeg',
      accent: '#91b8d4'
    },
    {
      id: 'ronghe',
      name: '融合 XR',
      en: 'RONGHE DIGITAL HERITAGE',
      kicker: '数字空间 / IMMERSIVE REALM',
      description: '以 XR、AI 与数字重建，让文化遗产重新被进入、理解与创造。',
      href: 'index.html',
      image: 'assets/video/project-poster.jpg',
      accent: '#d6a95f'
    },
    {
      id: 'qingcang',
      name: '擎苍',
      en: 'QINGCANG FPV SYSTEMS',
      kicker: '未来制造 / MODULAR FLIGHT',
      description: '模块化、可快速换装的 3D 打印 FPV 开放飞行平台。',
      href: 'qingcang.html',
      image: 'assets/qingcang/hero-drone.jpeg',
      accent: '#dfff34'
    }
  ];

  const path = location.pathname.split('/').pop() || 'index.html';
  const current = brands.find(brand => brand.href === path) || brands[1];
  const cards = brands.map((brand, index) => `
    <a class="brand-network__card${brand.id === current.id ? ' is-current' : ''}"
      href="${brand.href}" data-brand-id="${brand.id}" style="--accent:${brand.accent}">
      <span class="brand-network__media" style="background-image:url('${brand.image}')"></span>
      <span class="brand-network__veil"></span>
      <span class="brand-network__scan"></span>
      <span class="brand-network__index">0${index + 1} / 0${brands.length}</span>
      <span class="brand-network__status">正在浏览 / CURRENT</span>
      <span class="brand-network__content">
        <span class="brand-network__kicker">${brand.kicker}</span>
        <span class="brand-network__title">${brand.name}<small>${brand.en}</small></span>
        <span class="brand-network__description">${brand.description}</span>
        <span class="brand-network__enter">
          ${brand.id === current.id ? '返回当前官网' : '进入官方网站'}
          <i aria-hidden="true">↗</i>
        </span>
      </span>
    </a>
  `).join('');

  document.body.insertAdjacentHTML('beforeend', `
    <button class="brand-network-trigger" type="button" aria-label="打开品牌矩阵" aria-expanded="false">
      <span class="brand-network-trigger__mark"></span>
      <span class="brand-network-trigger__label">品牌矩阵</span>
      <span class="brand-network-trigger__count">0${brands.length}</span>
    </button>
    <section class="brand-network" aria-hidden="true" aria-label="品牌矩阵"
      style="--brand-count:${brands.length}">
      <div class="brand-network__topbar">
        <p class="brand-network__eyebrow"><span>NETWORK / 0${brands.length}</span>探索我们的品牌宇宙</p>
        <button class="brand-network__close" type="button" aria-label="关闭品牌矩阵">×</button>
      </div>
      <div class="brand-network__grid">${cards}</div>
      <div class="brand-network__footer">
        <span>HERITAGE · DIGITAL EXPERIENCE · FUTURE MAKING</span>
        <span>选择一个坐标，进入它的世界</span>
      </div>
    </section>
  `);

  const trigger = document.querySelector('.brand-network-trigger');
  const network = document.querySelector('.brand-network');
  const closeButton = document.querySelector('.brand-network__close');

  const open = () => {
    network.classList.add('is-open');
    network.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('brand-network-locked');
    try {
      sessionStorage.setItem('brand-network-seen', '1');
    } catch {}
    closeButton.focus();
  };

  const close = () => {
    network.classList.remove('is-open', 'is-leaving');
    network.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('brand-network-locked');
    trigger.focus();
  };

  trigger.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && network.classList.contains('is-open')) close();
  });

  network.querySelectorAll('.brand-network__card').forEach(card => {
    card.addEventListener('click', event => {
      if (card.dataset.brandId === current.id) {
        event.preventDefault();
        close();
        return;
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      event.preventDefault();
      network.classList.add('is-leaving');
      window.setTimeout(() => { location.href = card.href; }, 460);
    });
  });

  let hasSeenNetwork = false;
  try {
    hasSeenNetwork = sessionStorage.getItem('brand-network-seen') === '1';
  } catch {}

  const forceOpen = new URLSearchParams(location.search).get('brand-network') === 'open';
  if (forceOpen || !hasSeenNetwork) {
    window.requestAnimationFrame(open);
  }
})();
