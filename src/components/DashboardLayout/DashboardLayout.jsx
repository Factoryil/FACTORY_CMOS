import { useState } from "react";
import { Outlet } from "react-router-dom"
// import "./layout.css";
import "../../styles/global.css";
import styles from "./DashboardLayout.module.css";
import MenuDashboard from "../MenuDashboard/MenuDashboard";

function DashboardLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

  return (
    <div className={styles.dashboard} >

      <nav className={`${styles.sidebar} ${isMenuOpen ? styles.open : ""}`}>
        <MenuDashboard />
    </nav>


    <div className={styles.content}>
      <header className={styles.header_content}>
        <div className={styles.btn_menu_content} onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </div>
        <div className={styles.jbizsign_content}>
          <span>CMOCS</span>
        </div>
      </header>
      <div className={styles.main_content}>
        <Outlet />
      </div>
    </div>
  </div>
  )
}

export default DashboardLayout