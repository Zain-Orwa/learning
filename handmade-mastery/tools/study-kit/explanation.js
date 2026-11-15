/* Explanation card: a reusable, data-driven panel. Lesson data may set b.explainCard:
   { title, summary:{title,text}, analogy:{title,text},
     concepts:[{icon, label?, text, highlights?:[]}], clarification, fullExplanation }
   Anything missing falls back to the block's oneLiner, analogy and explain fields. */
const XC_ICONS={
book:'<svg viewBox="0 0 32 32"><path d="M2.5 9.5v15c5-1.6 9.4-1 13.5 1.8 4.1-2.8 8.5-3.4 13.5-1.8v-15" fill="none" stroke="#f7e4b0" stroke-width="2.2" stroke-linejoin="round"/><path d="M4.5 7.2c4-1.2 7.8-.6 11.5 2v15.2c-3.7-2.5-7.5-3.1-11.5-2z" fill="#3a2414" stroke="#f7e4b0" stroke-width="2" stroke-linejoin="round"/><path d="M27.5 7.2c-4-1.2-7.8-.6-11.5 2v15.2c3.7-2.5 7.5-3.1 11.5-2z" fill="#3a2414" stroke="#f7e4b0" stroke-width="2" stroke-linejoin="round"/></svg>',
target:'<svg viewBox="0 0 40 40"><circle cx="18" cy="22" r="15" fill="#c8562f" stroke="#5a2412" stroke-width="1.4"/><circle cx="18" cy="22" r="11.2" fill="#f6e7c6"/><circle cx="18" cy="22" r="7.6" fill="#c8562f"/><circle cx="18" cy="22" r="4" fill="#f6e7c6"/><circle cx="18" cy="22" r="1.7" fill="#7a2c14"/><path d="M18.6 21.4 33 7" stroke="#5a3a20" stroke-width="2.2" stroke-linecap="round"/><path d="M31 5.2 35.6 3l-1.3 4.7 4.2.4-4 3.3-3.6-.6-.6-3.6z" fill="#d9a441" stroke="#5a3a20" stroke-width="1" stroke-linejoin="round"/></svg>',
gear:'<svg viewBox="0 0 32 32"><path d="M13.6 2.5h4.8l.8 3.6 2.6 1.1 3.1-2 3.4 3.4-2 3.1 1.1 2.6 3.6.8v4.8l-3.6.8-1.1 2.6 2 3.1-3.4 3.4-3.1-2-2.6 1.1-.8 3.6h-4.8l-.8-3.6-2.6-1.1-3.1 2-3.4-3.4 2-3.1-1.1-2.6-3.6-.8v-4.8l3.6-.8 1.1-2.6-2-3.1 3.4-3.4 3.1 2 2.6-1.1z" fill="#4f7d8c" stroke="#1d3d47" stroke-width="1.3" stroke-linejoin="round"/><circle cx="16" cy="16" r="5" fill="#a9c9d2" stroke="#1d3d47" stroke-width="1.3"/><path d="M8.5 11.5a9 9 0 0 1 6-4.4" stroke="#9cc3ce" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>',
terminal:'<svg viewBox="0 0 34 30"><rect x="1.5" y="2" width="31" height="25" rx="4.5" fill="#173039" stroke="#0a181d" stroke-width="1.4"/><rect x="3.5" y="4" width="27" height="21" rx="2.8" fill="#1f3f4a"/><path d="m8 10 5 4-5 4" fill="none" stroke="#eaf5f7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 19.5h8" stroke="#eaf5f7" stroke-width="2.2" stroke-linecap="round"/></svg>',
window:'<svg viewBox="0 0 32 32"><rect x="2" y="2.5" width="28" height="27" rx="4.5" fill="#2f6676" stroke="#12323b" stroke-width="1.4"/><rect x="5.5" y="6" width="9.6" height="9" rx="1.6" fill="#f4e8c8"/><rect x="17" y="6" width="9.6" height="9" rx="1.6" fill="#f4e8c8"/><rect x="5.5" y="17" width="9.6" height="9" rx="1.6" fill="#f4e8c8"/><rect x="17" y="17" width="9.6" height="9" rx="1.6" fill="#dcebee"/></svg>',
info:'<svg viewBox="0 0 34 34"><circle cx="17" cy="17" r="14.5" fill="#f2c44f" stroke="#6b4512" stroke-width="1.8"/><circle cx="17" cy="17" r="11.6" fill="none" stroke="#fbe28f" stroke-width="1.2"/><circle cx="17" cy="10.4" r="2" fill="#4a2e0c"/><path d="M14.4 14.6h3.9v8.6h1.6v1.8h-5.6v-1.8h1.5v-6.8h-1.4z" fill="#4a2e0c"/></svg>',
file:'<svg viewBox="0 0 32 32"><path d="M7 2.5h12.5L26 9v20.5H7z" fill="#f8f0da" stroke="#3a2614" stroke-width="1.4" stroke-linejoin="round"/><path d="M19.5 2.5V9H26" fill="#e7d7ae" stroke="#3a2614" stroke-width="1.4" stroke-linejoin="round"/><path d="M10.5 14h12M10.5 18h12M10.5 22h8" stroke="#8d7651" stroke-width="1.5" stroke-linecap="round"/></svg>',
chip:'<svg viewBox="0 0 32 32"><path d="M11 3v4M16 3v4M21 3v4M11 25v4M16 25v4M21 25v4M3 11h4M3 16h4M3 21h4M25 11h4M25 16h4M25 21h4" stroke="#b98d35" stroke-width="2" stroke-linecap="round"/><rect x="6.5" y="6.5" width="19" height="19" rx="3" fill="#24434d" stroke="#0f2329" stroke-width="1.4"/><rect x="11" y="11" width="10" height="10" rx="1.5" fill="#6f9cab"/></svg>',
chain:'<svg viewBox="0 0 32 32"><g fill="none" stroke="#1d3d47" stroke-width="3.4"><rect x="3" y="11" width="15" height="10" rx="5" transform="rotate(-35 10.5 16)"/><rect x="14" y="11" width="15" height="10" rx="5" transform="rotate(-35 21.5 16)"/></g><g fill="none" stroke="#9cc3ce" stroke-width="1.5"><rect x="3" y="11" width="15" height="10" rx="5" transform="rotate(-35 10.5 16)"/><rect x="14" y="11" width="15" height="10" rx="5" transform="rotate(-35 21.5 16)"/></g></svg>',
box:'<svg viewBox="0 0 32 32"><path d="M3.5 10 16 4l12.5 6v13L16 29 3.5 23z" fill="#a8743f" stroke="#3a2414" stroke-width="1.4" stroke-linejoin="round"/><path d="M3.5 10 16 16l12.5-6M16 16v13" fill="none" stroke="#3a2414" stroke-width="1.4" stroke-linejoin="round"/><path d="M3.5 10 16 16 28.5 10 16 4z" fill="#c9935a" stroke="#3a2414" stroke-width="1.4" stroke-linejoin="round"/><path d="m9.6 7 12.6 6.1v4.6" fill="none" stroke="#f1dca8" stroke-width="2"/></svg>',
flag:'<svg viewBox="0 0 32 32"><path d="M7 3v27" stroke="#4a3220" stroke-width="2.4" stroke-linecap="round"/><path d="M8 5c5-2 8 2 13 0s5-1 7 0v11c-2-1-3-2-7 0s-8-2-13 0z" fill="#d9a441" stroke="#5a3a1a" stroke-width="1.3" stroke-linejoin="round"/></svg>',
tag:'<svg viewBox="0 0 32 32"><path d="M3.5 5.5v10L17 29l12-12L15.5 3.5h-10z" fill="#f0c45a" stroke="#6b4512" stroke-width="1.4" stroke-linejoin="round"/><circle cx="10" cy="10" r="2.4" fill="#fbf1d0" stroke="#6b4512" stroke-width="1.3"/></svg>',
arrow:'<svg viewBox="0 0 32 32"><path d="M3 13h15V7l11 9-11 9v-6H3z" fill="#d9a441" stroke="#5a3a1a" stroke-width="1.4" stroke-linejoin="round"/></svg>',
list:'<svg viewBox="0 0 32 32"><rect x="4" y="3" width="24" height="26" rx="2.5" fill="#f6ecd2" stroke="#3a2614" stroke-width="1.4"/><g fill="#c8562f"><circle cx="9.5" cy="10" r="1.6"/><circle cx="9.5" cy="16" r="1.6"/><circle cx="9.5" cy="22" r="1.6"/></g><path d="M13 10h10M13 16h10M13 22h7" stroke="#6a5534" stroke-width="1.5" stroke-linecap="round"/></svg>'
};
function xcIcon(name,cls=''){return `<span class="xc-icon ${cls}" aria-hidden="true">${XC_ICONS[name]||XC_ICONS.book}</span>`;}
/* Signpost illustration; the two board words come from the analogy title. */
function xcSign(title){
  const words=String(title||'Real-life picture').split(/\s+/),top=words[0]||'',low=words.slice(1).join(' ');
  const fit=t=>Math.min(14,92/Math.max(1,t.length*.6)).toFixed(1);
  // Snow on top of a board of width w: numbers are joined with spaces so "16" and ".6" never merge into "16.6".
  const cap=(x,w,y)=>{const n=v=>+v.toFixed(2),k=f=>n(w*f);
    return `<path d="M ${[x,n(y+1.5)].join(' ')} q ${[k(.18),-4,k(.42),-2.2].join(' ')} t ${[k(.4),-.6].join(' ')} q ${[k(.14),.4,k(.18),2.2].join(' ')} c ${[-k(.08),1.2,-k(.2),.6,-k(.3),1.6, -k(.1),-1.4,-k(.36),-.4,-k(.5),0, -k(.12),.2,-k(.2),-.4,-k(.2),-1].join(' ')} z" fill="#fbfeff"/>`;};
  return `<span class="xc-sign" aria-hidden="true"><svg viewBox="0 0 120 96"><path d="M6 94c14-8 34-8 54-7s38 2 54 7z" fill="#e6f3f6"/><g stroke-linecap="round" stroke-width="2" fill="none"><path d="M42 92c-2-6-6-10-11-12M47 91c0-6-2-11-5-14" stroke="#4f7e5c"/><path d="M71 92c2-7 6-11 11-13M76 92c3-5 7-8 12-9M66 91c0-5 1-9 3-12" stroke="#3f6b4c"/></g><rect x="52" y="8" width="10" height="85" rx="2" fill="#5b3c22" stroke="#2f1d0f" stroke-width="1.4"/><path d="M55 14v74" stroke="#75502f" stroke-width="1.4"/><path d="M50.5 9c2-3.6 11-3.6 13 0 .5 1.8-1.4 1.6-2 3-1-1.4-2.6-.8-3.6 0-1-1.2-6-.4-7.4-3z" fill="#fbfeff"/><path d="M4 20h86l12 12-12 12H4z" fill="#86552d" stroke="#2f1d0f" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 27h78M7 37h80" stroke="#6e4423" stroke-width="1.1"/>${cap(4,86,18)}<text x="48" y="37" text-anchor="middle" font-size="${fit(top)}" class="xc-sign-text">${esc(top)}</text><path d="M24 52h80l12 12-12 12H24z" fill="#7d4f2a" stroke="#2f1d0f" stroke-width="1.6" stroke-linejoin="round"/><path d="M27 59h74M27 69h76" stroke="#663f20" stroke-width="1.1"/>${cap(24,80,50)}<text x="66" y="69" text-anchor="middle" font-size="${fit(low)}" class="xc-sign-text">${esc(low)}</text></svg></span>`;
}
/* Mark the first whole-word occurrence of each key term with a pill. Matching runs on the raw
   text, so entities, `code` spans and earlier pills are never split or nested. */
