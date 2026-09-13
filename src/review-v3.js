/* Examples are scaffolds, not a mandatory question taxonomy. */
const INQUIRY_EXAMPLES=[
 {title:'구체적인 경험 읽기',q:'같은 운동장에 대해 두 친구가 각각 어떤 경험과 느낌을 이야기했는가?',e:'각자의 경험과 느낌을 색으로 구별해 표시한 표현물',why:'먼저 자료에 실제로 담긴 내용과 자신의 추측을 구별합니다.'},
 {title:'사례를 비교하며 개념 찾기',q:'두 사람은 같은 장소를 왜 다르게 느꼈을까? 다른 장소에서도 이런 차이가 보일까?',e:'두 장소의 경험 비교표와 차이를 설명하는 문장',why:'한 사례의 인상에 머물지 않고 여러 사례의 공통점과 차이를 살펴봅니다.'},
 {title:'관계 문장을 시험하기',q:'같은 경험을 하면 장소에 대한 느낌도 반드시 같을까? 우리의 설명을 더 조심스럽게 고칠 부분은?',e:'관계 문장을 뒷받침하거나 설명하기 어려운 사례, 수정한 관계 문장',why:'처음 만든 일반화를 정답으로 고정하지 않고 적용 범위와 예외를 검토합니다.'},
 {title:'다른 상황에 적용하기',q:'새 친구를 위한 장소 안내에 서로 다른 경험과 느낌을 어떻게 담으면 좋을까?',e:'다른 관점을 반영한 장소 안내 카드와 선택 이유',why:'새로운 상황에서도 관계를 사용해 설명하거나 선택할 수 있는지 확인합니다.'},
 {title:'필요할 때 판단하기',q:'장소 안내에는 가장 많은 사람이 느낀 점만 담아도 괜찮을까?',e:'누구의 경험이 드러나거나 빠지는지 표시한 안내도와 의견',why:'서로 다른 판단과 근거를 비교할 필요가 있을 때 골라 사용합니다.'}
];
function questionDefaults(){return [['fact','factEvidence'],['conceptual','conceptualEvidence'],['discussion','discussionEvidence']].map(([k,e])=>({id:k,q:reviewDraft[k],e:reviewDraft[e]}));}
function validQuestions(x){return Array.isArray(x)&&x.length<=50&&x.every(v=>v&&typeof v.q==='string'&&typeof v.e==='string'&&typeof v.id==='string')&&new Set(x.map(v=>v.id)).size===x.length;}
let inquiryQuestions=questionDefaults();try{const saved=JSON.parse(localStorage.getItem(REVIEW_KEY)||'null');if(validQuestions(saved?.questions))inquiryQuestions=saved.questions;}catch(e){}
function markInquiryChanged(){reviewSaved=false;const s=$('#reviewSaveStatus');if(s)s.textContent='수정됨 · 이 브라우저에 저장해 주세요';}
const previousReviewDocument=reviewDocument;
reviewDocument=function(){return {...previousReviewDocument(),questions:inquiryQuestions.map(x=>({...x}))};};
// Called by the backwards-compatible file loader after its validation.
function importInquiryQuestions(v){inquiryQuestions=validQuestions(v.questions)?v.questions.map(x=>({...x})):questionDefaults();}
function exampleGuide(r){
 const host=el('section','inquiry-guide');host.appendChild(el('div','review-kicker','설계 도움자료 · AI 예시'));
 host.appendChild(el('h2','review-heading','사례에서 개념을 찾고, 관계를 시험하기'));
 host.appendChild(el('p','review-muted','질문을 사실·개념·논쟁으로 모두 나눠 채울 필요는 없습니다. 무엇을 보고 어떤 이해에 도달할지 구분한 뒤, 필요한 질문만 골라 쓰세요.'));
 const sample=isReviewSample(r);
 const steps=[
 ['사실·사례','구체적으로 무엇을 보았나?',sample?'예시 자료: 민지는 운동장에서 친구와 놀아 즐거웠다고, 준호는 혼자 기다려 외로웠다고 말했다.':'교과서에서 실제로 다룬 사건·관찰·자료·작품의 구체적인 내용을 고릅니다.',sample?'특정 인물·장소·상황에 대한 진술입니다. 위 학생 이야기는 실제 조사 결과가 아닌 가상 예시입니다.':'누가, 언제, 어디에서 무엇을 했거나 관찰했는지 구체적으로 확인합니다.'],
 ['개념','여러 사례를 어떤 생각으로 묶나?',sample?'경험 · 관점 · 장소감':'반복되는 특징이나 관계를 살펴볼 개념 후보를 찾습니다.','한 단어나 짧은 말로 나타내되, 이름만 추상적으로 바꾸는 데 그치지 않고 사례와 연결합니다.'],
 ['관계·일반화','개념들이 어떻게 연결되나?',sample?'같은 장소라도 사람의 경험과 관점에 따라 서로 다른 의미를 가질 수 있다.':'개념 둘 이상이 어떻게 관련되는지, 자료에 근거해 설명하는 문장을 만듭니다.','사례를 더 살펴보며 수정할 설명입니다. 한 사례로 모든 상황을 단정하지 않습니다.'],
 ['전이','새 상황에서도 설명할 수 있나?',sample?'새 친구를 위한 장소 안내에 서로 다른 경험과 느낌을 반영한다.':'조건이나 대상이 달라진 사례에 관계 문장을 적용하고 설명이 맞는지 확인합니다.','처음의 사실·자료로 돌아가 근거를 다시 살필 수 있습니다. 반드시 한 방향으로만 진행하는 절차는 아닙니다.']
 ];
 const rail=el('div','inquiry-rail'),detail=el('div','inquiry-explanation');detail.setAttribute('aria-live','polite');
 steps.forEach((x,i)=>{const b=el('button','inquiry-stage'+(i===0?' active':''));b.setAttribute('aria-pressed',String(i===0));b.appendChild(el('small',null,'0'+(i+1)));b.appendChild(el('strong',null,x[0]));b.appendChild(el('span',null,x[1]));b.onclick=()=>{rail.querySelectorAll('button').forEach(n=>{n.classList.toggle('active',n===b);n.setAttribute('aria-pressed',String(n===b));});show(i);};rail.appendChild(b);});
 function show(i){detail.innerHTML='';detail.appendChild(el('strong',null,steps[i][1]));detail.appendChild(el('p',null,steps[i][2]));detail.appendChild(el('p','src',steps[i][3]));}
 show(0);host.append(rail,detail);
 const check=el('details','feedback-case');check.appendChild(el('summary',null,'사실과 개념을 헷갈릴 때'));check.appendChild(el('p',null,'“우리 학교 운동장”은 장소의 예이고, “민지가 운동장에서 즐거웠다고 말했다”는 그 사례에 관한 구체적 진술입니다. “장소감”은 여러 사례를 살펴볼 개념이며, “경험에 따라 장소의 의미가 달라질 수 있다”는 개념 사이의 관계 문장입니다.'));check.appendChild(el('p','src','이 구분은 사실을 덜 중요하게 다루기 위한 것이 아닙니다. 구체적인 자료는 관계를 만들고 검토하는 근거가 됩니다.'));host.appendChild(check);return host;
}
function questionWorkspace(host){
 host.appendChild(el('p','review-muted','초안을 그대로 고쳐 쓰거나 도움자료에서 추가하세요. 질문 수와 유형에는 정해진 할당이 없습니다.'));
 const layout=el('div','question-workspace'),bank=el('aside','question-bank'),editor=el('div','question-editor');bank.appendChild(el('h4',null,'필요한 질문 예시 고르기'));
 INQUIRY_EXAMPLES.forEach((x,i)=>{const d=el('details','question-example');if(i===0)d.open=true;d.appendChild(el('summary',null,x.title));d.appendChild(el('p',null,x.q));d.appendChild(el('p','src',x.why));d.appendChild(el('p','src','남길 증거 예시: '+x.e));const add=el('button','btn','이 예시 추가');add.onclick=()=>{if(inquiryQuestions.length>=50){reviewToast('질문은 최대 50개까지 보관할 수 있습니다.');return;}inquiryQuestions.push({id:'q'+Date.now()+Math.random().toString(16).slice(2),q:x.q,e:x.e});markInquiryChanged();draw();reviewToast('질문 초안에 추가했습니다.');};d.appendChild(add);bank.appendChild(d);});
 function draw(){editor.innerHTML='';editor.appendChild(el('h4',null,'우리 수업의 질문 · '+inquiryQuestions.length+'개'));if(!inquiryQuestions.length)editor.appendChild(el('p','review-muted','필요한 예시를 고르거나 질문을 직접 추가하세요.'));
  inquiryQuestions.forEach((x,i)=>{const card=el('section','question-edit-card');const head=el('div','dact');head.appendChild(el('strong',null,'질문 '+(i+1)));const remove=el('button','btn sm','삭제');remove.setAttribute('aria-label','질문 '+(i+1)+' 삭제');remove.onclick=()=>{inquiryQuestions.splice(i,1);markInquiryChanged();draw();};head.appendChild(remove);card.appendChild(head);
   [['q','질문'],['e','학생이 할 일과 남길 증거']].forEach(([key,label])=>{const l=el('label','review-field',label),ta=el('textarea');ta.value=x[key];ta.rows=3;ta.id=key==='q'?'review-'+x.id:'review-'+x.id+'Evidence';ta.oninput=()=>{x[key]=ta.value;if(['fact','conceptual','discussion'].includes(x.id))reviewDraft[x.id+(key==='e'?'Evidence':'')]=ta.value;markInquiryChanged();};l.appendChild(ta);card.appendChild(l);});editor.appendChild(card);});
  const own=el('button','btn','빈 질문 추가');own.onclick=()=>{if(inquiryQuestions.length>=50){reviewToast('질문은 최대 50개까지 보관할 수 있습니다.');return;}inquiryQuestions.push({id:'q'+Date.now(),q:'',e:''});markInquiryChanged();draw();};editor.appendChild(own);
 }
 draw();layout.append(bank,editor);host.appendChild(layout);
}
const v2PanePlan=panePlan;
panePlan=function(p,r,t){v2PanePlan(p,r,t);const guide=exampleGuide(r);p.querySelector('.draft-notice')?.after(guide);
 if(isReviewSample(r)){const section=[...p.querySelectorAll('.review-step')].find(n=>n.querySelector('#review-fact'));if(section){section.innerHTML='';section.appendChild(el('h3',null,'03 질문과 학생의 증거 설계하기'));questionWorkspace(section);}
  const pair=p.querySelector('.review-pair');if(pair)pair.remove();
 }else{const note=el('p','src','아래 질문 유형은 기존 생성 예시를 묶은 참고 구분입니다. 모두 사용할 필요는 없습니다. 자유롭게 추가·삭제하는 편집 화면은 현재 사회 대표 사례에서 제공됩니다.');guide.after(note);}
};
const v2ExportText=reviewExportText;
reviewExportText=function(){const r=STD.find(isReviewSample);return '# 탐구 설계 · AI 초안 / 교사 편집\n\n'+DRAFT_NOTICE+'\n\n## 공식 성취기준\n'+r.c+' '+r.t+'\n출처: '+reviewSourceText(r)+'\n\n## 수업 설계 (공식 원문 아님)\n'+[['context','수업 맥락'],['concepts','핵심 개념'],['relation','탐구할 관계']].map(([k,l])=>'### '+l+'\n'+reviewDraft[k]).join('\n\n')+'\n\n### 질문과 학생의 증거\n'+inquiryQuestions.map((x,i)=>`${i+1}. ${x.q}\n   학생이 할 일과 남길 증거: ${x.e}`).join('\n\n')+'\n\n'+[['transfer','전이 과제'],['evidence','살펴볼 학습 증거'],['revision','설명 수정']].map(([k,l])=>'### '+l+'\n'+reviewDraft[k]).join('\n\n')+'\n\n## 성취수준 원문\n'+['A','B','C'].map(k=>k+': '+r[k]).join('\n')+'\n출처: '+REVIEW_LEVEL_PDF+' · 인쇄 34쪽 / PDF 38쪽\n';};
const v2Map=paneMap;
const previousDocOf=docOf;
docOf=function(rows){if(!rows.some(isReviewSample))return previousDocOf(rows);return '<html><head><meta charset="utf-8"><title>탐구·평가 설계</title></head><body>'+rows.map(r=>isReviewSample(r)?'<pre style="white-space:pre-wrap;font-family:Malgun Gothic,sans-serif;line-height:1.7">'+esc2(reviewExportText()+'\n\n평가 방법 제안\n'+evalDraft(r).ways.map(w=>w.m+' / '+w.tool).join('\n')+'\n\n피드백 초안\n'+feedbackText(r))+'</pre>':(previousDocOf([r]).match(/<body>([\s\S]*)<\/body>/)||[])[1]||'').join('<hr>')+'</body></html>';};
paneMap=function(p,r){v2Map(p,r);if(!isReviewSample(r))return;const box=p.querySelector('#reviewRelationEvidence');const edges=p.querySelectorAll('.review-edge');function show(i){box.innerHTML='';box.appendChild(el('strong',null,i===0?'경험·관점과 장소감':'장소감의 차이와 존중'));box.appendChild(el('p','src','아래는 현재 설계에 남겨 둔 질문입니다. 이 관계를 탐구할 질문을 골라 근거를 확인하세요.'));inquiryQuestions.forEach(x=>{const d=el('details','question-example');d.appendChild(el('summary',null,x.q||'아직 작성하지 않은 질문'));d.appendChild(el('p',null,x.e||'학생의 증거를 추가하세요.'));box.appendChild(d);});if(!inquiryQuestions.length)box.appendChild(el('p',null,'설계에 남겨 둔 질문이 없습니다. 탐구 설계에서 추가하세요.'));}edges.forEach((b,i)=>b.onclick=()=>show(i));show(0);};
