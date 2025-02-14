import React from "react";
import { Link, useLocation } from "react-router-dom"; // Usando react-router-dom para navegación
import styles from "./Tabs.module.css";

function Tabs({ links }) {
  const location = useLocation();

  return (
    <div className={styles.tabsContainer}>
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.path}
          className={`${styles.tab} ${
            location.pathname === link.path ? styles.activeTab : ""
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export default Tabs;
