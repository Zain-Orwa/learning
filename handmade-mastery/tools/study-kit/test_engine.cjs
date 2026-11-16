const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
// Run: node handmade-mastery/tools/study-kit/test_engine.cjs
const base=require('path').resolve(__dirname,'../../..')+'/';
const html=fs.readFileSync(base+'handmade-mastery/courses/intro-to-c/day01/study-kit.html','utf8');
const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const saved={v:2,cur:'b03',step:'guess',tab:'path',done:{b01:{watch:true,recall:true,experiment:true},b02:{watch:true,recall:true,experiment:true}},completed:{b01:true,b02:true},cdate:{b01:'2026-11-01',b02:'2026-11-02'},answers:{'b01?0':'Historical answer'},rfb:{b01:{score:35}},lastVisit:0};
function el(){return {dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},paused:true,addEventListener(){},querySelector(){return el()},querySelectorAll(){return []},pause(){},getBoundingClientRect(){return {top:0,bottom:0}},setAttribute(){},remove(){},append(){},scrollIntoView(){}}}
const ctx={window:{scrollTo(){}},document:{querySelector(){return el()},querySelectorAll(){return []},createElement:el,addEventListener(){},body:{}},location:{protocol:'file:',pathname:'/courses/intro-to-c/day01/study-kit.html'},localStorage:{getItem(){return JSON.stringify(saved)},setItem(){}},navigator:{},Audio:class{pause(){}},MutationObserver:class{observe(){}},setTimeout(){return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){},requestAnimationFrame(){},console,URL,CSS:{escape:x=>x}};
vm.createContext(ctx);for(const script of scripts)new vm.Script(script);
vm.runInContext(scripts[0],ctx);
let logic=scripts[1].replace('function render(){','function render(){return;').replace('save(); render();\n})();',`globalThis.api={getState:()=>S,setState:p=>Object.assign(S,p),stepsFor,checkFor,normFb,migrate,goNextStep,est,estLeft,renderPath,renderStepRaw,checked,reviewItem,stepAudio,attemptsFor,checkClosed,gradeAttempt,checkFeedback,reviewCheck,pendingPractice,pendingHTML,positionBlock,courseTreeHTML,selectStudyView,tabFinished,finishSupportView,codeText,codePanel,overview,explanationPanel,explanationData,XC_ICONS,xcHighlight,xcSign,navigationHTML,pseudocodeSteps,searchLessons,flashcardContent,askBox,askMessagesHTML,askRules,richText,notesMarkdown,notesView,saveAnswerToNotes,setSample:v=>sample=v,setReference:v=>referenceStep=v,setHelper:v=>helperReady=v};\n})();`);
vm.runInContext(logic,ctx);const a=ctx.api;
assert.equal(a.getState().cur,'b03');assert.equal(a.getState().step,'watch');assert.equal(Object.keys(a.getState().completed).length,2);
assert.deepEqual(JSON.parse(JSON.stringify(a.getState().answers)),saved.answers);assert.deepEqual(JSON.parse(JSON.stringify(a.getState().rfb)),saved.rfb);
for(const b of ctx.window.STUDY.blocks){assert.equal(b.check.rubric.reduce((n,[,w])=>n+w,0),100);assert.equal(a.stepsFor(b).length,3);assert(!/yellow|green|edition|F7/i.test(b.check.q));for(const drill of [...b.interview||[],...b.debug||[]])assert.equal(drill.strong.reduce((n,[,w])=>n+w,0),100);}
let fb=a.normFb({awards:[65,10],right:'okay'},[['first',70],['second',30]]);assert.equal(fb.score,75);assert.equal(fb.score+fb.missing.reduce((n,m)=>n+m.pct,0),100);
fb=a.normFb({awards:[500,-2]},[['first',70],['second',30]]);assert.equal(fb.score,70);assert.throws(()=>a.normFb({awards:[NaN,0]},[['first',70],['second',30]]));assert.throws(()=>a.normFb({awards:[70]},[['first',70],['second',30]]));
const b3=ctx.window.STUDY.blocks[2];assert.equal(a.est(b3),9);
const first=ctx.window.STUDY.blocks[0];assert(a.codeText(first).includes('C:\\> cl'));assert(a.codePanel(first).includes('aria-label="Copy code"'));assert(a.codePanel(first).includes('line-number'));assert(a.overview(first).includes('Audio Explanation'));assert(a.pseudocodeSteps(first).length>0);
// Explanation card: structured data for every part, and the panel renders it in the right order.
for(const b of ctx.window.STUDY.blocks){const card=b.explainCard;assert(card,`${b.id} needs an explainCard`);assert(card.concepts.length>=2&&card.concepts.length<=4,`${b.id} concept rows`);assert(card.clarification);for(const c of card.concepts){assert(a.XC_ICONS[c.icon],`${b.id} icon ${c.icon}`);for(const h of c.highlights||[])assert(c.text.includes(h),`${b.id} highlight "${h}" must appear in its row`);}}
const b02=ctx.window.STUDY.blocks[1],xp=a.explanationPanel(b02),order=['xc-plate','The idea in one sentence:','Real-life picture:','">subsystem</mark>','xc-label">CONSOLE','xc-label">WINDOWS','xc-note','data-ui="full-explanation"'].map(t=>xp.indexOf(t));
assert(order.every((n,i)=>n>=0&&(i===0||n>order[i-1])),'Explanation card sections must render in reading order');assert(!xp.includes(b02.explain.slice(0,40)),'The compact card must not show the full explanation');
const bare={id:'bare',explain:'<p>Intro <b>only</b>.</p><p>More.</p>',summary:'S'},bp=a.explanationPanel(bare);assert(bp.includes('Intro <b>only</b>.')&&!bp.includes('More.')&&!bp.includes('xc-idea')&&!bp.includes('xc-note'),'Parts without card data fall back to the first paragraph');
for(const b of ctx.window.STUDY.blocks)for(const c of b.explainCard.concepts)assert.equal((a.xcHighlight(c.text,c.highlights).match(/<mark /g)||[]).length,(c.highlights||[]).length,`${b.id}: every highlight renders as one pill`);
assert.equal(a.xcHighlight('a & b < c',['amp','lt']),'a &amp; b &lt; c','Highlights must not split HTML entities');
assert.equal((a.xcHighlight('foo bar baz',['foo bar','bar']).match(/<mark /g)||[]).length,1,'Pills must not nest');
assert(a.xcHighlight('PEEK at PE',['PE']).startsWith('PEEK at <mark'),'Highlights match whole words');
assert(a.xcHighlight('use `x` and x',['x']).includes('<code>x</code> and <mark'),'Code spans stay intact');
assert(a.xcSign('<x> y').includes('&lt;x&gt;')&&!a.xcSign('<x> y').includes('<x>'),'Signpost words must be escaped');
for(const b of ctx.window.STUDY.blocks.filter(x=>x.oneLiner))assert.equal(a.overview(b).split(a.explanationPanel(b).match(/xc-idea[\s\S]*?<p>([\s\S]*?)<\/p>/)[1]).length,2,`${b.id}: the one-sentence idea appears once`);
assert(!a.explanationPanel({...b02,explainCard:{concepts:[{icon:'gear',label:'<i>x</i>',text:'a <b> c',highlights:['<b>']}],clarification:'q'}}).includes('<i>x</i>'),'Card text must be escaped');
const beforeView=JSON.stringify(a.getState().done);a.setReference('explain');a.renderPath();assert.equal(JSON.stringify(a.getState().done),beforeView,'Opening supporting views must not complete core work');
const largeTask={...b3,id:'large-task',practiceMinutes:60};a.getState().done[largeTask.id]={watch:true,recall:true};assert.equal(a.estLeft(largeTask),60,'Watching and checking must not discount hands-on work');
a.setState({cur:'b03',step:'watch',tab:'path',session:null,brk:null});a.setReference(null);let path=a.renderPath();for(const label of ['Watch','Check','Practice'])assert(path.includes(label+'</button>'));assert.equal((path.match(/role="tab"/g)||[]).length,3,'Three steps: Watch, Check, Practice');for(const old of ['Guess','Recall','Read Code','Why it Matters'])assert(!path.includes(old+'</button>'));assert(!path.includes('CALL STACK'));assert(path.includes('learning-tools'));assert(path.includes('Study support')&&path.includes('Explanation &amp; Listen'));assert(!path.includes('video is covered'));
a.goNextStep();assert.equal(a.getState().step,'recall');a.goNextStep();assert.equal(a.getState().step,'recall');a.getState().checkAnswers.b03='Compiler produces instructions for the target CPU';a.goNextStep();assert.equal(a.getState().step,'experiment');a.goNextStep();assert.equal(a.getState().cur,'b03');a.getState().practice.b03='Still to do';a.getState().checkFb.b03={score:100};assert.equal(a.checked(b3),false);a.getState().practiceDone.b03=true;assert.equal(a.checked(b3),true);a.goNextStep();assert.equal(a.getState().cur,'b04');assert.equal(a.getState().step,'watch');assert.equal(a.getState().brk,null);
// Revisiting an older completed part must preserve its original completion date.
a.setState({cur:'b01',step:'experiment'});a.getState().practice.b01='Tool previously verified';a.goNextStep();assert.equal(a.getState().cdate.b01,saved.cdate.b01);
a.setState({cur:'b02',step:'cards'});a.migrate();assert.equal(a.getState().step,'experiment');
a.setState({cur:'b03'});a.setReference('code');assert(a.stepAudio());a.setReference('explain');assert(a.stepAudio());
assert(a.reviewItem({source:'courses/intro-to-c/day01#b01'}));assert(a.reviewItem({source:'courses/intro-to-c/day01#b02/iv0'}));assert.equal(a.reviewItem({source:'courses/intro-to-c/day02#b01'}),null);
async function checkAttempts(){
  let calls=0;
  a.setSample({json:async()=>{calls++;return {awards:[20,20],right:'One useful idea',guide:'Consider the target CPU'};}});
  const attempts=[];
  assert(await a.gradeAttempt('retry',attempts,b3,b3.check,'first answer',()=>true));
  assert.equal(attempts.length,1);
  assert.equal(await a.gradeAttempt('retry',attempts,b3,b3.check,'first answer',()=>true),false);
  assert.equal(calls,1,'Clicking again without editing must not spend another model call');
  assert(await a.gradeAttempt('retry',attempts,b3,b3.check,'revised answer',()=>true));
  assert.equal(a.checkClosed(attempts),true);
  assert(a.checkFeedback(attempts).includes('The key idea:'));
  assert.equal(await a.gradeAttempt('retry',attempts,b3,b3.check,'third answer',()=>true),false);
  assert.equal(calls,2,'One retry is the limit');
  a.setSample({json:async()=>{calls++;return {awards:[50,50]};}});
  const passed=[];
  assert(await a.gradeAttempt('pass',passed,b3,b3.check,'correct answer',()=>true));
  assert.equal(await a.gradeAttempt('pass',passed,b3,b3.check,'a different wording',()=>true),false);
  assert.equal(calls,3,'A pass must not trigger more grading');
  a.setSample({json:async()=>{throw new Error('Temporary model failure');}});
  const failed=[];
  await assert.rejects(a.gradeAttempt('error',failed,b3,b3.check,'answer',()=>true));
  assert.equal(failed.length,0,'A service failure is not a learner attempt');
  a.setSample({json:async()=>({awards:[NaN,0]})});
  await assert.rejects(a.gradeAttempt('error',failed,b3,b3.check,'answer',()=>true));
  assert.equal(failed.length,0,'Invalid grades must not use a retry');
  let release;
  a.setSample({json:()=>new Promise(resolve=>{release=resolve;})});
  const parallel=[];
  const inflight=a.gradeAttempt('busy',parallel,b3,b3.check,'answer',()=>true);
  assert.equal(await a.gradeAttempt('busy',parallel,b3,b3.check,'answer',()=>true),false);
  release({awards:[20,20]});await inflight;
  assert.equal(parallel.length,1,'Concurrent clicks must produce only one attempt');
  a.setSample({json:async()=>({awards:[50,50]})});
  const edited=[];
  assert.equal(await a.gradeAttempt('stale',edited,b3,b3.check,'old text',()=>false),false);
  assert.equal(edited.length,0,'An edited answer must not inherit a stale response');
  // Saving and reloading keeps the initial review score and the one-retry limit.
  const row={unit:'icd01-p03',next:'2026-11-15'};
  const record=a.reviewCheck(row);record.answer='first review answer';record.attempts.push(attempts[0]);
  const snapshot=JSON.parse(JSON.stringify(a.getState()));
  a.setState(snapshot);a.migrate();
  const restored=a.reviewCheck(row);
  assert.equal(restored.attempts[0].fb.score,40);
  restored.answer='second review answer';
  assert(await a.gradeAttempt(row.unit,restored.attempts,b3,b3.check,restored.answer,()=>true));
  assert.equal(restored.attempts[0].fb.score,40,'The retry must not replace the unaided score');
  assert.equal(restored.attempts[1].fb.score,100);
  assert.equal(a.reviewCheck({...row,next:'2026-11-18'}).attempts.length,0,'A later due review gets fresh attempts');
  a.setState({practice:{b03:'Still to do on Windows'},practiceDone:{},completed:{b01:true,b02:true,b03:true}});
  assert.equal(a.pendingPractice().length,1,'Old completed parts must not become new mandatory work');
  assert(a.pendingHTML().includes('data-practicepart="b03"'));
  assert(a.positionBlock().includes('Practice still to try: b03'));
  a.getState().practiceDone.b03=true;assert.equal(a.pendingPractice().length,0);
  assert(a.renderStepRaw(b3,'visual').includes('ARM'));
  // Migration recognizes earlier short checks without touching legacy grades.
  a.setState({v:3,checkAttempts:{},checkAnswers:{b03:'Saved answer'},checkFb:{b03:{score:80}}});a.migrate();
  assert.equal(a.attemptsFor('b03').length,1);assert(a.checkClosed(a.attemptsFor('b03')));
  assert.deepEqual(JSON.parse(JSON.stringify(a.getState().rfb)),saved.rfb);
  console.log('PASS: progress migration, fair grading, step transitions, bounded retries, failed/stale/concurrent responses, persisted review scores, pending Windows practice, visuals and optional audio.');
}
checkAttempts().catch(error=>{console.error(error);process.exitCode=1;});

