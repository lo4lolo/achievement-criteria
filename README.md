# 2022 개정 교육과정 초등 수업 설계 도우미 · v2.1.0

[기존 주소에서 사용하기](https://lo4lolo.github.io/achievement-criteria/)

611개 성취기준·성취수준을 살펴보고 교사의 생각을 수업 자료로 구체화하는 정적 웹앱입니다. 실행·검색·MD 다운로드에 생성형 AI를 호출하지 않습니다.

## 사용 흐름

1. 교과·학년·검색으로 기준을 고르고 코드와 원문을 복사합니다. 바구니 버튼을 다시 누르면 해제됩니다.
2. 공식 문서·대조 범위에서 PDF와 확인한 위치를 살펴봅니다. 영역 연결은 교사가 변경하거나 보류할 수 있습니다.
3. 수업·평가 계획에서 학습 증거와 피드백을 고르고, 마지막 탐구 설계 탭에서 QFT 단계별로 생각해 볼 질문을 살펴봅니다. ‘SUCCESS 모델로 설계’를 고르면 한 차시는 목적에 맞는 단계만 고르고, 프로젝트는 S·U·CC·E·SS 다섯 단계를 모두 담아 설계합니다. 모든 성취기준에 규칙으로 구성한 SUCCESS 설계 초안이 있고, 검토 예시 5개는 [6과01-03] [6과03-02] [4국01-06] [6수04-03] [2바04-03]입니다.
4. QFT 또는 SUCCESS 설계 MD를 내려받아 교과서 자료와 자신의 결정을 적습니다. AI와 대화할 경우 포함된 요청문을 사용해 고민 확인→선택지 비교→설계→PPT 얼개·학습지 구성으로 발전시킵니다.

## 효율화와 자료 구분

승인한 사례 10개는 개별 데이터로 유지합니다. 나머지는 13개 교과 관점과 7개 수행 규칙을 성취기준의 실제 단어에 연결합니다. 생성 규칙으로 구성한 초안이며, 611개 개별 수업을 사람이 검증한 완성안은 아닙니다. 관계의 정답·학생 질문·모범 답을 자동으로 확정하지 않습니다.

화면, MD, Word(.doc 형식 HTML), 평가 CSV가 같은 설계 객체와 저장된 피드백을 사용합니다. 공식 데이터와 설계 도움은 분리됩니다. 수식 추출 오류 3곳은 별도 복원층과 PDF 근거를 제공합니다. 공식 파일 자체와 data/app.json은 보존합니다. 내용 체계의 자동 연결은 공식 대응표가 아닙니다. 신뢰가 낮은 68개 기준은 기본 보류하며 교사가 선택할 수 있습니다.

교사의 바구니·영역 선택·피드백은 브라우저에 저장됩니다. 기기 간 자동 동기화는 아닙니다. 내려받은 MD·Word·CSV를 공유 폴더로 옮겨 이어서 작업하세요. 기존 사회 대표 사례의 편집·작업 JSON도 유지됩니다.

## 재현 및 다른 컴퓨터에서 작업

- `python src/build.py`: 저장된 자료와 소스에서 index.html 재생성(Python 표준 라이브러리만 필요).
- `python -m http.server 8765 --bind 127.0.0.1`: github 폴더에서 실행 후 http://127.0.0.1:8765/ 열기.
- `npm install`, `npx playwright install chromium`, `npm test`: 실행 중인 앱을 검증. 기본 브라우저는 Playwright Chromium입니다. 설치된 Chrome을 쓰려면 CHROME_CHANNEL=chrome 환경변수를 지정합니다. APP_URL로 테스트 주소를 지정할 수 있습니다.
- 공식 PDF 변경 시 `python -m pip install -r scripts/requirements.txt`, `python scripts/source_index.py` 후 다시 빌드. sources/text-cache.json은 해시별 추출 캐시이며 Git에서 제외합니다.
- 공개 배포는 현재 achievement-criteria 브랜치와 GitHub Pages 주소를 유지합니다. 변경 후 빌드·검증하고 커밋·푸시합니다.

## 주요 파일

| 파일 | 역할 |
| --- | --- |
| src/release.js | v2 공통 조합·화면·내보내기·영역 연결 |
| src/design-rules.json | 교과 관점·수행 규칙 |
| src/pilot-designs.json | 승인한 기준별 예시 10개 |
| src/review*.js, src/review.css | 승인된 UI와 QFT 공통 안내 |
| src/success-model.json | SUCCESS 모델 내용(석산초 2026 연구학교 공모 계획서 요약)과 설계 질문 |
| src/success.js, src/success.css | SUCCESS 모델 화면·설계 MD·AI 대화 요청문 |
| src/base-v1.html, src/build.py | 원본 기준본 및 재현 가능한 빌드 |
| data/app.json | 보존한 원문 추출 데이터 |
| data/text-repairs.json | PDF 대조에 따른 수식 복원 3곳 |
| data/sources.json, sources/*.pdf | 공식 출처 색인과 원문 파일 |
| tests/verify.cjs, tests/verification.json | 전 기준 구조·내보내기 및 UI 검증 |
| src/ARCHITECTURE.md, CHANGELOG.md | 효율화 설계와 변경 기록 |

QFT는 [Right Question Institute](https://rightquestion.org/what-is-the-qft/)를 참고했습니다. 화면·MD에 출처를 표시하며 공식 한국어 번역본을 뜻하지 않습니다. 교육과정 원문은 공식 PDF에서 확인하고, 구성한 설계 도움은 수업에 맞게 검토·수정하세요.
