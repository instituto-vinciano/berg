(() => {
  const cfg = window.ODA_SITE || {};
  document.querySelectorAll('[data-stat]').forEach(el => { const v=cfg[el.dataset.stat]; if(v!==undefined) el.textContent=v; });
  const btn=document.querySelector('.menu-toggle'), nav=document.querySelector('.nav');
  if(btn&&nav) btn.addEventListener('click',()=>{const open=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open);});
})();
