(function(){
  const DB = window.BERG_NOTICIAS || {};
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const prefix = () => document.documentElement.dataset.bergRoot || '';
  const url = p => (!p || p === '#' || /^(https?:|mailto:|#)/.test(p)) ? (p || '#') : prefix()+p;
  const item = id => DB[id] || null;
  const meta = n => [n.data,n.local,n.categoria].filter(Boolean).join(' · ');

  function evento(el,n){
    el.innerHTML = `<div class="event-row-media"><img src="${esc(url(n.imagem))}" alt="${esc(n.titulo)}" onerror="this.style.display='none'"></div><div><span class="event-meta">${esc(meta(n))}</span><h3>${esc(n.titulo)}</h3><p>${esc(n.resumo)}</p><a class="text-link" href="${esc(url(n.link))}">Leia mais →</a></div>`;
  }
  function ultima(el,n){
    el.href=url(n.link); el.innerHTML=`<div class="news-card-media"><img src="${esc(url(n.imagem))}" alt="${esc(n.titulo)}"></div><p class="meta">${esc(n.dataLonga||n.data)}</p><h3>${esc(n.titulo)}</h3>`;
  }
  function manchete(el,n){
    const img=document.getElementById('manchete-img'); if(img){img.src=url(n.imagem);img.alt=n.titulo||''}
    const sm=(id,v)=>{const x=document.getElementById(id);if(x)x.textContent=v||''};
    sm('manchete-meta',[n.data,n.categoria].filter(Boolean).join(' · ')); sm('manchete-titulo',n.titulo); sm('manchete-resumo',n.resumo);
    const a=document.getElementById('manchete-link');if(a)a.href=url(n.link);
    const lm=document.querySelector('.lead-media');if(lm)lm.setAttribute('data-category',n.categoria||'Manchete');
  }
  document.querySelectorAll('[data-noticia][data-formato]').forEach(el=>{const n=item(el.dataset.noticia);if(!n)return;const f=el.dataset.formato;if(f==='evento')evento(el,n);else if(f==='ultima')ultima(el,n);else if(f==='manchete')manchete(el,n)});
  window.BERG_RENDER_NOTICIA={item,url};
})();
