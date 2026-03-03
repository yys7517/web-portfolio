import styles from "./SkillSection.module.css";
import langIcon from "/icons/ic_language.png";
import feIcon from "/icons/ic_frontend.png";
import beIcon from "/icons/ic_backend.png";
import mobileIcon from "/icons/ic_mobile.png";
import devopsIcon from "/icons/ic_devops.png";

const skills = [
  {
    category: "Language",
    icon: langIcon,
    items: [ "Kotlin", "Java", "TypeScript", "JavaScript"]
  },
  {
    category: "Frontend",
    icon: feIcon,
    items: ["React","Redux", "React-Query", "React-Hook-Form", "Vite", "CSS Modules"],
  },
  {
    category: "Backend",
    icon: beIcon,
    items: ["Spring (Boot)", "Firebase", "Supabase"],
  },
  {
    category: "Mobile",
    icon: mobileIcon,
    items: ["Android", "iOS", "Jetpack Compose", "Hilt", "Clean Architecture"],
  },
  {
    category: "DevOps",
    icon: devopsIcon,
    items: ["Docker", "AWS(EC2)", "Redis", "Vercel"],
  },
];

const SkillSection = () => {
  return (
    <section id="skills" className={styles.skillSection}>
      <div className={styles.titleWrap}>
          <h2 className={styles.title}>SKILLS</h2>
          <div className={styles.titleLine} />
        </div>

      <div className={styles.card}>
        {skills.map((group) => (
          <div key={group.category} className={styles.row}>
            <div className={styles.category}>
              <img src={group.icon} alt="" className={styles.icon} />
              <span>{group.category}</span>
            </div>

            <ul className={styles.tags}>
              {group.items.map((item) => (
                <li key={item} className={styles.tag} data-skill={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillSection;
