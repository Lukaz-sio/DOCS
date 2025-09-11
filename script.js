/* ==========================
   Config — édite ici
========================== */
const DOCS_CONFIG = {
  basePath: 'docs',
  sections: [
    {
      title: 'Réseau', icon: '🛰️', items: [
        { title: 'Adressage IPv4', path: 'reseau/ipv4.md' },
        { title: 'VLAN & Trunk', path: 'reseau/vlan.md' },
        { title: 'Spanning Tree', path: 'reseau/stp.md' },
        { title: 'DHCP (Linux/Windows)', path: 'reseau/dhcp.md' },
        { title: 'DNS (Bind9 / Windows)', path: 'reseau/dns.md' },
        { title: 'Routeurs & Switch Cisco — CLI', path: 'reseau/cisco-cli.md' },
        { title: 'Services Réseau (HTTP, FTP, SSH…)', path: 'reseau/services.md' },
      ]
    },
    {
      title: 'Système', icon: '💻', items: [
        { title: 'Debian — Installation', path: 'systeme/debian-install.md' },
        { title: 'Montage de services Debian', path: 'systeme/debian-services.md' },
        { title: 'Serveur Web (Apache/Nginx)', path: 'systeme/web-server.md' },
        { title: 'Sauvegardes (rsync)', path: 'systeme/rsync.md' },
        { title: 'Services systemd', path: 'systeme/systemd.md' },
        { title: 'Scripts Bash utiles', path: 'systeme/bash-commands.md' },
      ]
    },
    {
      title: 'Windows & Windows Server', icon: '🪟', items: [
        { title: 'Installation Windows Server', path: 'windows/winserver-install.md' },
        { title: 'Active Directory (AD DS)', path: 'windows/active-directory.md' },
        { title: 'Gestion des utilisateurs & GPO', path: 'windows/gpo.md' },
        { title: 'Partages réseau & NTFS', path: 'windows/shares.md' },
        { title: 'Commandes PowerShell utiles', path: 'windows/powershell.md' },
      ]
    },
    {
      title: 'Virtualisation', icon: '🖥️', items: [
        { title: 'Proxmox — Installation et gestion VM', path: 'virtualisation/proxmox.md' },
        { title: 'VMware Workstation — Création de VM', path: 'virtualisation/vmware-workstation.md' },
        { title: 'VMware vSphere — Administration ESXi', path: 'virtualisation/vsphere.md' },
      ]
    },
    {
      title: 'Outils & Supervision', icon: '🧩', items: [
        { title: 'GLPI — Installation & usage', path: 'outils/glpi.md' },
        { title: 'Monitoring avec Zabbix', path: 'outils/zabbix.md' },
        { title: 'Sauvegarde automatisée', path: 'outils/backup.md' },
      ]
    },
    {
      title: 'Sécurité', icon: '🛡️', items: [
        { title: 'Pare-feu (iptables/nft)', path: 'securite/firewall.md' },
        { title: 'SSH durci', path: 'securite/ssh-hardening.md' },
        { title: 'Sécurité Windows Server', path: 'securite/winserver-sec.md' },
      ]
    },
    {
      title: 'Commandes essentielles', icon: '⌨️', items: [
        { title: 'Commandes Linux indispensables', path: 'commandes/linux.md' },
        { title: 'Commandes Windows (cmd)', path: 'commandes/windows.md' },
        { title: 'Commandes Cisco IOS', path: 'commandes/cisco.md' },
      ]
    }
  ],
  featured: [
    { title: 'Démarrer sur Debian', path: 'systeme/debian-install.md', description: 'Installation, partitionnement, premiers paquets.' },
    { title: 'Active Directory', path: 'windows/active-directory.md', description: 'Installation et configuration d’un domaine.' },
    { title: 'Réseau Cisco', path: 'reseau/cisco-cli.md', description: 'Commandes de base sur routeurs et switch.' },
    { title: 'Proxmox', path: 'virtualisation/proxmox.md', description: 'Installation et gestion d’hyperviseur open source.' },
  ]
};

/* ==========================
   Initialisation UI
========================== */
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const state = {
  index: [], // index de recherche
  recent: [], // chemins ouverts récemment
};

