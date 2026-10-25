/* v2.2 교과서 학년-학기 배치. 데이터: data/grade-semester.json (build.py가 __GRADE_SEMESTER__에 삽입).
   교육과정 원문은 학년군까지만 정하므로 공식 지정이 아니라 교과서 편성 정보로 표시한다.
   gs: 평가 계획의 단원 배치, also: 같은 기준을 각론 근거로 연계 지도하는 학기, kind='연계': 평가 계획 배치 없이 여러 단원에 녹여 지도하는 기준. */
const GRADE_SEMESTER=__GRADE_SEMESTER__;
const GS_KEYS=['1-1','1-2','2-1','2-2','3-1','3-2','4-1','4-2','5-1','5-2','6-1','6-2'];
S.gs=new Set();
function gsOf(r){return GRADE_SEMESTER.map[r.c]||null;}
function gsAll(r){const e=gsOf(r);return e?[...e.gs,...(e.also||[])].sort((a,b)=>GS_KEYS.indexOf(a)-GS_KEYS.indexOf(b)):[];}
function gsLabel(k){const [g,s]=k.split('-');return g+'학년 '+s+'학기';}
function gsLinked(r){const e=gsOf(r);return !!e&&e.kind==='연계';}
function gsShort(r){const e=gsOf(r);if(!e)return '';return (gsLinked(r)?'연계 ':'')+e.gs.join(' · ')+((e.also||[]).length?' +'+e.also.join(' · '):'');}
function gsHit(r){return gsAll(r).some(k=>S.gs.has(k));}
function gsSubjectBasis(r){return GRADE_SEMESTER.basis[r.subj]||'';}
function gsText(r){
  const e=gsOf(r);
  if(!e)return '교과서 배치: 자료 없음 — '+(GRADE_SEMESTER.none[r.c]||'확인되지 않음');
  if(gsLinked(r))return '교과서 배치(학년-학기): 연계 지도 — '+e.gs.map(gsLabel).join(', ')+' ('+e.note+')';
  return '교과서 배치(학년-학기): '+e.gs.map(gsLabel).join(', ')+((e.also||[]).length?' · 연계 지도: '+e.also.map(gsLabel).join(', '):'')+(e.note?' ('+e.note+')':'');
}
function gsSourceText(r){const e=gsOf(r);return (e&&e.basis?'각론 근거: '+e.basis+'\n':'')+'근거: '+GRADE_SEMESTER.source+' · '+r.subj+' '+gsSubjectBasis(r)+' 기준. 공식 교육과정 지정이 아니며 학교 교육과정·출판사에 따라 다를 수 있음';}
function renderGsChips(){
  const host=$('#fGs');if(!host)return;
  chipsInto(host,GS_KEYS.map(k=>({v:k,label:k})),S.gs,()=>render());
  host.querySelectorAll('.chip').forEach((b,i)=>b.title=gsLabel(GS_KEYS[i])+' 교과서에서 다루는 기준(연계 지도 포함)');
}
const renderFiltersBeforeGs=renderFilters;
renderFilters=function(){renderFiltersBeforeGs();renderGsChips();};
const renderBeforeGs=render;
render=function(){document.querySelectorAll('#fGs .chip').forEach((b,i)=>b.classList.toggle('on',S.gs.has(GS_KEYS[i])));renderBeforeGs();};
function addGsBox(p,r){
  const e=gsOf(r),box=el('div','gs-box');
  box.appendChild(secTitle('교과서 배치 · 학년-학기',gsLinked(r)?'여러 단원 연계 지도':'교과서 편성 정보'));
  const line=el('div','gs-line');
  const chip=(k,linked)=>{const b=el('button','chip gs-chip'+(linked?' gs-linked':''),gsLabel(k)+(linked?' · 연계':''));b.title='이 학년-학기의 기준만 목록에 보기';b.onclick=()=>{S.gs.clear();S.gs.add(k);render();};line.appendChild(b);};
  if(e){e.gs.forEach(k=>chip(k,gsLinked(r)));(e.also||[]).forEach(k=>chip(k,true));}
  else line.appendChild(el('span','review-muted','자료 없음 — '+(GRADE_SEMESTER.none[r.c]||'확인되지 않음')));
  box.appendChild(line);
  if(e&&e.units.length){const u=el('p','gs-units');u.textContent=(gsLinked(r)?'관련 단원·활동: ':'단원(대표 교과서): ')+e.units.join(' / ');box.appendChild(u);}
  if(e&&(e.alsoUnits||[]).length){const u=el('p','gs-units');u.textContent='연계 단원: '+e.alsoUnits.join(' / ');box.appendChild(u);}
  if(e&&e.note)box.appendChild(el('p','review-muted',e.note));
  gsSourceText(r).split('\n').forEach(t=>box.appendChild(el('p','review-muted',t)));
  p.prepend(box);
}
const paneStdBeforeGs=paneStd;
paneStd=function(p,r,terms){paneStdBeforeGs(p,r,terms);addGsBox(p,r);};
function gsMdBlock(r){const e=gsOf(r);return gsText(r)+(e&&e.units.length?'\n'+(gsLinked(r)?'관련 단원·활동: ':'교과서 단원(대표): ')+e.units.join(' / '):'')+(e&&(e.alsoUnits||[]).length?'\n연계 단원: '+e.alsoUnits.join(' / '):'')+'\n'+gsSourceText(r);}
const qftDesignMdBeforeGs=qftDesignMd;
qftDesignMd=function(r){return qftDesignMdBeforeGs(r).replace(r.c+' '+r.t,r.c+' '+r.t+'\n\n'+gsMdBlock(r));};
const successDesignMdBeforeGs=successDesignMd;
successDesignMd=function(r,form){const md=form===undefined?successDesignMdBeforeGs(r):successDesignMdBeforeGs(r,form);return md.replace(r.c+' '+r.t,r.c+' '+r.t+'\n\n'+gsMdBlock(r));};
const gsCell=r=>{const e=gsOf(r);if(!e)return '자료 없음';return (gsLinked(r)?'연계: ':'')+e.gs.join(' / ')+((e.also||[]).length?' / 연계: '+e.also.join(' / '):'');};
toCSV=rows=>'﻿'+[['성취기준 코드','교과서 학년-학기','성취기준 원문','성취수준 A','성취수준 B','성취수준 C','출처'],...rows.map(r=>[r.c,gsCell(r),r.t,r.A,r.B,r.C,reviewSourceText(r)])].map(row=>row.map(csvEsc).join(',')).join('\r\n');
planCSV=function(rows){const out=[['성취기준 코드','교과서 학년-학기','성취기준 원문','내용 체계 연결(검토)','학습 증거 제안','평가 방법 후보','피드백(교사 편집 포함)','성취수준 구분','성취수준 원문','출처']];rows.forEach(r=>['A','B','C'].forEach(k=>out.push([r.c,gsCell(r),r.t,domName(r)||'보류',designFor(r).evidence,evalDraft(r).ways.map(w=>w.m).join(' / '),feedbackText(r),k,r[k],reviewSourceText(r)])));return '﻿'+out.map(row=>row.map(csvEsc).join(',')).join('\r\n');};
