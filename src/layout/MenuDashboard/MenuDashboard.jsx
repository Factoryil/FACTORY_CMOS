import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./menucss.module.css";
import { menuItems } from "../../data/menuItems";
import { apiManager } from "../../api/apiManager";
import { datosToken } from "../../utils/authUtils";

const MenuDashboard = ({ onMenuItemClick }) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función auxiliar para determinar si un path es activo dado el path actual.
  // Para "/" se exige igualdad exacta; para el resto, se considera activo si es igual o si currentPath inicia con itemPath + "/"
  const isActive = (itemPath, currentPath) => {
    if (itemPath === "/") {
      return currentPath === "/";
    } else {
      return currentPath === itemPath || currentPath.startsWith(itemPath + "/");
    }
  };

  // Actualiza el enlace activo basándose en el arreglo filtrado
  useEffect(() => {
    const currentPath = location.pathname;
    let bestMatch = null;
    let bestMatchLength = 0;
    // Recorremos los items filtrados (los que se muestran realmente)
    filteredMenuItems.forEach((item, fIndex) => {
      if (item.path && isActive(item.path, currentPath)) {
        if (item.path.length > bestMatchLength) {
          bestMatch = `${fIndex}`;
          bestMatchLength = item.path.length;
        }
      }
      if (item.submenu) {
        item.submenu.forEach((subItem, subIndex) => {
          if (subItem.path && isActive(subItem.path, currentPath)) {
            if (subItem.path.length > bestMatchLength) {
              bestMatch = `${fIndex}-${subIndex}`;
              bestMatchLength = subItem.path.length;
              setOpenSubmenu(fIndex); // Abrir el submenú correspondiente
            }
          }
        });
      }
    });
    setActiveLink(bestMatch);
  }, [location, filteredMenuItems]);

  // Extrae el token y el ID del usuario de forma segura
  const token = datosToken();
  const userId = token?.usuario?.ID_USUARIO;

  // Decide si un item debe mostrarse según sus propiedades y permisos del usuario
  const canShowItem = (item, permisosSet) => {
    if (item.public || item.publicOnly) {
      return !userId;
    }
    if (item.requiredPermission) {
      if (!userId) return false;
      return permisosSet.has(item.requiredPermission);
    }
    return true;
  };

  // Función recursiva para filtrar los items (y subitems) del menú
  const filterItems = (items, permisosSet) => {
    return items
      .map(item => {
        if (!canShowItem(item, permisosSet)) return null;
        const newItem = { ...item };
        if (item.submenu) {
          newItem.submenu = filterItems(item.submenu, permisosSet);
          if (newItem.submenu.length === 0) return null;
        }
        return newItem;
      })
      .filter(Boolean);
  };

  // Obtiene y filtra los permisos (usamos useCallback para estabilidad)
  const fetchPermissions = useCallback(async () => {
    let permisosSet = new Set();
    if (userId) {
      try {
        const permisos = await apiManager.getUserPermissions(userId);
        permisosSet = new Set(permisos.map(p => `${p.MODULO}:${p.TIPO}`));
      } catch (error) {
        // Si ocurre un error, dejamos permisosSet vacío
      }
    }
    const filtered = filterItems(menuItems, permisosSet);
    setFilteredMenuItems(filtered);
    setLoading(false);
  }, [userId]);

  // Actualiza permisos al montar y cada 30 segundos
  useEffect(() => {
    fetchPermissions();
    const intervalId = setInterval(fetchPermissions, 30000);
    return () => clearInterval(intervalId);
  }, [fetchPermissions]);

  // Escucha un evento personalizado para actualizar permisos inmediatamente
  useEffect(() => {
    const handlePermissionsChanged = () => {
      fetchPermissions();
    };
    window.addEventListener("permissionsChanged", handlePermissionsChanged);
    return () => {
      window.removeEventListener("permissionsChanged", handlePermissionsChanged);
    };
  }, [fetchPermissions]);

  // Maneja el clic en un item o subitem del menú
  const handleLinkClick = (menuIndex, subIndex = null) => {
    const linkIdentifier = subIndex !== null ? `${menuIndex}-${subIndex}` : `${menuIndex}`;
    setActiveLink(linkIdentifier);
    setOpenSubmenu(subIndex === null ? null : menuIndex);

    // Cierra el menú si se está en pantalla pequeña
    if (window.matchMedia("(max-width: 867px)").matches && typeof onMenuItemClick === "function") {
      onMenuItemClick();
    }
  };

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu(prevIndex => (prevIndex === index ? null : index));
  };

  if (loading) {
    return <div>Cargando menú...</div>;
  }

  if (filteredMenuItems.length === 0) {
    return <div>No hay elementos de menú para mostrar.</div>;
  }

  return (
    <ul className={`${styles.menudashboard} ${styles.sidebarMenu}`}>
      {filteredMenuItems.map((item, menuIndex) => (
        <li key={menuIndex} className={`${styles.hasSubmenu} ${openSubmenu === menuIndex ? styles.open : ""}`}>
          {!item.submenu?.length ? (
            <Link
              to={item.path}
              className={`${styles.item} ${activeLink === `${menuIndex}` ? styles.active : ""}`}
              onClick={() => handleLinkClick(menuIndex)}
            >
              <i className={`${item.icon} ${styles.itemIcon}`}></i>
              <span>{item.label}</span>
            </Link>
          ) : (
            <>
              <button
                className={`${styles.item} ${openSubmenu === menuIndex ? styles.open : ""} ${
                  activeLink && activeLink.startsWith(`${menuIndex}-`) && openSubmenu !== menuIndex
                    ? styles.active
                    : ""
                }`}
                onClick={() => handleSubmenuToggle(menuIndex)}
              >
                <i className={`${item.icon} ${styles.itemIcon}`}></i>
                <span>{item.label}</span>
                <i className={`fas fa-chevron-down ${styles.submenuIcon} ${
                  openSubmenu === menuIndex ? styles.submenuIconOpen : ""
                }`}></i>
              </button>
              <ul className={`${styles.submenu} ${openSubmenu === menuIndex ? styles.submenuOpen : ""}`}>
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      to={subItem.path}
                      className={`${styles.item} ${activeLink === `${menuIndex}-${subIndex}` ? styles.active : ""}`}
                      onClick={() => handleLinkClick(menuIndex, subIndex)}
                    >
                      <i className={`${subItem.icon} ${styles.itemIcon}`}></i>
                      {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MenuDashboard;
