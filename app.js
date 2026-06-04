// ============================================================
//  Begarlist 16 — Photo Gallery App Logic
// ============================================================

let currentCategory = 'all';
let currentSearch   = '';
let lightboxIndex   = 0;
let lightboxPhotos  = [];

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('bg16-theme') || 'dark';
  setTheme(saved);

  renderPhotos(PHOTOS);
  updateCount(PHOTOS.length);

  // Hide page loader once everything is ready
  window.addEventListener('load', hideLoader);
  // Fallback: hide after 2s even if some resource is slow
  setTimeout(hideLoader, 2000);

  // Close groups on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.group-trigger') && !e.target.closest('.group-chips')) {
      closeAllGroups();
    }
  });
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

// ── GROUP EXPAND (inline chips) ───────────────────────────────
function toggleGroup(groupId, triggerBtn) {
  const chips = document.getElementById('group-' + groupId);
  const isOpen = chips.classList.contains('open');

  // Close all groups first
  closeAllGroups();

  if (!isOpen) {
    chips.classList.add('open');
    triggerBtn.classList.add('open');
  }
}

function closeAllGroups() {
  document.querySelectorAll('.group-chips').forEach(c => c.classList.remove('open'));
  document.querySelectorAll('.group-trigger').forEach(b => b.classList.remove('open'));
}

// ── CATEGORY FILTER ───────────────────────────────────────────
function filterCategory(cat, btn, groupId) {
  currentCategory = cat;
  currentSearch   = '';

  // Remove active from all cat-btns and chips
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));

  if (groupId) {
    // Keep group open, mark the trigger as open+active-group, mark the chip active
    const trigger = document.querySelector(`[data-group="${groupId}"]`);
    if (trigger) { trigger.classList.add('open', 'active'); }
    btn.classList.add('active');
  } else {
    btn.classList.add('active');
    closeAllGroups();
  }

  document.getElementById('searchInput').value = '';
  document.getElementById('searchNotice').style.display = 'none';

  const filtered = filterPhotos();
  document.getElementById('sectionTitle').textContent = cat === 'all' ? 'Semua Foto' : cat;

  renderPhotos(filtered);
  updateCount(filtered.length);
}

// ── SEARCH ────────────────────────────────────────────────────
function handleSearch(val) {
  currentSearch = val.trim().toLowerCase();
  const notice = document.getElementById('searchNotice');
  if (currentSearch) {
    notice.style.display = 'flex';
    document.getElementById('searchTerm').textContent = val.trim();
  } else {
    notice.style.display = 'none';
  }
  const filtered = filterPhotos();
  renderPhotos(filtered);
  updateCount(filtered.length);
}

function clearSearch() {
  currentSearch = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('searchNotice').style.display = 'none';
  const filtered = filterPhotos();
  renderPhotos(filtered);
  updateCount(filtered.length);
}

// ── FILTER LOGIC ──────────────────────────────────────────────
function filterPhotos() {
  return PHOTOS.filter(p => {
    const matchCat    = currentCategory === 'all' || p.category === currentCategory;
    const matchSearch = !currentSearch ||
      p.title.toLowerCase().includes(currentSearch) ||
      p.category.toLowerCase().includes(currentSearch) ||
      p.description.toLowerCase().includes(currentSearch);
    return matchCat && matchSearch;
  });
}

// ── INTERSECTION OBSERVER (lazy load + zoom-fade-in) ──────────
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const img  = card.querySelector('img[data-src]');

      if (img) {
        // Show skeleton loader on the card while image loads
        card.classList.add('card-loading');

        const realImg = new Image();
        realImg.onload = () => {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          card.classList.remove('card-loading');
          // Staggered zoom-fade-in: small delay based on position in viewport batch
          setTimeout(() => {
            card.classList.add('card-visible');
          }, card._staggerDelay || 0);
        };
        realImg.onerror = () => {
          img.src = img.dataset.src; // still try to show
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

  // Store current filtered set for lightbox navigation
  lightboxPhotos = photos;

  photos.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'photo-card card-hidden';
    // Stagger: first 12 get a progressive delay, after that they all animate quickly
    card._staggerDelay = Math.min(i, 11) * 60;
    card.setAttribute('data-id', p.id);

    card.innerHTML = `
      <div class="photo-wrap">
        <div class="photo-skeleton"></div>
        <img
          data-src="${escHtml(p.src)}"
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
  loadLightboxPhoto(index);
}

function loadLightboxPhoto(index) {
  const photo   = lightboxPhotos[index];
  const img     = document.getElementById('lbImg');
  const caption = document.getElementById('lbCaption');
  const loader  = document.getElementById('lbImgLoader');

  // Show loader, hide image
  img.style.opacity = '0';
  loader.style.display = 'block';
  caption.textContent  = '';

  const tempImg = new Image();
  tempImg.onload = () => {
    img.src = photo.src;
    img.alt = photo.title;
    loader.style.display = 'none';
    img.style.opacity = '1';
    caption.textContent = `${photo.title}  ·  ${photo.category}`;
  };
  tempImg.onerror = () => {
    img.src = photo.src;
    loader.style.display = 'none';
    img.style.opacity = '1';
  };
  tempImg.src = photo.src;

  // Update nav visibility
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
  setTimeout(() => {
    document.getElementById('lbImg').src = '';
  }, 300);
}

function closeLightboxOnBg(e) {
  if (e.target === document.getElementById('lightboxOverlay')) closeLightbox();
}

document.addEventListener('keydown', e => {
  const overlay = document.getElementById('lightboxOverlay');
  if (!overlay.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   lightboxNav(-1);
  if (e.key === 'ArrowRight')  lightboxNav(1);
});

// ── HELPERS ───────────────────────────────────────────────────
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

function showHome() {
  currentCategory = 'all';
  currentSearch   = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('searchNotice').style.display = 'none';
  document.getElementById('sectionTitle').textContent = 'Semua Foto';
  document.querySelectorAll('.cat-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.cat === 'all')
  );
  closeAllGroups();
  renderPhotos(PHOTOS);
  updateCount(PHOTOS.length);
}
