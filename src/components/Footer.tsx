import styles from "./Footer.module.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          © {year} YOON YOUNG SUN. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
