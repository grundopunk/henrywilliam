// Año dinámico
document.getElementById('year')?.appendChild(document.createTextNode(String(new Date().getFullYear())));

// Menú móvil
const menuBtn = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu){
  menuBtn.addEventListener('click', () => {
    const open = !mobileMenu.hasAttribute('hidden');
    if (open){ mobileMenu.setAttribute('hidden',''); menuBtn.setAttribute('aria-expanded','false'); }
    else { mobileMenu.removeAttribute('hidden'); menuBtn.setAttribute('aria-expanded','true'); }
  });
}

// Tema claro/oscuro simple
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const KEY = 'gr-theme';
const saved = localStorage.getItem(KEY);
if (saved === 'light' || saved === 'dark') root.classList.add(saved);
toggle?.addEventListener('click', () => {
  const isDark = root.classList.contains('dark') || (!root.classList.contains('light') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.classList.remove('light','dark');
  const next = isDark ? 'light' : 'dark';
  root.classList.add(next);
  localStorage.setItem(KEY, next);
});

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if (id && id.length>1){
      if (location.pathname.endsWith('index.html') || location.pathname === '/' || a.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
        mobileMenu?.setAttribute('hidden','');
        menuBtn?.setAttribute('aria-expanded','false');
      }
    }
  });
});

// Inspiración (poemas)
const LS_KEY = 'gr.poems.v1';
const $form = document.getElementById('poemForm');
if ($form){
  const $title = document.getElementById('poemTitle');
  const $tag = document.getElementById('poemTag');
  const $body = document.getElementById('poemBody');
  const $list = document.getElementById('poemList');
  const $save = document.getElementById('savePoem');
  const $new = document.getElementById('newPoem');
  const $export = document.getElementById('exportPoems');
  const $search = document.getElementById('searchPoem');

  const read = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  const write = (arr) => localStorage.setItem(LS_KEY, JSON.stringify(arr));

  const render = () => {
    const q = ($search?.value || '').toLowerCase();
    const poems = read().filter(p => (p.title+p.tag+p.body).toLowerCase().includes(q));
    $list.innerHTML = '';
    poems.sort((a,b)=> b.created - a.created).forEach(p => {
      const div = document.createElement('div');
      div.className = 'poem-item';
      div.innerHTML = `<h4>${p.title || 'Sin título'}</h4>
        <div class="meta">${new Date(p.created).toLocaleString()} • ${p.tag || 'sin etiqueta'}</div>
        <pre>${p.body || ''}</pre>
        <div class="row actions" style="margin-top:.6rem; display:flex; gap:.5rem;">
          <button class="btn" data-edit="${p.id}">Editar</button>
          <button class="btn" data-del="${p.id}">Eliminar</button>
        </div>`;
      $list.appendChild(div);
    });
  };

  $save?.addEventListener('click', () => {
    const poems = read();
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();
    poems.push({ id, title: $title.value.trim(), tag: $tag.value.trim(), body: $body.value.trim(), created: Date.now() });
    write(poems);
    $title.value = ''; $tag.value=''; $body.value='';
    render();
  });

  $new?.addEventListener('click', () => {
    $title.value = ''; $tag.value=''; $body.value=''; $title.focus();
  });

  $export?.addEventListener('click', () => {
    const poems = read();
    const lines = poems.sort((a,b)=> a.created-b.created).map(p => `# ${p.title || 'Sin título'} [${p.tag||''}]\n${p.body}\n\n---\n`);
    const blob = new Blob([lines.join('\n')], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'poemas.txt';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  });

  $search?.addEventListener('input', render);

  document.getElementById('poemList')?.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const idDel = t.getAttribute('data-del');
    const idEdit = t.getAttribute('data-edit');
    if (idDel){
      const poems = read().filter(p => p.id !== idDel);
      write(poems); render();
    }
    if (idEdit){
      const p = read().find(p => p.id === idEdit);
      if (p){ $title.value = p.title; $tag.value = p.tag; $body.value = p.body; }
    }
  });

  render();
}
