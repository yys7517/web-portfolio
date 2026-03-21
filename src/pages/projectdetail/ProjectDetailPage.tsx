import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ProjectSkillRow = {
  skill_reason: string | null;
  skills: { skill_name: string } | null;
};

const toProject = (row: any): Project => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  role: row.role ?? "",
  duration: row.duration ?? "",
  contribution: row.contribution ?? "",
  readmeMd: row.readme_md ?? "",
  description: row.overview ?? "",
  category: row.category_name,
  image: row.img_url ?? "",
  githubUrl: row.github_url ?? "",
  tags: ((row.project_skills as ProjectSkillRow[] | undefined) ?? [])
    .map((item) => item.skills?.skill_name)
    .filter((value): value is string => Boolean(value)),
  skillReasons: ((row.project_skills as ProjectSkillRow[] | undefined) ?? [])
    .filter((item) => item.skills?.skill_name && item.skill_reason?.trim())
    .map((item) => ({
      skillName: item.skills?.skill_name ?? "",
      reason: item.skill_reason ?? "",
    })),
});

const fetchProjectBySlug = async (slug: string): Promise<Project> => {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      id,
      slug,
      title,
      role,
      duration,
      contribution,
      readme_md,
      overview,
      category_name,
      img_url,
      github_url,
      project_skills (
        skill_reason,
        skills (
          skill_name
        )
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (error) throw error;
  if (!data) throw new Error("프로젝트를 찾을 수 없습니다.");

  return toProject(data);
};

const ProjectDetailPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const location = useLocation();
  const queryClient = useQueryClient();

  const state = location.state as Project | { project: Project } | null;
  const projectFromState = state && "project" in state ? state.project : state;

  const {
    data: projectBySlug,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project", slug],
    enabled: Boolean(!projectFromState && slug),
    queryFn: () => fetchProjectBySlug(slug as string),
  });

  const project = useMemo(
    () => projectFromState ?? projectBySlug,
    [projectFromState, projectBySlug],
  );

  const deleteProjectMutation = useMutation({
    mutationFn: async () => {
      if (!project) {
        throw new Error("프로젝트가 없습니다.");
      }

      const { error: skillsDeleteError } = await supabase
        .from("project_skills")
        .delete()
        .eq("project_id", project.id);

      if (skillsDeleteError) throw skillsDeleteError;

      const { error: projectDeleteError } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (projectDeleteError) throw projectDeleteError;
    },
    onSuccess: async () => {
      if (slug) {
        await queryClient.invalidateQueries({ queryKey: ["project", slug] });
      }

      navigate("/#project");
    },
    onError: () => {
      window.alert("프로젝트 삭제에 실패했습니다.");
    },
  });

  const handleEdit = () => {
    navigate(`/projects/${project?.slug}/edit`, { state: project });
  };

  const handleDelete = async () => {
    if (!project || deleteProjectMutation.isPending) return;
    const confirmed = window.confirm("이 프로젝트를 삭제할까요?");
    if (!confirmed) return;

    deleteProjectMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className={styles.errorContainer}>
        <h1>프로젝트 정보를 불러오는 중입니다.</h1>
      </div>
    );
  }

  if (!project || isError) {
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
                disabled={deleteProjectMutation.isPending}
              >
                {deleteProjectMutation.isPending ? "삭제 중..." : "삭제"}
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
                const match = /language-(\w+)/.exec(className || "");

                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    style={darcula}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
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
