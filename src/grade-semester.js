/* v2.2.0 교과서 학년-학기 배치. 데이터: data/grade-semester.json (build.py가 __GRADE_SEMESTER__에 삽입).
   교육과정 원문은 학년군까지만 정하므로 공식 지정이 아니라 교과서 편성 정보로 표시한다. */
const GRADE_SEMESTER=__GRADE_SEMESTER__;
const GS_KEYS=['1-1','1-2','2-1','2-2','3-1','3-2','4-1','4-2','5-1','5-2','6-1','6-2'];
S.gs=new Set();
function gsOf(r){return GRADE_SEMESTER.map[r.c]||null;}
function gsLabel(k){const [g,s]=k.split('-');return g+'학년 '+s+'학기';}
function gsShort(r){const e=gsOf(r);return e?e.gs.join(' · '):'';}
function gsHit(r){const e=gsOf(r);return !!e&&e.gs.some(k=>S.gs.has(k));}
function gsSubjectBasis(r){return GRADE_SEMESTER.basis[r.subj]||'';}
function gsText(r){
  const e=gsOf(r);
  if(!e)return '교과서 배치: 자료 없음 — '+(GRADE_SEMESTER.none[r.c]||'확인되지 않음');
  return '교과서 배치(학년-학기): '+e.gs.map(gsLabel).join(', ')+(e.note?' ('+e.note+')':'');
}
function gsSourceText(r){return '근거: '+GRADE_SEMESTER.source+' · '+r.subj+' '+gsSubjectBasis(r)+' 기준. 공식 교육과정 지정이 아니며 학교 교육과정·출판사에 따라 다를 수 있음';}
function renderGsChips(){
  const host=$('#fGs');if(!host)return;
  chipsInto(host,GS_KEYS.map(k=>({v:k,label:k})),S.gs,()=>render());
  host.querySelectorAll('.chip').forEach((b,i)=>b.title=gsLabel(GS_KEYS[i])+' 교과서에서 다루는 기준');
}
const renderFiltersBeforeGs=renderFilters;
renderFilters=function(){renderFiltersBeforeGs();renderGsChips();};
const renderBeforeGs=render;
render=function(){document.querySelectorAll('#fGs .chip').forEach((b,i)=>b.classList.toggle('on',S.gs.has(GS_KEYS[i])));renderBeforeGs();};
function addGsBox(p,r){
  const e=gsOf(r),box=el('div','gs-box');
  box.appendChild(secTitle('교과서 배치 · 학년-학기','교과서 편성 정보'));
  const line=el('div','gs-line');
  if(e)e.gs.forEach(k=>{const b=el('button','chip gs-chip',gsLabel(k));b.title='이 학년-학기의 기준만 목록에 보기';b.onclick=()=>{S.gs.clear();S.gs.add(k);render();};line.appendChild(b);});
  else line.appendChild(el('span','review-muted','자료 없음 — '+(GRADE_SEMESTER.none[r.c]||'확인되지 않음')));
  box.appendChild(line);
  if(e&&e.units.length){const u=el('p','gs-units');u.textContent='단원(대표 교과서): '+e.units.join(' / ');box.appendChild(u);}
  if(e&&e.note)box.appendChild(el('p','review-muted',e.note));
  box.appendChild(el('p','review-muted',gsSourceText(r)));
  p.prepend(box);
}
const paneStdBeforeGs=paneStd;
paneStd=function(p,r,terms){paneStdBeforeGs(p,r,terms);addGsBox(p,r);};
function gsMdBlock(r){const e=gsOf(r);return gsText(r)+(e&&e.units.length?'\n교과서 단원(대표): '+e.units.join(' / '):'')+'\n'+gsSourceText(r);}
const qftDesignMdBeforeGs=qftDesignMd;
qftDesignMd=function(r){return qftDesignMdBeforeGs(r).replace(r.c+' '+r.t,r.c+' '+r.t+'\n\n'+gsMdBlock(r));};
const successDesignMdBeforeGs=successDesignMd;
successDesignMd=function(r,form){const md=form===undefined?successDesignMdBeforeGs(r):successDesignMdBeforeGs(r,form);return md.replace(r.c+' '+r.t,r.c+' '+r.t+'\n\n'+gsMdBlock(r));};
const gsCell=r=>{const e=gsOf(r);return e?e.gs.join(' / '):'자료 없음';};
toCSV=rows=>'﻿'+[['성취기준 코드','교과서 학년-학기','성취기준 원문','성취수준 A','성취수준 B','성취수준 C','출처'],...rows.map(r=>[r.c,gsCell(r),r.t,r.A,r.B,r.C,reviewSourceText(r)])].map(row=>row.map(csvEsc).join(',')).join('\r\n');
planCSV=function(rows){const out=[['성취기준 코드','교과서 학년-학기','성취기준 원문','내용 체계 연결(검토)','학습 증거 제안','평가 방법 후보','피드백(교사 편집 포함)','성취수준 구분','성취수준 원문','출처']];rows.forEach(r=>['A','B','C'].forEach(k=>out.push([r.c,gsCell(r),r.t,domName(r)||'보류',designFor(r).evidence,evalDraft(r).ways.map(w=>w.m).join(' / '),feedbackText(r),k,r[k],reviewSourceText(r)])));return '﻿'+out.map(row=>row.map(csvEsc).join(',')).join('\r\n');};
