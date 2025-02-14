export const menuItems = [
  {
    label: "Inicio",
    icon: "fas fa-home",
    path: "/",
    requiredPermission: "usuarios:lectura"
  },
  {
    label: "Gestión de Contactos",
    icon: "fas fa-user-cog",
    requiredPermission: "usuarios:lectura",
    submenu: [
      { 
        label: "Contactos", 
        icon: "fas fa-users-cog", 
        path: "/gestion/contactos", 
        requiredPermission: "usuarios:lectura"
      },
      { 
        label: "Etiquetas", 
        icon: "fas fa-users-cog", 
        path: "/gestion/etiquetas",  
        requiredPermission: "usuarios:lectura"
      },
      { 
        label: "Documentos", 
        icon: "fas fa-users-cog", 
        path: "/gestion/contactos/documentos", 
        requiredPermission: "usuarios:lectura"
      }
    ],
  },
  {
    label: "Gestión de Vehículos",
    icon: "fas fa-user-cog",
    requiredPermission: "usuarios:lectura",
    submenu: [
      { 
        label: "Vehículos", 
        icon: "fas fa-users-cog", 
        path: "/gestion/vehiculo", 
        requiredPermission: "usuarios:lectura"
      },
      { 
        label: "Documentos", 
        icon: "fas fa-users-cog", 
        path: "/gestion/vehiculos/documentos", 
        requiredPermission: "usuarios:lectura"
      }
    ],
  },
  {
    label: "Gestión de Usuarios",
    icon: "fas fa-user-cog",
    requiredPermission: "usuarios:lectura",
    submenu: [
      { 
        label: "Usuarios", 
        icon: "fas fa-users-cog", 
        path: "/gestion/usuarios", 
        requiredPermission: "usuarios:lectura"
      },
      { 
        label: "Permisos", 
        icon: "fas fa-users-cog", 
        path: "/gestion/permisos", 
        requiredPermission: "usuarios:lectura"
      }
    ],
  },
  {
    label: "Gestión de Tablas",
    icon: "fas fa-user-cog",
    requiredPermission: "usuarios:lectura",
    submenu: [
      { 
        label: "Tablas", 
        icon: "fas fa-users-cog", 
        path: "/gestion/tablas", 
        requiredPermission: "usuarios:lectura"
      }
    ],
  },
  {
    label: "Logout",
    icon: "fas fa-sign-out-alt",
    path: "/logout",
    requiredPermission: "usuarios:lectura" 
  }  
];
