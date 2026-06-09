// ============================================================
//  Begarlist 16 — Photo Gallery App Logic
// ============================================================

let currentCategory = null;
let currentSearch   = '';
let lightboxIndex   = 0;
let lightboxPhotos  = [];

// Carousel grid (homepage) state
let heroPhotos   = [];   // 6 random photos shown on homepage

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('bg16-theme') || 'dark';
  setTheme(saved);

  initCategoryNav();
  initCarouselGrid();

  window.addEventListener('load', hideLoader);
  setTimeout(hideLoader, 2000);
});

function hideLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader && !loader.classList.contains('hidden')) {
    loader.classList.add('hidden');
    setTimeout(() => loader.style.display = 'none', 400);
  }
}

// ── THEME ─────────────────────────────────────────────────────
function toggleTheme() {
  const html  = document.documentElement;
  const theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(theme);
  localStorage.setItem('bg16-theme', theme);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.getElementById('themeIcon').textContent = theme === 'dark' ? '☀' : '◑';
}

// ── CATEGORY NAV (arrows + drag + wheel) ─────────────────────
function initCategoryNav() {
  const inner = document.getElementById('categoryInner');
  if (!inner) return;

  updateCatNavBtns();
  inner.addEventListener('scroll', updateCatNavBtns);

  let isDragging = false;
  let dragStartX = 0;
  let dragScrollLeft = 0;

  inner.addEventListener('mousedown', (e) => {
    isDragging  = true;
    dragStartX  = e.pageX - inner.offsetLeft;
    dragScrollLeft = inner.scrollLeft;
    inner.classList.add('dragging');
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x    = e.pageX - inner.offsetLeft;
    const walk = (x - dragStartX) * 1.2;
    inner.scrollLeft = dragScrollLeft - walk;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    inner.classList.remove('dragging');
  });

  inner.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      inner.scrollLeft += e.deltaY * 1.5;
      updateCatNavBtns();
    }
  }, { passive: false });
}

function scrollCatNav(dir) {
  const inner = document.getElementById('categoryInner');
  if (!inner) return;
  inner.scrollBy({ left: dir * 200, behavior: 'smooth' });
  setTimeout(updateCatNavBtns, 320);
}

function updateCatNavBtns() {
  const inner = document.getElementById('categoryInner');
  const btnL  = document.getElementById('catNavLeft');
  const btnR  = document.getElementById('catNavRight');
  if (!inner || !btnL || !btnR) return;

  const atStart = inner.scrollLeft <= 2;
  const atEnd   = inner.scrollLeft >= inner.scrollWidth - inner.clientWidth - 2;

  btnL.disabled = atStart;
  btnR.disabled = atEnd;
}

// ── SEARCH ────────────────────────────────────────────────────
function handleSearch(val) {
  currentSearch = val.trim().toLowerCase();
  const clearBtn = document.getElementById('searchClear');
  clearBtn.style.display = currentSearch ? 'flex' : 'none';

  if (currentSearch) {
    showGrid();
    const filtered = PHOTOS.filter(p =>
      p.title.toLowerCase().includes(currentSearch) ||
      p.category.toLowerCase().includes(currentSearch) ||
      p.description.toLowerCase().includes(currentSearch)
    );
    document.getElementById('sectionTitle').textContent = `Hasil: "${val.trim()}"`;
    renderPhotos(filtered);
    updateCount(filtered.length);
  } else {
    if (currentCategory) {
      applyCategory(currentCategory);
    } else {
      showHero();
    }
  }
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  input.value = '';
  handleSearch('');
  input.focus();
}

// ── CATEGORY FILTER ───────────────────────────────────────────
function filterCategory(cat, btn) {
  currentCategory = cat;
  currentSearch   = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('searchClear').style.display = 'none';

  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll(`.cat-btn[data-cat="${CSS.escape(cat)}"]`).forEach(b => b.classList.add('active'));

  applyCategory(cat);
}

function applyCategory(cat) {
  showGrid();
  document.getElementById('sectionTitle').textContent = cat;
  const filtered = PHOTOS.filter(p => p.category === cat);
  renderPhotos(filtered);
  updateCount(filtered.length);
}

// ── VIEW SWITCHING ────────────────────────────────────────────
function showHero() {
  document.getElementById('carouselSection').style.display = '';
  document.getElementById('sectionHeader').style.display = 'none';
  document.getElementById('photoGrid').innerHTML = '';
  document.getElementById('emptyState').style.display = 'none';
  document.body.classList.add('homepage-mode');
}

function showGrid() {
  document.getElementById('carouselSection').style.display = 'none';
  document.getElementById('sectionHeader').style.display = 'flex';
  document.body.classList.remove('homepage-mode');
}

// ── CAROUSEL GRID (6 RANDOM IMAGES HOMEPAGE) ────────────────
function initCarouselGrid() {
  heroPhotos = [...PHOTOS].sort(() => Math.random() - 0.5).slice(0, 6);
  renderCarouselGrid();
  document.body.classList.add('homepage-mode');
}

function renderCarouselGrid() {
  const grid = document.getElementById('carouselGrid');
  if (!grid) return;
  grid.innerHTML = '';

  heroPhotos.forEach((photo, i) => {
    const item = document.createElement('div');
    item.className = 'carousel-grid-item';

    const skeleton = document.createElement('div');
    skeleton.className = 'carousel-grid-skeleton';

    const img = document.createElement('img');
    img.alt = photo.title;
    img.style.opacity = '0';

    const overlay = document.createElement('div');
    overlay.className = 'grid-overlay';
    overlay.innerHTML = '<span class="grid-zoom-icon">⊕</span>';

    item.appendChild(skeleton);
    item.appendChild(img);
    item.appendChild(overlay);

    // Click to open lightbox
    item.addEventListener('click', () => {
      lightboxPhotos = heroPhotos;
      openLightbox(i);
    });

    // Lazy load image
    const src = thumbSrc(photo.src);
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = src;
      img.style.opacity = '1';
      item.classList.add('loaded');
    };
    tempImg.onerror = () => {
      img.src = src;
      img.style.opacity = '1';
      item.classList.add('loaded');
    };
    tempImg.src = src;

    grid.appendChild(item);
  });
}

