/* Presentation layer: reuse the lesson, media, grading and persistence engine. */
const UI_PATHS={book:'M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2V4zm9 2v15',star:'m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z',flask:'M9 2h6M10 2v7L4 19c-1 2 0 3 2 3h12c2 0 3-1 2-3L14 9V2M7 16h10',code:'m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18',cards:'M7 3h12v17H7zM4 6H2v16h12v-1',tree:'m12 2-6 7h3l-5 7h6v6h4v-6h6l-5-7h3L12 2z',headphones:'M3 14v-3a9 9 0 0 1 18 0v3M3 12h4v9H3zm14 0h4v9h-4z',bulb:'M9 21h6M9 18h6c0-4 4-4 4-9A7 7 0 0 0 5 9c0 5 4 5 4 9z',check:'m3 12 6 6L21 6',list:'M8 5h14M8 12h14M8 19h14M2 5h1M2 12h1M2 19h1',copy:'M8 8h13v14H8zM17 8V2H2v14h6',chat:'M3 3h18v14H9l-6 4V3z',play:'m8 4 12 8-12 8V4z',gear:'m9 3 1-2h4l1 2 3 2 2 1 2 4-2 2v3l1 2-3 3-2-1-3 1-2 1-4-2v-2l-2-3-2-1 1-4 2-1 2-3zM9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0',layers:'m12 2 10 6-10 6L2 8l10-6zM2 12l10 6 10-6M2 17l10 6 10-6'};
function uiIcon(name){return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${UI_PATHS[name]||UI_PATHS.book}"/></svg>`;}
const WINTER_ART='../../../tools/study-kit/assets/winter-cabin.jpg';
const VIEW_STEPS=[['guess','Guess','bulb'],['watch','Watch','play'],['recall','Recall','list'],['answer','Answer','check'],['explain','Explain','book'],['experiment','Experiment','flask'],['code','Read Code','code'],['cards','Flashcards','cards'],['why','Why it Matters','tree']];
S.predictions=S.predictions||{};
S.tab='path'; // Open the clean lesson view; do not change its saved learning position.
let flashcardIndex=0,flashcardAnswer=false,lastDialogFocus=null;
const courseOpen={};
function activeLesson(){return blockById(S.cur)||D.blocks[0];}
function plainText(html){return String(html||'').replace(/<[^>]*>/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();}
function codeText(b){const m=String(b.code||'').match(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/i);return m?m[1].replace(/<[^>]+>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&').trim():'';}
function highlightLine(line){return line.split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*$|\b(?:int|void|return|char|const|if|else|while|for|struct|typedef|include)\b|\b\d+\b)/g).map(t=>{const c=/^\/\//.test(t)?'comment':/^["']/.test(t)?'string':/^\d+$/.test(t)?'number':/^(int|void|return|char|const|if|else|while|for|struct|typedef|include)$/.test(t)?'keyword':'';return c?`<span class="token-${c}">${esc(t)}</span>`:esc(t);}).join('');}
function pseudocodeSteps(b){const say=(b.say||{}).code||[];const first=say[0];if(first&&Array.isArray(first.steps))return first.steps;if(Array.isArray(first))return first;if(typeof first==='string')return [first];return [b.oneLiner||b.summary];}
function codePanel(b){const code=codeText(b),language=/\b(int|void|WinMain|include)\b/.test(code)?'C / C++':'Terminal';return `<section class="frost-card code-card"><div class="card-title">${uiIcon('code')}<h2>Code → Spoken Pseudocode</h2></div><p class="card-subtitle">See real code from the video on the left, and a plain-English readout on the right.</p><div class="code-split"><div class="code-editor"><div class="editor-header"><span class="language-badge">${language}</span><button class="copy-code" data-ui="copy-code" aria-label="Copy code">${uiIcon('copy')}</button></div><pre><code>${code?code.split('\n').map((line,i)=>`<span class="code-line"><span class="line-number" aria-hidden="true">${i+1}</span>${highlightLine(line)||' '}</span>`).join(''):'No code in this part.'}</code></pre></div><div class="pseudocode"><h3>${uiIcon('chat')} Spoken Pseudocode</h3><ul>${pseudocodeSteps(b).slice(0,3).map(step=>`<li>${md(step.split(/(?<=[.!?])\s+(?=[A-Z])/)[0])}</li>`).join('')}</ul></div></div></section>`;}
function audioPanel(b){const file=(D.summaryAudio||{})[b.id];return `<section class="frost-card audio-card"><div class="card-title">${uiIcon('headphones')}<h2>Audio Explanation</h2></div><p class="card-subtitle">A concise, spoken summary of the key ideas from this lesson.</p>${file?`<div class="audio-controls"><audio id="summary-audio" controls preload="metadata" aria-label="Audio explanation" src="${esc(file)}"></audio><select id="audio-speed" aria-label="Audio playback speed">${[.75,1,1.25,1.5].map(rate=>`<option value="${rate}" ${rate===(S.ttsRate||1)?'selected':''}>${rate}×</option>`).join('')}</select></div>`:`<p class="audio-empty">A spoken summary is not available for this part yet.</p>`}</section>`;}
function videoPanel(b){return `<div class="video-frame ${videoURL?'has-video':''}"><div id="vslot"></div><button class="poster-play" data-ui="play-video" aria-label="Play lesson video">${ICON.play}</button></div>`;}
function overview(b){return `<div class="study-primary" id="pane"><div class="learning-row"><div class="lesson-media-stack">${videoPanel(b)}<section class="takeaway"><h2>${uiIcon('star')} Key Takeaway</h2><p>${md(b.takeaway||b.focus||b.summary)}</p></section>${audioPanel(b)}</div>${explanationPanel(b)}</div>${codePanel(b)}<div class="lesson-action"><button class="btn ghost" data-ui="resume-core">${S.step==='watch'?'Continue watching':S.step==='recall'?'Continue to check':'Continue to practice'} →</button></div></div>`;}

function deferredTitle(text){return plainText(text).split(/\s*\(/)[0].replace(/\.\s+He says.*$/,'');}
function toolsRail(b){const deferred=b.deferred||[],count=(b.cards||[]).length;return `<aside class="learning-tools" aria-label="Learning tools"><section class="tool-card flashcard-tool"><h2 class="wood">${uiIcon('cards')} Flashcards</h2><div class="tool-body"><div class="card-illustration" aria-hidden="true"><span></span><span></span><span>✦</span></div><p>Key concepts from this lesson.</p><span class="count-pill">${count} card${count===1?'':'s'}</span><button class="btn amber" data-ui="flashcards" ${count?'':'disabled'}>Study Flashcards →</button></div></section><section class="tool-card"><h2>${uiIcon('flask')} Experiment / Prediction</h2><div class="tool-body"><p>Before trying it, make a prediction:</p><div class="prediction-prompt">${md(b.guess||checkFor(b).q)}</div><button class="btn amber" data-ui="prediction">${uiIcon('play')} Make a Prediction</button><button class="btn ghost" data-ui="experiment">${uiIcon('flask')} Run Experiment</button></div></section><section class="tool-card"><h2>${uiIcon('layers')} Deferred Topics</h2><div class="tool-body"><p>Important ideas we'll come back to later.</p>${deferred.length?`<ul class="deferred-list">${deferred.slice(0,4).map((text,i)=>`<li><button data-ui="deferred" data-index="${i}">${esc(deferredTitle(text))}</button></li>`).join('')}</ul>`:`<p class="empty-tool">No deferred topics in this part.</p>`}</div></section></aside>`;}
function navigationHTML(b){const current=referenceStep||S.step;return `<nav class="study-navigation" role="tablist" aria-label="Study workflow">${VIEW_STEPS.map(([key,label,icon])=>{const core=STEPS.some(([k])=>k===key),done=!!((S.done[b.id]||{})[key]),disabled=core&&!stepOpen(b,key);return `<button role="tab" aria-selected="${current===key}" ${key==='cards'?'data-ui="flashcards"':core?`data-step="${key}"`:`data-reference="${key}"`} ${disabled?'disabled':''}>${uiIcon(icon)}${label}${done?'<span class="step-check">✓</span>':''}</button>`;}).join('')}</nav>`;}
const baseRenderStepRaw=renderStepRaw;
renderStepRaw=function(b,key){
  if(key==='guess')return `<h2>Make a prediction</h2><p>${md(b.guess||checkFor(b).q)}</p><textarea data-prediction="${b.id}" placeholder="What do you think will happen?">${esc((S.predictions||{})[b.id]||'')}</textarea><p class="dialog-help">Optional. Try the idea, then compare it with what actually happens.</p>`;
  if(key==='answer'){const attempts=attemptsFor(b.id);return `<h2>Your answer</h2>${S.checkAnswers[b.id]?`<p>${esc(S.checkAnswers[b.id])}</p>${checkFeedback(attempts)}`:'<p>Your core-check answer will appear here after you write it.</p>'}`;}
  if(key==='why')return `<h2>Why it Matters</h2>${b.why||`<p>${md(b.summary)}</p>`}`;
  return baseRenderStepRaw(b,key);
};
renderPath=function(){
  if(S.brk)return renderBreak();if(S.stopped)return renderStopped();
  if(S.cur==='__qa')return `<section class="block"><h2>Questions &amp; answers</h2>${D.qa?.html||''}<div id="nextbox"></div></section>`;
  const b=activeLesson(),view=referenceStep||S.step;
  const content=view==='explain'?overview(b):`<section class="frost-card reading-pane study-primary"><div class="pane" id="pane">${renderStep(b,view)}</div>${!referenceStep?`<div class="next"><button class="btn amber" id="markNext">${nextLabel(b)}</button></div>`:''}</section>`;
  return `<header class="lesson-header"><div><div class="eyebrow">Part ${idxOf(b)+1} of ${D.blocks.length}</div><h1>Day 1 — ${esc(b.title)}</h1></div><span class="tsr">▶ ${b.start} – ${b.end}</span></header>${navigationHTML(b)}<div class="lesson-columns">${content}${toolsRail(b)}</div>`;
};
function courseTreeHTML(){
  const f=frontier();
  return D.blocks.map((part,i)=>{
    const key=part.id,open=Object.prototype.hasOwnProperty.call(courseOpen,key)?courseOpen[key]:key===S.cur;
    const status=S.completed[key]?(checked(part)?'Checked':'Finished'):i>f?'Upcoming':key===S.cur?'Current':'';
    return `<details class="course-group" data-chapter="${key}" ${open?'open':''}><summary><span>Part ${i+1} — ${esc(part.title)}</span><small>${status}</small></summary><div class="part-lessons"><p>${part.start}–${part.end}</p><button class="btn ghost small" data-blk="${key}" aria-current="${key===S.cur}" ${i>f?'disabled':''}>${i>f?'Complete the earlier parts first':'Open this lesson →'}</button></div></details>`;
  }).join('');
}
function renderCourseTree(){
  const b=activeLesson();
  $('#course-position').textContent=`Part ${idxOf(b)+1} of ${D.blocks.length}`;
  $('#course-tree').innerHTML=courseTreeHTML();
  $('#profile-name').textContent=S.profileName||'Zain';
  const avatar=$('.profile-button .avatar');if(avatar)avatar.textContent=(S.profileName||'Zain').slice(0,1).toUpperCase();
  $('#notification-dot').hidden=!dueReviews.length;
  $('#notifications-button').setAttribute('aria-label',dueReviews.length?`Notifications: ${dueReviews.length} reviews due`:'Notifications');
}
function openDialog(title,html){const dialog=$('#study-dialog');if(!dialog.open)lastDialogFocus=document.activeElement;$('#dialog-title').textContent=title;$('#dialog-body').innerHTML=html;if(!dialog.open)dialog.showModal();attachMics(dialog);}
function closeDialog(){const dialog=$('#study-dialog');if(dialog.open)dialog.close();lastDialogFocus?.focus?.();}
$('#study-dialog').addEventListener('close',()=>{if(tts.on||tts.i>0)ttsStop();});
function flashcardDialog(){const cards=activeLesson().cards||[];if(!cards.length)return;flashcardIndex=Math.min(flashcardIndex,cards.length-1);const card=cards[flashcardIndex];openDialog('Flashcards',`<p class="flashcard-counter">Card ${flashcardIndex+1} of ${cards.length}</p><div class="flashcard-face">${md(card[flashcardAnswer?1:0])}</div><div class="row"><button class="btn amber" data-ui="flip-card">${flashcardAnswer?'Show question':'Reveal answer'}</button><button class="btn ghost" data-ui="previous-card" ${flashcardIndex?'':'disabled'}>Previous</button><button class="btn ghost" data-ui="next-card" ${flashcardIndex===cards.length-1?'disabled':''}>Next →</button></div><p class="dialog-help">Optional practice. Your shared Review schedule stays the same.</p>`);}
function fullExplanation(b){const own=(b.explainCard||{}).fullExplanation;openDialog((b.explainCard||{}).title||'Explanation',`${own||renderStep(b,'explain')}${b.visual?`<div class="row"><button class="btn ghost" data-ui="visual">Show the idea</button></div>`:''}`);}
function searchLessons(value){const text=value.trim().toLowerCase(),box=$('#search-results'),input=$('#lesson-search');input.setAttribute('aria-expanded',text?'true':'false');if(!text){box.hidden=true;box.innerHTML='';return;}const results=D.blocks.filter(b=>(b.title+' '+b.summary+' '+codeText(b)).toLowerCase().includes(text));box.innerHTML=results.length?results.slice(0,8).map(b=>`<button data-blk="${b.id}" ${unlocked(b)?'':'disabled'}>${esc(b.title)}<small>${b.start}–${b.end}${unlocked(b)?'':' · Later in this episode'}</small></button>`).join(''):'<p>No matching lessons. Try “compiler”, “function” or “Windows”.</p>';box.hidden=false;}
function hideSearch(){const input=$('#lesson-search');$('#search-results').hidden=true;input.setAttribute('aria-expanded','false');}
function chooseVideo(){openDialog('Open lesson video',`<p>Choose your downloaded recording. It stays on your computer.</p><input type="file" data-video-file accept="video/*" aria-label="Choose lesson video"><p class="dialog-help">${esc(D.video?.file||'Choose the recording for this lesson.')}</p>`);}
function playLesson(){if(!videoURL){chooseVideo();return;}if(vid.paused)vid.play().catch(()=>toast('The recording could not be played. Choose the video again.'));else vid.pause();}
// Retain the original video element and all part boundaries, seeking and saved positions.
vid.poster=WINTER_ART;
vw.querySelector('.pctl').innerHTML=`<button data-v="play" aria-label="Play">${ICON.play}</button><span class="ptime">0:00 / 0:00</span><span class="pbar" role="slider" aria-label="Position in this part" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0"><i></i></span><button data-ui="captions" aria-label="Toggle captions" aria-pressed="false">CC</button><button data-ui="video-settings" aria-label="Video settings" aria-expanded="false">${uiIcon('gear')}</button><button data-v="fs" aria-label="Full screen">${ICON.fs}</button>`;
const settings=document.createElement('div');settings.className='video-settings';settings.hidden=true;settings.innerHTML=`<label>Playback speed <button data-v="speed" aria-label="Playback speed">${S.speed||1}×</button></label><button class="btn ghost small" data-ui="choose-video">Choose video file</button>`;vw.append(settings);
if(D.captions){const track=document.createElement('track');track.kind='captions';track.label='English';track.srclang='en';track.src=D.captions;vid.append(track);}
vw.addEventListener('click',e=>{if(e.target.closest('[data-v="play"]')&&!videoURL){e.stopImmediatePropagation();chooseVideo();}},true);
for(const event of ['play','pause','ended'])vid.addEventListener(event,()=>{const frame=vw.closest('.video-frame');if(frame)frame.classList.toggle('has-video',!vid.paused);});
vw.querySelector('.pbar').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)||!playerBlock||!videoURL)return;e.preventDefault();const [start,end]=range(playerBlock);vid.currentTime=e.key==='Home'?start:e.key==='End'?end:Math.max(start,Math.min(end,vid.currentTime+(e.key==='ArrowRight'?5:-5)));ptick();});
const baseRender=render;
render=function(){baseRender();renderCourseTree();const b=activeLesson();if(!vid.duration)vw.querySelector('.ptime').textContent=`0:00 / ${fmt(secs(b.end)-secs(b.start))}`;const audio=$('#summary-audio');if(audio)audio.playbackRate=S.ttsRate||1;$('#profile-popover').hidden=true;$('#profile-button').setAttribute('aria-expanded','false');};
document.addEventListener('toggle',e=>{const key=e.target.dataset?.chapter;if(key)courseOpen[key]=e.target.open;},true);
document.addEventListener('input',e=>{
  if(e.target.id==='lesson-search')searchLessons(e.target.value);
  if(e.target.dataset.prediction){S.predictions=S.predictions||{};S.predictions[e.target.dataset.prediction]=e.target.value;save();}
});
document.addEventListener('change',e=>{
  if(e.target.id==='audio-speed'){S.ttsRate=+e.target.value;const audio=$('#summary-audio');if(audio)audio.playbackRate=S.ttsRate;save();}
  if(e.target.hasAttribute?.('data-video-file')&&e.target.files[0]){closeDialog();loadVideo(e.target.files[0]);}
});
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#lesson-search').focus();}
  if(e.key==='Escape'){hideSearch();$('#profile-popover').hidden=true;$('#profile-button').setAttribute('aria-expanded','false');document.body.classList.remove('courses-open');}
});
document.addEventListener('click',async e=>{
  const target=e.target.closest('[data-ui], [data-blk], [data-tab], [data-sess], [data-reference], [data-practicepart]');
  if(!e.target.closest('.search-wrap'))hideSearch();
  if(!e.target.closest('.profile-wrap')){$('#profile-popover').hidden=true;$('#profile-button').setAttribute('aria-expanded','false');}
  if(!target)return;
  if(target.dataset.blk){document.body.classList.remove('courses-open');hideSearch();return;}
  if(target.dataset.sess||target.dataset.reference||target.dataset.practicepart){closeDialog();return;}
  const b=activeLesson(),action=target.dataset.ui;
  if(action==='home'){e.preventDefault();S.tab='path';referenceStep='explain';save();render();}
  if(action==='courses')document.body.classList.toggle('courses-open');
  if(action==='profile'){const panel=$('#profile-popover');panel.hidden=!panel.hidden;target.setAttribute('aria-expanded',String(!panel.hidden));}
  if(action==='close-dialog')closeDialog();
  if(action==='flashcards'){flashcardIndex=0;flashcardAnswer=false;flashcardDialog();}
  if(action==='flip-card'){flashcardAnswer=!flashcardAnswer;flashcardDialog();}
  if(action==='next-card'){flashcardIndex++;flashcardAnswer=false;flashcardDialog();}
  if(action==='previous-card'){flashcardIndex=Math.max(0,flashcardIndex-1);flashcardAnswer=false;flashcardDialog();}
  if(action==='full-explanation')fullExplanation(b);
  if(action==='visual')openDialog('Show the idea',b.visual||'<p>No visual for this part yet.</p>');
  if(action==='prediction')openDialog('Make a Prediction',renderStepRaw(b,'guess')+'<div class="row"><button class="btn amber" data-ui="close-dialog">Save prediction</button></div>');
  if(action==='experiment')openDialog('Experiment / Prediction',renderStepRaw(b,'experiment')+'<div class="row"><button class="btn amber" data-ui="close-dialog">Save practice</button></div>');
  if(action==='deferred')openDialog('Deferred Topics',`<p>${esc((b.deferred||[])[+target.dataset.index]||'')}</p><p class="dialog-help">Parked for later. Keep your attention on the current lesson.</p>`);
  if(action==='copy-code'){await copy(codeText(b),null);}
  if(action==='resume-core'){referenceStep=null;render();}
  if(action==='play-video')playLesson();
  if(action==='choose-video')chooseVideo();
  if(action==='video-settings'){settings.hidden=!settings.hidden;target.setAttribute('aria-expanded',String(!settings.hidden));}
  if(action==='captions'){const track=vid.textTracks?.[0];if(!track){toast('Captions are not available for this recording.');return;}track.mode=track.mode==='showing'?'hidden':'showing';target.setAttribute('aria-pressed',String(track.mode==='showing'));}
  if(action==='notifications')openDialog('Notifications',dueReviews.length?`<p>${dueReviews.length} reviews are due. Keep it to about five minutes.</p><ul>${dueReviews.slice(0,5).map(row=>`<li>${esc(row.title)}</li>`).join('')}</ul><button class="btn amber" data-ui="start-reviews">Open reviews</button>`:'<p>You are all caught up. Continue your lesson whenever you are ready.</p>');
  if(action==='start-reviews'){closeDialog();S.tab='review';save();refreshReviews();render();}
  if(action==='planner')openDialog('Plan this session',planHTML()||'<p>Your session is saved. Resume when you are ready.</p>');
  if(action==='history')openDialog('Study history',`${pendingHTML()}<p>${Object.keys(S.completed).length} of ${D.blocks.length} parts finished.</p><div class="tbl"><table class="history-table"><thead><tr><th>Part</th><th>Progress</th><th>Finished</th></tr></thead><tbody>${D.blocks.map(x=>`<tr><td>${esc(x.title)}</td><td>${S.completed[x.id]?(checked(x)?'Checked':'Finished'):blockDone(x)+'/3'}</td><td>${esc(S.cdate[x.id]||'—')}</td></tr>`).join('')}</tbody></table></div>`);
  if(action==='rename')openDialog('Your profile',`<label for="profile-input">Display name</label><input type="text" id="profile-input" maxlength="30" value="${esc(S.profileName||'Zain')}"><div class="row"><button class="btn amber" data-ui="save-name">Save name</button></div>`);
  if(action==='save-name'){const name=$('#profile-input').value.trim();if(!name)return;S.profileName=name.slice(0,30);save();closeDialog();renderCourseTree();}
});
