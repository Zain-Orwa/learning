/* Experimental presentation only. Core grading, media and saving remain intact. */
function experimentSupport(b){
  const deferred=b.deferred||[];
  return `<aside class="learning-tools" aria-label="Supporting tools"><section class="tool-card"><h2>${uiIcon('book')} Study support</h2><div class="tool-body"><button class="btn ghost" data-ui="full-explanation">Explanation &amp; Listen</button><button class="btn ghost" data-ui="code-notes">Code &amp; Pseudocode</button><button class="btn ghost" data-ui="flashcards" ${(b.cards||[]).length?'':'disabled'}>Flashcards · optional</button></div></section><section class="tool-card"><h2>${uiIcon('layers')} Deferred Topics</h2><div class="tool-body"><p>Ideas for later in the course.</p>${deferred.length?`<ul class="deferred-list">${deferred.map((text,i)=>`<li><button data-ui="deferred" data-index="${i}">${esc(deferredTitle(text))}</button></li>`).join('')}</ul>`:'<p class="empty-tool">No deferred topics in this part.</p>'}</div></section></aside>`;
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
  openDialog('Explanation & Listen',compact+listen);
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
  if(button.dataset.ui==='code-notes')openDialog('Code & Pseudocode',withWords(b.code||'<p>No code in this part.</p>',b.say?.code));
  if(button.dataset.ui==='detail-explanation')openDialog('Full explanation',renderStepRaw(b,'explain'));
});
referenceStep=STEPS.some(([key])=>key===S.lessonViews?.[S.cur])?S.lessonViews[S.cur]:S.step;
