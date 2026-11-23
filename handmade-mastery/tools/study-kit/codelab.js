/* Code Lab: write, build and run course C/C++ on the Mac, laid out like Casey's screen:
   the editor on top, Visual Studio's Output pane, a black console window and Disassembly.
   One editor for both places: the Practice step embeds it (createCodeLab(root,{kit})) and
   /code shows it full window ({kit, global:true}). No autocomplete: indentation only.
   Saving goes through one queue, so an older save can never land after a newer one. */
function createCodeLab(root,opts){
  const o=opts||{};
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  root.classList.add('codelab');
  root.innerHTML=`<div class="cl-bar">
      <span class="cl-title"><span class="cl-dot" aria-hidden="true"></span><span data-cl="where">Loading…</span></span>
      <select data-cl="file" aria-label="File"></select>
      <button type="button" data-cl="new" title="Create a new .c, .cpp or .h file">+ New file</button>
      <span class="cl-status" data-cl="status" aria-live="polite"></span>
      <button type="button" data-cl="build" title="Compile and link (Ctrl+Shift+B)">Build <kbd>⌃⇧B</kbd></button>
      <button type="button" data-cl="run" class="cl-primary" title="Build, then run (F5)">▶ Run <kbd>F5</kbd></button>
      <button type="button" data-cl="asm" title="Show the x64 assembly the compiler made">Disassembly</button>
      ${o.fullLink?`<a class="cl-link" data-cl="full" target="codelab" href="/code?kit=${encodeURIComponent(o.kit||'')}">Full window ↗</a>`:''}
    </div>
    <div class="cl-editor"><div class="cl-gutter" aria-hidden="true">1</div><textarea class="cl-src" data-mic="off" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" aria-label="Code editor"></textarea></div>
    <div class="cl-panel">
      <div class="cl-tabs" role="tablist" aria-label="Results">
        <button type="button" role="tab" data-cltab="output" aria-selected="true">Output</button>
        <button type="button" role="tab" data-cltab="console" aria-selected="false">Console</button>
        <button type="button" role="tab" data-cltab="disasm" aria-selected="false">Disassembly</button>
        <span class="cl-target" data-cl="target"></span>
      </div>
      <pre class="cl-out" data-out="output" role="tabpanel"><span class="cl-empty">Build output and debug output (OutputDebugStringA) appear here, like Visual Studio's Output window.</span></pre>
      <div class="cl-console" data-out="console" role="tabpanel" hidden><div class="cl-console-title" data-cl="contitle">C:\\Windows\\system32\\cmd.exe</div><pre class="cl-out"><span class="cl-empty">Text your program prints with printf appears here.</span></pre></div>
      <pre class="cl-out" data-out="disasm" role="tabpanel" hidden><span class="cl-empty">Press Disassembly to see the machine instructions for this file.</span></pre>
    </div>`;
  const q=sel=>root.querySelector(`[data-cl="${sel}"]`),out=name=>root.querySelector(`[data-out="${name}"]`);
  const src=root.querySelector('.cl-src'),gutter=root.querySelector('.cl-gutter'),fileSel=q('file'),statusEl=q('status');
  const conOut=out('console').querySelector('.cl-out');
  let kit=o.kit||'',files=[],current='',saveTimer=null,busy=false,queue=Promise.resolve(),lineCount=0,loaded=false;
  const fileByName=n=>files.find(f=>f.name===n);
  const buildable=()=>/\.(c|cpp)$/.test(current);
  const setStatus=t=>{statusEl.textContent=t;};

  async function api(path,body){
    const r=await fetch(path,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{});
    const j=await r.json().catch(()=>({error:`error ${r.status}`}));
    if(!r.ok||j.error)throw new Error(j.error||`error ${r.status}`);
    return j;
  }
  // The gutter is rebuilt only when the number of lines changes, not on every key.
  function lines(){
    let n=1;for(let i=src.value.indexOf('\n');i!==-1;i=src.value.indexOf('\n',i+1))n++;
    if(n!==lineCount){lineCount=n;let t='1';for(let i=2;i<=n;i++)t+='\n'+i;gutter.textContent=t;}
    gutter.scrollTop=src.scrollTop;
  }
  function fillFiles(){
    fileSel.innerHTML=files.map(f=>`<option ${f.name===current?'selected':''}>${esc(f.name)}</option>`).join('');
    for(const id of ['build','run','asm'])q(id).disabled=busy||!buildable();
  }
  function openFile(name){
    current=name;src.value=fileByName(name)?.source??'';lineCount=0;lines();src.scrollTop=0;fillFiles();
    q('contitle').textContent=`C:\\handmade\\${kit.replace(/\//g,'\\')}\\${current.replace(/\.\w+$/,'')}.exe`;
    try{localStorage.setItem('codelab-file:'+kit,name);}catch{}
  }

  /* ---- saving: debounced, queued in order ---- */
  function save(){
    clearTimeout(saveTimer);saveTimer=null;
    if(!current||!loaded)return queue;
    const body={kit,file:current,source:src.value};
    const f=fileByName(current);if(f)f.source=body.source;
    queue=queue.then(()=>api('/api/code/save',body)).then(()=>{if(!saveTimer)setStatus('Saved');},e=>setStatus('Not saved: '+e.message));
    return queue;
  }
  function scheduleSave(){setStatus('Editing…');clearTimeout(saveTimer);saveTimer=setTimeout(save,700);}
  function flushBeacon(){
    if(saveTimer&&current&&loaded&&navigator.sendBeacon){clearTimeout(saveTimer);saveTimer=null;navigator.sendBeacon('/api/code/save',new Blob([JSON.stringify({kit,file:current,source:src.value})],{type:'application/json'}));}
  }

  async function newFile(){
    const name=(prompt('New file name (for example main.cpp):',files.length?'':'main.cpp')||'').trim();
    if(!name)return;
    if(!/^[A-Za-z0-9_][A-Za-z0-9_-]{0,60}\.(c|cpp|h)$/.test(name)){alert('Use a simple name ending in .c, .cpp or .h');return;}
    await save();
    if(!fileByName(name))files.push({name,source:''});
    files.sort((a,b)=>a.name.localeCompare(b.name));
    openFile(name);src.focus();save();
  }

  /* ---- editor keys: indentation only, no autocomplete ---- */
  function insert(text){if(!document.execCommand('insertText',false,text))src.setRangeText(text,src.selectionStart,src.selectionEnd,'end');}
  function shortcut(e){
    const mod=e.metaKey||e.ctrlKey;
    if(mod&&e.key.toLowerCase()==='s'){e.preventDefault();save();return true;}
    if(mod&&e.shiftKey&&e.key.toLowerCase()==='b'){e.preventDefault();act('build');return true;}
    if(e.key==='F5'||(mod&&e.key==='Enter')){e.preventDefault();act('run');return true;}
    return false;
  }
  src.addEventListener('keydown',e=>{
    e.stopPropagation();                         // the study page's own keys (Space for the video…) stay out of the editor
    if(shortcut(e))return;
    const mod=e.metaKey||e.ctrlKey;
    if(e.key==='Tab'){
      e.preventDefault();
      const v=src.value,s=src.selectionStart,en=src.selectionEnd;
      if(s===en&&!e.shiftKey){insert('    ');return;}
      const ls=v.lastIndexOf('\n',s-1)+1,block=v.slice(ls,en);
      const res=e.shiftKey?block.replace(/^( {1,4}|\t)/gm,''):block.replace(/^/gm,'    ');
      src.setSelectionRange(ls,en);insert(res);src.setSelectionRange(ls,ls+res.length);return;
    }
    if(e.key==='Enter'&&!mod&&!e.isComposing){
      const v=src.value,s=src.selectionStart,ls=v.lastIndexOf('\n',s-1)+1;
      e.preventDefault();insert('\n'+v.slice(ls,s).match(/^[ \t]*/)[0]);
    }
  });
  (o.global?document:root).addEventListener('keydown',e=>{if(e.target!==src)shortcut(e);});
  src.addEventListener('input',()=>{lines();scheduleSave();});
  src.addEventListener('scroll',()=>{gutter.scrollTop=src.scrollTop;},{passive:true});

  /* ---- results panel ---- */
  function showTab(name){
    root.querySelectorAll('.cl-tabs [data-cltab]').forEach(b=>{const on=b.dataset.cltab===name;b.setAttribute('aria-selected',String(on));if(on)b.classList.remove('has');});
    for(const id of ['output','console','disasm'])out(id).hidden=id!==name;
  }
  root.querySelector('.cl-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-cltab]');if(b)showTab(b.dataset.cltab);});
  const mark=tab=>{if(out(tab).hidden)root.querySelector(`[data-cltab="${tab}"]`).classList.add('has');};
  function diagHTML(log){
    return esc(log).split('\n').map(l=>{
      const m=l.match(/^([\w.-]+\.(?:c|cpp|h)):(\d+):(\d+): (error|warning|note)/);
      const cls=/\berror\b/.test(l)?'err':/\bwarning\b/.test(l)?'warn':'';
      const body=m?`<button type="button" class="cl-diag" data-file="${m[1]}" data-line="${m[2]}" title="Go to line ${m[2]}">${l}</button>`:l;
      return cls?`<span class="${cls}">${body}</span>`:body;
    }).join('\n');
  }
  out('output').addEventListener('click',e=>{
    const b=e.target.closest('.cl-diag');if(!b)return;
    if(b.dataset.file!==current&&fileByName(b.dataset.file)){save();openFile(b.dataset.file);}
    const n=+b.dataset.line,v=src.value.split('\n'),start=v.slice(0,n-1).reduce((a,l)=>a+l.length+1,0);
    src.focus();src.setSelectionRange(start,start+(v[n-1]||'').length);
    src.scrollTop=Math.max(0,(n-5)*parseFloat(getComputedStyle(src).lineHeight));
  });

  const FAILED='<span class="err">========== Build: 0 succeeded, 1 failed ==========</span>\n';
  async function act(action){
    if(busy||!buildable()||!loaded)return;
    busy=true;fillFiles();
    clearTimeout(saveTimer);saveTimer=null;
    const f=fileByName(current);if(f)f.source=src.value;
    const body={kit,file:current,source:src.value,action};
    setStatus(action==='asm'?'Compiling…':action==='run'?'Building and running…':'Building…');
    try{
      await queue;                               // the build saves the file too: let earlier saves land first
      const r=await api('/api/code/build',body);
      setStatus('Saved');
      if(action==='asm'){
        q('target').textContent=r.target?`Target: ${r.target}`:'';
        if(r.built){out('disasm').textContent=r.asm;showTab('disasm');}
        else{out('output').innerHTML=diagHTML(r.log)+'\n'+FAILED;showTab('output');}
        return;
      }
      let html=`<span class="dim">Build started: ${esc(r.file)}\n$ ${esc(r.command)}</span>\n`;
      if(r.log)html+=diagHTML(r.log)+'\n';
      html+=r.built?`<span class="good">========== Build: 1 succeeded, 0 failed ==========</span>${r.buildMs!=null?`<span class="dim"> (${r.buildMs} ms)</span>`:''}\n`:FAILED;
      if(r.ran){
        if(r.debug)html+=`\n${esc(r.debug)}${r.debug.endsWith('\n')?'':'\n'}`;
        if(r.note)html+=`<span class="err">${esc(r.note)}</span>\n`;
        const code=r.exitCode<0?'(crashed)':`${r.exitCode} (0x${(r.exitCode>>>0).toString(16)})`;
        html+=`<span class="dim">The program '${esc(current.replace(/\.\w+$/,''))}.exe' has exited with code ${code}.</span>\n`;
        conOut.innerHTML=r.console?esc(r.console):'<span class="cl-empty">The program printed nothing to the console.</span>';
        if(r.console)mark('console');
      }
      out('output').innerHTML=html;showTab('output');
    }catch(e){setStatus('');out('output').innerHTML=`<span class="err">${esc(e.message)}</span>`;showTab('output');}
    finally{busy=false;fillFiles();}
  }
  q('build').onclick=()=>act('build');
  q('run').onclick=()=>act('run');
  q('asm').onclick=()=>act('asm');
  q('new').onclick=newFile;
  fileSel.onchange=()=>{const next=fileSel.value;save();openFile(next);src.focus();};
  window.addEventListener('pagehide',flushBeacon);

  /* Another window (the full Code Lab, VS Code) may have changed the files: pick that up when
     you come back, unless you have unsaved typing here. */
  async function refresh(){
    if(!loaded||saveTimer||busy)return;
    try{
      const r=await api('/api/code?kit='+encodeURIComponent(kit));
      if(saveTimer||busy||!r.files.length)return;
      const mine=src.value,disk=r.files.find(f=>f.name===current);
      files=r.files;
      if(!disk)files.push({name:current,source:mine});
      if(disk&&disk.source!==mine){const top=src.scrollTop;openFile(current);src.scrollTop=top;gutter.scrollTop=top;}
      else fillFiles();
    }catch{}
  }
  window.addEventListener('focus',refresh);

  async function load(){
    try{
      const r=await api('/api/code?kit='+encodeURIComponent(kit));
      kit=r.kit;files=r.files;loaded=true;
      q('where').textContent=`${kit} · saved in ${r.folder}/`;
      if(q('full'))q('full').href=`/code?kit=${encodeURIComponent(kit)}`;
      o.onKit?.(kit);
      if(!r.compiler)out('output').innerHTML='<span class="err">clang was not found. Run: xcode-select --install</span>';
      let last='';try{last=localStorage.getItem('codelab-file:'+kit)||'';}catch{}
      if(!files.length)files=[{name:'main.cpp',source:''}];
      openFile(fileByName(last)?last:files[0].name);
      setStatus(r.files.length?'':'New file: main.cpp (saved when you type)');
    }catch(e){q('where').textContent='Could not load: '+e.message;}
  }
  load();
  return {root,refresh,save,focus:()=>src.focus()};
}
