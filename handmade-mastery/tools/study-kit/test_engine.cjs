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
let logic=scripts[1].replace('function render(){','function render(){return;').replace('save(); render();\n})();',`globalThis.api={getState:()=>S,setState:p=>Object.assign(S,p),stepsFor,checkFor,normFb,migrate,goNextStep,est,renderPath,renderStepRaw,checked,reviewItem,stepAudio,setReference:v=>referenceStep=v,setHelper:v=>helperReady=v};\n})();`);
vm.runInContext(logic,ctx);const a=ctx.api;
assert.equal(a.getState().cur,'b03');assert.equal(a.getState().step,'watch');assert.equal(Object.keys(a.getState().completed).length,2);
assert.deepEqual(JSON.parse(JSON.stringify(a.getState().answers)),saved.answers);assert.deepEqual(JSON.parse(JSON.stringify(a.getState().rfb)),saved.rfb);
for(const b of ctx.window.STUDY.blocks){assert.equal(b.check.rubric.reduce((n,[,w])=>n+w,0),100);assert.equal(a.stepsFor(b).length,3);assert(!/yellow|green|edition|F7/i.test(b.check.q));for(const drill of [...b.interview||[],...b.debug||[]])assert.equal(drill.strong.reduce((n,[,w])=>n+w,0),100);}
let fb=a.normFb({awards:[65,10],right:'okay'},[['first',70],['second',30]]);assert.equal(fb.score,75);assert.equal(fb.score+fb.missing.reduce((n,m)=>n+m.pct,0),100);
fb=a.normFb({awards:[500,-2]},[['first',70],['second',30]]);assert.equal(fb.score,70);assert.throws(()=>a.normFb({awards:[NaN,0]},[['first',70],['second',30]]));assert.throws(()=>a.normFb({awards:[70]},[['first',70],['second',30]]));
const b3=ctx.window.STUDY.blocks[2];assert.equal(a.est(b3),8);
a.setState({cur:'b03',step:'watch',tab:'path',session:null,brk:null});let path=a.renderPath();assert(path.includes('Watch</button>'));assert(path.includes('Check</button>'));assert(path.includes('Practice</button>'));assert(!path.includes('video is covered'));
a.goNextStep();assert.equal(a.getState().step,'recall');a.goNextStep();assert.equal(a.getState().step,'recall');a.getState().checkAnswers.b03='Compiler produces instructions for the target CPU';a.goNextStep();assert.equal(a.getState().step,'experiment');a.goNextStep();assert.equal(a.getState().cur,'b03');a.getState().practice.b03='Still to do';a.getState().checkFb.b03={score:100};assert.equal(a.checked(b3),false);a.getState().practiceDone.b03=true;assert.equal(a.checked(b3),true);a.goNextStep();assert.equal(a.getState().cur,'b04');assert.equal(a.getState().step,'watch');assert.equal(a.getState().brk,null);
// Revisiting an older completed part must preserve its original completion date.
a.setState({cur:'b01',step:'experiment'});a.getState().practice.b01='Tool previously verified';a.goNextStep();assert.equal(a.getState().cdate.b01,saved.cdate.b01);
a.setState({cur:'b02',step:'cards'});a.migrate();assert.equal(a.getState().step,'experiment');
a.setState({cur:'b03'});a.setReference('code');assert(a.stepAudio());a.setReference('explain');assert(a.stepAudio());
assert(a.reviewItem({source:'courses/intro-to-c/day01#b01'}));assert(a.reviewItem({source:'courses/intro-to-c/day01#b02/iv0'}));assert.equal(a.reviewItem({source:'courses/intro-to-c/day02#b01'}),null);
console.log('PASS: saved-progress migration, 3-step rendering, fixed grading totals/errors, time estimates, step transitions, completion history, deferred practice, optional audio and shared-review resolution.');
