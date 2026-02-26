import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";

// 공통 껍데기 컴포넌트
function Layout() {
  const location = useLocation(); // 현재 URL 정보를 주는 hook

  useEffect(() => {
    if (location.pathname !== "/") return; // 홈 페이지가 아니면 동작 x
    if (!location.hash) return; // 해시 값이 없다면 동작 x

    const id = location.hash.replace("#", ""); // #skills -> skills
    // id: skills인 요소를 찾아 스크롤
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location]); // URL이 변경될 때마다 함수 동작

  return (
    <>
      <Header />
      {/* Outlet: 헤더 아래에 중첩 페이지 구조를 처리 */}
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
