/* ===== Thème ===== */
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme') || 'dark';
if (saved === 'light') root.classList.add('light');
themeBtn?.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

/* ===== Sidebar mobile ===== */
const burger = document.getElementById('burger');
const sidebar = document.getElementById('sidebar');
burger?.addEventListener('click', () => sidebar.classList.toggle('open'));

/* ===== Recherche (filtre les liens) ===== */
const searchInput = document.getElementById('searchInput');
const nav = document.getElementById('nav');
searchInput?.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();
  nav.querySelectorAll('a').forEach(a => {
    a.style.display = a.textContent.toLowerCase().includes(q) ? 'block' : 'none';
  });
});

/* ===== Chargement Markdown ===== */
const view = document.getElementById('docView');
const titleEl = document.getElementById('docTitle');
const pathEl = document.getElementById('docPath');
const readingEl = document.getElementById('docReading');
const contentEl = document.getElementById('docContent');
const tocEl = document.getElementById('toc');

function getDocFromHash(){
  const m = decodeURIComponent(location.hash).match(/doc=(.+)$/);
  return m ? m[1] : null;
}

function estimateReading(text){
  const words = text.replace(/```[\s\S]*?```/g,'').split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words/220));
  return `${mins} min de lecture`;
}

function buildTOC(){
  tocEl.innerHTML = '<h4>Sommaire</h4>';
  const hs = contentEl.querySelectorAll('h1, h2, h3');
  const list = document.createElement('div');
  hs.forEach(h => {
    const id = h.id || h.textContent.trim().toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'');
    h.id = id;
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = (h.tagName==='H1'?'• ':h.tagName==='H2'?'– ':'·· ') + h.textContent;
    list.appendChild(a);
  });
  tocEl.appendChild(list);
}

async function loadDoc(path){
  try{
    nav.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#doc=${path}`));
    const res = await fetch(path, {cache:'no-store'});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();
    const firstH1 = md.split('\n').find(l => l.startsWith('# '));
    titleEl.textContent = firstH1 ? firstH1.replace(/^#\s+/,'') : path.split('/').pop().replace('.md','');
    pathEl.textContent = path;
    readingEl.textContent = estimateReading(md);
    contentEl.innerHTML = marked.parse(md, {mangle:false, headerIds:true});
    document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    document.getElementById('welcome')?.setAttribute('hidden','hidden');
    view.hidden = false;
    buildTOC();
    window.scrollTo({top:0, behavior:'smooth'});
  }catch(e){
    titleEl.textContent = 'Document introuvable';
    contentEl.innerHTML = `<p>Impossible de charger <code>${path}</code> (${e.message}).</p>`;
    view.hidden = false;
  }
}

window.addEventListener('hashchange', () => { const d = getDocFromHash(); if(d) loadDoc(d); });
window.addEventListener('load', () => { const d = getDocFromHash(); if(d) loadDoc(d); });

/* ===== Actions ===== */
document.getElementById('copyLink')?.addEventListener('click', async () => {
  await navigator.clipboard.writeText(location.href);
  alert('Lien copié !');
});
document.getElementById('backTop')?.addEventListener('click', () => {
  window.scrollTo({top:0, behavior:'smooth'});
});
