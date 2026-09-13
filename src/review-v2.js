/* Second review: assessment without invented lesson schedules; explainable links. */
const DRAFT_NOTICE='AI가 생성한 초안입니다. 교육과정 원문과 우리 반 수업에 맞는지 꼭 확인하고 수정·보완해 주세요.';
const METHOD_SOURCES={stas:'https://stas.moe.go.kr/cmn/main',guide:'https://star.moe.go.kr/web/contents/m40400.do?id=97698&schM=view'};
function quietNotice(host){host.appendChild(el('p','draft-notice',DRAFT_NOTICE));}
const v1Plan=panePlan;
panePlan=function(p,r,t){v1Plan(p,r,t);p.querySelectorAll('.warn,.review-warning').forEach(n=>n.remove());const note=el('p','draft-notice',DRAFT_NOTICE);p.prepend(note);};
teachDraft=function(r){return {summary:teachContent(r),steps:[],acts:[],topic:topicOf(r)};};
const oldEvalDraft=evalDraft;
const METHOD_MAP={
 '구술·질의응답':['구술·발표','질문 목록 · 발표 관찰 기록','guide'],
 '지필평가(서술형)':['서·논술형','서술 문항 · 채점 기준','guide'],
 '서·논술형':['서·논술형','답안 · 채점 기준','guide'],
 '수행평가(프로젝트·산출물)':['프로젝트','산출물 · 과정 기록','guide'],
 '포트폴리오':['포트폴리오','수정 전후 자료 모음','guide'],
 '수행평가(관찰)':['관찰','관찰 기록지','app'],
 '관찰평가(체크리스트)':['관찰','체크리스트 · 일화 기록','app'],
 '자기평가·동료평가':['자기평가·동료평가','성찰지 · 동료 의견','app'],
 '지필평가(선택형·단답형)':['선택형·단답형','문항 · 응답 기록','app']
};
function methodInfo(r,m){if(m==='수행평가(실험·실습·실기)')return ['체육','음악'].includes(r.subj)?['실기','수행 관찰 기록 · 채점 기준','app']:['실험·실습','실험·실습 기록 · 채점 기준','guide'];return METHOD_MAP[m]||[m,'교사가 과제에 맞게 정함','app'];}
function assessmentWays(r,ways){
 if(isReviewSample(r))return [
  {m:'구술·발표',tool:'장소 표현물 · 발표 기록',source:'guide',cat:'과정·기능',why:'장소에서의 경험과 느낌을 자신의 표현물과 함께 설명하는지 확인합니다.'},
  {m:'관찰',tool:'대화 장면의 일화 기록 · 체크리스트',source:'app',cat:'가치·태도',why:'다른 장소감을 듣고 비교하는 말, 상대의 느낌을 존중하는 행동을 실제 대화에서 기록합니다.'},
  {m:'포트폴리오',tool:'처음 표현물 · 비교 기록 · 수정한 안내 카드',source:'guide',cat:'과정·기능',why:'친구의 경험을 들은 뒤 장소에 대한 설명을 어떻게 보완했는지 수정 전후를 비교합니다.'}
 ];
 const out=[];for(const w of ways){const [m,tool,source]=methodInfo(r,w.m);if(!out.some(x=>x.m===m))out.push({...w,m,tool,source});}return out;
}
function feedbackRows(r){
 if(isReviewSample(r))return [
  ['느낌만 말하고 경험을 설명하지 못할 때','“즐거웠다는 느낌이 드는구나. 그곳에서 누구와 무슨 일을 했는지 한 장면을 덧붙여 볼까?”','그림 옆에 경험 한 문장을 붙이거나 말로 녹음한다.','표현물에 장소·경험·느낌이 연결되어 있는지 다시 본다.'],
  ['친구의 느낌이 다르다는 것은 알지만 까닭을 찾지 못할 때','“둘 다 운동장을 골랐지만 느낌은 다르네. 두 사람에게 있었던 일을 각각 표시해 볼까?”','두 표현물에서 경험을 밑줄 긋고, 공통점과 차이점을 하나씩 적는다.','서로 다른 느낌을 구체적인 경험에 근거해 설명하는지 확인한다.'],
  ['다른 느낌을 틀렸다고 판단할 때','“너에게는 익숙하지만 친구에게는 다른 경험이 있었구나. 친구의 말을 네 말로 먼저 옮겨 볼까?”','상대의 경험을 다시 말한 뒤, 안내 카드에 두 사람의 느낌을 나란히 담는다.','다음 대화에서 말을 끝까지 듣고 다른 느낌을 인정하는 말·행동을 관찰한다.'],
  ['여러 장소감을 근거와 함께 비교할 수 있을 때','“아직 듣지 못한 사람의 경험도 있을까? 그 이야기를 더하면 안내가 어떻게 달라질까?”','새로운 관점 하나를 더 조사하고 안내 카드의 설명을 수정한다.','새 사례에도 경험과 장소감의 관계를 적용하고 수정 이유를 설명하는지 본다.']
 ];
 const focus=conceptsOf(r,2).join(' · ')||r.a;
 return [
  ['답이나 표현에 근거가 빠져 있을 때',`“${focus}에 대해 네가 표현한 부분을 찾았어. 그렇게 생각한 까닭을 배운 자료에서 한 가지 골라 연결해 볼까?”`,'교과서에서 실제로 학습한 자료 한 부분을 선택하고, 자신의 답에 근거와 설명을 덧붙인다.','수정 전후 답을 나란히 보고 추가한 근거가 설명을 뒷받침하는지 확인한다.'],
  ['수행 과정의 특정 단계에서 막힐 때','“여기까지는 스스로 했구나. 다음에 할 일 하나만 말해 보고, 필요한 도움을 골라 볼까?”','성취기준이 요구하는 수행을 작은 단계로 나누고, 막힌 단계에만 예시나 질문을 제공한 뒤 다시 수행하게 한다.','같은 도움을 줄였을 때 그 단계를 스스로 수행하는지 확인한다.'],
  ['배운 내용을 새 사례에 적용할 수 있을 때',`“${focus}을 다른 사례에도 적용할 수 있을까? 그대로 적용할 수 있는 점과 바꿔야 하는 점을 설명해 보자.”`,'교과서에서 다룬 범위 안에서 조건이 다른 사례를 골라 설명이나 수행을 수정한다.','결과만 맞는지보다 조건의 차이와 수정 이유를 말하는지 확인한다.']
 ];
}
let feedbackEdits={};try{feedbackEdits=JSON.parse(localStorage.getItem('review-feedback-v2')||'{}');}catch(e){}
function feedbackText(r){return typeof feedbackEdits[r.c]==='string'?feedbackEdits[r.c]:feedbackRows(r).map(x=>`관찰: ${x[0]}\n교사의 말: ${x[1]}\n다시 해 볼 일: ${x[2]}\n재확인: ${x[3]}`).join('\n\n');}
evalDraft=function(r){const e=oldEvalDraft(r);return {...e,when:'교과서 학습 후 학교 계획에 맞게 설정',count:'학교 평가계획에 따라 설정',feedback:feedbackText(r),ways:assessmentWays(r,e.ways)};};
toolName=function(r,m){return m;};
function methodSources(host){const d=el('details','method-sources'),s=el('summary',null,'평가 방법 용어의 출처와 확인 범위');d.appendChild(s);
 d.appendChild(el('p',null,'학생평가 지원포털의 공개 메뉴에서는 ‘수행평가 도구’, ‘서·논술형 평가 도구’를 확인했습니다. 아래 세부 방법 전체가 포털의 표준 분류라는 근거는 확인하지 못했습니다.'));
 d.appendChild(el('p',null,'구술·발표, 토의·토론, 프로젝트, 실험·실습, 포트폴리오, 서·논술형은 교육부의 2020 과정중심 학생평가 안내에 나오는 명칭입니다. 이 안내를 포털의 최신 분류표로 간주하지 않습니다.'));
 d.appendChild(el('p',null,'체크리스트·관찰 기록지·산출물은 이 앱이 제안하는 기록 도구/자료로 분리했습니다. ‘관찰’, ‘실기’, ‘자기평가·동료평가’, ‘선택형·단답형’은 이번 공개 페이지 대조에서 포털 명칭을 확인하지 못해 앱 제안으로 표시합니다.'));
 for(const [text,url] of [['학생평가 지원포털 공개 메뉴',METHOD_SOURCES.stas],['교육부 2020 과정중심 학생평가 안내',METHOD_SOURCES.guide]]){const a=el('a',null,text);a.href=url;a.target='_blank';a.rel='noopener';d.appendChild(a);d.appendChild(document.createTextNode(' · '));}
 d.appendChild(el('p','src','확인: 2026-09-12 · 공식 평가 예시에 인용된 명칭은 바꾸지 않습니다.'));host.appendChild(d);
}
paneLesson=function(p,r,t){
 originalPaneLesson(p,r,t);
 p.querySelectorAll('.warn').forEach(n=>n.remove());p.prepend(el('p','draft-notice',DRAFT_NOTICE+' 차시 흐름은 제공하지 않습니다.'));
 const titles=[...p.querySelectorAll('h4.sec')];
 const feedbackTitle=titles.find(n=>n.textContent.startsWith('피드백 방안'));
 if(feedbackTitle){const old=feedbackTitle.nextElementSibling;const wrap=el('div','feedback-board');
  const intro=el('p','review-muted',isReviewSample(r)?'학생의 실제 표현과 대화에서 아래 모습을 관찰했을 때 골라 사용하세요.':'공통 피드백 초안입니다. 해당 성취기준에서 실제로 관찰한 장면과 교과서 학습 내용에 맞게 구체화하세요.');wrap.appendChild(intro);
  feedbackRows(r).forEach((row,i)=>{const d=el('details','feedback-case');if(i===0)d.open=true;d.appendChild(el('summary',null,row[0]));['교사의 말','다시 해 볼 일','재확인할 증거'].forEach((label,j)=>{d.appendChild(el('strong',null,label));d.appendChild(el('p',null,row[j+1]));});wrap.appendChild(d);});
  const edit=el('details','feedback-case');edit.appendChild(el('summary',null,'피드백 초안 전체 수정·저장'));const ta=el('textarea');ta.value=feedbackText(r);ta.rows=12;ta.setAttribute('aria-label','피드백 방안 편집');edit.appendChild(ta);const save=el('button','btn','피드백 저장');save.onclick=()=>{try{const next={...feedbackEdits,[r.c]:ta.value};localStorage.setItem('review-feedback-v2',JSON.stringify(next));feedbackEdits=next;reviewToast('피드백을 저장했습니다. 복사·내보내기에 반영됩니다.');}catch(e){reviewToast('저장하지 못했습니다. 내용을 복사해 보관해 주세요.');}};edit.appendChild(save);wrap.appendChild(edit);const cp=el('button','btn','피드백 복사');cp.onclick=()=>copy(feedbackText(r),cp);wrap.appendChild(cp);old.replaceWith(wrap);}
 const methodTitle=titles.find(n=>n.textContent.startsWith('평가 방법 제안'));
 if(methodTitle){let next=methodTitle.nextElementSibling;while(next&&!next.matches('h4.sec')){const n=next.nextElementSibling;next.remove();next=n;}
  const block=el('div','method-grid');evalDraft(r).ways.forEach(w=>{const c=el('div','method-card');c.appendChild(el('strong',null,w.m));c.appendChild(el('p',null,w.why));c.appendChild(el('p','src','도구/자료 제안: '+w.tool));c.appendChild(el('p','method-tag',w.source==='guide'?'교육부 안내에서 명칭 확인':'앱 제안 · 포털 명칭 미확인'));block.appendChild(c);});const more=el('div');more.appendChild(block);methodSources(more);methodTitle.after(more);}
};
// Keep the edited representative design and the new assessment together in MD.
const v1Md=mdOf;
mdOf=function(rows){return rows.map(r=>{let out=v1Md([r]);if(isReviewSample(r))out+='\n\n## 평가 계획 · AI 초안\n'+evalDraft(r).ways.map(w=>'- '+w.m+' / 도구 제안: '+w.tool).join('\n')+'\n\n### 피드백 방안\n'+feedbackText(r);return out;}).join('\n\n---\n\n');};

