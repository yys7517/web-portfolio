import { BrowserRouter, Routes } from "react-router";
import "./App.css";
import Header from "./components/Header";
import IntroSection from "./section/intro/IntroSection";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <IntroSection />
      <Routes></Routes>
    </BrowserRouter>
  );
}

export default App;
