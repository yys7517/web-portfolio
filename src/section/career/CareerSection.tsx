import styles from "./CareerSection.module.css";

type WorkItem = {
  title: string;
  period: string;
  descriptions: string[];
};

type Company = {
  name: string;
  period: string;
  summary: string;
  roles: string[];
  logoImage: string;
  logoAlt: string;
  works: WorkItem[];
};

const companies: Company[] = [
  {
    name: "(주) 다큐브",
    period: "2024.05 - 2024.12 (7개월)",
    summary:
      "AI 음성인식 솔루션을 통해, 기업 별 맞춤화 답변을 제공하는 서비스 플랫폼",
    roles: ["Android 개발"],
    logoImage:
      "https://imgs.jobkorea.co.kr/img1/_whitebg/200X80/Co_Logo/Logo/2022/1/03/JK_CO_Uyj4u7E22010315403779.png?v=202603012034",
    logoAlt: "다큐브 로고",
    works: [
      {
        title: "웹케시 'AI CFO'앱 기능 고도화 및 운영관리",
        period: "2024.06 - 2024.12",
        descriptions: [
          "기획, 디자인 안에 변경에 따른 앱 유지보수",
          "프로젝트 참여 6개월 간, 제품 고도화 과정에서 Play store 배포, 업데이트 경험, Play Store 제품 릴리즈 10회 이상",
          "Firebase Crashlytics를 적용, 오류 추적 및 대응, 매일 1회 이상, 오류를 모니터링하여 사용자 오류를 재연 및 수정 후 재배포",
          "FCM을 통해 앱 Push 알림을 적용, 브리핑 알림, 거액 이체 알림 신규 기능을 구현, 서비스 접근성 2배 이상 향상",
          "WebView와 Native간 연동을 위해 Bridge 연결",
          "productFlavors를 통해 여러 방식의 Build Type을 추가, 관리",
        ],
      },
      {
        title: "IBK 기업은행 'AI 영업비서' 주변 기업찾기 기능 도입 및 운영관리",
        period: "2024.10 - 2024.11",
        descriptions: [
          "네이버 지도 SDK를 적용하여, 많은 마커 정보에 클러스터링 기능 적용, 지도 로딩 성능 3배 이상 개선 (3~40초 -> 10초)",
          "위치 정보(위도, 경도) 값이 동일한 마커 정보가 여러 개일 경우, 하나의 마커로 보이도록 표시",
        ],
      },
      {
        title: "키움증권 '영웅문' 앱 음성 검색 기능 도입 및 운영관리",
        period: "2024.09 - 2024.10",
        descriptions: [
          "키움증권 영웅문 앱 메뉴 데이터 랜덤하게 노출 안되던 부분 수정",
          "Lifecycle에 따른 음성엔진 초기화 및 해제 코드 수정",
          "네트워크 지연으로 인한 오류 발견 및 Timeout 값 수정",
        ],
      },
      {
        title: "사내 음성학습 및 테스트 앱 도입 및 운영관리",
        period: "2024.06 - 2024.08",
        descriptions: [
          "사내 음성학습 및 테스트 앱 도입 및 운영관리",
          "음성엔진 SDK를 적용하여 각 NLP 서버마다 인식된 음성에 대한 API응답 결과를 확인할 수 있는 사내 테스트 앱 구현",
        ],
      },
    ],
  },
  {
    name: "(주) 웅진씽크빅",
    period: "2023.02 - 2023.07 (6개월)",
    summary:
      "아이들의 학습을 위해 다양한 교육 콘텐츠를 제공하는 웅진 북클럽 플랫폼 개발",
    roles: ["Android 개발"],
    logoImage:
      "https://imgs.jobkorea.co.kr/img1/_whitebg/200X80/Co_Logo/Logo/2012/3/2a7vw00aRg_jKdzjkhtr3c2mg0gwYgIp_ikvc2wg.gif?v=202603012035&hash=r&serviceCode=CL",
    logoAlt: "웅진씽크빅 로고",
    works: [
      {
        title: "사용자 스토리지 자동 최적화 기능 개선 및 고도화",
        period: "2023.06 - 2023.07",
        descriptions: [
          "컨텐츠의 종류에 따라 분류할 수 있는 카테고리 Filter 기능 구현",
          "'스토리지 매니저'를 모듈화하여 슈퍼앱의 하위 Feature 모듈로 통합",
          "Java로 작성된 '스토리지 매니저'코드를 Kotlin으로 마이그레이션",
          "RxJava를 사용한 함수를 Kotlin + Coroutine으로 변경",
          "로컬 DB 통신, 네트워크 통신과 같은 비즈니스 로직을 Presentation Layer와 분리",
        ],
      },
      {
        title: "사용자 스토리지 자동 최적화 기능 개선 및 고도화",
        period: "2023.02 - 2023.05",
        descriptions: [
          "스토리지 관련 사용자 VoC 해결을 목표로 관련된 업무와 과제를 진행",
          "사용자 메타정보를 담고 있는 DB파일을 31개 분석, 컨텐츠의 분포도 및 최근 사용일자를 분석",
          "오래된 컨텐츠와 썸네일 이미지 파일을 자동 최적화 삭제 대상에 포함",
        ],
      },
    ],
  },
];

const CareerSection = () => {
  return (
    <section id="career" className={styles.careerSection}>
      <div className={styles.container}>
        <div className={styles.titleWrap}>
          <h2 className={styles.title}>CAREER</h2>
          <div className={styles.titleLine} />
        </div>

        <div className={styles.companyList}>
          {companies.map((company) => (
            <article key={company.name} className={styles.companyCard}>
              <div className={styles.companyLogo}>
                <div className={styles.logo}>
                  <img src={company.logoImage} alt={company.logoAlt} />
                </div>
              </div>

              <div className={styles.companyDetail}>
                <h4 className={styles.companyName}>{company.name}</h4>
                <div className={styles.period}>{company.period}</div>
                <p className={styles.summary}>{company.summary}</p>

                <div className={styles.roles}>
                  {company.roles.map((role) => (
                    <span key={role} className={styles.role}>
                      {role}
                    </span>
                  ))}
                </div>

                <div className={styles.works}>
                  {company.works.map((work) => (
                    <article key={work.title} className={styles.work}>
                      <h5>{work.title}</h5>
                      <div className={styles.workPeriod}>{work.period}</div>
                      <div className={styles.workLine}>
                        {work.descriptions.map((desc, index) => (
                          <p key={index}>{`- ${desc}`}</p>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerSection;
