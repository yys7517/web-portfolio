import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { logout } from "../store/authSlice";
import { supabase } from "../api/supabaseClient";

const Header = () => {
  const isLoggedin = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 섹션 이동으로 인해 섹션 URL 변경되면, 메뉴버튼 닫기
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  // 화면 사이즈가 1024px 이상으로 커지면 메뉴버튼 대신, 헤더 내비게이션으로 대체
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false); // 열려있던 메뉴 버튼 닫기
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    supabase.auth.signOut();
    dispatch(logout());
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerNav}>
        <div className={styles.logo}>Portfolio</div>

        <button
          type="button"
          className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonOpen : ""}`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMenuOpen}
          aria-controls="global-nav"
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="global-nav"
          className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}
        >
          <ul>
            <li>
              <Link
                className={styles.link}
                to={{ pathname: "/", hash: "#intro" }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className={styles.link}
                to={{ pathname: "/", hash: "#skills" }}
              >
                Skills
              </Link>
            </li>
            <li>
              <Link
                className={styles.link}
                to={{ pathname: "/", hash: "#project" }}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                className={styles.link}
                to={{ pathname: "/", hash: "#career" }}
              >
                Careers
              </Link>
            </li>

            <li>
              {isLoggedin ? (
                <button
                  type="button"
                  className={`${styles.link} ${styles.linkButton}`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <Link className={styles.link} to={{ pathname: "/login" }}>
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
