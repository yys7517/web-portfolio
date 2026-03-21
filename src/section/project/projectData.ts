import type { Project } from "../../type/project";

export const projectData: Project[] = [
  {
    id: 1,
    slug: "yys-portfolio",
    title: "YYS's Portfolio",
    role: "Frontend Developer",
    duration: "2026.03 ~ 진행중",
    contribution: "100%",
    readmeMd:
      "## 프로젝트 개요\n현대오토에버 모빌리티 SW스쿨 웹/앱 반에서 학습하여 익힌 프론트엔드 기술을 활용하여 나만의 포트폴리오 사이트를 제작하였습니다.<br/>## 프로젝트 주요 기능 및 특징\n\n- Section\n  - About me, Skills, Projects, Careers로 섹션으로 모두 컴포넌트로 분리하여 제작하였으며, 세로 스크롤 방식으로 섹션을 구분할 수 있도록 하였습니다.\n- Supabase\n  - Supabase를 통해, 프로젝트 데이터를 관리하고, 관리자 User를 설정하여, 프로젝트 CRUD 기능을 구현하였습니다.\n- Vercel\n  - main 브랜치에 코드를 push하면, 변경사항이 Vercel을 통해 자동으로 배포되게끔 CI/CD를 간단하게 적용해보았습니다.\n- Markdown\n  - 프로젝트 정리 내용을 Markdown으로 정리하여, 상세 페이지 컴포넌트를 줄이도록 하였습니다.\n\n## 프로젝트 패키지 구조\n\n- Section\n- Supabase\n- React Router / Redux Toolkit\n- Markdown\n\n# 프로젝트 사용 기술\n\n- React, TypeScript, CSS Module\n- React Router, Redux-Tool Kit\n- Supabase, Tanstack Query\n\n### 버전 관리 및 배포\n\n- Github\n- Vercel\n\n# 🤔 트러블 슈팅\n\n### 문제상황: React Router state 기반 상세 페이지에서 데이터가 사라지는 문제\n\n프로젝트 카드 클릭 시, supabase 통신을 하면, 네트워크 I/O가 불필요하게 많아질 수 있기 때문에 useNavigate와 useLocation을 사용하여 프로젝트 데이터를 페이지 이동 시, 전달하고자 하였습니다.\n그래서 코드 상에서 `navigate('/projects/:slug', { state: project })`로 프로젝트 객체를 전달하던 구조라, 직접 URL 접근이나 새로고침 시 location.state가 없어져 상세 페이지가 빈 화면/에러(프로젝트를 찾을 수 없음)로 동작할 수 있었습니다.\n\n### 해결\n- 상세 페이지 진입 지점에서 state 존재 여부를 먼저 확인\n- state가 없을 때는 slug 기반으로 supabase DB에서 다시 조회하는 fallback 조회 흐름을 추가\n- 조회 실패 시 사용자에게 명확한 안내 메시지와 목록으로 돌아가기 버튼 제공\n\n## 배포 URL\n\n[YYS's Portfolio](https://youngsun-portfolio.vercel.app/)",
    description: "나만의 포트폴리오 사이트",
    category: "Frontend",
    tags: [
      "React",
      "TypeScript",
      "CSS Module",
      "React Router",
      "Redux Toolkit",
      "Supabase",
      "Tanstack Query",
      "Markdown",
      "Vercel",
      "Github",
      "CI/CD",
    ],
    image: "/images/my-portfolio.png",
    githubUrl: "",
    skillReasons: [
      {
        skillName: "React",
        reason: "섹션을 컴포넌트로 분리해 재사용성과 유지보수성을 높였습니다.",
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
    ],
  },
  {
    id: 2,
    slug: "task-manager-api",
    title: "Task Manager API",
    role: "Backend Developer",
    duration: "2025.09 ~ 2025.12",
    contribution: "70%",
    readmeMd:
      "## Task Manager API\n\nNode.js + Express 기반의 API 서버입니다.\n\n### 핵심 기능\n- JWT 인증\n- 작업 CRUD\n- 태그 기반 필터링\n- Swagger 문서",
    description: "작업 관리 시스템 API 설계 및 구현",
    category: "Backend",
    tags: ["Node.js", "Express", "PostgreSQL"],
    image: "https://picsum.photos/seed/task-manager-api/600/340",
    githubUrl: "https://github.com/example/task-manager-api",
    skillReasons: [
      {
        skillName: "Node.js",
        reason: "이벤트 기반 서버 구조로 가볍고 빠른 API를 구성했습니다.",
      },
      {
        skillName: "PostgreSQL",
        reason: "정규화된 스키마와 인덱스로 조회 성능을 최적화했습니다.",
      },
    ],
  },
  {
    id: 3,
    slug: "kotlin-mobile-dashboard",
    title: "Mobile Study Dashboard",
    role: "Fullstack Developer",
    duration: "2025.03 ~ 2025.07",
    contribution: "60%",
    readmeMd:
      "## Mobile Study Dashboard\n\n안드로이드 앱에서 학습 진행률을 확인할 수 있는 데시보드 기능을 구현했습니다.",
    description: "학습 기록을 실시간으로 확인할 수 있는 모바일 앱",
    category: "Mobile",
    tags: ["Kotlin", "Android", "Firebase"],
    image: "https://picsum.photos/seed/mobile-dashboard/600/340",
    githubUrl: "",
    skillReasons: [
      {
        skillName: "Kotlin",
        reason:
          "안드로이드 생태계와 잘 맞는 타입 안정성 있는 화면 로직을 구현했습니다.",
      },
      {
        skillName: "Firebase",
        reason: "실시간 데이터 동기화로 사용자 경험을 개선했습니다.",
      },
    ],
  },
];