function scoreDetails(r,o){
 const d=el('details','score-details');d.appendChild(el('summary',null,'텍스트 유사도 '+(100*cos(r._v,o._v)).toFixed(1)+'% · 계산 근거'));
 d.appendChild(el('p',null,'이 비율은 함께 가르칠 적합성이나 선수학습 확률이 아닙니다. 단어의 가중치를 비교한 값으로, 표현이 비슷해도 학습 의미는 다를 수 있습니다.'));
 const contributions=[...r._v].filter(([k])=>o._v.has(k)).map(([k,w])=>({k,v:w*o._v.get(k)})).sort((a,b)=>b.v-a.v);
 const top=contributions.slice(0,6);top.forEach(x=>{const row=el('div','contribution-row');row.appendChild(el('span',null,x.k));const meter=el('div','contribution-track'),fill=el('i');fill.style.width=((x.v/(contributions[0]?.v||1))*100)+'%';meter.appendChild(fill);row.appendChild(meter);row.appendChild(el('span',null,'+'+(100*x.v).toFixed(2)+'%p'));d.appendChild(row);});
 const rest=contributions.slice(6).reduce((s,x)=>s+x.v,0);d.appendChild(el('p','src','그 밖의 공통 단어 기여: '+(100*rest).toFixed(2)+'%p · 반올림으로 합계가 조금 다를 수 있습니다. 막대는 가장 큰 단어 기여에 대한 상대 길이입니다.'));
 const math=el('details');math.appendChild(el('summary',null,'입력 자료와 계산식'));math.appendChild(el('p',null,'성취기준 본문 단어의 출현은 3배, A·B·C 성취수준·해설·탐구 활동의 출현은 각각 1배로 셉니다. 조사·어미와 불용어를 규칙으로 처리하며, 긴 단어의 앞 4글자도 색인에 들어갈 수 있습니다. 코드·영역 이름은 점수 입력에 포함되지 않습니다.'));
 math.appendChild(el('p',null,'611개 자료 중 35%를 넘는 기준에 등장하는 단어는 제외합니다. 가중치 = (1 + ln 가중 출현수) × ln(전체 기준 수 / 단어가 등장한 기준 수). 각 문서 벡터의 길이를 1로 만든 뒤 공통 단어 가중치의 곱을 합산하고 ×100 합니다.'));
 math.appendChild(el('p',null,'연관 후보는 유사도 4% 초과에서 상위 14개, 다른 학년군 추정 후보는 8% 초과에서 상위 3개입니다. 후보 표시용 문턱이며 교육적으로 검증한 기준점이 아닙니다.'));d.appendChild(math);return d;
}
const legacyRelCard=relCard;
relCard=function(o,s,k){const c=legacyRelCard(o,s,k);if(s!=null){const b=c.querySelector('.score');if(b)b.textContent='텍스트 '+(s*100).toFixed(1)+'%';const detail=scoreDetails(S.sel,o);detail.onclick=e=>e.stopPropagation();c.appendChild(detail);}return c;};
function verbSummary(r){const found=(r.t.match(/표현|비교|설명|탐구|분석|추론|조사|존중|실천|관찰|이해|참여|해결|탐색|평가|판단|계산|측정/g)||[]);return [...new Set(found)].slice(0,5);}
function relationCompare(host,r,o){
 host.innerHTML='';host.appendChild(el('h3',null,'두 성취기준을 나란히 읽기'));
 const grid=el('div','relation-compare');[r,o].forEach((x,i)=>{const box=el('div','relation-quote');box.appendChild(el('span','src',i?'연결 후보':'현재 기준'));box.appendChild(el('strong',null,x.c+' · '+x.subj));box.appendChild(el('p',null,x.t));box.appendChild(el('span','src','본문에서 찾은 수행 표현: '+(verbSummary(x).join(' · ')||'직접 확인')));grid.appendChild(box);});host.appendChild(grid);
 const common=commonKw(r,o);host.appendChild(el('p',null,'공통 표현 후보: '+(common.join(' · ')||'대표 단어 없음 · 계산 근거에서 확인')));
 const diff=verbSummary(o).filter(v=>!verbSummary(r).includes(v));host.appendChild(el('p','relation-insight','비교할 지점: '+(diff.length?'연결 후보에는 ‘'+diff.join(' · ')+'’ 표현이 더 있습니다. 활동에 이 수행을 더할 수 있는지 확인하세요.':'수행 표현이 비슷합니다. 다루는 대상과 맥락이 같은지도 원문에서 확인하세요.')+' 단어 차이만으로 학습 난도나 위계를 판단하지 않습니다.'));
 const guide=el('details');guide.appendChild(el('summary',null,'함께 설계할 때 확인할 질문'));['같은 개념을 다루는가, 이름만 비슷한가?','한 활동에서 두 기준이 요구하는 수행을 각각 관찰할 수 있는가?','다른 학년군의 기준이라면 이미 배운 내용인지, 새로 가르쳐야 할 내용인지?'].forEach(t=>guide.appendChild(el('p',null,t)));host.appendChild(guide);
 host.appendChild(scoreDetails(r,o));const actions=el('div','dact');const go=el('button','btn','이 기준 자세히 보기');go.onclick=()=>goto(o);actions.appendChild(go);const add=el('button','btn',S.cart.has(o.c)?'바구니에서 빼기':'+ 함께 담기');add.onclick=()=>{S.cart.has(o.c)?S.cart.delete(o.c):S.cart.add(o.c);saveCart();add.textContent=S.cart.has(o.c)?'바구니에서 빼기':'+ 함께 담기';};actions.appendChild(add);const cp=el('button','btn','두 기준 원문 복사');cp.onclick=()=>copy([r,o].map(x=>x.c+' '+x.t).join('\n'),cp);actions.appendChild(cp);host.appendChild(actions);
}
paneRel=function(p,r){
 p.appendChild(el('div','review-kicker','학년군과 교과를 넘나드는 자료 탐색'));
 p.appendChild(el('h2','review-heading','무엇이 이어지고, 무엇이 달라질까?'));
 p.appendChild(el('p','review-muted','카드를 선택하면 원문·수행 표현·공통 단어를 비교합니다. 선은 비교 방향이며 검증된 선수학습 관계를 뜻하지 않습니다.'));
 const timeline=el('div','band-map'),compare=el('section','relation-inspector');compare.id='relationInspector';compare.setAttribute('aria-live','polite');
 let first=null;
 BANDS.forEach((bn,bi)=>{const col=el('section','band-column'+(bi===r.b?' current':''));col.appendChild(el('h3',null,shortBand(bn)));const current=bi===r.b;
  let candidates=[];let label='';if(current){candidates=[{o:r,s:1}];label='현재 살펴보는 기준';}else{const ser=seriesOf(r);if(ser){candidates=ser.filter(x=>x.b===bi).map(o=>({o,s:cos(r._v,o._v)})).sort((a,b)=>b.s-a.s).slice(0,3);label='같은 코드 계열 · 유사도 상위 최대 3개';}else{candidates=seqGuess(r,bi);label='같은 교과의 유사 표현 후보';}}
  col.appendChild(el('p','src',label));if(!candidates.length)col.appendChild(el('p','band-empty','이 학년군에는 표시할 후보가 없습니다. 해당 교과 자료가 없거나 유사도 문턱을 넘지 못했습니다.'));
  candidates.forEach(({o,s})=>{const b=el('button','band-card');b.appendChild(el('strong',null,o.c));b.appendChild(el('span',null,o.t));b.appendChild(el('small',null,current?'현재 기준':'텍스트 유사도 '+(100*s).toFixed(1)+'%'));b.onclick=()=>{p.querySelectorAll('.band-card,.related-tile').forEach(x=>x.classList.remove('active'));b.classList.add('active');relationCompare(compare,r,o);compare.scrollIntoView({behavior:'smooth',block:'nearest'});};col.appendChild(b);if(!current&&!first)first=o;});timeline.appendChild(col);});p.appendChild(timeline);const expand=el('button','btn','학년군별 후보 더 보기');expand.onclick=()=>{timeline.classList.toggle('expanded');expand.textContent=timeline.classList.contains('expanded')?'학년군별 대표 후보만 보기':'학년군별 후보 더 보기';};p.appendChild(expand);
 const h=el('h3',null,'교과 간 연결 후보');p.appendChild(h);const modes=el('div','dact');[['bandCross','같은 학년군 · 다른 교과'],['band','같은 학년군'],['subject','같은 교과'],['all','전체']].forEach(([mode,label])=>{const b=el('button','btn'+(S.relMode===mode?' on':''),label);b.setAttribute('aria-pressed',String(S.relMode===mode));b.onclick=()=>{S.relMode=mode;renderDetail();};modes.appendChild(b);});p.appendChild(modes);
 const cats=el('div','dact');[null,...CATS].forEach(cat=>{const b=el('button','btn'+(S.relCat===cat?' on':''),cat||'범주 전체');b.onclick=()=>{S.relCat=cat;renderDetail();};cats.appendChild(b);});p.appendChild(cats);p.appendChild(el('p','src','범주는 기존 앱의 자동 추정입니다. 후보 목록은 선택한 범위에서 최대 14개입니다.'));
 const sims=similar(r,S.relMode,S.relCat),groups=new Map();sims.forEach(x=>{if(!groups.has(x.o.subj))groups.set(x.o.subj,[]);groups.get(x.o.subj).push(x);});
 const explorer=el('div','relation-explorer');const constellation=el('div','subject-map');for(const [subj,items] of groups){const group=el('section','subject-group');group.appendChild(el('h4',null,subj+' · '+items.length+'개'));items.forEach(({o,s})=>{const b=el('button','related-tile');b.appendChild(el('strong',null,o.c+' · '+(s*100).toFixed(1)+'%'));b.appendChild(el('span',null,o.t));const track=el('span','similarity-track'),fill=el('i');fill.style.width=(s*100)+'%';track.appendChild(fill);b.appendChild(track);b.appendChild(el('small',null,'공통 표현: '+(commonKw(r,o).slice(0,3).join(' · ')||'계산 근거에서 확인')));b.onclick=()=>{p.querySelectorAll('.band-card,.related-tile').forEach(x=>x.classList.remove('active'));b.classList.add('active');relationCompare(compare,r,o);compare.scrollIntoView({behavior:'smooth',block:'nearest'});};group.appendChild(b);});constellation.appendChild(group);}explorer.appendChild(constellation);
 if(!sims.length)p.appendChild(el('p','review-muted','이 범위에서 연관 후보를 찾지 못했습니다. 범위를 넓혀 보세요.'));
 p.appendChild(el('p','src','막대와 %는 텍스트 유사도입니다. 교과 묶음은 현재 표시한 후보 수이며 교육과정 전체의 비중이 아닙니다.'));
 explorer.appendChild(compare);p.appendChild(explorer);const chosen=sims[0]?.o||first;if(chosen)relationCompare(compare,r,chosen);else compare.appendChild(el('p',null,'비교할 다른 기준이 없습니다. 범위를 바꾸어 보세요.'));
};
