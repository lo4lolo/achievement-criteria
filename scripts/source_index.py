"""Hash-cached source locations. Never rewrites the official dataset."""
from pathlib import Path
from pypdf import PdfReader
import json,re,hashlib,shutil
ROOT=Path(__file__).resolve().parents[1]
workspace=ROOT.parent
def norm(t):return re.sub(r'\s+','',t).replace('–','-').replace('−','-').replace('ㆍ','·').replace('⋅','·').replace('･','·')
pdfs=list(workspace.glob('*초등만.pdf'))+list(workspace.glob('★*.pdf'))
if not pdfs:pdfs=list((ROOT/'sources').glob('*.pdf'))
cachepath=ROOT/'sources/text-cache.json'
cache=json.loads(cachepath.read_text('utf-8')) if cachepath.exists() else {}
texts={}
for file in pdfs:
 h=hashlib.sha256(file.read_bytes()).hexdigest()
 if cache.get(file.name,{}).get('sha256')!=h:
  cache[file.name]={'sha256':h,'pages':[p.extract_text() or '' for p in PdfReader(file).pages]}
 texts[file.name]=[norm(t) for t in cache[file.name]['pages']]
 dest=ROOT/'sources'/file.name
 if dest.resolve()!=file.resolve():shutil.copy2(file,dest)
cachepath.write_text(json.dumps(cache,ensure_ascii=False),'utf-8')
data=json.loads((ROOT/'data/app.json').read_text('utf-8'))
repairs=json.loads((ROOT/'data/text-repairs.json').read_text('utf-8')) if (ROOT/'data/text-repairs.json').exists() else {}
book={0:5,1:7,2:6,3:8,4:9,5:10,6:11,7:12,8:13,9:14}
result={}
for r in data['std']:
 r={**r,**repairs.get(r['c'],{}).get('fields',{})}
 level=next(n for n in texts if n.startswith('★') and ['1~2','3~4','5~6'][r['b']] in n)
 f=next((n for n in texts if n.startswith(f"[별책{book.get(r['s'],0)}]")),level)
 def locate(file,values,require_code=True):
  pp=texts[file];out=[]
  for i,t in enumerate(pp):
   if require_code and norm(r['c']) not in t:continue
   joined=t+(pp[i+1] if i+1<len(pp) else '')
   if all(norm(v) in joined for v in values if v):
    out.append(i+1)
    if not all(norm(v) in t for v in values if v):out.append(i+2)
  return sorted(set(out))
 sp=locate(f,[r['t']]);lp=locate(level,[r.get(k,'') for k in ['A','B','C']]);hp=locate(f,[r.get('hae','')]) if r.get('hae') else []
 result[r['c']]={'file':f,'pages':sp,'levelFile':level,'levelPages':lp,'haePages':hp,'standardVerified':bool(sp),'levelsVerified':bool(lp),'haeVerified':bool(hp) if r.get('hae') else None,'basis':'공백·줄바꿈·줄표·가운뎃점 이형을 정규화한 문자열 대조','curriculumFromLevels':r['s'] not in book}
 result[r['c']]['levelCandidatePages']=[i+1 for i,t in enumerate(texts[level]) if norm(r['c']) in t]
 if not sp:result[r['c']]['candidatePages']=[i+1 for i,t in enumerate(texts[f]) if norm(r['c']) in t]
 if not sp and f!=level:
  alternative=locate(level,[r['t']])
  if alternative:
   result[r['c']].update({'curriculumFile':f,'curriculumCandidatePages':result[r['c']]['candidatePages'],'file':level,'pages':alternative,'standardVerified':True,'curriculumFromLevels':True,'variantNote':'보유한 별책 교육과정 PDF와 성취수준 자료에 수록된 기준의 표기가 다릅니다. 앱 본문은 성취수준 자료에서 대조했습니다. 두 공식 자료를 함께 확인하세요.'})
 if r['c'] in repairs:
  repair=repairs[r['c']];result[r['c']]['repairNote']=repair['note']
  if 'C' in repair['fields']:result[r['c']].update({'levelPages':[repair['page']],'levelsVisualVerified':True})
out={'dataSha256':hashlib.sha256((ROOT/'data/app.json').read_bytes()).hexdigest(),'files':{n:cache[n]['sha256'] for n in texts},'records':result,'counts':{'total':len(result),'standardMatched':sum(x['standardVerified'] for x in result.values()),'levelsMatched':sum(x['levelsVerified'] for x in result.values())}}
(ROOT/'data/sources.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':')),'utf-8')
print(json.dumps(out['counts']))
