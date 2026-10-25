// v2.2.1 Google Sites 삽입 재현 검사: 실제 Sites iframe과 같은 sandbox 속성(allow-modals 없음)으로 앱을 넣고
// 사용자가 누르는 순서대로 바구니·내보내기·복사·인쇄·대화상자·탭·필터·테마를 점검한다. APP_URL(http) 필요.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const APP=process.env.APP_URL||'http://127.0.0.1:8765/';
const HOST=process.env.EMBED_HOST||'http://localhost:8771/tests/embed-harness.html';
const SANDBOX='allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads allow-storage-access-by-user-activation';
(async()=>{const b=await chromium.launch({headless:true,...(process.env.CHROME_CHANNEL?{channel:process.env.CHROME_CHANNEL}:{})});const checks=[];const ok=m=>checks.push(m);
try{
 const ctx=await b.newContext({viewport:{width:1366,height:900},acceptDownloads:true});const page=await ctx.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(HOST+'?src='+encodeURIComponent(APP));
 const fr=await (await page.waitForSelector('#app')).contentFrame();
 fr.page().on('dialog',d=>{errors.push('native dialog: '+d.message());d.dismiss();});
 await fr.waitForSelector('#fGs .chip');
 assert.equal(await fr.evaluate(()=>IN_FRAME),true);ok('iframe에서 IN_FRAME 감지');
 // 필터·검색
 await fr.click('#fGs .chip:nth-child(5)');await fr.waitForTimeout(150);
 const n31=await fr.evaluate(()=>({items:document.querySelectorAll('.item').length,f:filtered().length,all:filtered().every(r=>gsAll(r).includes('3-1'))}));
 assert.ok(n31.items>0&&n31.items===n31.f&&n31.all);ok('학년-학기 필터 3-1: '+n31.f+'개');
 await fr.click('#fGs .chip:nth-child(5)');await fr.fill('#q','곱셈');await fr.waitForTimeout(300);
 assert.ok(await fr.evaluate(()=>filtered().length>0));ok('검색');
 await fr.fill('#q','');await fr.waitForTimeout(300);
 // 바구니 담기·모두 비우기 (핵심 오류)
 const boxes=await fr.$$('.item input[type=checkbox]');await boxes[0].click();await boxes[1].click();await boxes[2].click();
 assert.equal(await fr.evaluate(()=>S.cart.size),3);ok('체크박스로 3개 담기');
 await fr.click('#cartClear');await fr.waitForSelector('#pageConfirm[open]');
 await fr.click('#pageConfirm [data-v=no]');assert.equal(await fr.evaluate(()=>S.cart.size),3);ok('모두 비우기 → 취소 시 유지');
 await fr.click('#cartClear');await fr.waitForSelector('#pageConfirm[open]');await fr.click('#pageConfirm [data-v=yes]');await fr.waitForTimeout(150);
 const cleared=await fr.evaluate(()=>({n:S.cart.size,ls:localStorage.getItem('cart2022'),checked:document.querySelectorAll('.item input:checked').length,label:$('#cartN').textContent}));
 assert.equal(cleared.n,0);assert.equal(cleared.checked,0);assert.ok(!cleared.ls||cleared.ls==='[]');ok('모두 비우기 → 확인 시 0개, 저장값 비움, 체크 해제 ('+cleared.label+')');
 await fr.goto(APP);await fr.waitForSelector('#fGs .chip');assert.equal(await fr.evaluate(()=>S.cart.size),0);ok('새로고침 뒤에도 0개');
 // 전체 담기 ↔ 전체 해제
 await fr.click('#fSubj .chip:nth-child(3)');await fr.waitForTimeout(150);await fr.click('#btnAll');
 const allN=await fr.evaluate(()=>({n:S.cart.size,f:filtered().length,label:$('#btnAll').textContent}));assert.equal(allN.n,allN.f);ok('전체 담기 '+allN.n+'개 → 버튼 "'+allN.label+'"');
 // 내보내기 4종
 for(const id of ['cartCsv','cartPlan','cartMd','cartDoc']){const [d]=await Promise.all([fr.page().waitForEvent('download'),fr.click('#'+id)]);const p=await d.path();assert.ok(fs.statSync(p).size>100);ok(id+' 다운로드 '+d.suggestedFilename());}
 const csv=fs.readFileSync(await (await Promise.all([fr.page().waitForEvent('download'),fr.click('#cartCsv')]))[0].path(),'utf8');assert.ok(csv.includes('교과서 학년-학기'));ok('CSV에 학년-학기 열');
 // 복사 2종(클립보드 권한 없는 iframe → execCommand 대체)
 for(const id of ['cartPlain','cartCopy']){const before=await fr.textContent('#'+id);await fr.click('#'+id);await fr.waitForTimeout(100);const after=await fr.textContent('#'+id);assert.notEqual(after,before,id);ok(id+' 복사 표시 "'+after+'"');await fr.waitForTimeout(1300);}
 // 목록 대화상자 + 빼기
 await fr.click('#cartView');await fr.waitForSelector('#dlg[open]');const before=await fr.evaluate(()=>S.cart.size);await fr.click('#dlg .btn.sm');await fr.waitForTimeout(100);
 assert.equal(await fr.evaluate(()=>S.cart.size),before-1);ok('목록 대화상자에서 빼기');await page.keyboard.press('Escape');
 // 인쇄 → 새 탭
 const [pop]=await Promise.all([ctx.waitForEvent('page'),fr.click('#cartPrint')]);await pop.waitForLoadState();assert.ok((await pop.content()).includes('성취기준 모음'));ok('인쇄/PDF → 새 탭 열림');await pop.close();
 // 상세 탭 6개·MD·SUCCESS
 await fr.click('.item');for(const t of await fr.$$eval('.tabs .tab',x=>x.map(e=>e.textContent))){await fr.click(`.tabs .tab:text-is("${t}")`);await fr.waitForTimeout(80);}
 ok('상세 탭 순회: '+(await fr.$$eval('.tabs .tab',x=>x.length))+'개');
 const [md]=await Promise.all([fr.page().waitForEvent('download'),fr.click('.dact .btn:text("이 성취기준 MD")')]);assert.ok(fs.readFileSync(await md.path(),'utf8').includes('교과서 배치'));ok('이 성취기준 MD에 교과서 배치');
 // 연계 지도 표시
 await fr.evaluate(()=>{S.subjs.clear();S.bands.clear();S.areas.clear();S.gs.clear();S.sel=STD.find(r=>r.c==='[4국02-06]');S.tab='std';render();});assert.ok((await fr.textContent('.gs-box')).includes('연계'));ok('연계 지도 기준 상세 표시');
 // 도움말·교과 살펴보기
 for(const id of ['btnHelp','btnGuide']){await fr.click('#'+id);await fr.waitForSelector('dialog[open]');ok(id+' 창 열림');await page.keyboard.press('Escape');await fr.waitForTimeout(100);}
 // 공식 PDF 새 탭
 await fr.evaluate(()=>{S.sel=STD.find(r=>r.c==='[4과01-01]');S.tab='std';render();document.querySelectorAll('details').forEach(d=>d.open=true);});
 const pdfHref=await fr.$eval('a[target=_blank][href*="sources/"]',a=>a.href);
 const [pdf]=await Promise.all([ctx.waitForEvent('page'),fr.click('a[target=_blank][href*="sources/"]')]);ok('공식 PDF 링크 새 탭 '+decodeURIComponent(pdfHref.split('/').pop()).slice(0,20));await pdf.close();
 // 탐구 설계: QFT·SUCCESS MD
 await fr.evaluate(()=>{S.tab='plan';inquiryMode='student';renderDetail();});
 { const [d]=await Promise.all([fr.page().waitForEvent('download'),fr.click('.btn:text("QFT 설계 MD 내려받기")')]);assert.ok(fs.readFileSync(await d.path(),'utf8').includes('교과서 배치'));ok('QFT 설계 MD 내려받기'); }
 await fr.evaluate(()=>{inquiryMode='success';renderDetail();});
 { const [d]=await Promise.all([fr.page().waitForEvent('download'),fr.click('.btn:text("SUCCESS 설계 MD 내려받기")')]);assert.ok(fs.readFileSync(await d.path(),'utf8').includes('교과서 배치'));ok('SUCCESS 설계 MD 내려받기'); }
 // 작업 파일 저장 → 불러오기(페이지 안 확인창)
 await fr.evaluate(()=>{S.sel=STD.find(r=>r.c==='[4사01-01]');S.tab='plan';inquiryMode='teacher';renderDetail();});
 const save=await fr.$('.btn:text("작업 파일 저장")');
 if(save){const [d]=await Promise.all([fr.page().waitForEvent('download'),save.click()]);const fp=await d.path();
  const input=await fr.$('input[type=file][accept*=json]');await input.setInputFiles({name:'work.json',mimeType:'application/json',buffer:fs.readFileSync(fp)});
  await fr.waitForSelector('#pageConfirm[open]');await fr.click('#pageConfirm [data-v=yes]');await fr.waitForTimeout(200);ok('작업 파일 저장·불러오기(확인창 → 바꾸기)');}
 else ok('작업 파일 버튼 없음(대표 사례 아님) — 건너뜀');
 // 테마
 await fr.click('#btnTheme');assert.equal(await fr.evaluate(()=>document.documentElement.dataset.theme),'dark');await fr.click('#btnTheme');ok('야간 모드 전환');
 // 바구니 다시 비우기
 await fr.click('#cartClear');await fr.waitForSelector('#pageConfirm[open]');await fr.click('#pageConfirm [data-v=yes]');await fr.waitForTimeout(100);
 assert.equal(await fr.evaluate(()=>S.cart.size===0&&$('#cart').hidden),true);ok('다시 비우기 → 0개, 바구니 막대 숨김');
 assert.deepEqual(errors,[]);
 const out={result:'PASS',version:require('../package.json').version,sandbox:SANDBOX,checks};fs.writeFileSync(path.join(__dirname,'embed-verification.json'),JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,1));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1);});
