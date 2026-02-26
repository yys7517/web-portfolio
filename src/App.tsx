import { BrowserRouter, Routes } from "react-router";
import "./App.css";
import Header from "./components/Header";
import IntroSection from "./section/intro/IntroSection";
import SkillSection from "./section/skill/SkillSection";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <IntroSection />
      <SkillSection />
      <Routes></Routes>
    </BrowserRouter>
  );
}

export default App;
