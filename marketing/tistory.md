# 티스토리 포스트 — AI Workflow Manager

**제목:** [오픈소스] AI 코딩 어시스턴트 일관성 문제 완전 해결 — AI Workflow Manager

**카테고리:** 개발/AI 도구

---

## 서론: AI가 자꾸 규칙을 까먹는다

개발자라면 이런 경험 있으실 겁니다.

Claude나 ChatGPT에게 열심히 프로젝트 규칙을 설명합니다.
- "에러 핸들링은 try/catch로 감싸줘"
- "API 응답은 { data, error } 형태로"
- "보안 취약점 꼭 확인해줘"

처음 몇 번은 완벽합니다. 그런데 세션이 끊기고 새 대화를 시작하면? **처음부터 다시**입니다.

이건 AI가 멍청해서가 아닙니다. Context window가 끝나면 이전 대화가 사라지는 구조적 한계입니다.

그래서 저는 이 문제를 근본적으로 해결하는 도구를 만들었습니다.

---

## AI Workflow Manager란?

**GitHub:** https://github.com/henrynkoh/ai-workflow-manager

Next.js 14 기반의 오픈소스 웹 앱으로, **4가지 외부 시스템**을 통해 AI 코딩 어시스턴트(Claude)가 항상 일관된 고품질 코드를 생성하도록 만들어줍니다.

핵심 아이디어: **규칙을 AI 내부(컨텍스트)가 아니라 외부(파일)에 저장하고 자동 주입**

---

## 상세 설명: 4가지 시스템

### 1️⃣ 매뉴얼 시스템 (자동 규칙 주입)

`manuals/` 폴더에 코딩 규칙을 마크다운으로 저장합니다.

`manuals/toc.md`에 키워드를 매핑해두면, 태스크를 입력할 때 키워드를 자동 감지해서 관련 매뉴얼을 Claude 프롬프트 앞에 주입합니다.

**동작 예시:**
```
입력: "유저 로그인 엔드포인트 추가"
감지 키워드: api, login, auth, endpoint
자동 주입: backend_rules.md + security_rules.md
```

Claude는 이제 백엔드 규칙과 보안 규칙을 "읽고" 코드를 작성합니다.

**기본 제공 매뉴얼 5개:**

```
backend_rules.md  → API 설계, 에러 처리, 상태코드
frontend_rules.md → React, TypeScript, Tailwind 규칙
security_rules.md → JWT, bcrypt, SQL 인젝션 방지
database_rules.md → Prisma, 쿼리 최적화, 마이그레이션
general_rules.md  → 네이밍, 커밋, 코드 스타일
```

### 2️⃣ 메모리 시스템 (영속 컨텍스트)

`memory/` 폴더의 3개 파일을 매 요청마다 시스템 프롬프트에 포함합니다:

```
project-plan.md    → 프로젝트 목표, 기술 스택, 주요 결정사항
context-notes.md   → 세션별 발견사항, 아키텍처 노트
task-checklist.md  → 완료/진행중/대기 태스크 목록
```

브라우저에서 직접 편집 가능하고, `/memory` 페이지에서 풀스크린 에디터로도 편집할 수 있습니다.

### 3️⃣ 품질 게이트 (자동 자기 검사)

모든 Claude 응답 마지막에 7가지 체크리스트를 강제 추가합니다:

```
QUALITY_GATE_RESULTS:
- Manual compliance: PASS
- Error handling: PASS
- Type safety: PASS
- Security: PASS
- Validation: PASS
- Loading/Error states: N/A
- MODIFIED_FILES logged: PASS
```

실패 항목이 있으면 Claude가 직접 수정 후 응답합니다.

### 4️⃣ 단축 명령어 (워크플로우 템플릿)

```
/continue  → 메모리 로드 + 다음 태스크 재개
/plan      → 코딩 전 구조화된 구현 계획
/review    → 작성된 코드 규칙 기준 리뷰
/add-rule  → 새 규칙 매뉴얼에 영구 추가
```

---

## UI 구성

```
[좌측 사이드바]    [중앙 채팅]           [우측 사이드바]
- /continue       - 태스크 입력창        - 매뉴얼 목록
- /plan           - 파일 경로 입력       - 매칭된 매뉴얼 (녹색)
- /review         - 메시지 히스토리      - 클릭시 내용 보기
- /add-rule       - 주입된 매뉴얼 배지
                  - MODIFIED_FILES 표시
- 메모리 패널
  - Plan | Notes
  - Tasks (편집 가능)
```

---

## 설치 및 실행

```bash
# 클론
git clone https://github.com/henrynkoh/ai-workflow-manager.git
cd ai-workflow-manager

# 설치
npm install

# API 키 설정 (.env.local)
ANTHROPIC_API_KEY=sk-ant-여기에_키

# 실행
npm run dev
# → http://localhost:3000
```

---

## CLI 도구

UI 없이 터미널에서도 컨텍스트 주입 테스트 가능:

```bash
node scripts/inject-context.js "prisma 마이그레이션 추가" prisma/schema.prisma
# MATCHED MANUALS: Database Rules, General Rules
```

---

## 커스텀 매뉴얼 추가 방법

1. `manuals/my_rules.md` 파일 생성
2. `manuals/toc.md`에 한 줄 추가:
   ```
   | My Rules | my_rules.md | 키워드1, 키워드2, 키워드3 |
   ```
3. 서버 재시작 불필요 — 즉시 적용

---

## 기술 스택 상세

| 패키지 | 버전 | 용도 |
|--------|------|------|
| next | 16.x | 풀스택 프레임워크 |
| typescript | 5.x | 타입 안전성 |
| tailwindcss | 3.x | 스타일링 |
| @anthropic-ai/sdk | latest | Claude API |
| gray-matter | 4.x | 마크다운 파싱 |
| react-markdown | 9.x | 마크다운 렌더링 |
| @tailwindcss/typography | latest | prose 스타일 |

---

## 마무리

AI 코딩 어시스턴트의 일관성 문제는 AI 성능의 문제가 아니라 **외부 구조의 부재** 문제입니다.

이 4가지 시스템(매뉴얼 + 메모리 + 품질 게이트 + 단축 명령어)만 있으면, 어떤 세션에서도 동일한 코딩 기준을 유지할 수 있습니다.

**완전 무료, MIT 라이선스, 오픈소스**

⭐ GitHub Star 부탁드립니다: https://github.com/henrynkoh/ai-workflow-manager

궁금한 점은 댓글로 남겨주세요!

---

**태그:** AI개발도구, 오픈소스, NextJS, ClaudeAI, TypeScript, 웹개발, 개발생산성, 인공지능, 코딩도구
