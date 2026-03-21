import { companies } from "./companies";
import styles from "./CareerSection.module.css";

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