function xcHighlight(text,terms){
  text=String(text||'');const taken=[];
  for(const m of text.matchAll(/`[^`]+`/g))taken.push([m.index,m.index+m[0].length,null]);
  const word=/\w/,free=(a,b)=>!taken.some(([x,y])=>a<y&&b>x);
  for(const term of terms||[]){
    if(!term)continue;
    for(let i=text.indexOf(term);i>=0;i=text.indexOf(term,i+1)){
      const j=i+term.length,edge=(word.test(term[0])&&word.test(text[i-1]||''))||(word.test(term[term.length-1])&&word.test(text[j]||''));
      if(!edge&&free(i,j)){taken.push([i,j,term]);break;}
    }
  }
  let out='',at=0;
  for(const [i,j,term] of taken.filter(t=>t[2]).sort((p,q)=>p[0]-q[0])){out+=md(text.slice(at,i))+`<mark class="xc-pill${term.length<=18?' xc-nowrap':''}">${md(term)}</mark>`;at=j;}
  return out+md(text.slice(at));
}
function explanationData(b){
  const c=b.explainCard||{},intro=(b.explain||'').match(/<p>([\s\S]*?)<\/p>/i);
  return {
    title:c.title||'Explanation',
    summary:c.summary||(b.oneLiner?{title:'The idea in one sentence',text:b.oneLiner}:null),
    analogy:c.analogy||(b.analogy?{title:'Real-life picture',text:b.analogy}:null),
    concepts:c.concepts||(intro?[{icon:'book',html:intro[1]}]:[]),
    clarification:c.clarification||'',
    fullExplanation:c.fullExplanation||b.explain||''
  };
}
function explanationPanel(b){
  const x=explanationData(b),id=`xc-${b.id}`;
  const row=c=>`<li>${xcIcon(c.icon)}<p>${c.label?`<mark class="xc-pill xc-label">${esc(c.label)}</mark> `:''}${c.html!=null?c.html:xcHighlight(c.text,c.highlights)}</p></li>`;
  return `<section class="xcard" aria-labelledby="${id}"><div class="xc-inner">
<h2 class="xc-plate" id="${id}">${xcIcon('book','xc-plate-icon')}<span>${esc(x.title)}</span></h2>
${x.summary?`<div class="xc-idea">${xcIcon('target','xc-idea-icon')}<div><h3>${esc(x.summary.title)}:</h3><p>${md(x.summary.text)}</p></div></div>`:''}
${x.analogy?`<div class="xc-picture">${xcSign(x.analogy.title)}<p><strong>${esc(x.analogy.title)}:</strong> ${md(x.analogy.text)}</p></div>`:''}
${x.concepts.length?`<ul class="xc-rows">${x.concepts.map(row).join('')}</ul>`:''}
${x.clarification?`<aside class="xc-note">${xcIcon('info')}<p>${md(x.clarification)}</p></aside>`:''}
${x.fullExplanation?`<button class="xc-more" data-ui="full-explanation">Read the full explanation <span aria-hidden="true">→</span></button>`:''}
</div></section>`;
}
