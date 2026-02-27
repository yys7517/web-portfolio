import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import type { Category } from "../../type/category";
import styles from "./ProjectSection.module.css";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../type/project";

const categories: Category[] = [
  "All",
  "Fullstack",
  "Frontend",
  "Backend",
  "Mobile",
  "DevOps",
];

type ProjectSkillRow = {
  skill_reason: string | null;
  skills: { skill_name: string } | null;
};

const ProjectSection = async () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All"); // 선택된 카테고리
  const [filteredProjects, setFilteredProjects] = useState(projects); // 선택된 카테고리에 해당하는 프로젝트로 필터링

  // 최초 Supabase 프로젝트 init 함수
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select(`
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
        demo_url,
        github_url,
        project_skills (
          skill_reason,
          skills (
            skill_name
          )
        )
      `);
        // FK에 연결된 project_id 값을 통해 project_skills를 자동으로 조인 + skill_id의 값을 통해
        // project_skills, skills 테이블을 조인
        // skill_reason, skill_name을 가져옴.
      if (error) return;

      const mapped: Project[] = (data ?? []).map((row: any) => {
        const projectSkills = (row.project_skills as ProjectSkillRow[] | undefined) ?? [];
        const tags = projectSkills
          .map((ps) => ps.skills?.skill_name)
          .filter((name): name is string => Boolean(name));

        /** 이유까지 작성한 기술들만 가져온다. */
        const skillReasons = projectSkills
          .filter((ps) => ps.skills?.skill_name && ps.skill_reason?.trim())
          .map((ps) => ({
            skillName: ps.skills?.skill_name ?? "",
            reason: ps.skill_reason ?? "",
          }));

        return {
          id: row.id,
          slug: row.slug,
          title: row.title,
          role: row.role ?? "",
          duration: row.duration ?? "",
          contribution: row.contribution ?? "",
          readmeMd: row.readme_md ?? "",
          description: row.overview ?? "",
          category: row.category_name as Category,
          image: row.img_url ?? "",
          demoUrl: row.demo_url ?? "",
          githubUrl: row.github_url ?? "",
          tags,
          skillReasons,
        };
      });

      setProjects(mapped);
      setFilteredProjects(mapped);
    };

    fetchProjects();
  }, []);
  
  // 카테고리 변경에 따른, 프로젝트 필터링 useEffect 함수
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProjects(projects); // 전체
    } else {
      const filtered = projects.filter(
        (project) => project.category === selectedCategory,
      ); // 필터링
      setFilteredProjects(filtered);
    }
  }, [selectedCategory, projects]);

  // 프로젝트 카드 클릭과, 링크 버튼 클릭을 구분하기 위해
  const handleCardClick = (e: MouseEvent<HTMLElement>, project: Project) => {
    const target = e.target as HTMLElement;
    if (target.closest("a, button")) {
      return;
    }
    navigate(`/projects/${project.slug}`, { state: project }); // 클릭 시, slug로 url 설정, state로 project 데이터 넘김
  };

  return (
    <section id="project" className={styles.projectSection}>
      <h2 className={styles.title}>PROJECTS</h2>

      <div className={styles.filterRow}>
        {categories.map((category) => (
          <button
            key={category}
            // .filterButton active 여부 감지
            className={`${styles.filterButton} ${
              selectedCategory === category ? styles.active : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 프로젝트 목록 */}
      <div className={styles.projectList}>
        {filteredProjects.map((project) => (
          <article
            key={project.id}
            className={styles.projectCard}
            onClick={(e) => handleCardClick(e, project)}
          >
            <img
              src={project.image}
              alt={project.title}
              className={styles.projectImg}
            />
            <div className={styles.projectInfo}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              {/* 스킬 스택 */}
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* 링크 연결 */}
              <div
                className={styles.links}
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src="/icons/ic_demo.svg"
                    alt=""
                    className={styles.linkIcon}
                  />
                  <span>Live Demo</span>
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src="/icons/ic_github.svg"
                    alt=""
                    className={styles.linkIcon}
                  />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProjectSection;
