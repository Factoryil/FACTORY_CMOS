import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import "./menucss.css";
import { menuItems } from "../../data/menuItems";
import { apiManager } from "../../api/apiManager";
import { datosToken } from "../../utils/authUtils";

const MenuDashboard = ({ onMenuItemClick }) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Actualiza el enlace activo según la ruta actual
  useEffect(() => {
    const currentPath = location.pathname;
    let matched = false;
    menuItems.forEach((item, menuIndex) => {
      if (item.path === currentPath) {
        setActiveLink(`${menuIndex}`);
        matched = true;
      }
      if (item.submenu) {
        item.submenu.forEach((subItem, subIndex) => {
          if (subItem.path === currentPath) {
            setActiveLink(`${menuIndex}-${subIndex}`);
            matched = true;
          }
        });
      }
    });
    if (!matched) setActiveLink(null);
  }, [location]);

  // Extrae el token y el ID del usuario de forma segura
  const token = datosToken();
  const userId = token?.usuario?.ID_USUARIO;

  // Función que decide si un ítem debe mostrarse según sus propiedades y los permisos del usuario
  const canShowItem = (item, permisosSet) => {
    // Si el ítem se marca como "public" o "publicOnly", se muestra solo si NO está autenticado
    if (item.public || item.publicOnly) {
      return !userId;
    }
    if (item.requiredPermission) {
      // Si se requiere permiso, se muestra solo si el usuario está autenticado y tiene el permiso
      if (!userId) return false;
      return permisosSet.has(item.requiredPermission);
    }
    // Si no tiene propiedades de control, se muestra siempre
    return true;
  };

  // Función recursiva para filtrar los ítems (y subítems) del menú
  const filterItems = (items, permisosSet) => {
    return items
      .map(item => {
        if (!canShowItem(item, permisosSet)) return null;
        const newItem = { ...item };
        if (item.submenu) {
          newItem.submenu = filterItems(item.submenu, permisosSet);
          // Si el submenú queda vacío, descartamos el item completo
          if (newItem.submenu.length === 0) return null;
        }
        return newItem;
      })
      .filter(Boolean);
  };

  // Función para obtener y filtrar los permisos (usamos useCallback para estabilidad)
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

  // Ejecuta la actualización de permisos al montar y cada 30 segundos
  useEffect(() => {
    fetchPermissions();
    const intervalId = setInterval(fetchPermissions, 30000);
    return () => clearInterval(intervalId);
  }, [fetchPermissions]);

  // Escucha un evento personalizado para actualizar inmediatamente los permisos
  useEffect(() => {
    const handlePermissionsChanged = () => {
      fetchPermissions();
    };
    window.addEventListener("permissionsChanged", handlePermissionsChanged);
    return () => {
      window.removeEventListener("permissionsChanged", handlePermissionsChanged);
    };
  }, [fetchPermissions]);

  // Maneja el clic en un ítem del menú o submenú
  const handleLinkClick = (menuIndex, subIndex = null) => {
    const linkIdentifier =
      subIndex !== null ? `${menuIndex}-${subIndex}` : `${menuIndex}`;
    setActiveLink(linkIdentifier);
    setOpenSubmenu(subIndex === null ? null : menuIndex);

    // Usa matchMedia para detectar pantallas de 867px o menos y cierra el menú
    if (
      window.matchMedia("(max-width: 867px)").matches &&
      typeof onMenuItemClick === "function"
    ) {
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
    <ul className="menudashboard sidebar-menu">
      {filteredMenuItems.map((item, menuIndex) => (
        <li key={menuIndex} className={`has-submenu ${openSubmenu === menuIndex ? "open" : ""}`}>
          {!item.submenu?.length ? (
            <Link
              to={item.path}
              className={`item ${activeLink === `${menuIndex}` ? "active" : ""}`}
              onClick={() => handleLinkClick(menuIndex)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ) : (
            <>
              <button
                className={`item ${openSubmenu === menuIndex ? "open" : ""}`}
                onClick={() => handleSubmenuToggle(menuIndex)}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
                <i className="fas fa-chevron-down submenu-icon"></i>
              </button>
              <ul className="submenu">
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      to={subItem.path}
                      className={`item ${activeLink === `${menuIndex}-${subIndex}` ? "active" : ""}`}
                      onClick={() => handleLinkClick(menuIndex, subIndex)}
                    >
                      <i className={subItem.icon}></i>
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
