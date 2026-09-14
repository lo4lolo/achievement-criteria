/* SUCCESS model planning companion. Model content in success-model.json; no inference API at runtime. */
const SUCCESS_MODEL=__SUCCESS_MODEL__;
const SUCCESS_KEYS=['S','U','CC','E','SS'],SUCCESS_CLASS={S:'success-s',U:'success-u',CC:'success-cc',E:'success-e',SS:'success-ss'};
let successForm='lesson',successStage=0,successPicks={};
try{successPicks=JSON.parse(localStorage.getItem('success-stages-v1')||'{}')||{};}catch(e){}
function successBand(r){const key=Object.keys(SUCCESS_MODEL.bands).find(k=>(r.band||'').includes(k));return key?{key,...SUCCESS_MODEL.bands[key]}:null;}
function successStep(form,i){const s=SUCCESS_MODEL.forms[form].steps[i];return {...SUCCESS_MODEL.guide[s.key],...s};}
function successInExample(r){return SUCCESS_MODEL.example.codes.includes(r.c);}
function successSourceNote(){const s=SUCCESS_MODEL.source;return s.org+'('+s.year+'). 『'+s.title+'』 '+s.doc+'.';}
// Same official level notation as the approved PE pilot export.
function successLevel(r,k){return r.c==='[4체01-05]'?r[k].replaceAll('·','ㆍ'):r[k];}
function successPurpose(stages){return SUCCESS_MODEL.purposes.find(x=>x.stages.join()===stages.join());}
function successBadge(key){return el('span','success-badge '+SUCCESS_CLASS[key],key);}
// Reviewed cases are authored data; every other standard gets a rule-composed draft with the same shape.
const successRuleCache=new Map();
function successCase(r){const reviewed=SUCCESS_MODEL.cases.find(x=>x.code===r.c);return reviewed?{...reviewed,kind:'reviewed'}:successRuleCase(r);}
// The main performance is usually the last verb of a Korean standard, so SUCCESS drafts use the latest matching rule.
function successAction(r){const hits=[];for(const a of DESIGN_RULES.actions){if(a.id==='explore')continue;const extra=SUCCESS_MODEL.rules.actionExtra[a.id],re=new RegExp(a.pattern+(extra?'|'+extra:''),'g');let m;while((m=re.exec(r.t)))hits.push({a,start:m.index,end:m.index+m[0].length});}
 // Ignore a match that begins inside another match, e.g. 구한다 inside 탐구한다.
 const kept=hits.filter(h=>!hits.some(o=>o.start<h.start&&h.start<o.end)).sort((p,q)=>p.start-q.start);return kept.length?kept[kept.length-1].a:DESIGN_RULES.actions.find(a=>a.id==='explore');}
