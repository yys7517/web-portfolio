import { BrowserRouter, Routes } from "react-router";
import "./App.css";
import Header from "./components/Header";
import IntroSection from "./section/intro/IntroSection";
import SkillSection from "./section/skill/SkillSection";
import ProjectSection from "./section/project/ProjectSection";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <IntroSection />
      <SkillSection />
      <ProjectSection />
      <Routes></Routes>
    </BrowserRouter>
  );
}

export default App;
