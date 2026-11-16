/* Experimental presentation only. Core grading, media and saving remain intact. */
function experimentSupport(b){
  const deferred=b.deferred||[];
  return `<aside class="learning-tools" aria-label="Supporting tools"><section class="tool-card"><h2>${uiIcon('book')} Study support</h2><div class="tool-body"><button class="btn ghost" data-ui="full-explanation">Explanation &amp; Listen</button><button class="btn ghost" data-ui="analogy">Analogy</button><button class="btn ghost" data-ui="graphics">Graphics</button><button class="btn ghost" data-ui="code-notes">Code &amp; Pseudocode</button><button class="btn ghost" data-ui="flashcards" ${(b.cards||[]).length?'':'disabled'}>Flashcards · optional</button><hr class="tool-divider"><button class="btn ghost" data-ui="ask-claude">Ask Claude</button><button class="btn ghost" data-ui="my-notes">My notes${(S.myNotes?.[b.id]?.text||'').trim()?'<span class="tool-mark" aria-label=" (written)">✓</span>':''}</button></div></section><section class="tool-card"><h2>${uiIcon('layers')} Deferred Topics</h2><div class="tool-body"><p>Ideas for later in the course.</p>${deferred.length?`<ul class="deferred-list">${deferred.map((text,i)=>`<li><button data-ui="deferred" data-index="${i}">${esc(deferredTitle(text))}</button></li>`).join('')}</ul>`:'<p class="empty-tool">No deferred topics in this part.</p>'}</div></section></aside>`;
}
const experimentBaseStep=renderStepRaw;
renderStepRaw=function(b,key){
  if(key==='watch')return `${videoPanel(b)}<p class="experiment-focus"><strong>Focus:</strong> ${md(b.focus||b.oneLiner||b.summary)}</p><p>When Casey codes, pause and write the change yourself. Predict, build and check the result. That work counts as your practice.</p><details class="experiment-parking"><summary>Park a question for later</summary><div class="row"><input type="text" id="parkin" placeholder="Your question…" aria-label="Question to park"><button class="btn ghost" id="parkgo">Park it</button></div><ul class="plist" id="plist">${parkItems(b,false)}</ul></details>`;
  if(key==='experiment')return `<details class="experiment-prediction"><summary>Predict the result · optional</summary><p>${md(b.guess||checkFor(b).q)}</p><textarea data-prediction="${b.id}" placeholder="What do you expect to happen?">${esc(S.predictions?.[b.id]||'')}</textarea></details>${experimentBaseStep(b,key)}`;
  return experimentBaseStep(b,key);
};
fullExplanation=function(b){
  const compact=explanationPanel(b).replace('data-ui="full-explanation"','data-ui="detail-explanation"');
  const listen=audioPanel(b).replace(/<div class="card-title">[\s\S]*?<\/div><p class="card-subtitle">[\s\S]*?<\/p>/,'');
  openDialog('Explanation & Listen',compact+listen+askBox(b,'explain'));
  const audio=$('#summary-audio');if(audio)audio.playbackRate=S.ttsRate||1;
};
renderPath=function(){
  if(S.brk)return renderBreak();if(S.stopped)return renderStopped();
  if(S.cur==='__qa')return `<section class="block"><h2>Questions &amp; answers</h2>${D.qa?.html||''}<div id="nextbox"></div></section>`;
  const b=activeLesson();
  if(!STEPS.some(([key])=>key===(referenceStep||S.step)))referenceStep=null;
  const view=referenceStep||S.step;
  const label=view==='watch'?'I watched it → Check':view==='recall'?'Continue to practice →':'Finish part';
  return `<header class="lesson-header"><div><div class="eyebrow">Part ${idxOf(b)+1} of ${D.blocks.length}</div><h1>Day 1 — ${esc(b.title)}</h1></div><span class="tsr">▶ ${b.start} – ${b.end}</span></header>${navigationHTML(b)}<div class="lesson-columns"><div id="lesson-panel" role="tabpanel" aria-labelledby="study-tab-${view}"><section class="frost-card reading-pane study-primary"><div class="pane" id="pane">${renderStep(b,view)}</div>${stepOpen(b,view)?`<div class="next"><button class="btn amber" data-ui="advance-view">${label}</button></div>`:''}</section></div>${experimentSupport(b)}</div>`;
};
document.addEventListener('click',e=>{
  const button=e.target.closest('[data-ui]');if(!button)return;const b=activeLesson();
  if(button.dataset.ui==='code-notes')openDialog('Code & Pseudocode',withWords(b.code||'<p>No code in this part.</p>',b.say?.code)+askBox(b,'code'));
  if(button.dataset.ui==='detail-explanation')openDialog('Full explanation',renderStepRaw(b,'explain')+askBox(b,'explain'));
  if(button.dataset.ui==='analogy')openDialog('Analogy',analogyView(b)+(b.mistake?`<div class="support-callout"><strong>Common beginner mistake:</strong> ${md(b.mistake)}</div>`:'')+askBox(b,'analogy'));
  if(button.dataset.ui==='graphics')openDialog('Graphics',graphicsView(b)+askBox(b,'graphics'));
});
referenceStep=STEPS.some(([key])=>key===S.lessonViews?.[S.cur])?S.lessonViews[S.cur]:S.step;