function successRuleCase(r){const key=r.c+'|'+domName(r);if(successRuleCache.has(key))return successRuleCache.get(key);
 const R=SUCCESS_MODEL.rules,x=designFor(r),rule=successAction(r),sub=R.subjects[r.subj],act=R.actions[rule.id],band=successBand(r),B=R.bands[band.key],young=band.key==='1~2',label=rule.label,roles=sub.roles.join(', '),kindOf=st=>st.join('');
 const acts={SU:'장면 제시: '+sub.scene+' → 핵심 질문 만나기 → 출발선 확인. '+act.u,CC:act.cc+(r.q?.length?' 교육과정 탐구 활동: '+r.q.join(', ')+'.':'')+' 역할 예: '+roles+'.'+(young?' 함께 만들 결과 예: '+sub.product+'.':''),CCSS:'공동 산출물을 완성하고 짧게 돌아봅니다. 산출물 예: '+sub.product+'.',ESS:sub.share+'. 근거를 묻고 답한 뒤 친구의 강점을 짚으며 돌아봅니다.',SS:'활동 사진이나 결과물을 보며 내가 한 일과 도움받은 일을 말·그림으로 돌아봅니다.'};
 const evidence={SU:'배움 문제를 자기 말로 표현한 기록',CC:x.evidence,CCSS:'공동 산출물과 만든 과정 기록',ESS:'받은 질문, 고친 부분, 성찰 문장',SS:'말·그림으로 한 돌아보기'};
 const sessions=B.sessions.map((s,i)=>({n:(i+1)+'차시',stages:s.stages,act:acts[kindOf(s.stages)],evidence:evidence[kindOf(s.stages)],sel:s.sel}));
 const target=rule.id==='interpret'?'SU':['practice','explore'].includes(rule.id)?'ESS':young?'CC':'CCSS',idx=Math.max(0,B.sessions.findIndex(s=>kindOf(s.stages)===target)),stages=B.sessions[idx].stages;
 const flowText={S:'장면 제시: '+sub.scene+' → 핵심 질문 “'+act.core+'” 만나기 → 출발선 짧게 확인(마음 열기는 선택).',U:act.u+' 성취기준에서 할 일을 배움 문제로 정리합니다.',CC:act.cc+(r.q?.length?' 교육과정 탐구 활동('+r.q[0]+')은 모든 모둠이 합니다.':'')+' 역할('+roles+')을 나누고, 수준에 따라 자료·지원만 달리합니다.',E:sub.share+'. 질문 예: “'+act.questions[0]+'”',SS:young?'말·그림으로 오늘 해낸 일과 친구에게 고마운 점을 나눕니다.':'성찰 문장틀로 오늘의 발견, 나와 친구의 강점, 다음 실천을 돌아봅니다.'};
 const where={};SUCCESS_KEYS.filter(k=>!stages.includes(k)).forEach(k=>{const i=B.sessions.findIndex((s,j)=>j!==idx&&s.stages.includes(k));(where[i]=where[i]||[]).push(k);});
 const P=successPurpose(stages);
 const c={kind:'rule',code:r.c,title:r.subj+' ‘'+(r.a||r.subj)+'’ 프로젝트',why:r.subj+' 관점 + '+label+' 규칙 + '+band.key+'학년군 규칙으로 구성했습니다.',core:act.core,sessions,
  lesson:{n:(idx+1)+'차시',stages:stages.slice(),flow:stages.map(k=>({key:k,do:flowText[k]})),elsewhere:Object.entries(where).map(([i,ks])=>ks.join('·')+'는 '+(+i+1)+'차시').join(', ')+'에서 다룹니다. 이 차시의 목적: '+(P?P.label:'모둠 탐구·제작')+'.'},
  levels:{all:'모두 성취기준의 핵심 수행('+(x.matches.join(', ')||'경험·성찰')+')을 직접 해 봅니다.'+(r.q?.length?' 교육과정 탐구 활동은 모든 학생이 경험합니다.':''),support:'도움 자료: '+sub.support+'. 성취수준 C 원문을 출발점으로 삼습니다.',extend:act.extend+' 성취수준 A 원문을 참고합니다.'},
  questions:[...act.questions,sub.question],reflection:B.reflection,
  eval:[['지식·이해',act.know],['과정·기능','성취기준의 수행 과정에서 확인: '+x.evidence],['가치·태도','협력하며 다른 사람의 생각을 존중합니다. 발언 횟수가 아니라 경청하고 근거를 묻는 모습으로 확인합니다.']],
  boundary:x.boundary+(r.hae?' 성취기준 해설 원문을 확인해 범위를 넘지 않게 합니다.':' 앱 자료에 해설 원문이 없어 성취수준을 기준으로 합니다.')+B.note+' 차시 수와 산출물은 교과서 단원에 맞게 조정합니다.',
  transfer:{kept:SUCCESS_MODEL.patterns.map(p=>p.name),changed:['산출물: '+sub.product,'공감 확장(E): '+sub.share,B.changed]}};
 successRuleCache.set(key,c);return c;
}
// A lesson uses the stages the teacher chose; a project always uses all five.
function successStages(r,form=successForm){if(form==='project')return SUCCESS_KEYS.slice();const saved=successPicks[r.c];if(Array.isArray(saved)&&saved.length&&saved.every(k=>SUCCESS_KEYS.includes(k)))return SUCCESS_KEYS.filter(k=>saved.includes(k));return successCase(r).lesson.stages.slice();}
function saveSuccessStages(r,list){successPicks[r.c]=SUCCESS_KEYS.filter(k=>list.includes(k));try{localStorage.setItem('success-stages-v1',JSON.stringify(successPicks));}catch(e){reviewToast('이 브라우저에 저장하지 못했습니다. MD로 보관해 주세요.');}}
function successLink(r,key){const x=designFor(r),band=successBand(r),d=domOf(r);
 if(key==='S')return '성취수준 원문(C·B·A)을 참고해 출발선 확인 활동을 만들 수 있습니다. 확인 결과는 학생에게 수준 이름을 붙이는 데가 아니라 지원 방법을 고르는 데 사용합니다.\n자료를 고를 때: '+x.facts;
 if(key==='U')return (d?'내용 체계 핵심 아이디어 · '+d.name+' (영역 연결은 검토할 제안)\n'+d.idea.join('\n'):'내용 체계 영역 연결이 보류되어 있습니다. 내용 체계 탭에서 영역을 고르면 핵심 아이디어를 함께 볼 수 있습니다.')+'\n\n'+(x.kind==='reviewed'?'관계 가설: ':'관계 탐구 방향: ')+x.relation;
 if(key==='CC')return '성취기준에서 확인한 수행: '+(x.matches.join(', ')||'경험·성찰')+'\n함께 만들며 살펴볼 학습 증거: '+x.evidence;
 if(key==='E')return (band?'중점 사회정서역량('+band.key+'학년군): '+band.focus.join(' · ')+' — '+band.touch+'\n':'')+'설계할 때 지킬 범위: '+x.boundary;
 return '새 상황에 적용하기: '+x.transfer+'\n\n피드백 방안(수업·평가 계획 탭의 편집 반영):\n'+feedbackText(r);
}
function successCoachPrompt(form){const lesson=form!=='project',rules=[
 '먼저 교사가 적은 생각을 짧게 정리하고, 설계 방향을 바꾸는 질문을 최대 3개만 물어보세요. 답을 기다린 뒤 다음 단계로 진행하세요.',
 lesson?'이 설계는 한 차시 수업입니다. MD의 ‘이번 차시에 넣은 단계’만 설계하고, 빠진 단계를 억지로 채우지 마세요. 차시 목적과 시간에 비해 활동이 많으면 줄일 부분을 먼저 제안하세요. 빠진 단계가 앞뒤 차시에서 어떻게 이어지는지는 교사에게 물어 짧은 메모로만 남기세요.':'이 설계는 프로젝트입니다. S → U → CC → E → SS 다섯 단계가 모두 한 번 이상 들어가야 합니다. 먼저 전체 차시 수와 산출물을 교사에게 확인하고, 차시마다 맡을 단계를 배치한 표를 만든 뒤 빠진 단계가 없는지 점검하세요. 한 차시에 여러 단계를 넣을 때는 시간이 무리하지 않은지 함께 확인하세요.',
 '선택이 어려운 부분에는 선택지 2~3개와 각각의 장점·조건을 제시하고, 교사의 의도를 확인하지 않고 확정하지 마세요. 이미 제공된 정보를 다시 묻지 마세요. MD의 SUCCESS 설계 초안은 규칙으로 구성한 출발점이므로 교사의 교과서·학급 정보를 우선하세요.',
 '각 단계에 연결된 사회정서역량이 실제 활동에서 어떤 학생 행동으로 드러나는지 구체적으로 제안하세요. 사회정서역량을 점수나 서열로 평가하는 활동, 학생에게 사적인 감정·가정 형편 공개를 요구하는 활동은 만들지 마세요.',
 '수준별 과제를 제안할 때 성취기준의 핵심 활동은 모든 학생이 경험하게 하고, 수준 차이는 자료 난도·지원·확장 과제로 두세요. 수준을 역할 이름으로 고정하지 마세요.',
 '친구 발표에는 점수 대신 칭찬·질문·제안 피드백을 제안하세요. 가치·태도 평가 기준은 발언·질문 횟수가 아니라 경청하고 근거를 묻는 모습 등 질로 제안하세요. 성찰·다짐 문장틀의 답을 미리 채우지 마세요.',
 '성취기준·성취수준·해설의 원문과 코드는 그대로 인용하고 출처를 유지하세요. 원문과 설계 제안을 명확히 구분하세요. 해설에 없는 내용으로 넓힐 때는 범위를 넘을 수 있다고 표시하세요. 교과서 내용·쪽·사진은 제공받은 것만 사용하고, 없으면 [교사가 자료 선택]으로 남기세요.',
 'AI·디지털 도구는 학교에서 사용하는 도구를 먼저 묻고 특정 제품을 전제하지 마세요. 학생이 생성형 AI를 직접 쓰는 활동에는 이용 연령·개인정보·교사 지도 조건을 확인할 점으로 표시하세요. MD의 AI 윤리 약속을 활동에 반영하세요.',
 '교사가 고른 방향으로 먼저 설계 얼개를 만들고, 확인 후 요청한 자료를 구체화하세요. PPT는 슬라이드별 SUCCESS 단계 / 목적 / 화면 문구 / 교사 진행 메모 / 넣을 자료·출처 / 미정 사항으로, 학습지는 학생용 빈 기록 공간과 교사용 관찰·피드백 메모를 분리해 작성하세요. 예상 학생 답을 학생용 빈칸에 채우지 마세요.',
 '생성 자료는 검토용 초안이라고 표시하고, SUCCESS 모델의 출처를 자료에 남기세요.'];
 return '당신은 교사의 생각을 구체화하는 수업 설계 동료입니다. 아래 SUCCESS 모델 설계 MD를 바탕으로 대화해 주세요.\n'+rules.map((t,i)=>(i+1)+'. '+t).join('\n');
}
function successCaseMd(r,c){const P=successPurpose(c.lesson.stages),rule=c.kind==='rule';return [(rule?'## SUCCESS 설계 초안 · ':'## 검토한 전이 예시 · ')+c.title,'',(rule?SUCCESS_MODEL.rules.note+' 구성 근거: ':'앱이 구성한 예시입니다. 교과서와 우리 반 여건에 맞게 차시·활동을 조정하세요. ')+c.why,'','핵심 질문'+(rule?' 초안':'')+': '+c.core,'','### 프로젝트 차시 배치 예시 · 모든 단계 포함','','| 차시 | 맡을 단계 | 주요 활동 | 학습 증거 | 사회정서역량 요소 |','| --- | --- | --- | --- | --- |',...c.sessions.map(s=>`| ${s.n} | ${s.stages.join('·')} | ${s.act} | ${s.evidence} | ${s.sel} |`),'','단계 확인: '+SUCCESS_KEYS.map(k=>k+(c.sessions.some(s=>s.stages.includes(k))?' 포함':' 빠짐')).join(' / '),
 '','### 한 차시 예시 · '+c.lesson.n+(P?' ('+P.label+')':''),'',...c.lesson.flow.map(f=>`- ${f.key}: ${f.do}`),'','앞뒤 차시에서 다룰 단계: '+c.lesson.elsewhere,
 '','### 수준별 설계','','- 모두가 하는 핵심 활동: '+c.levels.all,'- 도움이 필요할 때: '+c.levels.support,'- 더 나아가고 싶을 때: '+c.levels.extend,
 '','### 근거를 따지는 상호 질문 예시','',...c.questions.map(q=>'- '+q),'','### 성찰 문장틀 · 답을 채우지 않고 사용','',...c.reflection.map(q=>'- '+q),
 '','### 평가 계획 초안 · 성취수준 원문과 대조해 조정','',...c.eval.map(([a,b])=>`- ${a}: ${b}`),'','### 범위 확인','',c.boundary,
 '','### 실천 지도안에서 옮긴 것과 바꾼 것','','- 옮긴 것: '+c.transfer.kept.join(' / '),'- 바꾼 것: '+c.transfer.changed.join(' / ')];}
