// pages/HomePage.tsx
import IntroSection from "../section/intro/IntroSection";
import SkillSection from "../section/skill/SkillSection";
import ProjectSection from "../section/project/ProjectSection";
import CareerSection from "../section/career/CareerSection";

export default function HomePage() {
  return (
    <>
      <IntroSection />
      <SkillSection />
      <ProjectSection />
      <CareerSection />
    </>
  );
}
