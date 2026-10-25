"""Build the published app and matching offline HTML from shared sources."""
from pathlib import Path
import hashlib

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
base = (HERE / 'base-v1.html').read_text(encoding='utf-8')
data = (ROOT / 'data/app.json').read_text(encoding='utf-8')

def replace(old, new):
    global base
    assert old in base, f'Baseline changed: {old[:80]}'
    base = base.replace(old, new)

replace('<title>2022 개정 교육과정 초등 수업 설계 도우미</title>', '<title>확인용 · 교육과정 수업 설계 도우미</title>')
replace('</style>', '\n' + (HERE/'review.css').read_text(encoding='utf-8') + '\n' + (HERE/'success.css').read_text(encoding='utf-8') + '\n</style>')
# No top review banner (removed at the user's request). The basket clear button sits next to the count so it is easy to find.
replace('<button class="btn" id="cartClear">비우기</button>', '')
replace('<span style="color:var(--dim);font-size:12px">수업 바구니</span>', '<span style="color:var(--dim);font-size:12px">수업 바구니</span><button class="btn" id="cartClear">모두 비우기</button>')
# Migrate the most recent v2 selection, including an explicitly empty basket.
replace("JSON.parse(localStorage.getItem('cart2022')||'[]')", "JSON.parse(localStorage.getItem('review-cart2022-v1')??localStorage.getItem('cart2022')??'[]')")


