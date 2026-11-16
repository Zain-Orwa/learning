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

assert.equal(a.getState().cur,'b03');assert.equal(a.getState().step,'watch');
assert.deepEqual(JSON.parse(JSON.stringify(a.getState().answers)),saved.answers);
assert.deepEqual(JSON.parse(JSON.stringify(a.getState().rfb)),saved.rfb);
assert(ctx.window.STUDY.storageKey.endsWith('-experiment'));
const b=ctx.window.STUDY.blocks[2];
const before=JSON.stringify(a.getState().done);
for(const [view,label] of [['watch','Watch'],['recall','Check'],['experiment','Practice']]){
  assert(a.selectStudyView(view));const html=a.renderPath();
  assert.equal((html.match(/role="tab"/g)||[]).length,3);
  assert.equal((html.match(/aria-selected="true"/g)||[]).length,1);
  assert(html.includes(label+'</button>'));
  assert(!html.includes('Key Takeaway'));assert(!html.includes('Mark finished'));
  assert(html.includes('Explanation &amp; Listen'));
  assert(!html.includes('Make a Prediction</button>'));
}
assert.equal(JSON.stringify(a.getState().done),before);
assert(!a.selectStudyView('guess'));assert(!a.selectStudyView('answer'));
assert(a.renderStepRaw(b,'experiment').includes('Predict the result · optional'));
let fb=a.normFb({awards:[40,20]},b.check.rubric);assert.equal(fb.score,60);
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
const box=a.askBox(ctx.window.STUDY.blocks[2],'code');assert(box.includes('data-ask-from="code"')&&box.includes('Explain this code line by line')&&box.includes('./experiment/study'),'Ask box has quick questions and a helper hint without Claude');
const rules=a.askRules(ctx.window.STUDY.blocks[2],'analogy');assert(/under 120 words/.test(rules)&&/parks for later/.test(rules)&&/translating a book/.test(rules),'Ask prompt stays short, inside the part, with the analogy as context');
a.saveAnswerToNotes(ctx.window.STUDY.blocks[2],3);assert.equal(st.myNotes.b03.text,'Q: Why a book?\nA: - one\n- two');assert(st.notes.b03[3].saved);
a.saveAnswerToNotes(ctx.window.STUDY.blocks[2],3);assert.equal(st.myNotes.b03.text,'Q: Why a book?\nA: - one\n- two','Saving the same answer twice does nothing');
st.myNotes.b03.summary='- short';const mdText=a.notesMarkdown();assert(mdText.includes('## Part 3 — ')&&mdText.includes('Q: Why a book?')&&mdText.includes('**Summary**')&&!mdText.includes('## Part 4'),'notes.md lists only parts with notes');
const nv=a.notesView(ctx.window.STUDY.blocks[2]);assert(nv.includes('data-mynotes="b03"')&&nv.includes('Your notes path')&&(nv.match(/data-notes-open=/g)||[]).length===12);
console.log('PASS: Ask Claude thread, saving answers to notes, notes path and notes.md.');}
