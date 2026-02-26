import { Link } from "react-router";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>윤영선의 포트폴리오</div>
      <nav className={styles.nav}>
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
        </ul>
      </nav>
    </header>
  );
};

export default Header;
