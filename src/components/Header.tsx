import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>윤영선의 포트폴리오</div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <a href="#intro">Home</a>
          </li>
          <li>
            <a href="#skills">Skills</a>
          </li>
          <li>
            <a href="#project">Projects</a>
          </li>
          <li>
            <a href="#career">Careers</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