function initTheme(){
  const saved = localStorage.getItem('theme');
  if(saved){ document.documentElement.setAttribute('data-theme', saved); }
  const dark = (document.documentElement.getAttribute('data-theme') !== 'light');
  $('#themeSwitch').checked = dark;
  $('#themeSwitch').addEventListener('change', e => {
    const val = e.target.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', val);
    localStorage.setItem('theme', val);
  });
}

function buildSidebar(){
  const ul = $('#sections');
  ul.innerHTML = '';
  DOCS_CONFIG.sections.forEach(sec => {
    const li = document.createElement('li');
    const details = document.createElement('details');
    details.open = true;
    const summary = document.createElement('summary');
    summary.textContent = `${sec.icon || '📁'} ${sec.title}`;
    details.appendChild(summary);

    const inner = document.createElement('ul');
    sec.items.forEach(it => {
      const a = document.createElement('a');
      a.href = `#/doc/${encodeURIComponent(it.path)}`;
      a.textContent = it.title;
      const itemLi = document.createElement('li');
      itemLi.appendChild(a);
      inner.appendChild(itemLi);
    });
    details.appendChild(inner);
    li.appendChild(details);
    ul.appendChild(li);
  });
}

function buildFeatured(){
  const wrap = $('#featured');
  wrap.innerHTML = '';
  DOCS_CONFIG.featured.forEach(f => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h4>${f.title}</h4>
      <p>${f.description || ''}</p>
      <a href="#/doc/${encodeURIComponent(f.path)}">Lire →</a>
    `;
    wrap.appendChild(card);
  });
}

function buildIndex(){
  state.index = [];
  DOCS_CONFIG.sections.forEach(sec => {
    sec.items.forEach(it => {
      state.index.push({
        title: it.title,
        path: it.path,
        section: sec.title,
        score: 0
      });
    });
  });
}

function showToast(msg){
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

/* ==========================
   Router & rendu Markdown
========================== */
window.addEventListener('hashchange', handleRoute);

async function handleRoute(){
  const hash = location.hash || '#/home';
  const [_, route, ...rest] = hash.split('/');
  if(route === 'doc'){
    const rawPath = decodeURIComponent(rest.join('/'));
    await renderMarkdown(rawPath);
  } else if(route === 'recent'){
    renderRecent();
  } else if(route === 'all'){
    renderAllDocs();
  } else if(route === 'about'){
    renderAbout();
  } else {
    renderHome();
  }
}

async function renderMarkdown(relPath){
  const full = `${DOCS_CONFIG.basePath}/${relPath}`;
  const view = $('#docView');
  view.innerHTML = `<p>Chargement… <code>${relPath}</code></p>`;
  try{
    const res = await fetch(full, { cache: 'no-store' });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    // marked est global (CDN)
    const html = marked.parse(text, { mangle:false, headerIds:true });
    view.innerHTML = html;
    if(window.hljs){ view.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block)); }
    // maj récents
    addRecent(relPath);
    document.title = `${relPath} — Docs SISR`;
    // focus main
    $('#main').focus();
  }catch(err){
    console.error(err);
    view.innerHTML = `<p>❌ Impossible de charger <code>${relPath}</code>.<br><small>${String(err)}</small></p>`;
  }
}

function addRecent(path){
  state.recent = [path, ...state.recent.filter(p => p !== path)].slice(0, 10);
  localStorage.setItem('recentDocs', JSON.stringify(state.recent));
}

function loadRecent(){
  try{ state.recent = JSON.parse(localStorage.getItem('recentDocs')||'[]'); }catch{ state.recent = []; }
}

function renderHome(){
  const view = $('#docView');
  view.innerHTML = `
    <section class="hero">
      <h2>Bienvenue 👋</h2>
      <p>Utilise la barre de recherche ou la navigation à gauche pour ouvrir un document Markdown.</p>
    </section>
    <section>
      <h3>📌 Sélection</h3>
      <div id="featured" class="cards"></div>
    </section>
    <section>
      <h3>🆕 Derniers ajouts</h3>
      <ul id="recent" class="list"></ul>
    </section>
  `;
  buildFeatured();
  renderRecentList($('#recent'));
}

function renderRecent(){
  const view = $('#docView');
  view.innerHTML = `<h2>Récemment ouverts</h2><ul id="recentList" class="list"></ul>`;
  renderRecentList($('#recentList'));
}

function renderRecentList(root){
  root.innerHTML = '';
  state.recent.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#/doc/${encodeURIComponent(p)}">${p}</a>`;
    root.appendChild(li);
  });
  if(!state.recent.length){ root.innerHTML = '<li><em>Aucun document récent.</em></li>'; }
}

