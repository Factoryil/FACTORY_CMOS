export const menuItems = [
  {
    label: "Login",
    icon: "fas fa-sign-in-alt",
    path: "/login",
    public: true, // Se muestra solo cuando NO está autenticado
  },
  {
    label: "Inicio",
    icon: "fas fa-home",
    path: "/",
    requiredPermission: "usuarios:lectura", // Solo se muestra si el usuario tiene este permiso
  },
  {
    label: "Gestión de Contactos",
    icon: "fas fa-address-book",
    requiredPermission: "usuarios:lectura", // Solo se muestra si el usuario tiene este permiso
    submenu: [
      {
        label: "Contactos",
        icon: "fas fa-users",
        path: "/gestion/contactos",
        requiredPermission: "usuarios:lectura",
      },
      {
        label: "Etiquetas",
        icon: "fas fa-tag",
        path: "/gestion/etiquetas",
        requiredPermission: "usuarios:lectura",
      },
    ],
  },
  {
    label: "Gestión de Vehículos",
    icon: "fas fa-car",
    requiredPermission: "usuarios:lectura",
    submenu: [
      {
        label: "Vehículos",
        icon: "fas fa-truck",
        path: "/gestion/vehiculos",
        requiredPermission: "usuarios:lectura",
      },
    ],
  },
  {
    label: "Gestión de Usuarios",
    icon: "fas fa-user-cog",
    requiredPermission: "usuarios:lectura",
    submenu: [
      {
        label: "Usuarios",
        icon: "fas fa-users",
        path: "/gestion/usuarios",
        requiredPermission: "usuarios:lectura",
      },
      {
        label: "Roles",
        icon: "fas fa-users",
        path: "/gestion/roles",
        requiredPermission: "usuarios:lectura",
      },
      {
        label: "Permisos",
        icon: "fas fa-key",
        path: "/gestion/permisos",
        requiredPermission: "usuarios:lectura",
      },
    ],
  },
  {
    label: "Logout",
    icon: "fas fa-sign-out-alt",
    path: "/logout",
    requiredPermission: "usuarios:lectura",
  },
];
