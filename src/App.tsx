import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import ProjectDetailPage from "./pages/projectdetail/ProjectDetailPage";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import Login from "./pages/login/Login";

// 공통 껍데기 컴포넌트
function Layout() {
  const location = useLocation(); // 현재 URL 정보를 주는 hook

  useEffect(() => {
    // 홈페이지와 내비게이션 해시 값에서는 동작
    if (location.pathname === "/" && location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // 그 외 라우트 이동(예: /projects/:slug)은 항상 맨 위
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.hash]);

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
          <Route path="/login" element={<Login />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