function heroShuffle() {
  heroPhotos = [...PHOTOS].sort(() => Math.random() - 0.5).slice(0, 6);
  renderCarouselGrid();
}

// ── INTERSECTION OBSERVER (lazy load + zoom-fade-in) ──────────
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const img  = card.querySelector('img[data-src]');

      if (img) {
        card.classList.add('card-loading');
        const realImg = new Image();
        realImg.onload = () => {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          card.classList.remove('card-loading');
          setTimeout(() => card.classList.add('card-visible'), card._staggerDelay || 0);
        };
        realImg.onerror = () => {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          card.classList.remove('card-loading');
          setTimeout(() => card.classList.add('card-visible'), card._staggerDelay || 0);
        };
        realImg.src = img.dataset.src;
      } else {
        setTimeout(() => card.classList.add('card-visible'), card._staggerDelay || 0);
      }
      cardObserver.unobserve(card);
    }
  });
}, { rootMargin: '80px' });

// ── RENDER PHOTOS ─────────────────────────────────────────────
function renderPhotos(photos) {
  const grid  = document.getElementById('photoGrid');
  const empty = document.getElementById('emptyState');
  grid.innerHTML = '';

  if (photos.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  lightboxPhotos = photos;

  photos.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'photo-card card-hidden';
    card._staggerDelay = Math.min(i, 11) * 60;

    const thumb = thumbSrc(p.src);

    card.innerHTML = `
      <div class="photo-wrap">
        <div class="photo-skeleton"></div>
        <img
          data-src="${escHtml(thumb)}"
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt="${escHtml(p.title)}"
          loading="lazy"
        />
        <div class="photo-hover-overlay">
          <span class="zoom-icon">⊕</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openLightbox(i));
    grid.appendChild(card);
    cardObserver.observe(card);
  });
}

// ── LIGHTBOX ──────────────────────────────────────────────────
function openLightbox(index) {
  lightboxIndex = index;
  const overlay = document.getElementById('lightboxOverlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  buildStrip();
  loadLightboxPhoto(index);
}

function buildStrip() {
  const strip = document.getElementById('lbStrip');
  strip.innerHTML = '';

  lightboxPhotos.forEach((p, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'lb-thumb';
    thumb.dataset.index = i;

    const img = document.createElement('img');
    img.src = thumbSrc(p.src);
    img.alt = p.title;
    img.loading = 'lazy';

    thumb.appendChild(img);
    thumb.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxIndex = i;
      loadLightboxPhoto(i);
    });
    strip.appendChild(thumb);
  });
}

function syncStrip(index) {
  const strip = document.getElementById('lbStrip');
  const thumbs = strip.querySelectorAll('.lb-thumb');
  thumbs.forEach((t, i) => t.classList.toggle('active', i === index));

  const active = thumbs[index];
  if (active) {
    const stripWrap = strip.parentElement;
    const offset = active.offsetLeft - stripWrap.offsetWidth / 2 + active.offsetWidth / 2;
    strip.scrollTo({ left: offset, behavior: 'smooth' });
  }
}

function loadLightboxPhoto(index) {
  const photo   = lightboxPhotos[index];
  const img     = document.getElementById('lbImg');
  const caption = document.getElementById('lbCaption');
  const loader  = document.getElementById('lbImgLoader');

  img.style.opacity = '0';
  loader.style.display = 'block';
  caption.textContent  = '';

  const full = fullSrc(photo.src);

  const tempImg = new Image();
  tempImg.onload = () => {
    img.src = full;
    img.alt = photo.title;
    loader.style.display = 'none';
    img.style.opacity = '1';
    caption.textContent = `${photo.title}  ·  ${photo.category}`;
  };
  tempImg.onerror = () => {
    img.src = full;
    loader.style.display = 'none';
    img.style.opacity = '1';
  };
  tempImg.src = full;

  syncStrip(index);
  document.getElementById('lbPrev').style.opacity = index > 0 ? '1' : '0.2';
  document.getElementById('lbNext').style.opacity = index < lightboxPhotos.length - 1 ? '1' : '0.2';
}

function lightboxNav(dir) {
  const next = lightboxIndex + dir;
  if (next < 0 || next >= lightboxPhotos.length) return;
  lightboxIndex = next;
  loadLightboxPhoto(lightboxIndex);
}

function closeLightbox() {
  const overlay = document.getElementById('lightboxOverlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { document.getElementById('lbImg').src = ''; }, 300);
}

function closeLightboxOnBg(e) {
  if (e.target === document.getElementById('lightboxOverlay')) closeLightbox();
}

document.addEventListener('keydown', e => {
  const overlay = document.getElementById('lightboxOverlay');
  if (!overlay.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
});

// ── SRC HELPERS ───────────────────────────────────────────────
function thumbSrc(src) {
  if (src.includes('googleusercontent.com')) return src + '=w500-h500';
  return src + '?w=500&q=75';
}

function fullSrc(src) {
  if (src.includes('googleusercontent.com')) return src + '=w1600-h1200';
  return src + '?w=1600&q=95';
}

function updateCount(n) {
  document.getElementById('sectionCount').textContent = `${n} foto`;
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
