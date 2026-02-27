import styles from "./IntroSection.module.css";

const IntroSection = () => {
  return (
    <section id="intro" className={styles.introSection}>
      <div className={styles.intro}>
        <img className={styles.introImg} src="/images/bg_banner.jpeg" alt="" />
        <div className={styles.introduction}>
          <h1>안녕하세요. 윤영선입니다.</h1>
          <p>
            항상 사용자 입장에서의 사용성과 편의성을 최우선으로 생각하며
            개발하려고 노력합니다.
          </p>
        </div>
        <div className={styles.overlay} />
      </div>

      <div className={styles.profileCard}>
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
                  src="/icons/ic_github.svg"
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
              yys7517@naver.com
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
      </div>
    </section>
  );
};

export default IntroSection;
