# 네이버 블로그 포스트 — AI Workflow Manager

**제목:** AI 코딩 어시스턴트가 매번 같은 실수를 반복한다면? 이 오픈소스 툴로 해결하세요

**카테고리:** IT/컴퓨터 > 프로그래밍

---

## AI 코딩 어시스턴트, 왜 규칙을 안 지킬까?

Claude, ChatGPT 같은 AI 코딩 어시스턴트를 쓰다 보면 이런 경험 많이 하셨죠?

- "에러 핸들링 꼭 추가해줘" → 다음 세션에 또 빠뜨림
- "보안 규칙 따라줘" → 새 대화 시작하면 리셋
- "파일명 컨벤션은 이렇게 해줘" → 세션 끊기면 망각

이건 AI가 나쁜 게 아닙니다. **문맥 창(context window)** 이 끝나면 모든 지시사항이 사라지기 때문이에요.

해결책은 규칙을 **AI 외부**에 저장하고, 매번 자동으로 주입하는 겁니다.

---

## AI Workflow Manager 소개

저는 이 문제를 해결하기 위해 **AI Workflow Manager**를 만들었습니다.

Next.js 14 + TypeScript + Tailwind + Claude API로 만든 오픈소스 웹 애플리케이션으로, **4가지 외부 시스템**으로 AI를 일관성 있게 만들어줍니다.

### 🔗 GitHub: https://github.com/henrynkoh/ai-workflow-manager

---

## 4가지 핵심 시스템

### 📚 시스템 1: 매뉴얼 (Manuals)

코딩 규칙을 마크다운 파일로 저장하고, **태스크 키워드에 따라 자동 주입**합니다.

예시:
- "유저 로그인 API 추가해줘" 입력
- 시스템이 `api`, `login`, `auth` 키워드 감지
- **Backend Rules + Security Rules** 자동 주입
- Claude가 해당 규칙을 따르는 코드 생성

5가지 기본 매뉴얼 포함:
| 매뉴얼 | 트리거 키워드 |
|--------|------------|
| Backend Rules | api, route, endpoint, server |
| Frontend Rules | react, component, tsx, hook |
| Security Rules | auth, jwt, password, sql |
| Database Rules | prisma, sql, query, migration |
| General Rules | naming, git, commit, style |

### 🧠 시스템 2: 메모리 (Memory)

3개의 마크다운 파일로 프로젝트 컨텍스트 영속 저장:
- **project-plan.md** — 무엇을 만들고 있는지
- **context-notes.md** — 발견사항, 결정사항 기록
- **task-checklist.md** — 완료/진행중/대기 태스크

`/continue` 클릭 → Claude가 3개 파일 전부 읽고 이전 작업 이어서 진행 ✨

### ✅ 시스템 3: 품질 게이트 (Quality Gates)

모든 Claude 응답에 **7가지 자동 체크리스트** 추가:
1. 매뉴얼 규칙 준수 여부
2. 에러 핸들링 여부
3. TypeScript 타입 안전성
4. 보안 취약점 없음
5. 입력값 유효성 검사
6. 로딩/에러 UI 상태 처리
7. MODIFIED_FILES 기록

하나라도 실패하면 Claude가 수정 후 응답합니다.

### ⚡ 시스템 4: 단축 명령어 (Shortcuts)

| 명령어 | 기능 |
|--------|------|
| /continue | 메모리 로드 후 이전 작업 재개 |
| /plan | 코딩 전 구현 계획 수립 |
| /review | 매뉴얼 규칙 기준 코드 리뷰 |
| /add-rule | 새 규칙 영구 추가 |

---

## 실제 사용 예시

**채팅창에 입력:**
```
Add user login endpoint
파일 경로: app/api/auth/route.ts
```

**자동으로 발생하는 일:**
1. `api`, `login`, `auth`, `endpoint` 키워드 감지
2. Backend Rules + Security Rules 자동 주입
3. 프로젝트 메모리 파일 3개 로드
4. 품질 게이트 7가지 추가
5. Claude가 규칙을 따르는 완성도 높은 코드 생성

---

## 설치 방법

```bash
# 1. 클론
git clone https://github.com/henrynkoh/ai-workflow-manager.git
cd ai-workflow-manager

# 2. 의존성 설치
npm install

# 3. API 키 설정
echo "ANTHROPIC_API_KEY=여기에_키_입력" > .env.local

# 4. 개발 서버 시작
npm run dev
```

http://localhost:3000 접속 — 끝!

---

## 기술 스택

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS**
- **@anthropic-ai/sdk** (Claude API)
- **react-markdown**

---

## CLI 도구 (UI 없이 사용 가능)

```bash
node scripts/inject-context.js "리액트 버튼 수정" src/components/Button.tsx
# MATCHED MANUALS: Frontend Rules
```

---

## 마치며

AI 코딩 어시스턴트가 일관성이 없는 건 AI 문제가 아니라 **구조 부재** 문제입니다.

매뉴얼, 메모리, 품질 게이트, 단축 명령어 — 이 4가지 외부 시스템이 있으면 세션이 끊겨도, 새 대화를 시작해도 항상 같은 기준을 유지할 수 있습니다.

**무료 오픈소스 (MIT 라이선스)**

🔗 GitHub: https://github.com/henrynkoh/ai-workflow-manager

별(Star) 주시면 큰 힘이 됩니다! ⭐

---

**태그:** #AI #인공지능 #개발도구 #오픈소스 #NextJS #Claude #코딩 #개발자 #웹개발 #TypeScript #생산성
