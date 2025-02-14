export const menuItems = [
  {
    label: "Inicio",
    icon: "fas fa-home",
    path: "/",
    requiredPermission: "usuarios:lectura"
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
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Etiquetas",
        icon: "fas fa-tag",
        path: "/gestion/contactos/etiquetas",
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Tipos de Identificación",
        icon: "fas fa-id-card",
        path: "/gestion/contactos/tipos-identificacion",
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Correos",
        icon: "fas fa-envelope",
        path: "/gestion/contactos/correos",
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Teléfonos",
        icon: "fas fa-phone",
        path: "/gestion/contactos/telefonos",
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Documentos",
        icon: "fas fa-file-alt",
        path: "/gestion/contactos/documentos",
        requiredPermission: "usuarios:lectura"
      }
    ]
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
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Documentos",
        icon: "fas fa-file-alt",
        path: "/gestion/vehiculos/documentos",
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Mediciones",
        icon: "fas fa-tachometer-alt",
        path: "/gestion/vehiculos/mediciones",
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Operatividad",
        icon: "fas fa-cogs",
        path: "/gestion/vehiculos/operatividad",
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Inspecciones",
        icon: "fas fa-search",
        path: "/gestion/vehiculos/inspecciones",
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Afectación",
        icon: "fas fa-bolt",
        path: "/gestion/vehiculos/afectacion",
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Marca",
        icon: "fas fa-industry",
        path: "/gestion/vehiculos/marca",
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Línea",
        icon: "fas fa-road",
        path: "/gestion/vehiculos/linea",
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Tipo Vehículos",
        icon: "fas fa-car-side",
        path: "/gestion/vehiculos/tipo",
        requiredPermission: "usuarios:lectura"
      }
    ]
  },
  {
    label: "Gestión de Trabajos",
    icon: "fas fa-tools",
    requiredPermission: "usuarios:lectura",
    submenu: [
      {
        label: "Órdenes de Trabajos",
        icon: "fas fa-clipboard-list",
        path: "/gestion/trabajos/ordenes-trabajo",
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Autorizaciones",
        icon: "fas fa-check-circle",
        path: "/gestion/trabajos/autorizaciones",
        requiredPermission: "usuarios:lectura"
      }
    ]
  },
  {
    label: "Gestión de Conductores",
    icon: "fas fa-id-badge",
    requiredPermission: "usuarios:lectura",
    submenu: [
      {
        label: "Conductores",
        icon: "fas fa-user-check",
        path: "/gestion/conductores",
        requiredPermission: "usuarios:lectura"
      }
    ]
  },
  {
    label: "Gestión de Propietarios",
    icon: "fas fa-user-tie",
    requiredPermission: "usuarios:lectura",
    submenu: [
      {
        label: "Propietarios",
        icon: "fas fa-address-book",
        path: "/gestion/propietarios",
        requiredPermission: "usuarios:lectura"
      }
    ]
  },
  {
    label: "Gestión de Proveedores",
    icon: "fas fa-handshake",
    requiredPermission: "usuarios:lectura",
    submenu: [
      {
        label: "Proveedores",
        icon: "fas fa-truck-loading",
        path: "/gestion/proveedores",
        requiredPermission: "usuarios:lectura"
      }
    ]
  },
  {
    label: "Gestión de Clientes",
    icon: "fas fa-user-friends",
    requiredPermission: "usuarios:lectura",
    submenu: [
      {
        label: "Clientes",
        icon: "fas fa-users",
        path: "/gestion/clientes",
        requiredPermission: "usuarios:lectura"
      }
    ]
  },
  {
    label: "Gestión de FUEC",
    icon: "fas fa-file-signature",
    requiredPermission: "usuarios:lectura",
    submenu: [
      {
        label: "Crear",
        icon: "fas fa-plus-circle",
        path: "/gestion/fuec/crear",
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "FUEC",
        icon: "fas fa-file",
        path: "/gestion/fuec",
        requiredPermission: "usuarios:lectura"
      }
    ]
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
        requiredPermission: "usuarios:lectura"
      },
      {
        label: "Permisos",
        icon: "fas fa-key",
        path: "/gestion/permisos",
        requiredPermission: "usuarios:lectura"
      }
    ]
  },
  {
    label: "Logout",
    icon: "fas fa-sign-out-alt",
    path: "/logout",
    requiredPermission: "usuarios:lectura"
  }
];
