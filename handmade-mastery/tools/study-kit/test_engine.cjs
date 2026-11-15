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
let logic=scripts[1].replace('function render(){','function render(){return;').replace('save(); render();\n})();',`globalThis.api={getState:()=>S,setState:p=>Object.assign(S,p),stepsFor,checkFor,normFb,migrate,goNextStep,est,estLeft,renderPath,renderStepRaw,checked,reviewItem,stepAudio,attemptsFor,checkClosed,gradeAttempt,checkFeedback,reviewCheck,pendingPractice,pendingHTML,positionBlock,setSample:v=>sample=v,setReference:v=>referenceStep=v,setHelper:v=>helperReady=v};\n})();`);
vm.runInContext(logic,ctx);const a=ctx.api;
assert.equal(a.getState().cur,'b03');assert.equal(a.getState().step,'watch');assert.equal(Object.keys(a.getState().completed).length,2);
assert.deepEqual(JSON.parse(JSON.stringify(a.getState().answers)),saved.answers);assert.deepEqual(JSON.parse(JSON.stringify(a.getState().rfb)),saved.rfb);
for(const b of ctx.window.STUDY.blocks){assert.equal(b.check.rubric.reduce((n,[,w])=>n+w,0),100);assert.equal(a.stepsFor(b).length,3);assert(!/yellow|green|edition|F7/i.test(b.check.q));for(const drill of [...b.interview||[],...b.debug||[]])assert.equal(drill.strong.reduce((n,[,w])=>n+w,0),100);}
let fb=a.normFb({awards:[65,10],right:'okay'},[['first',70],['second',30]]);assert.equal(fb.score,75);assert.equal(fb.score+fb.missing.reduce((n,m)=>n+m.pct,0),100);
fb=a.normFb({awards:[500,-2]},[['first',70],['second',30]]);assert.equal(fb.score,70);assert.throws(()=>a.normFb({awards:[NaN,0]},[['first',70],['second',30]]));assert.throws(()=>a.normFb({awards:[70]},[['first',70],['second',30]]));
const b3=ctx.window.STUDY.blocks[2];assert.equal(a.est(b3),9);
const largeTask={...b3,id:'large-task',practiceMinutes:60};a.getState().done[largeTask.id]={watch:true,recall:true};assert.equal(a.estLeft(largeTask),60,'Watching and checking must not discount hands-on work');
a.setState({cur:'b03',step:'watch',tab:'path',session:null,brk:null});let path=a.renderPath();assert(path.includes('Watch</button>'));assert(path.includes('Check</button>'));assert(path.includes('Practice</button>'));assert(!path.includes('video is covered'));
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
