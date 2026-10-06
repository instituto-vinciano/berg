(function(){
const data=Array.isArray(window.RASTROPEDIA_VERBETES)?window.RASTROPEDIA_VERBETES:[];
const grid=document.getElementById("verbetes"),search=document.getElementById("busca"),filters=document.getElementById("categorias"),empty=document.getElementById("sem-resultados"),modal=document.getElementById("modal");
let cat="Todos";
const norm=s=>(s||"").toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const cats=["Todos",...new Set(data.map(v=>v.categoria))];
cats.forEach(c=>{const b=document.createElement("button");b.className="filter"+(c==="Todos"?" active":"");b.textContent=c;b.onclick=()=>{cat=c;[...filters.children].forEach(x=>x.classList.toggle("active",x===b));render()};filters.appendChild(b)});
function openEntry(v){
 document.getElementById("modal-cat").textContent=v.categoria;
 document.getElementById("modal-title").textContent=v.titulo;
 document.getElementById("modal-text").textContent=v.texto;
 const im=document.getElementById("modal-image");
 im.innerHTML=v.imagem?'<img class="entry-image" src="'+v.imagem+'" alt="'+v.titulo+'">':'<div class="image-placeholder">Espaço preparado para imagem do verbete</div>';
 document.getElementById("modal-related").textContent="Verbetes relacionados poderão ser conectados aqui.";
 modal.classList.add("open");
}
function render(){
 const q=norm(search.value);
 const list=data.filter(v=>(cat==="Todos"||v.categoria===cat)&&(!q||norm([v.titulo,v.categoria,v.resumo,v.texto].join(" ")).includes(q))).sort((a,b)=>a.titulo.localeCompare(b.titulo,"pt-BR"));
 grid.innerHTML="";empty.hidden=!!list.length;
 list.forEach(v=>{const a=document.createElement("article");a.className="card";a.tabIndex=0;a.setAttribute("role","button");a.setAttribute("aria-label","Abrir "+v.titulo);a.innerHTML='<div class="card-top"></div><div class="card-body"><small>'+v.categoria+'</small><h3>'+v.titulo+'</h3><p>'+v.resumo+'</p></div>';a.onclick=()=>openEntry(v);a.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openEntry(v)}};grid.appendChild(a)})
}
search.oninput=render;
document.getElementById("fechar").onclick=()=>modal.classList.remove("open");
modal.onclick=e=>{if(e.target===modal)modal.classList.remove("open")};
document.onkeydown=e=>{if(e.key==="Escape")modal.classList.remove("open")};
render();
const requested=new URLSearchParams(location.search).get("verbete");
if(requested){const found=data.find(v=>v.titulo===requested);if(found)openEntry(found)}
})();