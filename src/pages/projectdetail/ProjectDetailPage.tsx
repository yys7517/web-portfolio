import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ProjectDetailPage.module.css";
import type { Project } from "../../type/project";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { supabase } from "../../api/supabaseClient";
import rehypeRaw from "rehype-raw";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";

const ProjectDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [isDeleting, setIsDeleting] = useState(false); // 삭제 중 상태
  const state = location.state as Project | { project: Project } | null;
  const project = state && "project" in state ? state.project : state;

  // 수정 핸들러
  const handleEdit = () => {
    navigate(`/projects/${project?.slug}/edit`, { state: project });
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!project || isDeleting) return;
    const confirmed = window.confirm("이 프로젝트를 삭제할까요?");
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      // 1. 프로젝트와 연결된 project_skills 레코드 삭제
      const { error: skillsDeleteError } = await supabase
        .from("project_skills")
        .delete()
        .eq("project_id", project.id);

      if (skillsDeleteError) throw skillsDeleteError;

      // 2. 프로젝트 삭제
      const { error: projectDeleteError } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (projectDeleteError) throw projectDeleteError;

      navigate("/#project"); // 삭제 후 목록으로 이동
    } catch (err) {
      console.error(err);
      window.alert("프로젝트 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

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
        <div className={styles.topActions}>
          <button
            className={styles.backButton}
            onClick={() => navigate("/#project")}
          >
            &lt; 목록 보기
          </button>

          {/* // 로그인한 사용자에게만 수정/삭제 버튼을 보여준다. */}
          {isLoggedIn && (
            <div className={styles.adminActions}>
              <button
                type="button"
                className={styles.editButton}
                onClick={handleEdit}
              >
                수정
              </button>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          )}
        </div>

        <section className={styles.titleRow}>
          <h1>{project.title}</h1>
          {project.githubUrl && (
            <div className={styles.titleActions}>
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <img src="/icons/ic_github.svg"></img>
                <span>Github</span>
              </a>
            </div>
          )}
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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={rehypeRaw as any}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                // className에 'language-java' 같은 값이 있는지 확인합니다.
                const match = /language-(\w+)/.exec(className || "");

                return !inline && match ? (
                  // 언어 태그가 있는 코드 블록인 경우 하이라이터 적용
                  <SyntaxHighlighter
                    {...props}
                    style={darcula}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  // 백틱(`) 하나로 감싼 인라인 코드인 경우 기본 스타일 적용
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {project.readmeMd ||
              "프로젝트 상세 설명이 아직 등록되지 않았습니다."}
          </ReactMarkdown>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
