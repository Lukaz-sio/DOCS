/* ====== THEME (dark/light) ====== */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') root.classList.add('light');
themeToggle?.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

/* ====== SIDEBAR (mobile) ====== */
const burger = document.getElementById('burger');
const sidebar = document.getElementById('sidebar');
burger?.addEventListener('click', () => sidebar.classList.toggle('open'));

/* ====== SEARCH (filter links) ====== */
const searchInput = document.getElementById('searchInput');
const nav = document.getElementById('nav');
searchInput?.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();
  nav.querySelectorAll('a').forEach(a => {
    const show = a.textContent.toLowerCase().includes(q);
    a.style.display = show ? 'block' : 'none';
  });
});

/* ====== DOC LOADER (Markdown) ====== */
const docContainer = document.getElementById('docContainer');
const docTitle = document.getElementById('docTitle');
const docContent = document.getElementById('docContent');

function getDocFromHash() {
  const hash = decodeURIComponent(location.hash || '');
  const match = hash.match(/doc=(.+)$/);
  return match ? match[1] : null;
}

async function loadDoc(path) {
  try {
    nav.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#doc=${path}`));
    // fetch le raw .md (fonctionne sur GitHub Pages)
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();
    // Titre = 1ère ligne H1 si présent
    const firstLine = md.split('\n').find(l => l.startsWith('# '));
    docTitle.textContent = firstLine ? firstLine.replace(/^#\s+/, '') : path.split('/').pop().replace('.md','');
    // Converti Markdown -> HTML
    docContent.innerHTML = marked.parse(md, { mangle:false, headerIds:true });
    // Affiche
    document.querySelector('.hero')?.setAttribute('hidden', 'hidden');
    docContainer.hidden = false;
    // remonte en haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    docTitle.textContent = 'Document introuvable';
    docContent.innerHTML = `<p>Impossible de charger <code>${path}</code> (${e.message}).</p>`;
    docContainer.hidden = false;
  }
}

window.addEventListener('hashchange', () => {
  const doc = getDocFromHash();
  if (doc) loadDoc(doc);
});
window.addEventListener('load', () => {
  const doc = getDocFromHash();
  if (doc) loadDoc(doc);
});

/* ====== Small utils ====== */
document.getElementById('copyLink')?.addEventListener('click', async () => {
  await navigator.clipboard.writeText(location.href);
  alert('Lien copié !');
});
document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
