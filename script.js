/* ==========================


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