function renderAllDocs(){
  const view = $('#docView');
  view.innerHTML = '<h2>Tous les documents</h2><ul class="list" id="allList"></ul>';
  const all = DOCS_CONFIG.sections.flatMap(sec => sec.items.map(it => ({...it, section: sec.title})));
  const ul = $('#allList');
  all.forEach(it => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#/doc/${encodeURIComponent(it.path)}">${it.title}</a> <span style="color:var(--muted)">· ${it.section}</span>`;
    ul.appendChild(li);
  });
}

function renderAbout(){
  $('#docView').innerHTML = `
    <h2>À propos</h2>
    <p>Ce site affiche des fichiers <code>.md</code> directement dans le navigateur via <strong>Marked.js</strong> et <strong>highlight.js</strong>.</p>
    <ul>
      <li>Placer les documents dans <code>${DOCS_CONFIG.basePath}/</code></li>
      <li>Mettre à jour les rubriques dans <code>script.js</code> → <code>DOCS_CONFIG.sections</code></li>
      <li>Recherche rapide: <kbd>/</kbd> ou <kbd>Ctrl</kbd> + <kbd>K</kbd></li>
      <li>Thème clair/sombre via le commutateur (préférence enregistrée)</li>
    </ul>
  `;
}

/* ==========================
   Recherche
========================== */
function initSearch(){
  const form = $('#searchForm');
  const input = $('#searchInput');
  const results = $('#searchResults');

  function openPalette(){ input.focus(); input.select(); results.classList.add('visible'); renderResults(input.value); }
  function closePalette(){ results.classList.remove('visible'); results.innerHTML=''; }

  // Raccourcis: / ou Ctrl+K
  window.addEventListener('keydown', (e) => {
    if(e.key === '/' && document.activeElement !== input){ e.preventDefault(); openPalette(); }
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); openPalette(); }
    if(e.key === 'Escape'){ closePalette(); }
  });

  input.addEventListener('input', () => { results.classList.add('visible'); renderResults(input.value); });
  form.addEventListener('submit', (e) => { e.preventDefault(); results.classList.add('visible'); renderResults(input.value); });
  document.addEventListener('click', (e) => { if(!form.contains(e.target)) closePalette(); });

  function renderResults(q){
    const query = (q||'').trim().toLowerCase();
    const items = !query ? state.index.slice(0, 20) : state.index
      .map(it => ({...it, score: score(query, it)}))
      .filter(it => it.score > 0)
      .sort((a,b)=> b.score - a.score)
      .slice(0, 30);

    results.innerHTML = items.map(it => `
      <a role="option" href="#/doc/${encodeURIComponent(it.path)}">
        <strong>${highlight(it.title, query)}</strong>
        <span style="float:right; color:var(--muted)">${it.section}</span>
      </a>
    `).join('');
  }

  function score(q, it){
    // pondération simple: titre + section + path
    const str = `${it.title} ${it.section} ${it.path}`.toLowerCase();
    let s = 0;
    q.split(/\s+/).forEach(tok => { if(str.includes(tok)) s += 1; });
    // bonus si début de titre
    if(it.title.toLowerCase().startsWith(q)) s += 1;
    return s;
  }

  function highlight(text, q){
    if(!q) return text;
    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(esc, 'ig'), m => `<mark>${m}</mark>`);
  }
}

/* ==========================
   Boot
========================== */
(function main(){
  initTheme();
  buildSidebar();
  buildFeatured();
  buildIndex();
  initSearch();
  loadRecent();
  handleRoute();
  showToast('Prêt. Place tes .md dans /' + DOCS_CONFIG.basePath);
})();
