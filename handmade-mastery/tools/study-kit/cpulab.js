/* CPU lab: Task Manager's Performance → CPU page inside Practice, for parts about
   processors, cores and hyperthreads. Two computers:
   - This Mac (live): real cores, logical processors and per-processor load from the helper's
     /api/cpu, polled once a second only while the lab is on screen and the tab is visible.
   - Example Windows PC (simulated): 8 cores, 16 logical processors, so two threads per core
     can be compared with a machine that has one.
   Right-click the graph (or use the buttons) → Change graph to → Logical processors, as in
   the video. One canvas draws every graph; history lives in fixed Float32Array rings.
   createCpuLab(root,{live,onNote}) → {root, wake}. */
function createCpuLab(root,opts={}){
  const SAMPLES=60,POLL=1000;
  const EXAMPLE={name:'Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz',sockets:1,cores:8,logical:16,groups:[],ghz:2.9,os:'Windows',example:true};
  const LIVE_OFF={name:'This computer',sockets:null,cores:null,logical:navigator.hardwareConcurrency||null,groups:[],ghz:null,os:'',off:true};
  const H=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const comp={live:{topo:opts.live?null:LIVE_OFF,ring:null,overall:null,prev:null,sim:null},example:{topo:EXAMPLE,ring:null,overall:null,prev:null,sim:null}};
  let source='live',view='overall',head=0,timer=0,busy=false,err='';

  root.classList.add('cpulab');
  root.innerHTML=`<div class="tm" role="group" aria-label="Task Manager, CPU performance">
  <div class="tm-title"><span class="tm-logo" aria-hidden="true"></span>Task Manager<span class="tm-caps" aria-hidden="true"><i>─</i><i>☐</i><i>✕</i></span></div>
  <div class="tm-tabs" aria-hidden="true"><span>Processes</span><span class="is-on">Performance</span><span>App history</span><span>Startup</span><span>Users</span><span>Details</span><span>Services</span></div>
  <div class="tm-body">
    <nav class="tm-nav" aria-label="Computer">
      <button type="button" class="tm-card" data-tm-src="live"><canvas data-tm-spark="live" aria-hidden="true"></canvas><span><b>CPU</b><small>This Mac · live</small><small data-tm-pct="live"></small></span></button>
      <button type="button" class="tm-card" data-tm-src="example"><canvas data-tm-spark="example" aria-hidden="true"></canvas><span><b>CPU</b><small>Example Windows PC</small><small data-tm-pct="example"></small></span></button>
    </nav>
    <section class="tm-main">
      <header class="tm-head"><h3>CPU</h3><span data-tm-name></span></header>
      <div class="tm-axis"><span data-tm-axis>% Utilization over 60 seconds</span><span>100%</span></div>
      <div class="tm-graph" data-tm-graph tabindex="0" title="Right-click: Change graph to…"><canvas></canvas></div>
      <div class="tm-axis"><span>60 seconds</span><span>0</span></div>
      <div class="tm-stats"><div class="tm-big"><div><small>Utilization</small><b data-tm-util>–</b></div><div><small>Speed</small><b data-tm-speed>–</b></div></div><dl data-tm-facts></dl></div>
      <p class="tm-note" data-tm-note hidden></p>
    </section>
  </div>
  <div class="tm-menu" role="menu" data-tm-menu hidden><div class="tm-menu-h">Change graph to</div><button type="button" role="menuitemradio" data-tm-view="overall">Overall utilization</button><button type="button" role="menuitemradio" data-tm-view="logical">Logical processors</button></div>
</div>
<div class="tm-tools"><span>Graph:</span><button type="button" data-tm-view="overall">Overall</button><button type="button" data-tm-view="logical">Logical processors</button></div>
<div class="tm-mine"><b>Your numbers</b> <span class="tm-mine-for" data-tm-for></span>
  <label>Cores <input type="number" min="1" max="512" inputmode="numeric" data-tm-in="cores"></label>
  <label>Logical processors <input type="number" min="1" max="1024" inputmode="numeric" data-tm-in="logical"></label>
  <button type="button" data-tm-check>Check</button><button type="button" data-tm-copy hidden>Put it in my note</button>
  <p data-tm-result aria-live="polite"></p></div>`;
  const q=s=>root.querySelector(s),graph=q('[data-tm-graph]'),canvas=graph.querySelector('canvas'),ctx=canvas.getContext('2d'),menu=q('[data-tm-menu]');
  const ins={cores:q('[data-tm-in="cores"]'),logical:q('[data-tm-in="logical"]')},result=q('[data-tm-result]'),copyBtn=q('[data-tm-copy]');

  /* ---------- data ---------- */
  function ensureRings(c){
    const n=Math.max(1,c.topo?.logical||1);
    if(c.ring&&c.ring.length===n)return;
    c.ring=Array.from({length:n},()=>new Float32Array(SAMPLES).fill(NaN));c.overall=new Float32Array(SAMPLES).fill(NaN);
  }
  function push(c,usage){                                  // usage: one 0..100 value per logical processor
    ensureRings(c);
    let sum=0;
    for(let i=0;i<c.ring.length;i++){const v=usage[i]??0;c.ring[i][head]=v;sum+=v;}
    c.overall[head]=sum/c.ring.length;
  }
  function simulate(c){                                    // hyperthread pairs share their core's load, roughly
    const n=c.topo.logical;c.sim??=Array.from({length:n},()=>8+Math.random()*20);
    const out=new Array(n);
    for(let core=0;core<n/2;core++){
      const base=c.sim[core*2]=Math.min(92,Math.max(2,c.sim[core*2]+(Math.random()-.5)*14+(Math.random()<.04?40:0)-(c.sim[core*2]>60?6:0)));
      out[core*2]=base;out[core*2+1]=Math.min(100,Math.max(0,base*(.35+Math.random()*.4)));
    }
    return out;
  }
  async function sampleLive(){
    const c=comp.live;
    if(!opts.live){push(c,[]);return;}
    try{
      const r=await fetch('/api/cpu',{cache:'no-store'});
      if(!r.ok)throw new Error('HTTP '+r.status);
      const d=await r.json();err='';
      if(!c.topo){c.topo=d;fillFacts();}
      if(!d.ticks){push(c,[]);return;}
      const usage=d.ticks.map((t,i)=>{const p=c.prev?.[i];if(!p)return NaN;const dt=t[1]-p[1];return dt>0?Math.min(100,Math.max(0,100*(t[0]-p[0])/dt)):(c.ring?.[i]?.[(head+SAMPLES-1)%SAMPLES]??0);});
      c.prev=d.ticks;push(c,usage);
    }catch(e){err='The helper did not answer, so the live numbers are paused.';push(c,[]);}
  }
  async function tick(){
    head=(head+1)%SAMPLES;
    await sampleLive();
    push(comp.example,simulate(comp.example));
    draw();
  }

  /* ---------- drawing ---------- */
  const COL={line:'#117dbb',fill:'rgba(17,125,187,.13)',grid:'#d9eaf4',edge:'#117dbb',bg:'#fff'};
  function fit(cv){
    const dpr=window.devicePixelRatio||1,w=Math.max(1,Math.round(cv.clientWidth*dpr)),h=Math.max(1,Math.round(cv.clientHeight*dpr));
    if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}
    return dpr;
  }
  function plot(g,ring,x,y,w,h,dpr,gridCols,gridRows){
    g.fillStyle=COL.bg;g.fillRect(x,y,w,h);
    g.strokeStyle=COL.grid;g.lineWidth=dpr;g.beginPath();
    for(let i=1;i<gridCols;i++){const gx=Math.round(x+w*i/gridCols)+.5;g.moveTo(gx,y);g.lineTo(gx,y+h);}
    for(let i=1;i<gridRows;i++){const gy=Math.round(y+h*i/gridRows)+.5;g.moveTo(x,gy);g.lineTo(x+w,gy);}
    g.stroke();
    g.beginPath();let started=false,firstX=0,lastX=0;
    for(let k=0;k<SAMPLES;k++){                               // oldest on the left, newest on the right
      const v=ring[(head+1+k)%SAMPLES];if(Number.isNaN(v))continue;
      const px=x+w*k/(SAMPLES-1),py=y+h-(h*v/100);
      if(!started){g.moveTo(px,py);firstX=px;started=true;}else g.lineTo(px,py);lastX=px;
    }
    if(started){
      g.strokeStyle=COL.line;g.lineWidth=1.2*dpr;g.stroke();
      g.lineTo(lastX,y+h);g.lineTo(firstX,y+h);g.closePath();g.fillStyle=COL.fill;g.fill();
    }
    g.strokeStyle=COL.edge;g.lineWidth=dpr;g.strokeRect(x+dpr/2,y+dpr/2,w-dpr,h-dpr);
  }
  function draw(){
    if(!root.isConnected)return;
    const c=comp[source];ensureRings(c);
    const dpr=fit(canvas),W=canvas.width,Hh=canvas.height;
    ctx.clearRect(0,0,W,Hh);
    if(view==='overall'||c.ring.length<2)plot(ctx,c.overall,0,0,W,Hh,dpr,12,10);
    else{
      const n=c.ring.length,gap=Math.round(4*dpr);
      let cols=Math.min(n,Math.max(1,Math.ceil(Math.sqrt(n*W/Hh))));const rows=Math.ceil(n/cols);cols=Math.ceil(n/rows); // even rows: 16 → 8×2, not 10+6
      const cw=(W-gap*(cols-1))/cols,ch=(Hh-gap*(rows-1))/rows;
      for(let i=0;i<n;i++){const cx=(i%cols)*(cw+gap),cy=Math.floor(i/cols)*(ch+gap);plot(ctx,c.ring[i],Math.round(cx),Math.round(cy),Math.round(cw),Math.round(ch),dpr,4,4);}
    }
    for(const key of ['live','example']){
      const cc=comp[key];ensureRings(cc);
      const sp=q(`[data-tm-spark="${key}"]`),sd=fit(sp),g=sp.getContext('2d');
      plot(g,cc.overall,0,0,sp.width,sp.height,sd,1,1);
      const v=cc.overall[head];q(`[data-tm-pct="${key}"]`).textContent=Number.isNaN(v)?'':`${Math.round(v)}%`;
    }
    const v=c.overall[head];
    q('[data-tm-util]').textContent=Number.isNaN(v)?'–':`${Math.round(v)}%`;
    const note=q('[data-tm-note]'),msg=source==='live'?(c.topo?.off?`Live numbers need the helper: start the page with <code>${H(typeof START_CMD==='string'?START_CMD:'./study')}</code>. The browser alone only knows ${c.topo.logical?`${c.topo.logical} logical processors`:'nothing about the cores'}.`:H(err)):'Simulated: a typical Windows PC with Hyper-Threading (two hardware threads per core).';
    note.hidden=!msg;if(msg&&note.innerHTML!==msg)note.innerHTML=msg;
  }
  function fillFacts(){
    const t=comp[source].topo||{};
    q('[data-tm-name]').textContent=t.name||'';
    q('[data-tm-speed]').textContent=t.ghz?`${t.ghz.toFixed(2)} GHz`:'–';
    const rows=[['Base speed',t.ghz?`${t.ghz.toFixed(2)} GHz`:'not reported'],['Sockets',t.sockets],['Cores',t.cores],['Logical processors',t.logical]];
    for(const gp of t.groups||[])rows.push([`${gp.name} cores`,gp.cores]);
    if(t.example)rows.push(['Virtualization','Enabled'],['L1 cache','512 KB'],['L2 cache','2.0 MB'],['L3 cache','16.0 MB']);
    q('[data-tm-facts]').innerHTML=rows.map(([k,v])=>`<dt>${H(k)}</dt><dd>${v==null||v===''?'–':H(v)}</dd>`).join('');
    q('[data-tm-for]').textContent=source==='live'?'(this Mac)':'(example PC)';
    q('[data-tm-axis]').textContent=view==='logical'?'% Utilization over 60 seconds, one graph per logical processor':'% Utilization over 60 seconds';
    root.querySelectorAll('[data-tm-src]').forEach(b=>b.classList.toggle('is-on',b.dataset.tmSrc===source));
    root.querySelectorAll('[data-tm-view]').forEach(b=>b.setAttribute(b.getAttribute('role')==='menuitemradio'?'aria-checked':'aria-pressed',String(b.dataset.tmView===view)));
  }

  /* ---------- your numbers ---------- */
  function checkMine(){
    const c=+ins.cores.value,l=+ins.logical.value,t=comp[source].topo||{};
    copyBtn.hidden=true;
    if(!(c>0&&l>0)){result.textContent='Type both numbers from the bottom right first.';result.className='tm-bad';return;}
    if(l<c){result.textContent='Logical processors can never be fewer than cores. Look again.';result.className='tm-bad';return;}
    if((t.cores&&c!==t.cores)||(t.logical&&l!==t.logical)){result.textContent='That is not what this window shows. Read "Cores" and "Logical processors" again.';result.className='tm-bad';return;}
    const per=l/c,perTxt=Number.isInteger(per)?String(per):per.toFixed(2);
    result.className='tm-good';
    result.textContent=`${l} ÷ ${c} = ${perTxt} thread${per===1?'':'s'} per core. `+(per===1?'Equal: no hyperthreading here, each core runs one thread.':`Not equal: each core runs ${perTxt} hardware threads (hyperthreading).`)+(t.groups?.length>1?` This chip also mixes ${t.groups.map(gp=>`${gp.cores} ${gp.name.toLowerCase()}`).join(' and ')} cores.`:'');
    copyBtn.hidden=!opts.onNote;
    copyBtn.dataset.note=`Task Manager (${source==='live'?'this Mac':'example PC'}): ${c} cores, ${l} logical processors, ${perTxt} per core, ${per===1?'equal':'not equal'}.`;
  }

  /* ---------- events ---------- */
  function openMenu(x,y){
    const box=root.querySelector('.tm').getBoundingClientRect();
    menu.hidden=false;
    menu.style.left=`${Math.min(x-box.left,box.width-menu.offsetWidth-4)}px`;menu.style.top=`${Math.min(y-box.top,box.height-menu.offsetHeight-4)}px`;
    menu.querySelector(`[data-tm-view="${view}"]`)?.focus();
  }
  const closeMenu=()=>{if(!menu.hidden){menu.hidden=true;}};
  graph.addEventListener('contextmenu',e=>{e.preventDefault();openMenu(e.clientX,e.clientY);});
  graph.addEventListener('keydown',e=>{if(e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10')){e.preventDefault();const r=graph.getBoundingClientRect();openMenu(r.left+24,r.top+24);}});
  menu.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();graph.focus();}});
  root.addEventListener('click',e=>{
    const src=e.target.closest('[data-tm-src]'),v=e.target.closest('[data-tm-view]');
    if(!e.target.closest('[data-tm-menu]'))closeMenu();
    if(src&&src.dataset.tmSrc!==source){source=src.dataset.tmSrc;result.textContent='';copyBtn.hidden=true;fillFacts();draw();}
    if(v){view=v.dataset.tmView;closeMenu();fillFacts();draw();}
    if(e.target.closest('[data-tm-check]'))checkMine();
    if(e.target===copyBtn&&opts.onNote)opts.onNote(copyBtn.dataset.note);
  });
  document.addEventListener('pointerdown',e=>{if(!menu.hidden&&!menu.contains(e.target))closeMenu();},true);
  root.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'&&e.target.matches('[data-tm-in]')){e.preventDefault();checkMine();}}); // page shortcuts stay out of the inputs
  if(typeof ResizeObserver==='function')new ResizeObserver(()=>draw()).observe(graph);

  /* ---------- loop: only while visible ---------- */
  function loop(){
    timer=0;
    if(!root.isConnected||busy)return;                        // left the page: stop until wake()
    if(document.hidden){timer=setTimeout(loop,POLL);return;}
    busy=true;
    tick().finally(()=>{busy=false;const warm=opts.live&&Number.isNaN(comp.live.overall?.[head]);if(root.isConnected&&!timer)timer=setTimeout(loop,warm?300:POLL);}); // first live reading needs a second one to compare
  }
  function wake(){fillFacts();draw();if(!timer&&!busy)loop();}
  fillFacts();
  return {root,wake};
}
