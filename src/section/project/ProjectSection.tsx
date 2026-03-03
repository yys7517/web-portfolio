import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import {
  categoryFilters,
  type Category,
  type CategoryFilter,
} from "../../type/category";
import styles from "./ProjectSection.module.css";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../type/project";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

type ProjectSkillRow = {
  skill_reason: string | null;
  skills: { skill_name: string } | null;
};

const ProjectSection = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All"); // 선택된 카테고리
  const [filteredProjects, setFilteredProjects] = useState(projects); // 선택된 카테고리에 해당하는 프로젝트로 필터링

  const isLoggedin = useSelector((state: RootState) => state.auth.isLoggedIn);

  // 최초 Supabase 프로젝트 init 함수
  useEffect(() => {
    const fetchProjects = async () => {
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
        .order("duration", { ascending: false });

      // FK에 연결된 project_id 값을 통해 project_skills를 자동으로 조인 + skill_id의 값을 통해
      // project_skills, skills 테이블을 조인
      // skill_reason, skill_name을 가져옴.
      if (error) return;

      const mapped: Project[] = (data ?? []).map((row: any) => {
        const projectSkills =
          (row.project_skills as ProjectSkillRow[] | undefined) ?? [];
        const tags = projectSkills
          .map((ps) => ps.skills?.skill_name)
          .filter((name): name is string => Boolean(name));

        /** 이유까지 작성한 기술들만 가져온다. */
        const skillReasons = projectSkills
          .filter((ps) => ps.skills?.skill_name && ps.skill_reason?.trim())
          .map((ps) => ({
            skillName: ps.skills?.skill_name ?? "",
            reason: ps.skill_reason ?? "",
          }))
          .slice(0, 4); // 최대 3개까지만 보여준다.

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

  // 프로젝트 추가 페이지로 이동
  const handleAddProject = () => {
    navigate("/projects/new");
  };

  return (
    <section id="project" className={styles.projectSection}>
      <div className={styles.topHeader}>
        <div className={styles.titleWrap}>
          <h2 className={styles.title}>PROJECTS</h2>
          <div className={styles.titleLine} />
        </div>

        {isLoggedin && (
          <button
            type="button"
            className={styles.addProjectButton}
            onClick={handleAddProject}
          >
            <img
              src="/icons/ic_plus.png"
              alt=""
              className={styles.addButtonIcon}
            />
            <span>프로젝트 추가</span>
          </button>
        )}
      </div>

      <div className={styles.filterRow}>
        {categoryFilters.map((category) => (
          <button
            key={category}
            // .filterButton active 여부 감지
            className={`${styles.filterButton} ${
              selectedCategory === category ? styles.active : ""
            }`}
            onClick={() => setSelectedCategory(category as CategoryFilter)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 프로젝트 목록 */}
      <div
        className={`${styles.projectList} ${
          filteredProjects.length === 0 ? styles.projectListEmpty : ""
        }`}
      >
        {filteredProjects.length === 0 && (
          <p className={styles.projectEmpty}>등록된 프로젝트가 없습니다.</p>
        )}

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

              <div className={styles.viewMore}>View More &rarr;</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProjectSection;
