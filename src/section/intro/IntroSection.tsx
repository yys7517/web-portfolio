import styles from "./IntroSection.module.css";

const IntroSection = () => {
  return (
    <section id="intro" className={styles.introSection}>
      <div className={styles.intro}>
        <img className={styles.introImg} src="/images/bg_banner.jpeg" alt="" />
        <div className={styles.introduction}>
          <h1>안녕하세요 윤영선입니다.</h1>
          <p>
            사용자 경험을 중심으로 명확한 구조와 안정적인 구현을 지향합니다.
          </p>
        </div>

        <div className={styles.overlay} />
        <div className={styles.lastUpdate}>last update : 26.03.03</div>
      </div>

      <section id="about" className={styles.profileCard}>
        <img
          className={styles.avatar}
          src="/images/profile.jpeg"
          alt="윤영선 프로필"
        />
        <div className={styles.profileInfo}>
          <div className={styles.nameRow}>
            <h2>윤영선</h2>
            <div className={styles.socials}>
              <a
                href="https://github.com/yys7517"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <img
                  className={styles.socialIcon}
                  src="/icons/ic_github.png"
                  alt="GitHub"
                />
              </a>

              <a
                href="https://velog.io/@yys7517"
                target="_blank"
                rel="noreferrer"
                aria-label="Velog"
              >
                <img
                  className={styles.socialIcon}
                  src="/icons/ic_velog.png"
                  alt="Velog"
                />
              </a>

              <a
                href="https://linkedin.com/in/yys7517"
                target="_blank"
                rel="noreferrer"
                aria-label="Linkedin"
              >
                <img
                  className={styles.socialIcon}
                  src="/icons/ic_linkedin.png"
                  alt="Linkedin"
                />
              </a>

              <a
                href="https://young-seon.notion.site/portfolio"
                target="_blank"
                rel="noreferrer"
                aria-label="Notion Portfolio"
              >
                <img
                  className={styles.socialIcon}
                  src="/icons/ic_notion.png"
                  alt="Notion Portfolio"
                />
              </a>
            </div>
          </div>

          <div className={styles.metaGrid}>
            <p>
              <img
                src="/icons/ic_phone.png"
                alt=""
                className={styles.metaIcon}
              />
              010-3224-8732
            </p>
            <p>
              <img
                src="/icons/ic_calendar.png"
                alt=""
                className={styles.metaIcon}
              />
              1997.10.01
            </p>
            <p>
              <img
                src="/icons/ic_mail.png"
                alt=""
                className={styles.metaIcon}
              />
              <a href="mailto:yys7517@naver.com" aria-label="이메일">
                yys7517@naver.com
              </a>
            </p>
            <p>
              <img
                src="/icons/ic_school.png"
                alt=""
                className={styles.metaIcon}
              />
              성결대학교 컴퓨터공학과
            </p>
          </div>
        </div>
      </section>
    </section>
  );
};

export default IntroSection;
