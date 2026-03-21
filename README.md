# 프로젝트 개요
현대오토에버 모빌리티 SW스쿨 웹/앱 반에서 학습하여 익힌 프론트엔드 기술을 활용하여 나만의 포트폴리오 사이트를 제작하였습니다.

# 프로젝트 주요 기능 및 특징
- Section
   - About me, Skills, Projects, Careers로 섹션으로 모두 컴포넌트로 분리하여 제작하였으며, 세로 스크롤 방식으로 섹션을 구분할 수 있도록 하였습니다.
 
- Supabase
   - Supabase를 통해, 프로젝트 데이터를 관리하고, 관리자 User를 설정하여, 프로젝트 CRUD 기능을 구현하였습니다.
    
- Vercel
   - main 브랜치에 코드를 push하면, 변경사항이 Vercel을 통해 자동으로 배포되게끔 CI/CD를 간단하게 적용해보았습니다.
 
- Markdown
   - 프로젝트 정리 내용을 Markdown으로 정리하여, 상세 페이지 컴포넌트를 줄이도록 하였습니다.

# 프로젝트 패키지 구조
<img width="453" height="727" alt="image" src="https://github.com/user-attachments/assets/ceefa8a5-b9d5-462e-9020-a51822eb3ad1" />

 

# 💻 프로젝트 사용 기술
- React, TypeScript, CSS Module
- React Router, Redux-Tool Kit
- Supabase, Tanstack Query

## 버전 관리 및 배포
- Github
- Vercel

# 🤔 트러블 슈팅
  ### 문제상황: React Router state 기반 상세 페이지에서 데이터가 사라지는 문제
  
프로젝트 카드 클릭 시, supabase 통신을 하면, 네트워크 I/O가 불필요하게 많아질 수 있기 때문에 useNavigate와 useLocation을 사용하여 프로젝트 데이터를 페이지 이동 시, 전달하고자 하였습니다.
그래서 코드 상에서`navigate('/projects/:slug', { state: project })`로 프로젝트 객체를 전달하던 구조라, 직접 URL 접근이나 새로고침 시 location.state가 없어져 상세 페이지가 빈 화면/에러(프로젝트를 찾을 수 없음)로 동작할 수 있었습니다.

  ### 해결
  - 상세 페이지 진입 지점에서 state 존재 여부를 먼저 확인
  - state가 없을 때는 slug 기반으로 supabase DB에서 다시 조회하는 fallback 조회 흐름을 추가
  - 조회 실패 시 사용자에게 명확한 안내 메시지와 목록으로 돌아가기 버튼 제공

# 배포 URL
[YYS's Portfolio](https://youngsun-portfolio.vercel.app/)
