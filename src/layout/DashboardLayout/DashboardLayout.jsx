import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "../../styles/global.css";
import styles from "./DashboardLayout.module.css";
import MenuDashboard from "../MenuDashboard/MenuDashboard";

function DashboardLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función para cerrar el menú en pantallas de 867px o menos
  const closeMenu = () => {
    if (window.matchMedia("(max-width: 867px)").matches) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 867) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.dashboard}>
      <nav className={`${styles.sidebar} ${isMenuOpen ? styles.open : ""}`}>
        <MenuDashboard onMenuItemClick={closeMenu} />
      </nav>

      <div className={styles.content}>
        <header className={styles.header_content}>
          <div className={styles.btn_menu_content} onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </div>
          <div className={styles.jbizsign_content}>
            {/* <span>CMOCS</span> */}
          </div>
        </header>
        <div className={styles.main_content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