/* Study support: the analogy on its own, and the drawings made for this part. */
function analogyView(b){
  const a=explanationData(b).analogy;
  return a?`<div class="analogy-view">${xcSign(a.title)}<p><strong>${esc(a.title)}:</strong> ${md(a.text)}</p></div>`:'<p class="empty-tool">No analogy for this part yet.</p>';
}
function graphicsView(b){
  const parts=[];
  if(b.anim)parts.push(`<figure class="anim"><video src="${esc(b.anim)}" controls playsinline preload="metadata"></video></figure>`);
  if(b.visual)parts.push(`<div class="graphics-visual">${b.visual}</div>`);
  return parts.join('')||'<p class="empty-tool">No drawing for this part yet. New drawings and animations made with <code>/animate</code> will appear here.</p>';
}

/* Compact course list: one line per part. Click a row to open that part. */
courseTreeHTML=function(){
  const f=frontier();
  return `<ol class="part-list">${D.blocks.map((part,i)=>{
    const key=part.id,done=!!S.completed[key],current=key===S.cur,locked=i>f;
    const state=done?(checked(part)?'checked':'finished'):current?'current':locked?'complete the earlier parts first':'open';
    return `<li><button class="part-row${done?' is-finished':''}${current?' is-current':''}" data-blk="${key}" ${current?'aria-current="page"':''} ${locked?'disabled':''} title="Part ${i+1} — ${esc(part.title)} (${part.start}–${part.end})" aria-label="Part ${i+1}: ${esc(part.title)}, ${state}"><span class="part-mark" aria-hidden="true">${done?'✓':i+1}</span><span class="part-name">${esc(part.title)}</span></button></li>`;
  }).join('')}</ol>`;
};

