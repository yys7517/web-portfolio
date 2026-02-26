import { useEffect, useState } from "react";
import type { Category } from "../../type/category";
import styles from "./ProjectSection.module.css";

type Project = {
  id: number;
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

const projects: Project[] = [
  {
    id: 1,
    title: "My First Project",
    description: "This is a sample project description.",
    category: "Frontend" as Category,
    tags: ["React", "TypeScript"],
    image: "/images/project-1.png",
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/your-id/repo1",
  },
  {
    id: 2,
    title: "Mobile App",
    description: "Android/iOS 앱 프로젝트",
    category: "Mobile" as Category,
    tags: ["React Native", "Firebase"],
    image: "/images/project-2.png",
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/your-id/repo2",
  },
];

const ProjectSection = () => {
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
          <div key={project.id} className={styles.projectCard}>
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
                  Demo
                </a>
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectSection;
