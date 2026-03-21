import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import {
  categoryFilters,
  type CategoryFilter,
} from "../../type/category";
import styles from "./ProjectSection.module.css";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../type/project";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { projectData } from "./projectData";

const ProjectSection = () => {
  const navigate = useNavigate();
  const sortedProjects = useMemo(() => {
    const parseDurationDate = (duration: string): number => {
      const startText = (duration || "").split("~")[0].trim();

      const normalized = startText
        .replace(/\s/g, "")
        .replace(/[^0-9./-]/g, "")
        .replace(/\./g, "-");

      const [year, month, day] = normalized.split("-").map(Number);

      if (!year) return 0;
      const validMonth = Number.isNaN(month) ? 1 : month;
      const validDay = Number.isNaN(day) ? 1 : day;

      return new Date(year, validMonth - 1, validDay).getTime();
    };

    return [...projectData].sort(
      (a, b) => parseDurationDate(b.duration) - parseDurationDate(a.duration),
    );
  }, []);

  const projects = sortedProjects;
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All"); // 선택된 카테고리

  const isLoggedin = useSelector((state: RootState) => state.auth.isLoggedIn);

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
