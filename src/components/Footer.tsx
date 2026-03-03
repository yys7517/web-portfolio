import { useDispatch, useSelector } from "react-redux";
import styles from "./Footer.module.css";
import type { RootState } from "../store/store";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  const isLoggedin = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userEmail = useSelector((state: RootState) => state.auth.email);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    // 로그인 상태가 아니라면 로그인 페이지로 이동
    if (!isLoggedin) {
      navigate("/login");
      return;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    window.alert("로그아웃 되었습니다.");
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          © {year}{" "}
          <span onClick={handleLogin} className={styles.loginButton}>
            YOON YOUNG SUN
          </span>
          . All rights reserved.
        </p>

        {isLoggedin && (
          <p onClick={handleLogout} className={styles.admin}>
            {userEmail ?? ""} (로그인 됨)
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
