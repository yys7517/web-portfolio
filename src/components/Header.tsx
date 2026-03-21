import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 섹션 이동으로 인해 섹션 URL 변경되면, 메뉴버튼 닫기
  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      setIsMenuOpen(false);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [location.pathname, location.hash]);

  // 데스크톱 영역으로 넘어가면 모바일 메뉴 닫기
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1025px)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsMenuOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () =>
      mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const navItems = [
    { id: "about", label: "About me" },
    { id: "skills", label: "Skills" },
    { id: "project", label: "Projects" },
    { id: "career", label: "Careers" },
  ] as const;

  const moveToSection = (
    e: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault();
    navigateToSection(sectionId);
  };

  const navigateToSection = (sectionId: string) => {
    setIsMenuOpen(false);

    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash: `#${sectionId}` });
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (location.hash !== `#${sectionId}`) {
      navigate({ pathname: "/", hash: `#${sectionId}` }, { replace: true });
    }
  };

  const handleLogoClick = () => {
    navigateToSection("intro");
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerNav}>
        <button
          type="button"
          className={styles.logoButton}
          onClick={handleLogoClick}
        >
          YYS's Portfolio
        </button>
        <nav className={styles.desktopNav}>
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  className={styles.link}
                  to={`/#${item.id}`}
                  onClick={(e) => moveToSection(e, item.id)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className={styles.menuButton}
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
          className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ""}`}
        >
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  className={styles.link}
                  to={`/#${item.id}`}
                  onClick={(e) => moveToSection(e, item.id)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