const tree=a.courseTreeHTML();assert.equal((tree.match(/class="part-row/g)||[]).length,12);assert(!tree.includes('<details'));assert(tree.includes('Part 12 —'));assert(!tree.includes('Finishing the Game'));

const stageBeforeTabs=a.getState().step,doneBeforeTabs=JSON.stringify(a.getState().done);
for(const key of ['watch','recall','experiment']){
  assert(a.selectStudyView(key));const navigation=a.navigationHTML(ctx.window.STUDY.blocks[2]);
  assert.equal((navigation.match(/aria-selected="true"/g)||[]).length,1);
  assert(navigation.includes(`data-view="${key}" aria-controls="lesson-panel" aria-selected="true"`));
  assert(a.renderPath().includes(`aria-labelledby="study-tab-${key}"`));
}
assert.equal(a.getState().step,stageBeforeTabs,'Browsing tabs must not move the saved study step');
assert.equal(JSON.stringify(a.getState().done),doneBeforeTabs,'Browsing tabs must not complete any work');
assert(!a.selectStudyView('unknown'));

const coreBeforeSupport=a.getState().step,completedBeforeSupport=JSON.stringify(a.getState().completed);
for(const old of ['guess','answer','explain','code','cards','why'])assert(!a.selectStudyView(old),`${old} is a support popup now, not a step`);a.selectStudyView('watch');assert.equal(a.finishSupportView(),false,'Core steps are finished by the step itself');assert.equal(a.getState().step,coreBeforeSupport);assert.equal(JSON.stringify(a.getState().completed),completedBeforeSupport);

// Study flow, support tools, Ask Claude and notes (built in experiment/ and adopted 2026-11-16).
{
const b=ctx.window.STUDY.blocks[2];
const before=JSON.stringify(a.getState().done);
for(const [view,label] of [['watch','Watch'],['recall','Check'],['experiment','Practice']]){
  assert(a.selectStudyView(view));const html=a.renderPath();
  assert.equal((html.match(/role="tab"/g)||[]).length,3);
  assert.equal((html.match(/aria-selected="true"/g)||[]).length,1);
  assert(new RegExp(label+'(<span[^>]*>✓</span>)?</button>').test(html),label); // a finished step shows a tick
  assert(!html.includes('Key Takeaway'));assert(!html.includes('Mark finished'));
  assert(html.includes('Explanation &amp; Listen'));
  assert(!html.includes('Make a Prediction</button>'));
}
assert.equal(JSON.stringify(a.getState().done),before);
assert(!a.selectStudyView('guess'));assert(!a.selectStudyView('answer'));
assert(a.renderStepRaw(b,'experiment').includes('Predict the result · optional'));
let fb=a.normFb({awards:[40,20]},b.check.rubric);assert.equal(fb.score,60);
{const st=a.getState();delete st.checkFb.b03;delete st.checkAnswers.b03;st.checkAttempts.b03=[];delete st.practice.b03;delete st.practiceDone.b03;delete st.completed.b03;st.done.b03={};} // fresh part 3 for this flow check
a.setState({cur:'b03',step:'watch',brk:null});a.goNextStep();assert.equal(a.getState().step,'recall');
a.getState().checkAnswers.b03='Text becomes instructions for the chosen CPU';a.goNextStep();assert.equal(a.getState().step,'experiment');
assert(!a.checked(b));a.getState().checkFb.b03={score:100};a.getState().practice.b03='Verified build output';a.getState().practiceDone.b03=true;assert(a.checked(b));
a.goNextStep();assert.equal(a.getState().cur,'b04');assert.equal(a.getState().step,'watch');
console.log('PASS: three-step experiment, no duplicate views, optional prediction/support, preserved history and core progression.');

const flash=a.flashcardContent();assert(!flash.includes('<h2>'),'Flashcards dialog owns its single heading');assert(!flash.includes('shared Review schedule'),'No routine instructions in the popup footer');assert(flash.includes('Reveal answer'));

const tree=a.courseTreeHTML();assert(tree.includes('class="part-row')&&!tree.includes('<details')&&!tree.includes('Open this lesson'),'Course list is one compact row per part');
assert((tree.match(/class="part-row/g)||[]).length===12);assert(tree.includes('aria-current="page"'),'Current part is marked');
a.setReference('watch');const page=a.renderPath();assert(page.includes('data-ui="analogy"')&&page.includes('data-ui="graphics"'),'Study support offers Analogy and Graphics');
console.log('PASS: compact course list and Analogy/Graphics study support.');

{const b=a.getState().cur&&'b03';const blk={id:'b03'};const st=a.getState();st.notes.b03=[{r:'user',c:'Old engine question'},{r:'assistant',c:'Old answer'},{r:'user',c:'Why a book?',from:'analogy'},{r:'assistant',c:'- one\n- two',from:'analogy'}];
const part=a.askMessagesHTML({id:'b03'},'part'),ana=a.askMessagesHTML({id:'b03'},'analogy');
assert(part.includes('Old engine question')&&part.includes('Why a book?')&&part.includes('about the analogy'),'Part view shows the whole thread, tagged by where it was asked');
assert(!ana.includes('Old engine question')&&ana.includes('<ul><li>one</li><li>two</li></ul>'),'A support view shows only its own questions, with bullet answers');
assert.equal(a.richText('a <b>\n\n- x'),'<p>a &lt;b&gt;</p><ul><li>x</li></ul>','Answers are escaped');
const box=a.askBox(ctx.window.STUDY.blocks[2],'code');assert(box.includes('data-ask-from="code"')&&box.includes('Explain this code line by line')&&/Enter sends|experiment\/study|Claude Code was not found/.test(box),'Ask box has quick questions and a hint');
const rules=a.askRules(ctx.window.STUDY.blocks[2],'analogy');assert(/under 120 words/.test(rules)&&/parks for later/.test(rules)&&/translating a book/.test(rules),'Ask prompt stays short, inside the part, with the analogy as context');
a.saveAnswerToNotes(ctx.window.STUDY.blocks[2],3);assert.equal(st.myNotes.b03.text,'Q: Why a book?\nA: - one\n- two');assert(st.notes.b03[3].saved);
a.saveAnswerToNotes(ctx.window.STUDY.blocks[2],3);assert.equal(st.myNotes.b03.text,'Q: Why a book?\nA: - one\n- two','Saving the same answer twice does nothing');
st.myNotes.b03.summary='- short';const mdText=a.notesMarkdown();assert(mdText.includes('## Part 3 — ')&&mdText.includes('Q: Why a book?')&&mdText.includes('**Summary**')&&!mdText.includes('## Part 4'),'notes.md lists only parts with notes');
const nv=a.notesView(ctx.window.STUDY.blocks[2]);assert(nv.includes('data-mynotes="b03"')&&nv.includes('Your notes path')&&(nv.match(/data-notes-open=/g)||[]).length===12);
console.log('PASS: Ask Claude thread, saving answers to notes, notes path and notes.md.');}

}
