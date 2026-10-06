(()=>{
const W=1800,H=900,entries=window.ODA_ENTRIES||[];
const vp=document.getElementById("viewport"),svg=document.getElementById("worldMap"),layer=document.getElementById("dataLayer");
const detail=document.getElementById("detail"); document.getElementById("count").textContent=entries.length;
let vb={x:0,y:0,w:W,h:H}, dragging=false, last=null, active=null;
const NS="http://www.w3.org/2000/svg", clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const project=(lat,lon)=>({x:(lon+180)/360*W,y:(90-lat)/180*H});
function el(n,c){const x=document.createElementNS(NS,n);if(c)x.setAttribute("class",c);return x}
function setVB(){vb.w=clamp(vb.w,W/12,W);vb.h=vb.w/2;vb.x=clamp(vb.x,0,W-vb.w);vb.y=clamp(vb.y,0,H-vb.h);svg.setAttribute("viewBox",`${vb.x} ${vb.y} ${vb.w} ${vb.h}`);render()}
function render(){
 layer.innerHTML="";
 const zoom=W/vb.w, threshold=zoom<1.7?68:zoom<2.7?42:24;
 const remaining=[...entries],groups=[];
 while(remaining.length){
   const a=remaining.shift(),pa=project(a.lat,a.lon),g=[a];
   for(let i=remaining.length-1;i>=0;i--){const pb=project(remaining[i].lat,remaining[i].lon);if(Math.hypot(pa.x-pb.x,pa.y-pb.y)<threshold/zoom){g.push(remaining[i]);remaining.splice(i,1)}}
   groups.push(g)
 }
 groups.forEach(g=>g.length>1?addCluster(g,zoom):addMarker(g[0],zoom))
}
function addMarker(e,z){
 const p=project(e.lat,e.lon),g=el("g","marker"+(active===e.id?" active":""));g.setAttribute("transform",`translate(${p.x} ${p.y}) scale(${1/z})`);
 [["halo",13],["ring",7],["core",3.4]].forEach(([c,r])=>{const q=el("circle",c);q.setAttribute("r",r);g.append(q)});
 g.addEventListener("click",ev=>{ev.stopPropagation();show(e)});layer.append(g)
}
function addCluster(group,z){
 const pts=group.map(e=>project(e.lat,e.lon)),p={x:pts.reduce((s,v)=>s+v.x,0)/pts.length,y:pts.reduce((s,v)=>s+v.y,0)/pts.length};
 const g=el("g","cluster-g");g.setAttribute("transform",`translate(${p.x} ${p.y}) scale(${1/z})`);
 const h=el("circle","halo");h.setAttribute("r",19);const r=el("circle","ring");r.setAttribute("r",12);const t=el("text");t.textContent=group.length;g.append(h,r,t);
 g.addEventListener("click",ev=>{ev.stopPropagation();zoomTo(p.x,p.y,1.8)});layer.append(g)
}
function show(e){active=e.id;render();dCountry.textContent=e.country;dName.textContent=e.name;dInstitution.textContent=e.institution;dCoords.textContent=`${Math.abs(e.lat).toFixed(3)}° ${e.lat>=0?"N":"S"} / ${Math.abs(e.lon).toFixed(3)}° ${e.lon>=0?"E":"W"}`;dType.textContent=e.type;dLink.href=e.url;detail.hidden=false}
function zoomTo(cx,cy,f){const nw=clamp(vb.w/f,W/12,W),nh=nw/2;const rx=(cx-vb.x)/vb.w,ry=(cy-vb.y)/vb.h;vb.x=cx-rx*nw;vb.y=cy-ry*nh;vb.w=nw;vb.h=nh;setVB()}
function screenToWorld(clientX,clientY){const r=svg.getBoundingClientRect();return{x:vb.x+(clientX-r.left)/r.width*vb.w,y:vb.y+(clientY-r.top)/r.height*vb.h}}
document.getElementById("zoomIn").onclick=()=>zoomTo(vb.x+vb.w/2,vb.y+vb.h/2,1.5);
document.getElementById("zoomOut").onclick=()=>zoomTo(vb.x+vb.w/2,vb.y+vb.h/2,1/1.5);
document.getElementById("home").onclick=()=>{vb={x:0,y:0,w:W,h:H};setVB()};
document.getElementById("closeDetail").onclick=()=>{detail.hidden=true;active=null;render()};
vp.addEventListener("wheel",e=>{e.preventDefault();const p=screenToWorld(e.clientX,e.clientY);zoomTo(p.x,p.y,e.deltaY<0?1.22:1/1.22)},{passive:false});
vp.addEventListener("pointerdown",e=>{if(e.target.closest&&e.target.closest("button,a,.detail,.marker,.cluster-g"))return;dragging=true;last={x:e.clientX,y:e.clientY};vp.classList.add("dragging");vp.setPointerCapture(e.pointerId)});
vp.addEventListener("pointermove",e=>{if(!dragging)return;const r=svg.getBoundingClientRect(),dx=(e.clientX-last.x)/r.width*vb.w,dy=(e.clientY-last.y)/r.height*vb.h;vb.x-=dx;vb.y-=dy;last={x:e.clientX,y:e.clientY};setVB()});
vp.addEventListener("pointerup",()=>{dragging=false;vp.classList.remove("dragging")});
setVB();
})();