export const menuItems = [
  {
    label: "Inicio",
    icon: "fas fa-home",
    path: "/",
    requiredPermission: "usuarios:lectura",
  },
  {
    label: "Gestión de Contactos",
    icon: "fas fa-address-book",
    requiredPermission: "usuarios:lectura",
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
      {
        label: "Mediciones",
        icon: "fas fa-tachometer-alt",
        path: "/gestion/vehiculos/mediciones",
        requiredPermission: "usuarios:lectura",
      },
    ],
  },
  {
    label: "Gestión de Mantenimientos",
    icon: "fas fa-cogs", // Cambiado para reflejar mantenimiento
    requiredPermission: "usuarios:lectura",
    submenu: [
      {
        label: "Planes de Mantenimiento",
        icon: "fas fa-calendar-alt",
        path: "/gestion/mantenimientos/planes",
        requiredPermission: "usuarios:lectura",
      },
      {
        label: "Trabajos de Mantenimiento",
        icon: "fas fa-wrench",
        path: "/gestion/mantenimientos/trabajos",
        requiredPermission: "usuarios:lectura",
      },
    ],
  },
  {
    label: "Gestión de Trabajos",
    icon: "fas fa-tasks", // Cambiado para reflejar gestión de tareas/trabajos
    requiredPermission: "usuarios:lectura",
    submenu: [
      {
        label: "Órdenes de Trabajos",
        icon: "fas fa-clipboard-list",
        path: "/gestion/trabajos/ordenes-trabajo",
        requiredPermission: "usuarios:lectura",
      },
      {
        label: "Autorizaciones",
        icon: "fas fa-check-circle",
        path: "/gestion/trabajos/autorizaciones",
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
        icon: "fas fa-user-tag", // Alternativa para roles
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
  {
    label: "Login",
    icon: "fas fa-sign-in-alt",
    path: "/login",
    public: true,
  },
];
