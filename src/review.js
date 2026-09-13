/* Review-only interaction layer. Official records remain unchanged. */
const REVIEW_CODE='[4사01-01]';
const REVIEW_KEY='curriculum-review-design-v1';
const REVIEW_PDF='[별책7] 사회과 교육과정 - 초등만.pdf';
const REVIEW_LEVEL_PDF='★(초)2022개정교육과정에따른성취수준(3~4학년군).pdf';
function isReviewSample(r){return r&&r.c===REVIEW_CODE;}
const REVIEW_DEFAULT={
  context:'학교 운동장과 도서관에서 서로 다르게 느꼈던 경험을 나눈다. 공개하기 어려운 경험은 말하지 않아도 되며 가상의 사례를 사용할 수 있다.',
  concepts:'장소, 경험, 관점, 장소감',
  relation:'같은 장소라도 사람의 경험과 관점에 따라 서로 다른 의미를 가질 수 있다.',
  fact:'내가 고른 장소에서 어떤 일이 있었으며, 그때 어떤 느낌이 들었는가?',
  factEvidence:'장소 한 곳을 골라 그림·글·심상지도 중 원하는 방식으로 경험과 느낌을 표현한다. 표현한 내용에서 경험과 느낌을 구별해 표시한다.',
  conceptual:'같은 장소에 대한 느낌이 서로 다른 까닭을 두 사람의 경험에서 어떻게 찾을 수 있을까?',
  conceptualEvidence:'같은 장소를 고른 두 사람의 표현을 비교한다. 공통점과 차이점, 그렇게 느끼게 된 경험을 표에 기록하고 관계 문장을 설명한다.',
  discussion:'우리 반 장소 안내도에는 가장 많은 친구가 느낀 점만 담아도 괜찮을까?',
  discussionEvidence:'다수의 느낌만 담은 안내도와 서로 다른 느낌을 함께 담은 안내도를 비교한다. 누구의 경험이 드러나거나 빠지는지 근거를 들어 의견을 나눈다.',
  transfer:'새로 전학 온 친구를 위한 학교 장소 안내 카드를 만든다. 한 장소에 대해 서로 다른 두 경험과 느낌을 담고, 친구의 느낌을 함부로 판단하지 않는 소개 문장을 쓴다.',
  evidence:'① 경험과 느낌이 표현물에서 드러나는가? ② 서로 다른 장소감을 구체적인 경험에 근거해 비교하는가? ③ 친구의 느낌을 듣고 존중하는 말이나 행동을 보이는가?',
  revision:'친구의 표현을 본 뒤 내 설명에 더하거나 바꾼 부분과 그 이유를 적는다.'
};
let reviewDraft={...REVIEW_DEFAULT},reviewSaved=false;
try{const x=JSON.parse(localStorage.getItem(REVIEW_KEY)||'null');if(x&&x.version===1&&x.code===REVIEW_CODE){for(const k in REVIEW_DEFAULT)if(typeof x.fields?.[k]==='string')reviewDraft[k]=x.fields[k];reviewSaved=true;}}catch(e){}
function reviewToast(message){let n=$('#reviewToast');if(!n){n=el('div','review-toast');n.id='reviewToast';n.setAttribute('role','status');document.body.appendChild(n);}n.textContent=message;n.hidden=false;clearTimeout(reviewToast.timer);reviewToast.timer=setTimeout(()=>n.hidden=true,2600);}
function reviewSourceText(r){return isReviewSample(r)?`${REVIEW_PDF} · 인쇄 19쪽 / PDF 25쪽\n교육부 고시 제2022-33호 [별책7]`:`${(window.__SRC||[]).join('\n')}\n${r.pg?'교육과정 기록 쪽: '+r.pg+' (PDF 위치 미검증)':'항목별 원문 쪽 미검증'}`;}
function addReviewCopyActions(host,r){
  const b=el('button','btn on','코드+원문 복사');b.id='copyStandard';b.onclick=()=>copy(r.c+' '+r.t,b);host.appendChild(b);
  const s=el('button','btn','출처 포함 복사');s.onclick=()=>copy(r.c+' '+r.t+'\n\n출처: '+reviewSourceText(r),s);host.appendChild(s);
}
function reviewLink(host,label,file,page){const a=el('a',null,label);a.href='../'+encodeURIComponent(file)+'#page='+page;a.target='_blank';a.rel='noopener';host.appendChild(a);}
function addReviewSource(host,r){
  if(!isReviewSample(r))return;
  const box=el('div','review-source');
  box.appendChild(el('strong',null,'원문 단원: 우리가 사는 곳'));
  box.appendChild(el('p',null,'내용 체계 연결 제안: '+domName(r)+' · 공식 대응표가 아닌 검토용 연결'));
  const detail=el('details');detail.appendChild(el('summary',null,'기존 연결과 제안 근거 보기'));
  detail.appendChild(el('p',null,'기존 앱은 이 성취기준을 한국사에 연결했습니다. 내용 체계의 ‘장소 경험과 장소감’ 및 성취기준 해설을 근거로 지리 인식 연결을 제안합니다.'));
  detail.appendChild(el('p',null,'단원명과 성취기준 문장은 그대로 유지했습니다. 다른 영역은 이번 수정 범위에 포함되지 않습니다.'));
  const contentLink=el('p');reviewLink(contentLink,'연결 근거 원문 · 내용 체계 인쇄 8쪽 / PDF 14쪽',REVIEW_PDF,14);detail.appendChild(contentLink);
  box.appendChild(detail);
  const p=el('p');reviewLink(p,'교육과정 원문 · 인쇄 19쪽 / PDF 25쪽',REVIEW_PDF,25);box.appendChild(p);
  const p2=el('p');reviewLink(p2,'성취수준 원문 · 인쇄 34쪽 / PDF 38쪽',REVIEW_LEVEL_PDF,38);box.appendChild(p2);
  host.appendChild(box);
}
function reviewField(host,key,label,hint){const l=el('label','review-field',label),t=el('textarea');t.id='review-'+key;t.value=reviewDraft[key];t.rows=key.includes('Evidence')?4:3;t.oninput=()=>{reviewDraft[key]=t.value;reviewSaved=false;const s=$('#reviewSaveStatus');if(s)s.textContent='수정됨 · 이 브라우저에 저장해 주세요';};l.appendChild(t);if(hint)l.appendChild(el('small',null,hint));host.appendChild(l);return t;}
function reviewSection(host,n,title){const x=el('section','review-step'),h=el('h3');h.appendChild(el('span',null,n));h.appendChild(document.createTextNode(title));x.appendChild(h);host.appendChild(x);return x;}
function reviewDocument(){const r=STD.find(x=>isReviewSample(x));return {version:1,code:REVIEW_CODE,fields:{...reviewDraft},savedAt:new Date().toISOString()};}
function reviewExportText(){const r=STD.find(isReviewSample);return '# 탐구 설계 · 교사 편집 초안\n\n## 공식 성취기준\n'+r.c+' '+r.t+'\n\n출처: '+reviewSourceText(r)+'\n\n## 수업 설계 제안 (공식 원문 아님)\n\n'+Object.entries({context:'수업 맥락',concepts:'핵심 개념',relation:'탐구할 관계',fact:'경험 확인 질문',factEvidence:'학생의 활동과 증거',conceptual:'개념 질문',conceptualEvidence:'학생의 활동과 증거',discussion:'판단 질문',discussionEvidence:'학생의 활동과 증거',transfer:'전이 과제',evidence:'살펴볼 학습 증거',revision:'설명 수정'}).map(([k,t])=>'### '+t+'\n'+reviewDraft[k]).join('\n\n')+'\n\n## 성취수준 원문\n'+['A','B','C'].map(k=>k+': '+r[k]).join('\n')+'\n출처: '+REVIEW_LEVEL_PDF+' · 인쇄 34쪽 / PDF 38쪽\n';}
function reviewSaveBar(host){
  const bar=el('div','review-savebar'),status=el('span','review-status',reviewSaved?'이 브라우저에 저장됨':'검토용 예시 · 아직 저장하지 않음');status.id='reviewSaveStatus';status.setAttribute('role','status');bar.appendChild(status);
  const b=el('button','btn on','설계 저장');b.onclick=()=>{try{localStorage.setItem(REVIEW_KEY,JSON.stringify(reviewDocument()));reviewSaved=true;status.textContent='이 브라우저에 저장됨';reviewToast('설계를 저장했습니다.');}catch(e){status.textContent='브라우저 저장 실패 · 파일로 저장해 주세요';}};bar.appendChild(b);
  const exp=el('button','btn','작업 파일 저장');exp.onclick=()=>download('탐구설계_4사01-01.json',JSON.stringify(reviewDocument(),null,2),'application/json');bar.appendChild(exp);
  const load=el('button','btn','작업 파일 불러오기'),input=el('input');input.type='file';input.accept='.json,application/json';input.hidden=true;load.onclick=()=>input.click();input.onchange=async()=>{try{const f=input.files[0];if(!f)return;if(f.size>1000000)throw Error();const v=JSON.parse(await f.text());if(('questions' in v&&!validQuestions(v.questions))||v.version!==1||v.code!==REVIEW_CODE||!v.fields||!Object.keys(REVIEW_DEFAULT).every(k=>typeof v.fields[k]==='string'))throw Error();if(!confirm('현재 편집 중인 설계를 파일의 내용으로 바꿀까요?'))return;for(const k in REVIEW_DEFAULT)reviewDraft[k]=v.fields[k];importInquiryQuestions(v);reviewSaved=false;renderDetail();reviewToast('불러왔습니다. 설계 저장을 누르면 이 브라우저에 보관됩니다.');}catch(e){reviewToast('이 대표 사례의 작업 파일인지 확인해 주세요.');}finally{input.value='';}};bar.appendChild(load);bar.appendChild(input);
  const cp=el('button','btn','설계 복사');cp.onclick=()=>copy(reviewExportText(),cp);bar.appendChild(cp);host.appendChild(bar);
  host.appendChild(el('p','review-muted','이 브라우저에 저장한 설계는 다른 기기에 자동으로 옮겨지지 않습니다. 이어서 작업하려면 작업 파일을 저장해 불러오세요.'));
}
const originalPanePlan=panePlan,originalPaneMap=paneMap,originalPaneStd=paneStd;
panePlan=function(pane,r,terms){
  if(!isReviewSample(r)){pane.appendChild(el('p','review-warning','이 성취기준의 탐구 초안은 기존 방식입니다. 상단 ‘대표 사례 열기’에서 새 설계 흐름을 확인하세요.'));return originalPanePlan(pane,r,terms);}
  pane.appendChild(el('div','review-kicker','교사 편집 초안 · 공식 원문과 별도'));
  pane.appendChild(el('h2','review-heading','같은 장소, 서로 다른 느낌'));
  pane.appendChild(el('p','review-muted','장소감을 표현하는 활동에서 출발해, 서로 다른 경험을 비교하고 새로운 장소 안내에 적용합니다. 아래 문장은 수업에 맞게 고칠 수 있습니다.'));
  const s1=reviewSection(pane,'01','원문에서 출발하기');
  const q=el('div','review-evidence');q.appendChild(el('strong',null,'성취기준 해설 · 원문'));q.appendChild(el('p',null,r.hae));q.appendChild(el('div','src',REVIEW_PDF+' · 인쇄 19쪽 / PDF 25쪽'));s1.appendChild(q);
  reviewField(s1,'context','우리 반 수업 맥락');
  const s2=reviewSection(pane,'02','탐구할 개념과 관계');
  const pair=el('div','review-pair');const a=el('div');a.appendChild(el('strong',null,'다루는 사례'));a.appendChild(el('p',null,'학교 운동장 · 도서관 · 생활 주변 장소'));const b=el('div');b.appendChild(el('strong',null,'다른 사례에도 적용할 개념'));b.appendChild(el('p',null,'장소 · 경험 · 관점 · 장소감'));pair.append(a,b);s2.appendChild(pair);
  reviewField(s2,'concepts','핵심 개념');reviewField(s2,'relation','학생이 탐구할 관계 문장','교사가 검토할 설계 가설입니다. 공식 핵심 아이디어를 인용한 문장이 아닙니다.');
  const s3=reviewSection(pane,'03','질문에 학생의 증거 연결하기');
  [['fact','factEvidence','경험을 확인하는 질문'],['conceptual','conceptualEvidence','개념 사이 관계를 탐구하는 질문'],['discussion','discussionEvidence','판단 기준을 따져 보는 질문']].forEach(([k,e,title])=>{const grid=el('div','review-grid');reviewField(grid,k,title);reviewField(grid,e,'학생이 할 일과 남길 증거');s3.appendChild(grid);});
  const s4=reviewSection(pane,'04','새 상황에 적용하고 설명 고치기');reviewField(s4,'transfer','전이 과제');reviewField(s4,'evidence','교사가 살펴볼 학습 증거','수업 관찰을 위한 제안이며, 공식 A·B·C 성취수준을 대체하지 않습니다.');reviewField(s4,'revision','설명 수정');
  const levels=el('details','review-evidence');levels.appendChild(el('summary',null,'공식 A·B·C 성취수준과 함께 검토하기'));['A','B','C'].forEach(k=>levels.appendChild(el('p',null,k+' · '+r[k])));levels.appendChild(el('div','src',REVIEW_LEVEL_PDF+' · 인쇄 34쪽 / PDF 38쪽'));s4.appendChild(levels);reviewSaveBar(pane);
};
paneMap=function(pane,r){
  if(!isReviewSample(r)){pane.appendChild(el('p','review-warning','기존 공통 용어 연결 지도입니다. 학습 위계나 개념 관계가 검증된 연결은 아닙니다.'));return originalPaneMap(pane,r);}
  pane.appendChild(el('div','review-kicker','교사 설계 제안 · 관계와 증거'));
  pane.appendChild(el('h2','review-heading','관계를 읽고, 근거를 살펴보기'));
  pane.appendChild(el('p','review-muted','아래 관계는 검토용 예시입니다. 관계를 누르면 연결된 질문과 학생의 증거를 확인할 수 있습니다.'));
  const flow=el('div','review-flow');
  flow.appendChild(el('div','review-node','경험·관점'));
  const edge1=el('button','review-edge','장소에 부여하는 의미에 영향을 줄 수 있다');flow.appendChild(edge1);
  flow.appendChild(el('div','review-node','장소감'));
  const edge2=el('button','review-edge','서로 비교하고 나누며 차이를 이해한다');flow.appendChild(edge2);
  flow.appendChild(el('div','review-node','다른 장소감의 존중'));pane.appendChild(flow);
  const box=el('div','review-evidence');box.id='reviewRelationEvidence';box.setAttribute('aria-live','polite');pane.appendChild(box);
  function show(kind){box.innerHTML='';box.appendChild(el('strong',null,kind===1?'경험·관점과 장소감':'장소감의 차이와 존중'));box.appendChild(el('p','review-linked','질문: '+reviewDraft[kind===1?'conceptual':'discussion']));box.appendChild(el('p','review-linked','학생의 증거: '+reviewDraft[kind===1?'conceptualEvidence':'discussionEvidence']));box.appendChild(el('div','src','연결 근거: '+REVIEW_CODE+' 해설 · '+REVIEW_PDF+' 인쇄 19쪽. 위 관계 문구는 원문 인용이 아닌 설계 제안입니다.'));}
  edge1.onclick=()=>show(1);edge2.onclick=()=>show(2);show(1);
  const rel=el('div','review-evidence');rel.appendChild(el('strong',null,'현재 작성 중인 관계 문장'));rel.appendChild(el('p','review-linked',reviewDraft.relation));rel.appendChild(el('p','review-linked','핵심 개념: '+reviewDraft.concepts));pane.appendChild(rel);
  const edit=el('button','btn on','탐구 설계에서 질문·증거 수정');edit.onclick=()=>{S.tab='plan';renderDetail();};pane.appendChild(edit);
};
paneStd=function(pane,r,terms){originalPaneStd(pane,r,terms);if(isReviewSample(r)){const info=el('p','review-muted','위 성취기준·해설과 A·B·C 문장은 공식 PDF의 해당 항목과 대조했습니다. 아래의 내용 요소 범주 성향은 기존 앱의 자동 추정입니다.');pane.prepend(info);}};
const originalUpdateCart=updateCart;
updateCart=function(){originalUpdateCart();document.querySelectorAll('[data-cart-code]').forEach(b=>b.checked=S.cart.has(b.dataset.cartCode));document.querySelectorAll('[data-cart-action]').forEach(b=>{const on=S.cart.has(b.dataset.cartAction);b.textContent=on?'바구니에서 빼기':'+ 수업 바구니';b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on));});};
saveCart=function(){try{localStorage.setItem('review-cart2022-v1',JSON.stringify([...S.cart]));}catch(e){reviewToast('바구니를 브라우저에 저장하지 못했습니다. 필요한 원문을 복사해 주세요.');}updateCart();};
const originalMdOf=mdOf;
mdOf=function(rows){return rows.map(r=>isReviewSample(r)?reviewExportText():originalMdOf([r])).join('\n\n---\n\n');};
const originalPaneLesson=paneLesson;
paneLesson=function(pane,r,terms){pane.appendChild(el('p','review-warning','수업·평가 계획은 기존 자동 생성 기능입니다. 이번 확인본에서 편집한 내용은 ‘탐구 설계’의 설계 복사·작업 파일 저장과 MD에 반영됩니다.'));return originalPaneLesson(pane,r,terms);};
function openReviewSample(){S.q='우리가 사는 곳';$('#q').value=S.q;S.bands.clear();S.subjs.clear();S.areas.clear();S.bands.add(1);S.subjs.add(1);S.sel=STD.find(isReviewSample);S.tab='plan';S.map=null;renderFilters();render();$('#detailcol').classList.add('open');}
function startReview(){
  $('#q').setAttribute('aria-label','성취기준 검색');$('#reviewSample').onclick=openReviewSample;
  $('#cartPlain').onclick=()=>copy(cartRows().map(r=>r.c+' '+r.t).join('\n'),$('#cartPlain'));
  openReviewSample();
}
