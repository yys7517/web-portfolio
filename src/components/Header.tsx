import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { logout } from "../store/authSlice";
import { supabase } from "../api/supabaseClient";

const Header = () => {
  const isLoggedin = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    supabase.auth.signOut();
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Portfolio</div>
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
    </header>
  );
};

export default Header;
