import api from "./instance";

export const apiManager = {


  crearFactura: async (item) => {
    try {
      const response = await api.post("/otfactura", item);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  editarFactura: async (id, formData) => {
    try {
      const response = await api.post(`/otfactura-editar/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  obtenerFacturaPorOT: async (id) => {
    try {
      const response = await api.get(`/otfactura/ot/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  editarItemTrabajo: async (id, formData) => {
    try {
      const response = await api.post(`/itemtrabajo-editar/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  eliminarItemTrabajo: async (id) => {
    try {
      const response = await api.delete(`/itemtrabajo/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  obtenerItemTrabajoPorOT: async (ot) => {
    try {
      const response = await api.get(`/itemtrabajo/ot/${ot}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  crearItemTrabajo: async (item) => {
    try {
      const response = await api.post("/itemtrabajo", item);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  crearOtFactura: async (data) => {
    try {
      const response = await api.post("/otfactura", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // =====================================================
  // AUTHENTICACIÓN Y TOKEN
  // =====================================================
  login: async ({ email, password }) => {
    try {
      const formData = new FormData();
      formData.append("CORREO_ELECTRONICO", email);
      formData.append("PASSWORD", password);
      const response = await api.post("/login", formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyToken: async () => {
    try {
      const response = await api.post("/token");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // =====================================================
  // CONSULTAS GET (LISTAR / OBTENER)
  // =====================================================
  ejecucionesMantenimiento: async (placa) => {
    try {
      const response = await api.get(`/mantenimiento-ejecutar/placa/${placa}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  unionDePermisosContactoID: async (id) => {
    try {
      const response = await api.get(`/usuarios-contacto/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  contactos: async () => {
    try {
      const response = await api.get("/contactos");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  obtenerAsignacionesPlan: async (id) => {
    try {
      const response = await api.get(`/union-plan-mantenimiento/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  contactosID: async (id) => {
    try {
      const response = await api.get(`/contactos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  permisos: async () => {
    try {
      const response = await api.get("/permisos");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserPermissions: async (idContacto) => {
    try {
      const response = await api.get(`/permisos-usuarios/${idContacto}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  contactosSinUsuarios: async () => {
    try {
      const response = await api.get("/contactos-sin-usuario");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  etiquetas: async () => {
    try {
      const response = await api.get("/etiquetas");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  roles: async () => {
    try {
      const response = await api.get("/roles");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  planesMantenimiento: async () => {
    try {
      const response = await api.get("/plan-mantenimiento");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  mantenimientos: async () => {
    try {
      const response = await api.get("/mantenimiento");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  vehiculos: async () => {
    try {
      const response = await api.get("/vehiculos");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  usuarios: async () => {
    try {
      const response = await api.get("/usuarios");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Ordenes de Trabajo
  ordenesTrabajoActuales: async () => {
    try {
      const response = await api.get("/ordenes-trabajo");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  ordenesTrabajoHistorico: async () => {
    try {
      const response = await api.get("/ordenes-trabajo");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  ordenTrabajoID: async (id) => {
    try {
      const response = await api.get(`/ordenes-trabajo/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Odómetros
  odometros: async () => {
    try {
      const response = await api.get("/odometro");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  odometroUltimos: async () => {
    try {
      const response = await api.get("/odometro-ultimos");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Documentos y Soportes
  getSoportes: async (ot) => {
    try {
      const response = await api.get(`/soportes-ot/ot/${ot}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  obtenerOdometroPorPlaca: async (ot) => {
    try {
      const response = await api.get(`/odometro-placa/${ot}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDocumentosOTByOT: async (ot) => {
    try {
      const response = await api.get(`/documentos-ot/ot/${ot}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteSoporte: async (id) => {
    try {
      const response = await api.delete(`/soportes-ot/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteDocumentoOT: async (id) => {
    try {
      const response = await api.delete(`/documentos-ot/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Vehículos y sus relaciones
  vehiculoID: async (placa) => {
    try {
      const response = await api.get(`/vehiculos/${placa}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  vehiculoIDFichaTecnica: async (placa) => {
    try {
      const response = await api.get(`/vehiculos-info/${placa}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPropietariosVehiculo: async (placa) => {
    try {
      const response = await api.get(`/union-vehiculo-propietario/vehiculo/${placa}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getClientesVehiculo: async (placa) => {
    try {
      const response = await api.get(`/union-vehiculo-cliente/vehiculo/${placa}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPropietariosID: async (id) => {
    try {
      const response = await api.get(`/union-vehiculo-propietario/propietario/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Etiquetas y relaciones
  contactosEtiquetidoID: async (id) => {
    try {
      const response = await api.get(`/union-etiquetas/etiqueta/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  unionDeEtiquetaContactoID: async (contactoID) => {
    try {
      const response = await api.get(`/union-etiquetas/contacto/${contactoID}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  etiquetaUsuarios: async (id) => {
    try {
      const response = await api.get(`/contactos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // =====================================================
  // MÉTODOS POST (AGREGAR)
  // =====================================================

  addContactos: async (datos) => {
    try {
      const response = await api.post("/contactos", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  asignarMantenimientoPlan: async (datos) => {
    try {
      const response = await api.post("/union-plan-mantenimiento/asignar", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addMantenimiento: async (datos) => {
    try {
      const response = await api.post("/mantenimiento", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addPlanMantenimiento: async (datos) => {
    try {
      const response = await api.post("/plan-mantenimiento", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addOrdenTrabajo: async (datos) => {
    try {
      const response = await api.post("/ordenes-trabajo", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addOdometro: async (datos) => {
    try {
      const response = await api.post("/odometro", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addRol: async (datos) => {
    try {
      const response = await api.post("/roles", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadSoporte: async (datos) => {
    try {
      const response = await api.post("/soportes-ot", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addDocumentoOT: async (datos) => {
    try {
      const response = await api.post("/documentos-ot", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addPropietario: async (datos) => {
    try {
      const response = await api.post("/union-vehiculo-propietario-crear", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addCliente: async (datos) => {
    try {
      const response = await api.post("/union-vehiculo-cliente-crear", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addPlaca: async (datos) => {
    try {
      const response = await api.post("/placa", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addUsuario: async (datos) => {
    try {
      const response = await api.post("/usuarios", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addEtiqueta: async (datos) => {
    try {
      const response = await api.post("/etiquetas", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addPermiso: async (datos) => {
    try {
      const response = await api.post("/permisos", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addMantenimientoEjecutar: async (datos) => {
    try {
      const response = await api.post("/mantenimiento-ejecutar", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // =====================================================
  // MÉTODOS POST (AGREGAR / EDITAR)
  // =====================================================

  activarEtiquetaContacto: async (datos) => {
    try {
      const response = await api.post("/union-etiquetas", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editContactosImagen: async (contactId, datos) => {
    try {
      const response = await api.post(`/contacto/imagen/${contactId}`, datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editVehiculoImagen: async (id, datos) => {
    try {
      const response = await api.post(`/vehiculo/imagen/${id}`, datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateEstado: async (id, datos) => {
    try {
      const response = await api.post(`/ordenes-trabajo-editar/${id}`, datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editPropietarioInfo: async (idRegistro, datos) => {
    try {
      const response = await api.post(`/union-vehiculo-propietario/${idRegistro}`, datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editClienteVehiculo: async (idRegistro, datos) => {
    try {
      const response = await api.post(`/union-vehiculo-cliente/${idRegistro}`, datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editContactosInfo: async (contactId, datos) => {
    try {
      const response = await api.put(`/contactos/${contactId}`, datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editVehiculoInfo: async (placa, formData10) => {
    try {
      const response = await api.post(`/vehiculo/${placa}`, formData10);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // =====================================================
  // ELIMINAR
  // =====================================================
  desactivarEtiquetaContacto: async (idEtiqueta, contactoID) => {
    try {
      const response = await api.delete(`/union-etiquetas/${idEtiqueta}/${contactoID}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  desactivarPermisoContacto: async (idPermiso, contactoID) => {
    try {
      const response = await api.delete(`/union-usuarios-permisos/${idPermiso}/${contactoID}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  activarPermisoContacto: async (datos) => {
    try {
      const response = await api.post("/union-usuarios-permisos", datos);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
