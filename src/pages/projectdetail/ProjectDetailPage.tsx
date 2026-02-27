import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ProjectDetailPage.module.css";
import type { Project } from "../../type/project";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ProjectDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as Project | { project: Project } | null;
  const project = state && "project" in state ? state.project : state;

  if (!project) {
    return (
      <div className={styles.errorContainer}>
        <h1>프로젝트를 찾을 수 없습니다.</h1>
        <button onClick={() => navigate("/#project")}>목록으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div className={styles.projectDetailPage}>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          &larr; Back
        </button>

        <section className={styles.titleRow}>
          <h1>{project.title}</h1>
          <div className={styles.titleActions}>
            <a href={project.demoUrl} target="_blank" rel="noreferrer">
              Live Demo
            </a>
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              <img src="/icons/ic_github.svg"></img>
              <span>Github</span>
            </a>
          </div>
        </section>

        <section className={styles.topSection}>
          <aside className={styles.summaryCard}>
            <div className={styles.summaryGroup}>
              <h3>Role</h3>
              <p>{project.role || "-"}</p>
            </div>
            <div className={styles.summaryGroup}>
              <h3>Duration</h3>
              <p>{project.duration || "-"}</p>
            </div>
            <div className={styles.summaryGroup}>
              <h3>Project Contribution</h3>
              <p>{project.contribution || "-"}</p>
            </div>
            <div className={styles.summaryGroup}>
              <h3>Tech Stack</h3>
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <div className={styles.overviewPanel}>
            <h2>프로젝트 소개</h2>
            <p className={styles.description}>{project.description}</p>

            {project.skillReasons.length > 0 && (
              <div className={styles.reasonGrid}>
                {project.skillReasons.map((item) => (
                  <article
                    key={`${item.skillName}-${item.reason}`}
                    className={styles.reasonCard}
                  >
                    <span className={styles.reasonSkill}>{item.skillName}</span>
                    <p>{item.reason}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={styles.markdownSection}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.readmeMd ||
              "프로젝트 상세 설명이 아직 등록되지 않았습니다."}
          </ReactMarkdown>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
