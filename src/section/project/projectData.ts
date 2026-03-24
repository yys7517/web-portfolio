import type { Project } from "../../type/project";

export const projectData: Project[] = [
  {
    id: 1,
    slug: "yys-portfolio",
    title: "포트폴리오 웹사이트 제작",
    role: "Frontend Developer",
    duration: "2026.02.24 ~ 2026.03.03",
    contribution: "100% (개인 프로젝트)",
    readmeMd: `## 프로젝트 개요
현대오토에버 모빌리티 SW스쿨 웹/앱 반에서 학습하여 익힌 프론트엔드 기술을 활용하여 나만의 포트폴리오 사이트를 제작하였습니다.

## 프로젝트 주요 기능 및 특징

- Section
  - About me, Skills, Projects, Careers로 섹션으로 모두 컴포넌트로 분리하여 제작하였으며, 세로 스크롤 방식으로 섹션을 구분할 수 있도록 하였습니다.
- Supabase
  - Supabase를 통해, 프로젝트 데이터를 관리하고, 관리자 User를 설정하여, 프로젝트 CRUD 기능을 구현하였습니다.
- Vercel
  - main 브랜치에 코드를 push하면, 변경사항이 Vercel을 통해 자동으로 배포되게끔 CI/CD를 간단하게 적용해보았습니다.
- Markdown
  - 프로젝트 정리 내용을 Markdown으로 정리하여, 상세 페이지 컴포넌트를 줄이도록 하였습니다.

## 프로젝트 패키지 구조

![프로젝트 패키지 구조](https://github.com/user-attachments/assets/ceefa8a5-b9d5-462e-9020-a51822eb3ad1)

# 프로젝트 사용 기술

- React, TypeScript, CSS Module
- React Router, Redux-Tool Kit
- Supabase, Tanstack Query

### 버전 관리 및 배포

- Github
- Vercel

# 🤔 트러블 슈팅

### 문제상황: React Router state 기반 상세 페이지에서 데이터가 사라지는 문제

프로젝트 카드 클릭 시, supabase 통신을 하면, 네트워크 I/O가 불필요하게 많아질 수 있기 때문에 useNavigate와 useLocation를 사용하여 프로젝트 데이터를 페이지 이동 시, 전달하고자 하였습니다.
그래서 코드 상에서 \`navigate('/projects/:slug', { state: project })\`로 프로젝트 객체를 전달하던 구조라, 직접 URL 접근이나 새로고침 시 location.state가 없어져 상세 페이지가 빈 화면/에러(프로젝트를 찾을 수 없음)로 동작할 수 있었습니다.

### 해결

- 상세 페이지 진입 지점에서 state 존재 여부를 먼저 확인
- state가 없을 때는 slug 기반으로 supabase DB에서 다시 조회하는 fallback 조회 흐름을 추가
- 조회 실패 시 사용자에게 명확한 안내 메시지와 목록으로 돌아가기 버튼 제공
`,
    description:
      "현대오토에버 모빌리티 SW스쿨 웹/앱 반에서 학습하여 익힌 프론트엔드 기술을 통해 나만의 웹 포트폴리오 사이트를 제작하였습니다.",
    category: "Frontend",
    tags: [
      "React",
      "TypeScript",
      "CSS Module",
      "React Router",
      "Redux Toolkit",
      "Supabase",
      "Tanstack Query",
      "React-Markdown",
      "React-Hook-Form",
      "Vercel",
      "Github",
    ],
    image: "/images/my-portfolio.png",
    githubUrl: "https://github.com/yys7517/web-portfolio",
    skillReasons: [
      {
        skillName: "React",
        reason:
          "페이지, 컴포넌트로 분리하여 재사용성과 유지보수성을 높였습니다.",
      },
      {
        skillName: "TypeScript",
        reason:
          "컴포넌트 간 데이터 타입을 일관되게 정의해 유지보수 비용을 줄였습니다.",
      },
      {
        skillName: "Supabase",
        reason:
          "관리자 CRUD와 데이터 정합성을 유지하기 위해 관계형 테이블 구조를 적용해 프로젝트 정보를 관리했습니다.",
      },
      {
        skillName: "Redux",
        reason:
          "관리자 로그인 여부를 확인하는 상태를 전역으로 두어 페이지 전반 UI 제어를 단순화했습니다.",
      },
      {
        skillName: "Tanstack React-Query",
        reason:
          "Supabase 통신 시, 비동기 프로젝트 데이터 조회/캐싱 흐름을 정리해 서버 상태를 효율적으로 관리할 수 있도록 했습니다.",
      },
      {
        skillName: "CSS Module",
        reason:
          "컴포넌트 별 CSS 파일을 모듈화하여, 같은 id로 적용되는 css 충돌을 방지했습니다",
      },
    ],
  },
  {
    id: 2,
    slug: "pint",
    title: "PINT (핀트)",
    role: "Backend Developer",
    duration: "2026.03.05 ~ 2026.03.18",
    contribution:
      "50% (인증/인가, 유저 연동 후, 게시글 CRUD API, 게시글 좋아요 CRUD API 연결)",
    readmeMd: `
# 📸 PINT (핀트)
> **"내 취향에 핀트가 딱 맞는 출사지 공유소"**
유저들이 사진의 본질에만 집중할 수 있도록 돕는 **Content-First** 사진 및 필터 정보 공유 플랫폼입니다.

<br />

## 🔍 Overview
**핀트(Pint)**는 사진 촬영 시 피사체를 선명하게 맞추는 초점(Focus)을 의미하는 사진계의 오랜 은어에서 착안했습니다.
우리는 "이 사진 어디서 찍었지?", "어떻게 보정했지?"라는 사용자의 근본적인 궁금증을 해결하고자 합니다.

* **주요 타겟**: 감성이 풍부한 일반인, 사진을 더 니치(Niche)하게 찍고 싶은 아마추어, 영감을 얻고 싶은 사진작가
* **디자인 철학**: 미니멀리즘 컨셉을 바탕으로 모든 유저가 핵심 기능을 한 번에 알아볼 수 있는 UX
* **핵심 기능**: 사진 속 장소 및 필터 정보 공유, XMP 메타데이터 표준을 활용한 카메라 정보 자동 추출, 게시글 좋아요

<br />


## 패키지 구조
<img width="800" height="600" alt="image" src="https://github.com/user-attachments/assets/063983d9-d9be-468e-9875-1e4a6347e031" />

## 🛠 Tech Stack
![Skill Stack](https://github.com/user-attachments/assets/583b12b4-bd98-4f74-b6f7-c63af6ef1e54)

* **Core**: Java Spring Boot
* **Security**: Spring Security (Session & CSRF)
* **Database**: PostgreSQL, Spring Data JPA/Hibernate
* **Caching**: Redis

## Infrastructure & DevOps
* **Storage**: Amazon S3
* **CI/CD, Deployment**: GitHub Actions, Docker, Vercel
* **Proxy** : Nginx
* **Server** : AWS EC2

## Architecture

<img width="1324" height="730" alt="image" src="https://github.com/user-attachments/assets/cf39a426-7765-4409-af04-509dfad664a1" />

<br />

## ✨ 담당 기능 및 개인 개발내용
### 1. 이미지 로딩 성능 최적화 (Redis Caching)
* **문제 상황**: S3 Private 버킷 보안 정책상 매번 Pre-signed URL을 생성해야 하므로 네트워크 I/O 과부하 발생.
* **해결 방법**: 생성된 Pre-signed URL을 Redis에 캐싱(TTL 55분)하여 유효 시간 동안 재사용하도록 구현.
* **결과**: 게시글 목록 조회 성능이 **약 6배 향상**(279ms → 41ms)되었습니다.

### 2. 인증/인가, CSRF 보안 강화 (Session & CSRF)
* **JWT 대신 세션을 선택한 이유**: 모놀리식 구조에서 상태 유지가 용이하며, 별도의 인증 서버가 없이 API 서버에서 Refresh Token 관리 시, 발생하는 Stateless 위배 문제를 방지하기 위함, Spring Security 호환성
* **CSRF 방어**: Spring Security 6의 마스킹된 토큰 해석 문제를 해결하기 위해 \`CsrfTokenRequestAttributeHandler\`를 커스텀 설정하여 SPA 환경에서의 보안을 강화했습니다.

### 3. 무한 스크롤 페이지네이션 (Pageable <-> Slice)
* **핵심 구현**: Pageable 인터페이스를 상속받는 Slice 인터페이스를 활용한 비즈니스 로직 설계
* **최적화**: 전체 데이터 개수 조회를 위한 Count 쿼리 생략 및 불필요한 오버헤드 방지
* **적용이유**: 랜딩 페이지 조회 시, 많은 이미지를 한 번에 로딩하기에는 사용성에 너무 많은 성능 지연이 발생하기 때문에, 페이징을 통해 10개 단위로 불러오도록 적용하였습니다.

### 4. N+1 쿼리 최적화
<img width="688" height="124" alt="image" src="https://github.com/user-attachments/assets/4422becb-7b5c-4f75-ac9a-a22a30ee16b8" />
<br />

**문제 상황**: Post와 User 간의 연관 관계 조회 시, 지연 로딩(Lazy Loading)으로 인한 N+1 쿼리 발생 및 성능 저하
<br />
<br />
**해결**: JPQL JOIN FETCH를 적용하여 단 한 번의 쿼리로 연관 객체까지 일괄 조회

### 5. Vibe Coding 전략 (With. Codex)
![](https://github.com/user-attachments/assets/b554fc74-0d1b-4a56-9312-46f32c04e1be)

\`\`\`
# 에이전트 작업 규칙

## 주제별 문서 관리

- 모든 작업은 \`agent/<주제명>/\` 디렉터리 아래에서 관리한다.
- 각 주제 디렉터리에는 아래 파일을 유지한다.
  - \`research_<주제명>.md\`
  - \`plan_<주제명>.md\`
- 같은 주제 파일이 이미 있으면 새로 만들지 말고 기존 파일을 업데이트한다.

## 예시

- 주제: \`security_config\`
- 파일:
  - \`agent/security_config/research_security_config.md\`
  - \`agent/security_config/plan_security_config.md\`
\`\`\`

**위와 같이 구조화된 에이전트 작업 규칙 (AGENT.md)을 작성하고, 프로젝트를 진행하였습니다.**
- 문서 기반 관리: 모든 작업은 agent/<주제명>/ 하위에 research 및 plan 문서로 명문화하여 관리하였습니다. research 문서는 기존 코드베이스를 분석하여 작성하게끔 하였고, 앞으로 할 작업내용에 대한 plan 문서를 작성하게 하였습니다.
- 지속적 업데이트: 신규 생성보다 기존 문서를 갱신하여 맥락의 연속성을 유지합니다.
- 정확도 향상 및 지연 감소
   - 컨텍스트를 길게 가져가더라도, 문서화를 통해 주제별로 세션을 다양하게 다룰 수 있었습니다.
   - 간결한 프롬프트만으로도 사전에 정의된 research와 plan 문서를 참조하도록 하여, 코드의 정확도를 높였고, 문서화를 통해 Agent으 문맥 파악을 더 쉽게하여, 답변 시간을 단축시킬 수 있었습니다.

<br />

## 배포 URL
[Vercel](https://pint-frontend-three.vercel.app/)

## 발표 자료
[Canva](https://www.canva.com/design/DAHEKSCKbUA/o8SECI8vNXv_zIGzlzHQDw/edit?utm_content=DAHEKSCKbUA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## 시연영상
[Demo](https://drive.google.com/file/d/1XNfFHuV3prxDul5s8yuP_z-fmJ1zi8cw/view)

<br />

## 👥 Contributors (현대오토에버 SW 스쿨 3기 1조)
* [**김준성 (Backend)**](https://github.com/jsktt)
* [**윤영선 (Backend)**](https://github.com/yys7517)
<br />`,
    description:
      "현대오토에버 SW스쿨에서 2차 프로젝트로, 웹/앱 팀 프로젝트를 진행하였습니다. Pint는 사진 및 필터 정보 공유 플랫폼을 백엔드 중심으로 개발한 프로젝트입니다.",
    category: "Backend",
    tags: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "Spring Data JPA",
      "Hibernate",
      "PostgreSQL",
      "Redis",
      "Amazon S3",
      "GitHub Actions",
      "Docker",
      "AWS EC2",
      "Nginx",
    ],
    image: "/images/pint.png",
    githubUrl: "https://github.com/yys7517/Pint-Backend",
    skillReasons: [
      {
        skillName: "Spring Boot",
        reason:
          "Controller-Service-Repository 레이어드 아키텍처를 적용하여 계층 분리를 통해 코드를 분리해 유지보수성을 확보했습니다.",
      },
      {
        skillName: "Spring Security",
        reason:
          "Session 기반 인증과 CSRF 커스텀 토큰 처리로 SPA 환경에서도 안전한 인증/인가 체계를 구성했습니다.",
      },
      {
        skillName: "PostgreSQL / JPA",
        reason:
          "연관관계 조회 최적화 및 영속성 설계를 통해 N+1 문제를 줄이고 데이터 정합성을 안정적으로 유지했습니다.",
      },
      {
        skillName: "Redis",
        reason:
          "Pre-signed URL 캐싱(TTL 55분)을 적용해 반복 생성 비용을 낮추고 이미지 목록 조회 성능을 개선했습니다.",
      },
      {
        skillName: "CI/CD",
        reason:
          "GitHub Actions, Docker, Nginx, AWS EC2 조합으로 배포 자동화 및 운영 환경 구성을 정리해 운영 안정성을 높였습니다.",
      },
    ],
  },
];