function successDesignMd(r,form=successForm){const M=SUCCESS_MODEL,s=sourceRecord(r),band=successBand(r),d=domOf(r),X=M.example,c=successCase(r),lesson=form!=='project',F=M.forms[form],stages=successStages(r,form),others=SUCCESS_KEYS.filter(k=>!stages.includes(k)),idx=k=>SUCCESS_KEYS.indexOf(k),purpose=successPurpose(stages),out=[];
 out.push('# SUCCESS 모델 수업 설계 노트 · '+(lesson?'한 차시 수업':'프로젝트'),'','이 문서는 AI가 구성한 설계 도움 초안입니다. 교육과정 원문과 우리 반 맥락에 맞게 확인하고 수정·보완하세요. 빈칸은 교사의 결정을 위한 자리이며 모두 채울 필요는 없습니다.','','## 1. 교육과정 근거 · 원문','','### 성취기준',r.c+' '+r.t,'','출처: '+reviewSourceText(r));
 if(s.variantNote)out.push('공식 자료 간 표기 차이: '+s.variantNote);
 if(s.repairNote)out.push('수식 표기 복원: '+s.repairNote);
 if(r.hae)out.push('','### 성취기준 해설 · 원문',r.hae);
 if(['A','B','C'].some(k=>r[k]))out.push('','### 성취수준 · 원문',...['A','B','C'].filter(k=>r[k]).map(k=>k+': '+successLevel(r,k)),'','출처: '+s.levelFile+' · '+(s.levelPages.length?'PDF '+s.levelPages.join(', ')+'쪽':'위치 확인 필요'));
 out.push('','### 내용 체계 연결 · 검토할 제안','',d?'영역: '+d.name+(DOMPICK[r.c]?' (교사 선택)':' (앱 제안 · 공식 대응표 아님)')+'\n핵심 아이디어(교육과정 수록 문장):\n'+d.idea.map(t=>'- '+t).join('\n'):'연결 보류. 앱의 내용 체계 탭에서 영역을 고르거나 교사가 확인해 기록: ______');
 out.push('','---','','## 2. SUCCESS 모델과 이번 설계 형태','',M.definition+'입니다.','','| 글자 | 뜻 | 학생 | 교사 | 학교 | 연결 역량 |','| --- | --- | --- | --- | --- | --- |',...M.letters.map(l=>`| ${l.key} | ${l.ko} (${l.en}) | ${l.student} | ${l.teacher} | ${l.school} | ${l.sel} |`),'','연결 역량은 계획서 용어 정의의 표기입니다. 아래 단계별 역량 연결과 일부 다릅니다.','','### '+F.label,'',lesson?M.lessonRule:M.projectRule,'');
 if(lesson)out.push('이번 차시에 넣은 단계: '+stages.map(k=>k+' '+F.steps[idx(k)].name).join(' → ')+(purpose?' (차시 목적: '+purpose.label+')':''),'앞뒤 차시에서 다룰 단계: '+(others.join('·')||'없음')+(others.length?' → 어느 차시에서 다룰지: ______':''),'','- 이 차시가 속한 단원·프로젝트와 차시 순서: ______','- 차시 목적과 단계별 시간 배분: ______');
 else out.push('| 차시 | 맡을 단계 | 주요 활동 | 산출물·학습 증거 | 사회정서역량 요소 |','| --- | --- | --- | --- | --- |',...Array.from({length:5},()=>'| ______ | ______ | ______ | ______ | ______ |'),'','단계 확인(모두 한 번 이상): S [ ] / U [ ] / CC [ ] / E [ ] / SS [ ]','전체 차시 수와 산출물: ______');
 out.push('','### 계획서의 적용 예시 · '+X.unit,'','관련 성취기준: '+X.codes.join(' '),'핵심 아이디어: '+X.idea,'개념적 렌즈: '+X.lenses.join(' · '),'프로젝트 주제: '+X.topic,'학습 요소: '+X.elements.join(' · '),'',...X.steps.map(x=>`- ${x.key} (${x.time}): ${x.act} — “${x.q}”`),'','예시의 단원·차시·질문은 참고용입니다. 이 성취기준에 옮기지 말고 형식만 참고하세요.');
 out.push('','### 실천 지도안에서 확인한 설계 방법','',M.patternSource,'',...M.patterns.map(x=>`- ${x.stage} · ${x.name}: ${x.how} 주의: ${x.caution}`));
 out.push('',...successCaseMd(r,c));
 out.push('','## 3. 사회정서역량 중점','','다섯 가지 역량: '+M.sel.map(x=>x.name).join(' · '),'',band?`${band.key}학년군 중점(계획서의 학년군별 중점): ${band.focus.join(' · ')} — 교사 하이터치: ${band.touch}`:'학년군 중점: 교사가 확인해 기록 ______','','- 우리 반의 관계·정서 특성(개인을 특정하지 않고): ______','- 이번 설계에서 특히 키우고 싶은 역량과 그 모습: ______','- 참여·정서 지원이 필요한 상황과 지원 방법: ______');
 out.push('','## 4. 교사가 먼저 생각해 볼 것 · 설계 메모','','- 교과서·단원·실제로 사용할 쪽과 자료: ______','- 학생의 삶과 연결되는 문제 상황 또는 핵심 질문: ______','- 함께 만들 산출물과 공유 대상: ______','- 사용할 AI·디지털 도구(학교에서 쓰는 도구, 이용 연령·개인정보 확인): ______','- 개념과 관계에 대한 현재의 생각(잠정 가설, 학생에게 정답으로 제시하지 않기): ______','- 아직 고민인 것, 설계 동료와 먼저 이야기할 것: ______');
 out.push('','## 5. 단계별 설계 질문 · '+(lesson?'이번 차시에 넣은 단계':'다섯 단계 모두'));
 stages.forEach((k,n)=>{const g=M.guide[k],a=F.steps[idx(k)],pt=M.patterns.find(x=>x.stage===k);out.push('',`### ${n+1}. ${k} · ${a.name} (${a.en})`,'','계획서 활동: '+a.acts.join(', '),'','연결 사회정서역량(계획서): '+a.sel.join('·')+' / 이번 설계에서 짚을 요소: ______','','디지털 활용(계획서): '+a.digital+'. 실제 도구는 학교 여건에 맞게 선택합니다.','','교사의 역할: '+g.role,'','생각해 볼 질문: '+g.think,'','선택을 돕는 관점: '+g.choose,'','학생이 하는 일: '+g.student,'','자료로 옮길 때: '+g.material);if(pt)out.push('','실천 지도안에서 확인한 방법 · '+pt.name+': '+pt.how+' 주의: '+pt.caution);out.push('','이 성취기준과 연결(앱 제안):',successLink(r,k),'','계획서 발문 예시(4학년 사회 · 형식만 참고): “'+a.ex+'”','','내 결정 또는 남겨 둘 고민 ('+g.blank+'): ______');});
 if(lesson&&others.length)out.push('','앞뒤 차시에서 다룰 단계: '+others.map(k=>k+' '+F.steps[idx(k)].name).join(', ')+'. 이번 차시 설계에는 자세히 넣지 않았습니다.');
 if(stages.includes('CC'))out.push('','## 6. 강점 기반 역할 나누기 · 계획서 예시','','| 역할 | 강점 | 하는 일 |','| --- | --- | --- |',...M.roles.map(x=>`| ${x.name} | ${x.strength} | ${x.work} |`),'','역할은 고정된 꼬리표가 아니라 강점을 발견하는 기회입니다. 우리 반에서 쓸 역할과 바꿔 맡을 방법: ______');
 out.push('','## 7. AI 윤리 약속 · 계획서의 AI 윤리 교육 내용','',...M.aiEthics.map(x=>`- ${x.name}: ${x.detail}`),'','이번 활동에서 특히 강조할 약속: ______');
 out.push('','## 8. PPT 얼개 · 교사가 선택한 방향으로 구체화','','슬라이드 역할 후보입니다. 장수·표현·자료는 교사가 정합니다.','','| 단계 | 화면에 담을 것 | 교사 진행 메모·결정 |','| --- | --- | --- |',...M.ppt.filter((x,i)=>stages.includes(SUCCESS_KEYS[i])).map(x=>`| ${x[0]} | ${x[1]} | ${x[2]} ______ |`));
 out.push('','## 9. 학습지 구성 · 학생이 채울 공간','','인쇄 크기·분량: ______ / 개별·모둠 사용: ______ / 글 대신 표현할 방법: ______','','### 학생용 기록 틀','',...stages.flatMap(k=>['**'+k+' · '+F.steps[idx(k)].name+'**','',...M.guide[k].sheet.map(t=>'- '+t+': ______'),'']),'### 교사용 관찰·피드백 메모 (학생용과 분리)','','- 사회정서역량은 점수로 서열화하지 않고, 활동 속 구체적인 행동과 변화를 기록합니다.','- 감정·가정 형편 등 사적인 내용의 공개는 요구하지 않고 선택으로 둡니다.','- 친구 발표에는 점수 대신 칭찬·질문·제안으로 피드백합니다.','- 관찰한 구체적인 모습 → 되돌려 줄 말 → 다시 시도할 기회: ______');
 out.push('','## 10. 평가 계획과 피드백','','| 영역 | 확인할 모습 (교사 작성) |','| --- | --- |',...M.evalAreas.map(a=>`| ${a} | ______ |`),'','성취수준 A·B·C 원문과 대조해 정합니다. 가치·태도는 발언·질문 횟수가 아니라 경청하고 근거를 묻는 모습처럼 질로 확인합니다.','','평가 방법 후보:',...evalDraft(r).ways.map(w=>'- '+w.m+' / '+w.tool+' / '+(w.source==='guide'?'교육부 안내 명칭':'앱 제안')),'','피드백 방안(교사 편집 포함):',feedbackText(r));
 out.push('','## 11. AI와 함께 설계·자료 만들기','','아래 요청문과 이 문서를 함께 전달하세요. 먼저 고민을 나누고, 선택한 방향에 따라 설계한 뒤 자료를 만듭니다.','',successCoachPrompt(form));
 out.push('','## 12. 출처와 사용 안내','','SUCCESS 모델: '+successSourceNote(),'설계 방법: '+M.patternSource,'','계획서의 모델 정의·수업 모형·프로젝트 단계·학년군별 사회정서역량·강점 기반 역할·AI 윤리 내용을 요약했습니다. 교사의 생각을 여는 질문, 이 성취기준과의 연결, SUCCESS 설계 초안과 예시, PPT·학습지 틀은 앱이 구성한 제안입니다. 교육과정 원문과 설계 제안을 구분해 사용하세요.','','내보낸 버전: v'+APP_VERSION);
 return out.join('\n')+'\n';
}
function successCaseCard(r,c){const rule=c.kind==='rule',box=el('details','success-transfer'+(rule?' rule':''));box.open=true;box.appendChild(el('summary',null,(rule?'SUCCESS 설계 초안 · ':'검토한 전이 예시 · ')+c.title));box.appendChild(el('p','src',(rule?SUCCESS_MODEL.rules.note+' 구성 근거: ':'앱이 구성한 예시입니다. ')+c.why));
 const core=el('div','qft-think');core.appendChild(el('span','review-kicker',rule?'핵심 질문 초안 · 교과서 장면에 맞게 다듬기':'핵심 질문'));core.appendChild(el('p',null,c.core));box.appendChild(core);
 box.appendChild(el('h4',null,'프로젝트 차시 배치 예시 · 모든 단계 포함'));const list=el('ol','success-sessions');c.sessions.forEach(s=>{const li=el('li'),head=el('div','success-session-head');head.appendChild(el('strong',null,s.n));s.stages.forEach(k=>head.appendChild(successBadge(k)));li.appendChild(head);li.appendChild(el('p',null,s.act));li.appendChild(el('p','src','학습 증거: '+s.evidence+' · 사회정서역량 요소: '+s.sel));list.appendChild(li);});box.appendChild(list);
 const all=SUCCESS_KEYS.every(k=>c.sessions.some(s=>s.stages.includes(k))),cover=el('div','success-sel-strip');cover.appendChild(el('span','src','단계 확인'));SUCCESS_KEYS.forEach(k=>{const b=successBadge(k),ok=c.sessions.some(s=>s.stages.includes(k));b.classList.toggle('missing',!ok);b.title=ok?'포함':'빠짐';cover.appendChild(b);});cover.appendChild(el('span','src',all?'다섯 단계가 모두 들어 있습니다.':'빠진 단계가 있습니다.'));box.appendChild(cover);
 const P=successPurpose(c.lesson.stages);box.appendChild(el('h4',null,'한 차시 예시 · '+c.lesson.n+(P?' · '+P.label:'')));const flow=el('div','success-lesson-flow');c.lesson.flow.forEach(f=>{const row=el('div','success-lesson-row '+SUCCESS_CLASS[f.key]);row.appendChild(successBadge(f.key));row.appendChild(el('p',null,f.do));flow.appendChild(row);});box.appendChild(flow);box.appendChild(el('p','src','앞뒤 차시에서 다룰 단계: '+c.lesson.elsewhere));
 box.appendChild(el('h4',null,'수준별 설계'));const levels=el('div','success-levels');for(const [l,t] of [['모두가 하는 핵심 활동',c.levels.all],['도움이 필요할 때',c.levels.support],['더 나아가고 싶을 때',c.levels.extend]]){const d=el('div');d.appendChild(el('strong',null,l));d.appendChild(el('p',null,t));levels.appendChild(d);}box.appendChild(levels);
 for(const [l,items] of [['근거를 따지는 상호 질문 예시',c.questions],['성찰 문장틀 · 답을 채우지 않고 사용',c.reflection]]){const d=el('details','method-sources');d.appendChild(el('summary',null,l));items.forEach(t=>d.appendChild(el('p',null,t)));box.appendChild(d);}
 const ev=el('details','method-sources');ev.appendChild(el('summary',null,'평가 계획 초안 · 성취수준 원문과 대조'));c.eval.forEach(([a,b])=>ev.appendChild(el('p',null,a+' — '+b)));['A','B','C'].filter(k=>r[k]).forEach(k=>ev.appendChild(el('p','src','성취수준 '+k+' 원문 · '+r[k])));box.appendChild(ev);
 const bd=el('details','method-sources');bd.appendChild(el('summary',null,'범위 확인'));bd.appendChild(el('p',null,c.boundary));box.appendChild(bd);
 const tr=el('div','success-kept');for(const [l,items] of [['실천 지도안에서 옮긴 것',c.transfer.kept],['이 성취기준에 맞게 바꾼 것',c.transfer.changed]]){const d=el('div'),ul=el('ul');d.appendChild(el('strong',null,l));items.forEach(t=>ul.appendChild(el('li',null,t)));d.appendChild(ul);tr.appendChild(d);}box.appendChild(tr);
 const act=el('div','qft-actions'),b1=el('button','btn','이 예시의 한 차시 단계로 보기'),b2=el('button','btn','프로젝트 형태로 보기');b1.onclick=()=>{successForm='lesson';saveSuccessStages(r,c.lesson.stages);successStage=SUCCESS_KEYS.indexOf(c.lesson.stages[0]);renderDetail();};b2.onclick=()=>{successForm='project';successStage=0;renderDetail();};act.append(b1,b2);box.appendChild(act);return box;
}
function successPane(p,r){const M=SUCCESS_MODEL,form=M.forms[successForm],lesson=successForm==='lesson',stages=successStages(r),band=successBand(r),c=successCase(r);
 p.appendChild(el('div','review-kicker','모델 이해하기 → 단계 고르기 → MD로 AI와 설계하기'));
 p.appendChild(el('h2','review-heading','SUCCESS 모델로 사회정서역량을 키우는 수업'));
 p.appendChild(el('p','review-muted',M.definition+'입니다. 한 차시는 목적에 맞는 단계만 고르고, 프로젝트는 다섯 단계를 모두 담아 설계합니다.'));
 const pack=el('section','qft-package');pack.appendChild(el('strong',null,'SUCCESS 설계 노트 · 단계별 질문 · PPT 얼개 · 학습지 틀 · AI 대화 요청문'));
 pack.appendChild(el('p','src','지금 고른 형태가 담깁니다. 한 차시는 고른 단계만, 프로젝트는 다섯 단계와 차시 배치표가 들어갑니다. AI가 구성한 도움 초안이므로 수업에 맞게 확인·수정해 주세요.'));
 const actions=el('div','qft-actions'),save=el('button','btn on','SUCCESS 설계 MD 내려받기'),cp=el('button','btn','SUCCESS 설계 MD 복사');save.onclick=()=>download('SUCCESS_'+(lesson?'차시':'프로젝트')+'설계_'+r.c.replace(/[\[\]]/g,'')+'.md',successDesignMd(r),'text/markdown;charset=utf-8');cp.onclick=()=>copy(successDesignMd(r),cp);actions.append(save,cp);pack.appendChild(actions);p.appendChild(pack);
 p.appendChild(successCaseCard(r,c));
 const toggle=el('div','success-form');toggle.setAttribute('role','group');toggle.setAttribute('aria-label','SUCCESS 적용 형태');
 Object.entries(M.forms).forEach(([k,f])=>{const b=el('button',null,f.label);b.type='button';b.setAttribute('aria-pressed',String(successForm===k));b.onclick=()=>{successForm=k;const chosen=successStages(r,k);if(!chosen.includes(SUCCESS_KEYS[successStage]))successStage=SUCCESS_KEYS.indexOf(chosen[0]);renderDetail();};toggle.appendChild(b);});
 p.appendChild(toggle);p.appendChild(el('p','src',(lesson?M.lessonRule:M.projectRule)+' '+form.note));
 const pick=el('div','success-pick');
 if(lesson){pick.appendChild(el('strong',null,'차시 목적으로 고르기'));const presets=el('div','success-presets');M.purposes.forEach(x=>{const on=x.stages.join()===stages.join(),b=el('button','btn'+(on?' on':''),x.label+' · '+x.stages.join('·'));b.type='button';b.title=x.why;b.setAttribute('aria-pressed',String(on));b.onclick=()=>{saveSuccessStages(r,x.stages);successStage=SUCCESS_KEYS.indexOf(x.stages[0]);renderDetail();};presets.appendChild(b);});pick.appendChild(presets);
  pick.appendChild(el('strong',null,'이번 차시에 넣을 단계'));const chips=el('div','success-presets');SUCCESS_KEYS.forEach((k,i)=>{const on=stages.includes(k),b=el('button','success-toggle '+SUCCESS_CLASS[k]+(on?' on':''),k+' '+form.steps[i].name);b.type='button';b.setAttribute('aria-pressed',String(on));b.onclick=()=>{const next=on?stages.filter(x=>x!==k):[...stages,k];if(!next.length){reviewToast('한 단계 이상 골라 주세요.');return;}saveSuccessStages(r,next);renderDetail();};chips.appendChild(b);});pick.appendChild(chips);
  const P=successPurpose(stages),others=SUCCESS_KEYS.filter(k=>!stages.includes(k));pick.appendChild(el('p','src',(P?P.why+' ':'')+(others.length?'앞뒤 차시에서 다룰 단계: '+others.join('·'):'다섯 단계를 모두 넣었습니다. 한 차시 시간에 무리가 없는지 확인하세요.')));}
 else{pick.appendChild(el('strong',null,'프로젝트에는 다섯 단계가 모두 들어갑니다'));const row=el('div','success-sel-strip');SUCCESS_KEYS.forEach(k=>row.appendChild(successBadge(k)));pick.appendChild(row);pick.appendChild(el('p','src','각 차시가 어느 단계를 맡는지 MD의 차시 배치표에 적고, 빠진 단계가 없는지 확인합니다.'));}
 p.appendChild(pick);
 const word=el('nav','success-word');word.setAttribute('aria-label','SUCCESS 단계');
 form.steps.forEach((s,i)=>{const off=lesson&&!stages.includes(s.key),b=el('button','success-tile '+SUCCESS_CLASS[s.key]+(off?' off':''));b.type='button';b.setAttribute('aria-current',i===successStage?'step':'false');b.append(el('span','success-letter',s.key),el('span','success-ko',M.letters[i].ko),el('strong','success-name',s.name),el('span','success-sel',off?'이번 차시 제외':s.sel.join(' · ')));b.onclick=()=>{successStage=i;renderDetail();};word.appendChild(b);});
 p.appendChild(word);
 const sel=el('div','success-sel-strip');sel.appendChild(el('span','src',band?band.key+'학년군 중점':'사회정서역량'));M.sel.forEach(x=>{const chip=el('span','success-chip'+(band&&band.focus.includes(x.name)?' on':''),x.name);chip.title=x.hint;sel.appendChild(chip);});if(band)sel.appendChild(el('span','src','교사 하이터치: '+band.touch));p.appendChild(sel);
 const pillars=el('details','method-sources');pillars.appendChild(el('summary',null,'SUCCESS 글자의 뜻 · 학생·교사·학교는 무엇을 하나요?'));const grid=el('div','success-pillars');
 M.letters.forEach(l=>{const card=el('div','success-pillar '+SUCCESS_CLASS[l.key]);card.appendChild(el('strong',null,l.key+' '+l.ko));card.appendChild(el('span','src',l.en+' · '+l.sel));for(const [who,t] of [['학생',l.student],['교사',l.teacher],['학교',l.school]])card.appendChild(el('p',null,who+' · '+t));grid.appendChild(card);});
 pillars.appendChild(grid);pillars.appendChild(el('p','src','역량 연결은 계획서의 용어 정의 표를 따릅니다. 단계 카드의 역량은 수업 모형·프로젝트 표를 따르며 일부 다릅니다.'));p.appendChild(pillars);
 const s=successStep(successForm,successStage),body=el('section','success-body '+SUCCESS_CLASS[s.key]);
 if(lesson&&!stages.includes(s.key)){const note=el('div','success-note');note.appendChild(el('p',null,'이 단계는 이번 차시에 넣지 않았습니다. 앞뒤 차시에서 다룰 때 참고하세요.'));const add=el('button','btn','이번 차시에 넣기');add.onclick=()=>{saveSuccessStages(r,[...stages,s.key]);renderDetail();};note.appendChild(add);body.appendChild(note);}
 const h=el('h3');h.append(el('span','success-letter-inline',s.key),document.createTextNode(s.name+' '),el('span','src',s.en));body.appendChild(h);
 const acts=el('ul','success-acts');acts.setAttribute('aria-label','계획서의 활동');s.acts.forEach(a=>acts.appendChild(el('li',null,a)));body.appendChild(acts);
 body.appendChild(el('p','src','연결 사회정서역량: '+s.sel.join(' · ')+' / 디지털 활용(계획서): '+s.digital));
 body.appendChild(el('p',null,s.role));
 const think=el('div','qft-think');think.appendChild(el('span','review-kicker','교사의 생각을 여는 질문'));think.appendChild(el('p',null,s.think));body.appendChild(think);
 const pair=el('div','qft-guide-pair');for(const [label,text] of [['학생이 하는 일',s.student],['자료로 옮길 때',s.material]]){const col=el('div');col.appendChild(el('strong',null,label));col.appendChild(el('p',null,text));pair.appendChild(col);}body.appendChild(pair);
 const pt=M.patterns.find(x=>x.stage===s.key);if(pt){const tip=el('div','success-tip');tip.appendChild(el('strong',null,'실천 지도안에서 확인한 방법 · '+pt.name));tip.appendChild(el('p',null,pt.how));tip.appendChild(el('p','src','주의: '+pt.caution));body.appendChild(tip);}
 const link=el('div','success-link');link.appendChild(el('strong',null,'이 성취기준과 연결하기 · 앱 제안'));link.appendChild(el('p',null,successLink(r,s.key)));body.appendChild(link);
 body.appendChild(el('p','success-example','계획서 발문 예시(4학년 사회): “'+s.ex+'”'));
 if(s.key==='CC'){const d=el('details','method-sources');d.open=true;d.appendChild(el('summary',null,'강점 기반 역할 나누기 · 계획서 예시'));const roles=el('div','success-roles');M.roles.forEach(x=>{const card=el('div','success-role');card.appendChild(el('strong',null,x.name));card.appendChild(el('span',null,x.strength+' · '+x.work));roles.appendChild(card);});d.appendChild(roles);d.appendChild(el('p','src','역할은 고정된 꼬리표가 아니라 강점을 발견하는 기회입니다. 바꿔 맡을 기회를 함께 설계하세요.'));body.appendChild(d);}
 if(s.key==='E'){const d=el('details','method-sources');d.appendChild(el('summary',null,'AI 윤리 약속 · 계획서의 AI 윤리 교육 내용'));M.aiEthics.forEach(x=>d.appendChild(el('p',null,x.name+' — '+x.detail)));body.appendChild(d);}
 const choice=el('details','method-sources');choice.appendChild(el('summary',null,'결정이 어려울 때 살펴볼 관점'));choice.appendChild(el('p',null,s.choose));body.appendChild(choice);
 body.appendChild(el('p','src','MD에 남길 내 생각: '+s.blank));p.appendChild(body);
 const bar=el('div','qft-actions');if(successStage>0){const b=el('button','btn','이전 단계');b.onclick=()=>{successStage--;renderDetail();};bar.appendChild(b);}if(successStage<form.steps.length-1){const b=el('button','btn on','다음 단계');b.onclick=()=>{successStage++;renderDetail();};bar.appendChild(b);}bar.appendChild(el('span','src',(successStage+1)+' / '+form.steps.length+' 단계'));p.appendChild(bar);
 const X=M.example,ex=el('details','method-sources success-case');ex.open=successInExample(r);ex.appendChild(el('summary',null,(successInExample(r)?'이 성취기준이 포함된 ':'')+'계획서 적용 예시 · '+X.unit));
 ex.appendChild(el('p','src','관련 성취기준 '+X.codes.join(' ')+' · 예시의 차시와 질문은 참고용입니다.'));ex.appendChild(el('p',null,'핵심 아이디어: '+X.idea));const lens=el('div','success-sel-strip');lens.appendChild(el('span','src','개념적 렌즈'));X.lenses.forEach(t=>lens.appendChild(el('span','success-chip on',t)));ex.appendChild(lens);ex.appendChild(el('p',null,'프로젝트 주제: '+X.topic));
 const flow=el('ol','success-flow');X.steps.forEach(x=>{const li=el('li','success-flow-step '+SUCCESS_CLASS[x.key]);li.append(el('span','success-letter-inline',x.key),el('span','src',x.time),el('p',null,x.act),el('p','success-example','“'+x.q+'”'));flow.appendChild(li);});ex.appendChild(flow);p.appendChild(ex);
 const more=el('details','qft-md-preview');more.appendChild(el('summary',null,'내려받을 MD 내용 미리보기'));more.appendChild(el('pre',null,successDesignMd(r)));p.appendChild(more);
 const source=el('details','method-sources');source.appendChild(el('summary',null,'SUCCESS 모델 출처와 안내'));source.appendChild(el('p','src',successSourceNote()));source.appendChild(el('p','src','설계 방법: '+M.patternSource));source.appendChild(el('p','src','교사의 생각을 여는 질문, 성취기준과의 연결, SUCCESS 설계 초안과 예시, PPT·학습지 틀은 앱이 구성한 제안입니다.'));p.appendChild(source);
}
const beforeSuccessStart=startReview;
startReview=function(){beforeSuccessStart();const banner=document.querySelector('.review-banner');if(!banner)return;const label=el('label','pilot-picker','SUCCESS 검토 예시 '),select=el('select');select.setAttribute('aria-label','SUCCESS 검토 예시');const empty=el('option',null,'성취기준 선택');empty.value='';select.appendChild(empty);SUCCESS_MODEL.cases.forEach(x=>{const r=STD.find(y=>y.c===x.code);if(!r)return;const o=el('option',null,r.subj+' '+x.code);o.value=x.code;select.appendChild(o);});select.onchange=()=>{const r=STD.find(y=>y.c===select.value);if(!r)return;S.q='';$('#q').value='';S.bands.clear();S.subjs.clear();S.areas.clear();inquiryMode='success';successForm='project';successStage=0;goto(r,{tab:'plan'});renderFilters();$('#detailcol').classList.add('open');};label.appendChild(select);banner.appendChild(label);};