replace("cb.onclick=ev=>{ ev.stopPropagation(); cb.checked?S.cart.add(r.c):S.cart.delete(r.c); saveCart(); };", "cb.dataset.cartCode=r.c; cb.setAttribute('aria-label',r.c+' 수업 바구니 선택'); cb.onclick=ev=>{ ev.stopPropagation(); cb.checked?S.cart.add(r.c):S.cart.delete(r.c); saveCart(); };")
replace("inCart?'✓ 담김':'+ 수업 바구니'", "inCart?'바구니에서 빼기':'+ 수업 바구니'")
replace("bAdd.onclick=()=>", "bAdd.dataset.cartAction=r.c; bAdd.setAttribute('aria-pressed',String(inCart)); bAdd.onclick=()=>")
replace("bAdd.onclick=()=>{ S.cart.has(r.c)?S.cart.delete(r.c):S.cart.add(r.c); saveCart(); render(); };", "bAdd.onclick=()=>{ S.cart.has(r.c)?S.cart.delete(r.c):S.cart.add(r.c); saveCart(); };")
replace("act.appendChild(bAdd); act.appendChild(bMd);", "act.appendChild(bAdd); addReviewCopyActions(act,r); act.appendChild(bMd);")
replace("head.appendChild(act); d.appendChild(head);", "head.appendChild(act); addReviewSource(head,r); d.appendChild(head);")
replace("['plan','개념 기반 탐구']", "['plan','탐구 설계']")
replace("['map','개념 지도']", "['map','개념 관계']")
replace("['plan','탐구 설계'],['rel','연관·위계'],['map','개념 관계']", "['rel','연관·위계'],['map','개념 관계'],['plan','탐구 설계']")
replace("(r.domGuess&&!DOMPICK[r.c])?' · 영역 자동 연결':''", "(r.domGuess&&!DOMPICK[r.c])?(isReviewSample(r)?' · 연결 제안':' · 영역 자동 연결'):''")
replace("const domName = r => DOMPICK[r.c] || r.dom || null;", "const domName = r => DOMPICK[r.c] || (isReviewSample(r)?'지리 인식':r.dom) || null;")
replace("r._cbi=null; r._con=null;", "for(const k of ['_cbi','_con','_end','_lens','_eval','_teach','_tc','_prof','_sub','_topic','_gr']) delete r[k]; S.map=null; CONIDX.clear(); buildConceptIndex();")
replace("sel.onchange=()=>{ setDom(r,sel.value); renderDetail(); };", "sel.setAttribute('aria-label','내용 체계 연결 영역'); sel.onchange=()=>{ setDom(r,sel.value); S.areas.clear(); renderFilters(); render(); };")
replace("MAPCFG.showDom&&r.dom", "MAPCFG.showDom&&domName(r)")
replace("r.subj+'|'+r.dom,r.dom,r.subj+' 영역'", "r.subj+'|'+domName(r),domName(r),r.subj+' 영역'")
replace("'교육과정 원문 + AI 초안'", "'원문을 참고한 가공 초안'")
replace("'성취기준 해설에서 옮김'", "'해설을 참고해 가공한 초안'")
replace("'내용 요소에서 옮김'", "'내용 요소를 참고해 가공한 초안'")
replace('<button class="btn" id="cartCopy">', '<button class="btn on" id="cartPlain">코드+원문 복사</button><button class="btn" id="cartCopy">')
replace("document.execCommand('copy'); done();", "if(!document.execCommand('copy')) throw new Error('copy failed'); done();")
replace("$('#dlg').showModal();\n  };\n  $('#cartPrint')", "if(!$('#dlg').open) $('#dlg').showModal();\n  };\n  $('#cartPrint')")
# v2.2.1 교과서 학년-학기: 필터 행, 목록 배지, 상세 태그, 범위 해제 시 함께 해제(로직은 src/grade-semester.js).
replace('</style>', (HERE/'grade-semester.css').read_text(encoding='utf-8') + '\n</style>')
replace('<div class="frow"><span class="flabel">학년군</span><span id="fBand" style="display:contents"></span></div>', '<div class="frow"><span class="flabel">학년군</span><span id="fBand" style="display:contents"></span></div>\n    <div class="frow"><span class="flabel">학년-학기</span><span id="fGs" style="display:contents"></span></div>')
replace("(!S.bands.size||S.bands.has(r.b)) && ", "(!S.bands.size||S.bands.has(r.b)) && (!S.gs||!S.gs.size||gsHit(r)) && ")
replace("const b=new Set(S.bands), s=new Set(S.subjs), a=new Set(S.areas);\n  S.bands.clear(); S.subjs.clear(); S.areas.clear();", "const b=new Set(S.bands), s=new Set(S.subjs), a=new Set(S.areas), g=new Set(S.gs);\n  S.bands.clear(); S.subjs.clear(); S.areas.clear(); S.gs.clear();")
replace("a.forEach(x=>S.areas.add(x));", "a.forEach(x=>S.areas.add(x)); g.forEach(x=>S.gs.add(x));")
replace("const narrowed = raw && (S.bands.size||S.subjs.size||S.areas.size);", "const narrowed = raw && (S.bands.size||S.subjs.size||S.areas.size||S.gs.size);")
replace("b.onclick=()=>{ S.bands.clear(); S.subjs.clear(); S.areas.clear(); render(); };", "b.onclick=()=>{ S.bands.clear(); S.subjs.clear(); S.areas.clear(); S.gs.clear(); render(); };")
replace("S.areas.clear(); S.subjs.clear(); S.bands.clear(); }", "S.areas.clear(); S.subjs.clear(); S.bands.clear(); S.gs.clear(); }")
replace("if(r.hae) h.appendChild(el('span','badge','해설'));", "{ const g=gsShort(r); if(g) h.appendChild(el('span','badge gs-badge',g)); }\n    if(r.hae) h.appendChild(el('span','badge','해설'));")
replace("if(r.sr) tags.appendChild(el('span','tag','학년군 위계'));", "if(r.sr) tags.appendChild(el('span','tag','학년군 위계'));\n  { const g=gsOf(r); tags.appendChild(el('span','tag gs-tag', g?'교과서 '+g.gs.join(' · '):'교과서 배치 자료 없음')); }")
# v2.2.1 Google Sites 삽입 iframe(sandbox, allow-modals 없음)에서 confirm/alert/print가 막히는 문제(src/embed-safe.js).
replace("$('#cartClear').onclick=()=>{ if(confirm('담은 성취기준을 모두 비울까요?')){ S.cart.clear(); saveCart(); render(); } };", "$('#cartClear').onclick=async()=>{ if(!S.cart.size){ pageNotice('바구니가 이미 비어 있습니다.'); return; } if(await pageConfirm('담은 성취기준 '+S.cart.size+'개를 모두 비울까요?','모두 비우기')){ S.cart.clear(); saveCart(); render(); pageNotice('수업 바구니를 비웠습니다.'); } };")
replace("alert('복사에 실패했습니다.');", "pageNotice('복사에 실패했습니다. 내용을 직접 선택해 복사해 주세요.');")
replace("    window.print();\n  };", "    printArea(pa,'프로젝트 수업 성취기준 모음');\n  };")
# Remove lesson sequencing at the source, including exported sequence content.
start=base.index("  const bActs=el('button','btn','차시용 활동으로 나눠 복사');")
end=base.index("  if(r.q&&r.q.length){", start)
base=base[:start]+"  sbtn.appendChild(bCopySum); spot.appendChild(sbtn); pane.appendChild(spot);\n"+base[end:]
replace('차시 흐름을 보고 나누어 쓰세요.', '교과서에서 실제로 다룬 내용을 기준으로 정하세요.')
replace('성취기준·내용 요소·탐구 활동으로 차시 흐름을 짜 초안을 만듭니다.', '성취기준과 내용 요소를 참고한 초안입니다. 실제 교수·학습은 교과서에 맞추어 정하세요.')
replace('수업 의도·차시·활동·평가를 먼저 물어본 뒤', '수업 의도·교과서 학습 내용·활동·평가를 먼저 물어본 뒤')
replace("L.push('2) 어느 학년 몇 반이고 몇 차시로 계획하시나요? 학생들의 특성은 어떤가요?');", "L.push('2) 교과서에서 다룬 내용과 학생들의 특성은 무엇인가요?');")
replace("L.push('  ④ 차시별 탐구 흐름 (관계 맺기 → 집중하기 → 조사하기 → 조직 및 정리하기 →');\n  L.push('     일반화하기 → 전이하기 → 성찰하기)');", "L.push('  ④ 교과서에서 학습한 내용을 바탕으로 확인할 학습 증거');")
replace("fetch('data/app.json').then(r=>r.json()).then(boot).catch(e=>{", (HERE/'embed-safe.js').read_text(encoding='utf-8') + '\n' + (HERE/'review.js').read_text(encoding='utf-8') + '\n' + (HERE/'review-v2.js').read_text(encoding='utf-8') + '\n' + (HERE/'review-v3.js').read_text(encoding='utf-8') + '\n' + (HERE/'review-v4.js').read_text(encoding='utf-8') + '\n' + (HERE/'review-v5.js').read_text(encoding='utf-8') + '\n' + (HERE/'review-v6.js').read_text(encoding='utf-8').replace('__PILOT_DESIGNS__', (HERE/'pilot-designs.json').read_text(encoding='utf-8')).replace('__PILOT_SOURCES__', (HERE/'pilot-source-audit.json').read_text(encoding='utf-8')) + '\n' + (HERE/'release.js').read_text(encoding='utf-8').replace('__DESIGN_RULES__', (HERE/'design-rules.json').read_text(encoding='utf-8')).replace('__OTHER_REPAIRS__', (ROOT/'data/other-subject-repairs.json').read_text(encoding='utf-8')).replace('__DOMAIN_REPAIRS__', (ROOT/'data/domain-repairs.json').read_text(encoding='utf-8')).replace('__TEXT_REPAIRS__', (ROOT/'data/text-repairs.json').read_text(encoding='utf-8')).replace('__SOURCE_INDEX__', (ROOT/'data/sources.json').read_text(encoding='utf-8')) + '\n' + (HERE/'success.js').read_text(encoding='utf-8').replace('__SUCCESS_MODEL__', (HERE/'success-model.json').read_text(encoding='utf-8')) + '\n' + (HERE/'grade-semester.js').read_text(encoding='utf-8').replace('__GRADE_SEMESTER__', (ROOT/'data/grade-semester.json').read_text(encoding='utf-8').replace('</', '<\\/')) + "\nPromise.resolve(" + data.replace('</', '<\\/') + ").then(boot).then(startReview).catch(e=>{")
base=base.replace('const domName = r =>', 'let domName = r =>')
base=base.replace('확인용 · 교육과정 수업 설계 도우미', '교육과정 수업 설계 도우미 v2.2.1').replace('사회 ‘우리가 사는 곳’으로 탐구 설계 흐름을 확인해 보세요.','611개 성취기준 · 교사의 생각을 구체화하는 수업 설계').replace('기존 게시본과 별도로 저장됩니다','원문과 설계 제안을 구분합니다')
base='\n'.join(line.rstrip() for line in base.splitlines())+'\n'
(ROOT/'index.html').write_text(base,encoding='utf-8')
print('Built github/index.html v2.2.1; original JSON SHA256:',hashlib.sha256(data.encode()).hexdigest())

# Keep the double-click offline entry point identical, except relative PDF links.
offline=ROOT.parent/'2022개정 초등 수업설계 도우미 (오프라인용).html'
offline.write_text(base.replace("'sources/'", "'github/sources/'"),encoding='utf-8')
