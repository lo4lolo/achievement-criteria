// v2.2.0 교과서 학년-학기: 데이터 무결성, 필터, 상세, MD/CSV, 범위 해제, 390px 검사.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const url=process.env.APP_URL||require('node:url').pathToFileURL(path.resolve(__dirname,'../index.html')).href;
(async()=>{const b=await chromium.launch({headless:true,...(process.env.CHROME_CHANNEL?{channel:process.env.CHROME_CHANNEL}:{})});try{
const p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(url);await p.waitForSelector('#fGs .chip');
const gsData=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/grade-semester.json'),'utf8'));
const r=await p.evaluate(async()=>{const wait=()=>new Promise(r=>setTimeout(r,60)),fail=[];
 const band={0:[1,2],1:[3,4],2:[5,6]};
 for(const x of STD){const e=gsOf(x),none=GRADE_SEMESTER.none[x.c];
  if(!!e===!!none)fail.push(x.c+':map-or-none');
  if(e){if(!e.gs.length)fail.push(x.c+':empty');for(const k of gsAll(x)){const [g,s]=k.split('-').map(Number);if(!band[x.b].includes(g)||![1,2].includes(s))fail.push(x.c+':band '+k);}}
  const md=qftDesignMd(x),sm=successDesignMd(x);if(!md.includes(gsText(x))||!sm.includes(gsText(x)))fail.push(x.c+':md');
  if(!toCSV([x]).includes(e?e.gs.join(' / '):'자료 없음'))fail.push(x.c+':csv');}
 const counts={};
 for(const k of GS_KEYS){S.gs.clear();S.gs.add(k);render();await wait();const f=filtered();counts[k]=f.length;
  if(!f.length||f.some(x=>!gsAll(x).includes(k)))fail.push('filter '+k);
  if(document.querySelectorAll('.item').length!==Math.min(f.length,700))fail.push('list '+k);}
 S.gs.clear();render();await wait();
 // 검색 범위 해제 버튼이 학년-학기도 함께 푼다
 S.gs.add('1-1');S.q='곱셈';render();await wait();const narrowed=filtered().length;const wide=searchAllScope().length;const stillOn=S.gs.has('1-1');
 S.q='';S.gs.clear();render();await wait();
 S.sel=STD.find(x=>x.c==='[4과01-01]');S.tab='std';render();await wait();
 const box=document.querySelector('.gs-box')?.innerText||'',tag=document.querySelector('.gs-tag')?.innerText||'';
 return {fail,counts,box,tag,narrowed,wide,stillOn,none:Object.keys(GRADE_SEMESTER.none)};});
assert.deepEqual(errors,[]);assert.deepEqual(r.fail,[]);
assert.ok(r.box.includes('3학년 1학기')&&r.box.includes('힘과 우리 생활'));assert.equal(r.none.length,0);assert.equal(r.tag,'교과서 3-1');
assert.ok(r.wide>=r.narrowed&&r.stillOn,'searchAllScope는 학년-학기 선택을 되돌려 놓아야 함');
assert.equal(Object.keys(gsData.map).length+r.none.length,611);
await p.setViewportSize({width:390,height:844});await p.waitForTimeout(150);
const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);assert.equal(overflow,false);
const out={result:'PASS',version:require('../package.json').version,mapped:Object.keys(gsData.map).length,none:r.none,perSemester:r.counts};
fs.writeFileSync(path.join(__dirname,'grade-semester-verification.json'),JSON.stringify(out,null,2));console.log(JSON.stringify(out));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1);});
