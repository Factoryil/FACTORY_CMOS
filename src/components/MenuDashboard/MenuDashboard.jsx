import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./menucss.css";
import { menuItems } from "../../data/menuItems";
import { apiManager } from "../../api/apiManager";
import { datosToken } from "../../utils/authUtils";

const MenuDashboard = () => {
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

  // Obtiene y filtra el menú según los permisos del usuario, refrescando periódicamente
  useEffect(() => {
    const token = datosToken();
    if (!token || !token.usuario || !token.usuario.ID_USUARIO) {
      // console.error("Token inválido o faltan datos de usuario:", token);
      setFilteredMenuItems(menuItems); // Fallback: mostrar todo
      setLoading(false);
      return;
    }

    const fetchPermissions = async () => {
      try {
        const permisos = await apiManager.getUserPermissions(token.usuario.ID_USUARIO);
        // console.log("Permisos del usuario:", permisos);
        // Se espera que cada permiso tenga propiedades MODULO y TIPO
        const permisosSet = new Set(permisos.map(p => `${p.MODULO}:${p.TIPO}`));
        // console.log("Set de permisos:", permisosSet);

        const filtered = menuItems
          .map(item => {
            // Si el ítem no requiere permiso o se tiene el permiso, se mantiene
            if (!item.requiredPermission || permisosSet.has(item.requiredPermission)) {
              if (item.submenu) {
                const filteredSubmenu = item.submenu.filter(subItem =>
                  !subItem.requiredPermission || permisosSet.has(subItem.requiredPermission)
                );
                // Solo se muestra el ítem si tiene al menos un subítem permitido
                return filteredSubmenu.length > 0 ? { ...item, submenu: filteredSubmenu } : null;
              }
              return item;
            }
            return null;
          })
          .filter(Boolean);

        // console.log("Menú filtrado:", filtered);
        setFilteredMenuItems(filtered);
      } catch (error) {
        // console.error("Error al obtener permisos del usuario:", error);
        setFilteredMenuItems(menuItems); // Fallback en caso de error
      } finally {
        setLoading(false);
      }
    };

    // Ejecutar la función inmediatamente
    fetchPermissions();

    // Establecer un intervalo para refrescar los permisos cada 30 segundos
    const intervalId = setInterval(fetchPermissions, 30000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [datosToken().usuario.ID_USUARIO]);

  const handleLinkClick = (menuIndex, subIndex = null) => {
    const linkIdentifier = subIndex !== null ? `${menuIndex}-${subIndex}` : `${menuIndex}`;
    setActiveLink(linkIdentifier);
    setOpenSubmenu(subIndex === null ? null : menuIndex);
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
          { !item.submenu?.length ? (
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
