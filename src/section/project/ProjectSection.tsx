import { useEffect, useState } from "react";
import type { Category } from "../../type/category";
import styles from "./ProjectSection.module.css";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";

type ProjectCard = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  image: string;
  demoUrl: string;
  githubUrl: string;
};

const categories: Category[] = [
  "All",
  "Fullstack",
  "Frontend",
  "Backend",
  "Mobile",
  "DevOps",
];

const { data, error } = await supabase.from("projects").select(`
  id,
  slug,
  title,
  overview,
  category_name,
  img_url,
  demo_url,
  github_url,
  project_skills (
    skills (
      skill_name
    )
  )
`);
// FK에 연결된 project_id 값을 통해 project_skills를 자동으로 조인 + skill_id의 값을 통해
// skills 테이블을 조인, skill_name을 가져옴.

if (error) throw error;

type ProjectSkillRow = {
  row: { skill_name: string } | null;
};

const projects: ProjectCard[] = (data ?? []).map((row: any) => {
  const tags =
    (row.project_skills as ProjectSkillRow[] | undefined)
      ?.map(({ row }) => row?.skill_name)
      .filter((name): name is string => Boolean(name)) ?? [];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.overview,
    category: row.category_name as Category,
    image: row.img_url ?? "",
    demoUrl: row.demo_url ?? "",
    githubUrl: row.github_url ?? "",
    tags,
  };
});

const ProjectSection = () => {
  const navigate = useNavigate();

  // 선택된 카테고리 상태
  const [selectedCategory, setSelectedCategory] = useState<Category>("All"); // 선택된 카테고리

  // 선택된 카테고리에 해당하는 프로젝트로 필터링
  const [filteredProjects, setFilteredProjects] = useState(projects);

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
  }, [selectedCategory]);

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
            onClick={() => navigate(`/projects/${project.slug}`)} // id 대신 project slug값을 통해 이동
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
              <div className={styles.links}>
                <a href={project.demoUrl} target="_blank" rel="noreferrer">
                  <img
                    src="/icons/ic_demo.svg"
                    alt=""
                    className={styles.linkIcon}
                  />
                  <span>Live Demo</span>
                </a>
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
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