/* Video: click the picture to pause or continue, a clear gear and a readable speed menu. */
const GEAR_ICON=svg('M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.47.47 0 0 0-.47.41l-.36 2.54a7.4 7.4 0 0 0-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54a7 7 0 0 0 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.48.48 0 0 0-.12-.61zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z');
const VIDEO_SPEEDS=[0.75,1,1.25,1.5,1.75,2];
const gearButton=vw.querySelector('[data-ui="video-settings"]');
gearButton.innerHTML=`${GEAR_ICON}<span class="speed-badge" hidden></span>`;
settings.innerHTML=`<div class="vs-head"><span id="vs-label">Playback speed</span><span class="vs-current" data-v="speed" aria-hidden="true"></span></div><div class="vs-speeds" role="radiogroup" aria-labelledby="vs-label">${VIDEO_SPEEDS.map(r=>`<button type="button" role="radio" data-speed="${r}">${r}×</button>`).join('')}</div><button type="button" class="vs-file" data-ui="choose-video">Choose video file…</button>`;
const tapFlash=document.createElement('div');tapFlash.className='tap-flash';tapFlash.setAttribute('aria-hidden','true');vw.append(tapFlash);
function showVideoSpeed(){
  const rate=S.speed||1;
  settings.querySelectorAll('[data-speed]').forEach(b=>{const on=+b.dataset.speed===rate;b.setAttribute('aria-checked',String(on));b.tabIndex=on?0:-1;});
  settings.querySelector('.vs-current').textContent=rate+'×';
  const badge=gearButton.querySelector('.speed-badge');badge.hidden=rate===1;badge.textContent=rate+'×';
  gearButton.setAttribute('aria-label',`Video settings, speed ${rate}×`);
}
function setVideoSpeed(rate){S.speed=rate;vid.playbackRate=rate;save();showVideoSpeed();}
function closeVideoSettings(focusGear){if(settings.hidden)return;settings.hidden=true;gearButton.setAttribute('aria-expanded','false');if(focusGear)gearButton.focus();}
settings.addEventListener('click',e=>{const b=e.target.closest('[data-speed]');if(b){setVideoSpeed(+b.dataset.speed);return;}if(e.target.closest('[data-ui="choose-video"]'))closeVideoSettings(false);});
settings.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.stopPropagation();closeVideoSettings(true);return;}
  const b=e.target.closest('[data-speed]');if(!b||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
  e.preventDefault();const i=VIDEO_SPEEDS.indexOf(+b.dataset.speed),step=e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1;
  const next=VIDEO_SPEEDS[(i+step+VIDEO_SPEEDS.length)%VIDEO_SPEEDS.length];setVideoSpeed(next);settings.querySelector(`[data-speed="${next}"]`).focus();
});
document.addEventListener('click',e=>{if(!e.target.closest('.video-settings,[data-ui="video-settings"]'))closeVideoSettings(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeVideoSettings(false);});
vid.addEventListener('click',e=>{
  if(!settings.hidden){e.stopPropagation();closeVideoSettings(false);return;}
  if(!videoURL){chooseVideo();return;}
  vw.querySelector('[data-v="play"]').click();
  // Paused: the big play button comes back by itself, except in full screen, so flash only where it helps.
  if(vid.paused&&!document.fullscreenElement)return;
  tapFlash.innerHTML=vid.paused?ICON.pause:ICON.play;tapFlash.classList.remove('show');void tapFlash.offsetWidth;tapFlash.classList.add('show');
});
vid.addEventListener('ratechange',showVideoSpeed);
showVideoSpeed();

/* ---------- Ask Claude and My notes: help and notes that stay with each part ----------
   Questions and answers use the same per-part thread as the engine's "Ask about this part" (S.notes).
   Written notes, their summary and its voice file live in S.myNotes; the whole-episode summary in S.episodeNotes.
   With the helper (./study, or ./experiment/study in the experiment copy) running, notes are also written to <day>/notes.md so they can be read outside the page. */
// The helper can replace S after start-up (saved progress), so always reach these through the getters.
const myNotes=()=>S.myNotes||(S.myNotes={});
const episodeNotes=()=>S.episodeNotes||(S.episodeNotes={});
// TODO(human): tune the quick questions to the ones you really ask.
const ASK_CHIPS={
  part:["I didn't understand this part","What is the most important idea?","What should I remember for later?"],
  explain:['Explain it more simply','Give me a real example','How does this connect to the code?'],
  analogy:['Explain the analogy more','Give me another analogy','Where does the analogy stop working?'],
  graphics:['Walk me through this picture','What should I notice here?'],
  code:['Explain this code line by line','What happens if I change one line?']
};
const ASK_ABOUT={part:'this part',explain:'the explanation',analogy:'the analogy',graphics:'the drawing',code:'the code'};
let askPending=null,voiceReady=null,notesFileError='';
const askErrors={},notesPending={},notesErrors={};
const nowISO=()=>new Date().toISOString();
const niceTime=iso=>{const d=new Date(iso);return isNaN(d)?'':d.toLocaleString([], {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});};
// The same file runs in the main app and in experiment/; only the start command and labels differ.
const IN_EXPERIMENT=String(D.storageKey||'').endsWith('-experiment');
const START_CMD=IN_EXPERIMENT?'./experiment/study':'./study';
const claudeMissing=()=>helperReady?'Claude Code was not found on this computer, so Claude can’t answer here.':`Start the page with <code>${START_CMD}</code> so Claude can answer here.`;
function richText(text){
  return String(text||'').trim().split(/\n\s*\n/).map(block=>{
    const lines=block.split('\n').map(l=>l.trim()).filter(Boolean);
    if(lines.length&&lines.every(l=>/^[-•*]\s+/.test(l)))return `<ul>${lines.map(l=>`<li>${md(l.replace(/^[-•*]\s+/,''))}</li>`).join('')}</ul>`;
    return `<p>${lines.map(l=>md(l)).join('<br>')}</p>`;
  }).join('');
}
function setIfChanged(el,html){if(el&&el.dataset.html!==html){el.innerHTML=html;el.dataset.html=html;}} // untouched nodes keep playback and focus

/* Ask Claude */
function askThread(b){return S.notes[b.id]=S.notes[b.id]||[];}
function askMessagesHTML(b,from){
  const log=S.notes[b.id]||[],out=[];
  log.forEach((m,i)=>{
    const origin=m.from||'part';if(from!=='part'&&origin!==from)return;
    const tag=from==='part'&&origin!=='part'?`<span class="ask-tag">about ${ASK_ABOUT[origin]||'this part'}</span>`:'';
    if(m.r==='user')out.push(`<div class="ask-msg is-user"><span class="ask-who">You</span>${tag}<p>${esc(m.c)}</p>${m.failed?`<div class="ask-actions"><span>Not answered.</span> <button type="button" class="quiet-link" data-ui="ask-retry" data-index="${i}">Ask again</button></div>`:''}</div>`);
    else out.push(`<div class="ask-msg is-claude"><span class="ask-who">Claude</span><div class="ask-text">${richText(m.c)}</div><div class="ask-actions"><button type="button" class="quiet-link" data-ui="ask-save-note" data-index="${i}" ${m.saved?'disabled':''}>${m.saved?'Saved to my notes ✓':'Save to my notes'}</button></div></div>`);
  });
  if(askPending){
    if(askPending.id===b.id&&(from==='part'||askPending.from===from))out.push(`<div class="ask-msg is-claude is-thinking" role="status"><span class="ask-who">Claude</span><p>Thinking<span class="ask-dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span></p></div>`);
    else{const pb=blockById(askPending.id);out.push(`<p class="ask-empty" role="status">Claude is still answering your question about ${ASK_ABOUT[askPending.from]} (Part ${pb?idxOf(pb)+1:''}). You can ask here when it is done.</p>`);}
  }
  const err=askErrors[b.id+':'+from];if(err)out.push(`<p class="ask-error" role="alert">${esc(err)}</p>`);
  return out.join('')||`<p class="ask-empty">Ask anything you did not understand. The answer stays here with this part.</p>`;
}
function askControlsOff(){return !!askPending||!sample;}
function askBox(b,from){
  const off=askControlsOff()?'disabled':'';
  return `<section class="ask-box" data-ask-part="${b.id}" data-ask-from="${from}"><h3 class="ask-title">${uiIcon('chat')} Ask Claude about ${ASK_ABOUT[from]}</h3><div class="ask-thread" aria-live="polite">${askMessagesHTML(b,from)}</div><div class="ask-chips">${ASK_CHIPS[from].map(q=>`<button type="button" class="ask-chip" data-ask-chip="${esc(q)}" ${off}>${esc(q)}</button>`).join('')}</div><div class="ask-compose"><textarea class="ask-input" rows="2" placeholder="Type or speak your question…" aria-label="Your question about ${ASK_ABOUT[from]}"></textarea><button type="button" class="btn amber" data-ui="ask-send" ${off}>Ask</button></div><p class="dialog-help ask-help">${sample?'Enter sends · Shift+Enter starts a new line.':claudeMissing()}</p></section>`;
}
function askContext(b,from){
  if(from==='analogy'){const a=explanationData(b).analogy;return a?`THE ANALOGY HE IS LOOKING AT: ${a.title}: ${plainText(md(a.text))}`:'';}
  if(from==='code')return `THE CODE HE IS LOOKING AT:\n${codeText(b).slice(0,2500)}`;
  if(from==='graphics')return `THE DRAWING HE IS LOOKING AT (as text): ${plainText(b.visual||'').slice(0,2000)}`;
  if(from==='explain')return `THE IDEA IN ONE SENTENCE: ${plainText(md(b.oneLiner||b.summary||''))}`;
  return '';
}
function askRules(b,from){
  const practice=plainText(md(b.practice||''));
  return `You tutor Zain through one part of a programming video, inside his study page. English is not his first language: use plain, simple English and short sentences. He is asking about ${ASK_ABOUT[from]}. Answer only his question, directly, in under 120 words. Stay inside this part. If he asks about something Casey parks for later, say so in one line and give at most a one-sentence preview. Use \`backticks\` for code names. No headings.${practice?`\nHIS PRACTICE TASK (he must write it himself: never give the answer or the code for it; give one short hint or ask one guiding question instead): ${practice}`:''}\n${blockContext(b)}\n${askContext(b,from)}`;
}
function askPrompt(b,from,history,text){
  const past=history.map(m=>`${m.r==='user'?'ZAIN':'TUTOR'}: ${m.c}`).join('\n\n');
  return `${askRules(b,from)}\n\n${past?`EARLIER QUESTIONS AND ANSWERS ABOUT THIS PART (oldest first):\n${past}\n\n`:''}ZAIN'S NEW QUESTION: ${text}\n\nAnswer only the new question.`;
}
function refreshAsk(){
  const keep=document.activeElement,keepBox=keep?.closest?.('.ask-box');
  document.querySelectorAll('.ask-box').forEach(box=>{
    const b=blockById(box.dataset.askPart);if(!b)return;
    setIfChanged(box.querySelector('.ask-thread'),askMessagesHTML(b,box.dataset.askFrom));
    box.querySelectorAll('[data-ask-chip],[data-ui="ask-send"]').forEach(x=>{x.disabled=askControlsOff();});
    setIfChanged(box.querySelector('.ask-help'),sample?'Enter sends · Shift+Enter starts a new line.':claudeMissing());
  });
  if(keepBox&&!keepBox.contains(document.activeElement)&&(!keep.isConnected||keep.disabled))keepBox.querySelector('.ask-input')?.focus({preventScroll:true}); // focus never falls back to the page
}
function showNewest(box){const last=box?.querySelector('.ask-thread>:last-child');if(last)last.scrollIntoView({block:'nearest'});}
async function askClaude(box,text){
  const b=blockById(box.dataset.askPart),from=box.dataset.askFrom;text=String(text||'').trim();
  if(!b||!text||askPending||!sample)return false;
  delete askErrors[b.id+':'+from];
  const history=askThread(b).filter(m=>!m.failed).slice(-6),question={r:'user',c:text,from,at:nowISO()};
  askThread(b).push(question);save();
  askPending={id:b.id,from};refreshAsk();showNewest(box);
  try{
    const r=await sample(askPrompt(b,from,history,text),{cache:false});
    askThread(b).push({r:'assistant',c:String(r.text||'').trim()||'(No answer. Try asking again.)',q:text,from,at:nowISO()});
  }catch(err){question.failed=true;askErrors[b.id+':'+from]=err.text||err.message||"Couldn't answer this time. Try again.";}
  finally{
    // The helper may have replaced S while Claude was thinking; keep the question in the live thread.
    const live=askThread(b);if(!live.includes(question))live.splice(Math.max(0,live.length-(question.failed?0:1)),0,question);
    save();askPending=null;refreshAsk();showNewest(document.querySelector(`.ask-box[data-ask-part="${b.id}"][data-ask-from="${from}"]`));
  }
  return true;
}
function saveAnswerToNotes(b,index){
  const log=S.notes[b.id]||[],answer=log[index];if(!answer||answer.r!=='assistant'||answer.saved)return;
  let q=answer.q;if(q===undefined){for(let i=index-1;i>=0;i--){if(log[i].r==='user'){q=log[i].c;break;}}} // older entries have no stored question
  const n=myNotes()[b.id]=myNotes()[b.id]||{text:''};
  n.text=`${(n.text||'').trim()}${(n.text||'').trim()?'\n\n':''}${q?`Q: ${q}\n`:''}A: ${answer.c}`;n.updated=nowISO();
  answer.saved=true;save();scheduleNotesFile();refreshAsk();updateNotesMark(b);
}

/* My notes */
function notesFor(id){return (S.myNotes||{})[id]||{};}
function holderFor(key){return key==='episode'?episodeNotes():notesFor(key);}
function episodeSource(){return D.blocks.map(x=>(notesFor(x.id).text||'').trim()).join('\n␞\n');}
function noteSource(key){return key==='episode'?episodeSource():(notesFor(key).text||'').trim();}
function summaryStale(key){const h=holderFor(key);if(!h.summary)return false;return h.basedOn!==undefined?h.basedOn!==noteSource(key):!!h.stale;}
function summarySlots(key){return `<div class="notes-summary" data-ns-wrap="${key}" hidden><h4>${uiIcon('star')} Summary <small data-ns-time="${key}"></small></h4><div data-ns-text="${key}"></div><p class="dialog-help" data-ns-stale="${key}" hidden>Your notes changed after this summary. Summarize again to include the new parts.</p><div data-ns-audio="${key}"></div></div><div data-ns-msg="${key}" tabindex="-1"></div>`;}
function fillSummary(key){
  const q=sel=>document.querySelector(`#dialog-body [${sel}="${key}"]`),wrap=q('data-ns-wrap');if(!wrap)return;
  const h=holderFor(key),pending=notesPending[key];
  wrap.hidden=!h.summary||pending==='summary';
  setIfChanged(q('data-ns-time'),h.summaryAt?esc(niceTime(h.summaryAt)):'');
  setIfChanged(q('data-ns-text'),h.summary?richText(h.summary):'');
  q('data-ns-stale').hidden=!summaryStale(key);
  setIfChanged(q('data-ns-audio'),pending==='voice'?'<p class="notes-working" role="status">Making the voice summary… (this can take up to a minute)</p>':h.audio?`<audio class="notes-audio" controls preload="none" src="${esc(h.audio)}" aria-label="Voice summary"></audio>`:'');
  setIfChanged(q('data-ns-msg'),pending==='summary'?'<p class="notes-working" role="status">Claude is summarizing your notes…</p>':notesErrors[key]?`<p class="ask-error" role="alert">${esc(notesErrors[key])}</p>`:'');
}
function notesActionsHTML(key,kind,hasText){
  const h=holderFor(key),busy=!!notesPending[key],ai=!!sample,voice=voiceReady!==false&&helperReady;
  const aiTip=ai?'':` title="${helperReady?'Claude Code was not found on this computer':`Start ${START_CMD} so Claude can summarize`}"`;
  return `<button type="button" class="btn amber" data-ui="${kind}-summarize" ${busy||!hasText||!ai?'disabled':''}${aiTip}>${h.summary?'Summarize again':'Summarize with Claude'}</button><button type="button" class="btn ghost" data-ui="${kind}-voice" ${busy||!h.summary||!voice?'disabled':''} title="${voice?'Read the summary aloud with the study voice':`Voice needs ${START_CMD} and the Kokoro voice setup`}">${h.audio?'Make the voice again':'Make voice summary'}</button>`;
}
function episodeHasNotes(){return D.blocks.some(x=>(notesFor(x.id).text||'').trim());}
function notesPathHTML(b){
  return `<section class="notes-path" aria-label="Notes for every part"><h3>${uiIcon('list')} Your notes path · Day 1</h3><ol>${D.blocks.map((x,i)=>{const t=(notesFor(x.id).text||'').trim(),open=t||x.id===b.id||unlocked(x);return `<li><button type="button" class="notes-path-row${x.id===b.id?' is-here':''}${t?' has-notes':''}" data-notes-open="${x.id}" ${open?'':'disabled'} ${x.id===b.id?'aria-current="true"':''}><span class="part-mark" aria-hidden="true">${t?'✓':i+1}</span><span class="np-text"><span class="np-title">Part ${i+1} — ${esc(x.title)}</span><span class="np-preview" data-np-preview="${x.id}">${t?esc(t.split('\n')[0].slice(0,90)):'No notes yet'}</span></span></button></li>`;}).join('')}</ol><div class="episode-box"><div class="row notes-actions" data-notes-actions="episode">${notesActionsHTML('episode','episode',episodeHasNotes())}</div>${summarySlots('episode')}</div></section>`;
}
function notesStatus(b){const n=notesFor(b.id);return (n.updated?'Saved '+niceTime(n.updated):'Not written yet')+(notesFileError?' · notes.md not updated: '+notesFileError:'');}
function notesView(b){
  const n=notesFor(b.id);
  return `<section class="notes-pane" data-notes-part="${b.id}"><div class="notes-head"><h3>${uiIcon('book')} Part ${idxOf(b)+1} — ${esc(b.title)}</h3><span class="notes-status" aria-live="polite">${esc(notesStatus(b))}</span></div><textarea class="notes-text" data-mynotes="${b.id}" rows="8" aria-label="Your notes for part ${idxOf(b)+1}" placeholder="Write what matters: the main idea in your own words, what confused you, what to remember later…">${esc(n.text||'')}</textarea><div class="row notes-actions" data-notes-actions="${b.id}">${notesActionsHTML(b.id,'notes',!!(n.text||'').trim())}</div>${summarySlots(b.id)}</section>${notesPathHTML(b)}`;
}
function openNotes(b){openDialog('My notes',notesView(b));refreshNotes();checkVoice();}
function refreshNotes(){
  const pane=document.querySelector('#dialog-body .notes-pane');if(!pane)return;
  const b=blockById(pane.dataset.notesPart),n=notesFor(b.id);
  const pressed=document.activeElement?.closest?.('.notes-actions [data-ui]'),pressedUi=pressed?.dataset.ui;
  setIfChanged(pane.querySelector(`[data-notes-actions="${b.id}"]`),notesActionsHTML(b.id,'notes',!!(n.text||'').trim()));
  setIfChanged(document.querySelector('#dialog-body [data-notes-actions="episode"]'),notesActionsHTML('episode','episode',episodeHasNotes()));
  fillSummary(b.id);fillSummary('episode');
  const status=pane.querySelector('.notes-status');if(status&&status.textContent!==notesStatus(b))status.textContent=notesStatus(b);
  const t=(n.text||'').trim(),preview=document.querySelector(`#dialog-body [data-np-preview="${b.id}"]`);if(preview)preview.textContent=t?t.split('\n')[0].slice(0,90):'No notes yet';
  if(pressedUi&&!pressed.isConnected){ // the row was rebuilt: put focus back on the same button, or on its status line while it works
    const again=document.querySelector(`#dialog-body [data-ui="${pressedUi}"]`),key=pressedUi.startsWith('episode')?'episode':b.id;
    if(again&&!again.disabled)again.focus({preventScroll:true});
    else{focusReturn=pressedUi;document.querySelector(`#dialog-body [data-ns-msg="${key}"]`)?.focus({preventScroll:true});}
  }else if(focusReturn&&document.activeElement?.matches?.('[data-ns-msg]')){ // the work finished: back to the button that started it
    const again=document.querySelector(`#dialog-body [data-ui="${focusReturn}"]`);
    if(again&&!again.disabled){again.focus({preventScroll:true});focusReturn=null;}
  }
}
let focusReturn=null;
function updateNotesMark(b){const btn=document.querySelector('[data-ui="my-notes"]');if(!btn||b.id!==activeLesson().id)return;const has=!!(notesFor(b.id).text||'').trim(),mark=btn.querySelector('.tool-mark');if(has&&!mark)btn.insertAdjacentHTML('beforeend','<span class="tool-mark" aria-label=" (written)">✓</span>');if(!has&&mark)mark.remove();}
async function checkVoice(){
  if(voiceReady!==null||!helperReady)return;
  try{voiceReady=!!(await (await fetch('/api/ping')).json()).voice;}catch(e){voiceReady=false;}
  refreshNotes();
}
async function summarize(key,prompt){
  if(!sample||notesPending[key])return;
  const basedOn=noteSource(key);
  notesPending[key]='summary';delete notesErrors[key];refreshNotes();
  try{
    const r=await sample(prompt,{cache:false}),h=key==='episode'?episodeNotes():(myNotes()[key]=myNotes()[key]||{text:''}); // looked up after the wait: S may have been replaced
    h.summary=String(r.text||'').trim();h.summaryAt=nowISO();h.basedOn=basedOn;delete h.stale;delete h.audio;save();scheduleNotesFile();
  }catch(err){notesErrors[key]=err.text||err.message||"Couldn't summarize this time. Try again.";}
  finally{delete notesPending[key];refreshNotes();}
}
const SUMMARY_RULES=`Summarize Zain's own study notes. Keep his key points and his words where possible. Plain, simple English (English is not his first language). Write 3 to 6 short lines, each starting with "- ". Do not add new topics. If a note is clearly wrong, add one last line starting "- Check:" with the correct idea in one sentence.`;
function summarizePart(b){
  const text=(notesFor(b.id).text||'').trim();if(!text)return;
  return summarize(b.id,`${SUMMARY_RULES}\n${blockContext(b)}\n\nHIS NOTES FOR THIS PART:\n${text.slice(0,6000)}`);
}
function summarizeEpisode(){
  const rows=D.blocks.map((x,i)=>[x,(notesFor(x.id).text||'').trim(),i]).filter(r=>r[1]);if(!rows.length)return;
  return summarize('episode',`${SUMMARY_RULES} This covers a whole episode: group the lines by idea, not by part, and keep it under 10 lines.\nVIDEO: "${D.title}".\n\n${rows.map(([x,t,i])=>`PART ${i+1} (${x.title}):\n${t.slice(0,2500)}`).join('\n\n')}`);
}
async function makeVoice(key){
  const summary=holderFor(key).summary;if(!helperReady||!summary||notesPending[key])return;
  notesPending[key]='voice';delete notesErrors[key];refreshNotes();
  try{
    const r=await (await fetch('/api/speak',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kit:kitPath,id:key,text:summary.replace(/^\s*[-•*]\s+/gm,'')})})).json();
    if(r.error)throw new Error(r.error);
    const h=holderFor(key);if(h.summary===summary){h.audio=r.file;save();scheduleNotesFile();} // ignore a voice for a summary that has since changed
  }catch(err){notesErrors[key]=err.message||'Could not make the voice summary.';}
  finally{delete notesPending[key];refreshNotes();}
}
function notesMarkdown(){
  const ep=episodeNotes(),out=[`# My notes — ${D.title}`,'',`_Written in the study page${IN_EXPERIMENT?' (experiment)':''}. Last saved: ${new Date().toISOString().slice(0,10)}_`,''];
  if(ep.summary)out.push('## Whole episode summary','',ep.summary,'');
  D.blocks.forEach((x,i)=>{const n=notesFor(x.id);if(!(n.text||'').trim()&&!n.summary)return;out.push(`## Part ${i+1} — ${x.title} (${x.start}–${x.end})`,'',(n.text||'').trim());if(n.summary)out.push('','**Summary**','',n.summary);out.push('');});
  return out.join('\n');
}
let notesFileTimer=null;
function scheduleNotesFile(){
  if(!helperReady)return;clearTimeout(notesFileTimer);
  notesFileTimer=setTimeout(async()=>{
    let problem='';
    try{const r=await fetch('/api/notes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kit:kitPath,markdown:notesMarkdown()})});if(!r.ok)problem=(await r.json().catch(()=>({}))).error||`error ${r.status}`;}
    catch(e){problem='the helper is not answering';}
    if(problem!==notesFileError){notesFileError=problem;refreshNotes();}
  },1500);
}
// When the helper swaps in saved progress, keep notes and questions written in the first seconds.
let notesOwner=S;
function adoptEarlyNotes(){
  if(S===notesOwner)return;const old=notesOwner;notesOwner=S;let changed=false;
  for(const [id,n] of Object.entries(old.myNotes||{})){const cur=(S.myNotes||{})[id];if(!cur||(n.updated||'')>(cur.updated||'')){myNotes()[id]=n;changed=true;}}
  for(const [id,log] of Object.entries(old.notes||{})){const cur=(S.notes||{})[id]||[];if(log.length>cur.length){S.notes[id]=log;changed=true;}}
  if((old.episodeNotes?.summaryAt||'')>(S.episodeNotes?.summaryAt||'')){S.episodeNotes=old.episodeNotes;changed=true;}
  if(changed)save();
}
const notesBaseRender=render;
render=function(){adoptEarlyNotes();notesBaseRender();};

document.addEventListener('input',e=>{
  const id=e.target.dataset?.mynotes;if(!id)return;
  adoptEarlyNotes();
  const n=myNotes()[id]=myNotes()[id]||{text:''};n.text=e.target.value;n.updated=nowISO();
  save();scheduleNotesFile();refreshNotes();const b=blockById(id);if(b)updateNotesMark(b);
});
document.addEventListener('keydown',e=>{
  if(!e.target.classList?.contains('ask-input')||e.key!=='Enter'||e.shiftKey||e.isComposing)return;
  e.preventDefault();e.target.closest('.ask-box')?.querySelector('[data-ui="ask-send"]')?.click();
});
$('#study-dialog').addEventListener('close',()=>{$('#dialog-body').querySelectorAll('audio,video').forEach(m=>m.pause());}); // nothing keeps playing out of sight
document.addEventListener('click',e=>{
  const chip=e.target.closest('[data-ask-chip]');if(chip){const box=chip.closest('.ask-box');box.querySelector('.ask-input')?.focus({preventScroll:true});askClaude(box,chip.dataset.askChip);return;}
  const row=e.target.closest('[data-notes-open]');if(row){const b=blockById(row.dataset.notesOpen);if(b){openNotes(b);document.querySelector('#dialog-body .notes-text')?.focus();}return;}
  const t=e.target.closest('[data-ui]');if(!t)return;const action=t.dataset.ui;
  if(action==='ask-send'){
    const box=t.closest('.ask-box'),input=box.querySelector('.ask-input'),text=input.value;
    if(!text.trim()||askPending||!sample)return;
    input.value='';input.focus();askClaude(box,text); // the question moves into the thread straight away
    return;
  }
  if(action==='ask-retry'){
    const box=t.closest('.ask-box'),b=blockById(box.dataset.askPart),log=b?askThread(b):[],m=log[+t.dataset.index];
    if(!m||!m.failed||askPending||!sample)return;
    log.splice(+t.dataset.index,1);box.querySelector('.ask-input')?.focus({preventScroll:true});askClaude(box,m.c);return;
  }
  if(action==='ask-save-note'){const box=t.closest('.ask-box'),b=blockById(box.dataset.askPart);if(b)saveAnswerToNotes(b,+t.dataset.index);return;}
  const b=activeLesson();
  if(action==='ask-claude'){openDialog(`Ask Claude · Part ${idxOf(b)+1}`,askBox(b,'part'));showNewest(document.querySelector('#dialog-body .ask-box'));document.querySelector('#dialog-body .ask-input')?.focus();}
  if(action==='my-notes'){openNotes(b);document.querySelector('#dialog-body .notes-text')?.focus();}
  const pane=document.querySelector('#dialog-body .notes-pane'),nb=pane&&blockById(pane.dataset.notesPart);
  if(action==='notes-summarize'&&nb)summarizePart(nb);
  if(action==='notes-voice'&&nb)makeVoice(nb.id);
  if(action==='episode-summarize')summarizeEpisode();
  if(action==='episode-voice')makeVoice('episode');
});

/* ---------- Review first: due part reviews must be done before studying ----------
   On a new visit with core part reviews due (journey/REVIEWS.md via the helper), a popup that cannot be
   dismissed asks each one from memory, grades it with the usual fixed checklist (one retry), saves the first
   score, then continues to the saved part. It keeps to the five-minute review budget: when time is up,
   the current answer can be finished and the rest stays due for next time. Interview/debug rows are not forced. */
const REVIEW_BUDGET_MS=5*60*1000;
const localDay=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const gateState=()=>{const g=S.reviewGate;return g&&g.day===localDay()?g:(S.reviewGate={day:localDay()});};
let gate=null; // {rows, index, results, busy, error, canSkip}: skipping is offered only when Claude or saving fails, never for a missing answer
function coreReviewRows(){return dueReviews.filter(r=>!/\/(iv|dbg)\d+$/.test(r.source)&&reviewItem(r));}
function gateTimeLeft(){const g=gateState();return g.startedAt?Math.max(0,REVIEW_BUDGET_MS-(Date.now()-g.startedAt)):REVIEW_BUDGET_MS;}
function gateDialog(){
  let d=document.querySelector('#review-gate');if(d)return d;
  d=document.createElement('dialog');d.id='review-gate';d.className='review-gate';d.setAttribute('aria-labelledby','rg-title');
  d.innerHTML=`<div class="dialog-heading"><h2 id="rg-title">Review first</h2><span class="rg-clock" id="rg-clock" aria-live="off"></span></div><div class="rg-body" id="rg-body"></div>`;
  d.addEventListener('cancel',e=>{if(gate)e.preventDefault();}); // Escape does not skip the review
  d.addEventListener('close',()=>{if(gate)d.showModal();});
  document.body.append(d);return d;
}
function maybeOpenReviewGate(){
  if(gate||!helperReady||!reviewsLoaded||!sample||S.tab!=='path')return;
  const g=gateState();if(g.finished)return;
  const rows=coreReviewRows();if(!rows.length)return;
  if(!g.startedAt){g.startedAt=Date.now();save();}
  gate={rows,index:0,results:[],busy:false,error:'',canSkip:false};
  if(vw.isConnected&&!vid.paused)vid.pause();
  if($('#study-dialog').open)closeDialog();
  const d=gateDialog();d.showModal();drawGate();gateTick();
}
function gateTick(){
  const clock=$('#rg-clock');if(!gate||!clock)return;
  const left=gateTimeLeft();clock.textContent=left?`${fmt(Math.ceil(left/1000))} left`:'Time is up';
  if(!left&&!gate.timeUpShown){gate.timeUpShown=true;drawGate();}
  setTimeout(gateTick,1000);
}
function gateItemHTML(row){
  const item=reviewItem(row),record=reviewCheck(row),closed=checkClosed(record.attempts),n=gate.index+1,b=item.b;
  const busy=gate.busy,first=record.attempts[0];
  return `<p class="rg-meta">Review ${n} of ${gate.rows.length} · Part ${idxOf(b)+1} — ${esc(b.title)}</p><div class="rg-question">${md(item.check.q)}</div>${item.scenario||''}
  <textarea class="rg-answer" data-reviewanswer="${esc(row.unit)}" placeholder="Answer from memory, in your own words…" aria-label="Your answer" ${closed||busy?'readonly':''}>${esc(record.answer)}</textarea>
  <div class="row">${closed?'':`<button type="button" class="btn amber" data-ui="gate-check" ${busy?'disabled':''}>${busy==='check'?'Checking…':record.attempts.length?'Check my retry':'Check my answer'}</button>`}${record.attempts.length?`<button type="button" class="btn ${closed?'amber':'ghost'}" data-ui="gate-save" ${busy?'disabled':''}>${busy==='save'?'Saving…':gate.index+1<gate.rows.length&&gateTimeLeft()?'Save and next →':'Save and finish →'}</button>`:''}</div>
  ${gate.error?`<p class="ask-error" role="alert">${esc(gate.error)}${gate.canSkip?' <button type="button" class="quiet-link" data-ui="gate-skip">Skip this one for today</button>':''}</p>`:''}
  <div class="rg-feedback" aria-live="polite">${checkFeedback(record.attempts,true)}${first?`<p class="small">Your first score (${first.fb.score}%) sets the next review date.</p>`:''}</div>
  ${record.attempts.length?rubricHTML(item.check.rubric):''}`;
}
function gateDoneHTML(){
  const left=gate.rows.length-gate.results.length;
  return `<div class="rg-done"><p class="rg-big">${left?'Time is up for reviews.':'Reviews done ✓'}</p>${gate.results.length?`<ul class="rg-results">${gate.results.map(r=>`<li><strong>${esc(r.title)}</strong> · ${r.score===null?'skipped, still due':r.score+'%'}</li>`).join('')}</ul>`:''}${left?`<p>${left} review${left===1?' stays':'s stay'} due for next time.</p>`:''}<div class="row"><button type="button" class="btn amber" data-ui="gate-continue">Continue to Part ${idxOf(activeLesson())+1} →</button></div></div>`;
}
function drawGate(){
  const body=$('#rg-body');if(!gate||!body)return;
  const row=gate.rows[gate.index],timeUp=!gateTimeLeft(),started=row&&reviewCheck(row).attempts.length;
  const finished=!row||(timeUp&&!started&&!gate.busy);
  body.innerHTML=`<p class="rg-intro">${finished?'':'Before you continue, answer from memory. One short answer per finished part, about five minutes.'}</p><ol class="rg-steps" aria-label="Reviews">${gate.rows.map((r,i)=>`<li class="${i<gate.index?'is-done':i===gate.index&&!finished?'is-now':''}" title="${esc(reviewItem(r).b.title)}">${i<gate.index?'✓':i+1}</li>`).join('')}</ol>${finished?gateDoneHTML():gateItemHTML(row)}`;
  attachMics(body);
  (body.querySelector('.rg-answer:not([readonly])')||body.querySelector('[data-ui="gate-save"],[data-ui="gate-continue"]'))?.focus({preventScroll:true});
}
function gateFinish(){const g=gateState();g.finished=true;save();const d=$('#review-gate');gate=null;d?.close();S.tab='path';render();}
document.addEventListener('keydown',e=>{ // keep Space for the answer box, never the video behind the review
  if(gate&&e.code==='Space'&&!e.target.closest?.('input,textarea,select,button'))e.stopImmediatePropagation();
},true);
document.addEventListener('click',async e=>{
  const t=e.target.closest('#review-gate [data-ui]');if(!t||!gate||gate.busy)return;
  const action=t.dataset.ui,row=gate.rows[gate.index];
  if(action==='gate-continue'){gateFinish();return;}
  if(!row)return;
  const item=reviewItem(row),record=reviewCheck(row);
  if(action==='gate-skip'){if(!gate.canSkip)return;gate.results.push({title:item.b.title,score:null});gate.index++;gate.error='';gate.canSkip=false;drawGate();return;}
  if(action==='gate-check'){
    const answer=record.answer.trim();
    if(!answer){gate.error='Write a short answer first.';gate.canSkip=false;drawGate();return;}
    if(record.attempts.some(a=>a.answer===answer)){gate.error='Change your answer for the retry, or save this review.';gate.canSkip=false;drawGate();return;}
    gate.busy='check';gate.error='';gate.canSkip=false;drawGate();
    try{await gradeAttempt(row.unit,record.attempts,item.b,item.check,answer,()=>record.answer.trim()===answer);}
    catch(err){gate.error=err.text||err.message||'Claude could not check this answer. Try again.';gate.canSkip=true;}
    gate.busy=false;drawGate();return;
  }
  if(action==='gate-save'){
    if(!record.attempts.length)return;
    gate.busy='save';gate.error='';gate.canSkip=false;drawGate();
    try{
      const r=await (await fetch('/api/review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({unit:row.unit,score:record.attempts[0].fb.score})})).json();
      if(r.error)throw new Error(r.error);
      gate.results.push({title:item.b.title,score:record.attempts[0].fb.score});gate.index++;save();refreshReviews();
    }catch(err){gate.error=err.message||'Could not save the review. Try again.';gate.canSkip=true;}
    gate.busy=false;drawGate();
  }
});
const gateBaseRender=render;
render=function(){gateBaseRender();maybeOpenReviewGate();};
