/* v2.2.1 Google Sites 삽입 대응. 삽입 iframe의 sandbox에는 allow-modals가 없어 confirm·alert·print가
   창 없이 곧바로 거부된다(confirm은 false). 페이지 안의 <dialog>와 새 탭 인쇄로 대신한다. */
const IN_FRAME=(()=>{try{return window.self!==window.top;}catch(e){return true;}})();
function pageConfirm(message,okLabel){
  return new Promise(resolve=>{
    let d=document.getElementById('pageConfirm');
    if(!d){d=document.createElement('dialog');d.id='pageConfirm';d.className='page-confirm';d.setAttribute('aria-labelledby','pageConfirmText');
      d.innerHTML='<p id="pageConfirmText"></p><div class="page-confirm-act"><button type="button" class="btn" data-v="no">취소</button><button type="button" class="btn on" data-v="yes"></button></div>';
      document.body.appendChild(d);}
    d.querySelector('p').textContent=message;
    const no=d.querySelector('[data-v=no]'),yes=d.querySelector('[data-v=yes]');yes.textContent=okLabel||'확인';
    const done=v=>{no.onclick=yes.onclick=d.oncancel=null;if(d.open)d.close();resolve(v);};
    no.onclick=()=>done(false);yes.onclick=()=>done(true);d.oncancel=e=>{e.preventDefault();done(false);};
    d.showModal();no.focus();
  });
}
function pageNotice(message){
  if(typeof reviewToast==='function')return reviewToast(message);
  let n=document.getElementById('pageNotice');
  if(!n){n=document.createElement('div');n.id='pageNotice';n.className='review-toast';n.setAttribute('role','status');document.body.appendChild(n);}
  n.textContent=message;n.hidden=false;clearTimeout(pageNotice.t);pageNotice.t=setTimeout(()=>n.hidden=true,2600);
}
/* 인쇄: 단독 실행이면 바로 인쇄, 삽입 상태면 같은 내용을 새 탭에서 열어 인쇄한다. */
function printArea(node,title){
  if(!IN_FRAME){window.print();return;}
  const html='<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>'+esc2(title||'인쇄')+'</title><style>body{font-family:"Malgun Gothic",sans-serif;line-height:1.6;margin:24px;color:#111}@media print{body{margin:0}}</style></head><body>'+node.innerHTML+'<script>window.addEventListener("load",()=>setTimeout(()=>window.print(),300));<\/script></body></html>';
  const url=URL.createObjectURL(new Blob([html],{type:'text/html'}));
  const w=window.open(url,'_blank');
  if(!w)pageNotice('새 탭이 막혔습니다. 브라우저의 팝업 허용 후 다시 눌러 주세요.');
  else pageNotice('새 탭에서 인쇄 창을 엽니다.');
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
if(IN_FRAME)document.documentElement.classList.add('in-frame');
