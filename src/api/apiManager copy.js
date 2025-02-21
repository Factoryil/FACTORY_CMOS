import api from "./instance";

export const apiManager = {
  // Método para iniciar sesión
  login: async ({ email, password }) => {



    try {
      const formData = new FormData();
      formData.append("CORREO_ELECTRONICO", email);
      formData.append("PASSWORD", password);
      const response = await api.post("/login", formData);
      return response.data;
    } catch (error) {
      // Manejo personalizado de errores si lo requieres
      throw error;
    }
  },

  // Método para verificar el token
  verifyToken: async () => {
    try {
      const response = await api.post("/token");
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Método para verificar el token
  contactos: async () => {
    try {
      const response = await api.get("/contactos");
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  mantenimientos: async () => {
    try {
      const response = await api.get("/mantenimiento");
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  vehiculos: async () => {
    try {
      const response = await api.get("/vehiculos");
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  ordenesTrabajoActuales: async () => {
    try {
      const response = await api.get("/ordenes-trabajo");
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  ordenesTrabajoHistorico: async () => {
    try {
      const response = await api.get("/ordenes-trabajo");
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  permisos: async () => {
    try {
      const response = await api.get("/permisos");
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  odometros: async () => {
    try {
      const response = await api.get("/odometro");
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  odometroUltimos: async () => {
    try {
      const response = await api.get("/odometro-ultimos");
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  contactosSinUsuarios: async () => {
    try {
      const response = await api.get("/contactos-sin-usuario");
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  etiquetas: async () => {
    try {
      const response = await api.get("/etiquetas");
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  roles: async () => {
    try {
      const response = await api.get("/roles");
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  planesMantenimiento: async () => {
    try {
      const response = await api.get("/plan-mantenimiento");
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  usuarios: async () => {
    try {
      const response = await api.get("/usuarios");
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  contactosID: async (id) => {
    try {
      const response = await api.get(`/contactos/${id}`);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getSoportes: async (ot) => {
    try {
      const response = await api.get(`/soportes-ot/ot/${ot}`);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getDocumentosOTByOT: async (ot) => {
    try {
      const response = await api.get(`/documentos-ot/ot/${ot}`);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  ordenTrabajoID: async (id) => {
    try {
      const response = await api.get(`/ordenes-trabajo/${id}`);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  vehiculoID: async (placa) => {
    try {
      const response = await api.get(`/vehiculos/${placa}`);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  vehiculoIDFichaTecnica: async (placa) => {
    try {
      const response = await api.get(`/vehiculos-info/${placa}`);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPropietariosVehiculo: async (placa) => {
    try {
      const response = await api.get(`/union-vehiculo-propietario/vehiculo/${placa}`);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getClientesVehiculo: async (placa) => {
    try {
      const response = await api.get(`/union-vehiculo-cliente/vehiculo/${placa}`);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPropietariosID: async (id) => {
    try {
      const response = await api.get(`/union-vehiculo-propietario/propietario/${id}`);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  contactosEtiquetidoID: async (id) => {
    try {
      const response = await api.get(`/union-etiquetas/etiqueta/${id}`);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  unionDeEtiquetaContactoID: async (contactoID) => {
    try {
      const response = await api.get(`/union-etiquetas/contacto/${contactoID}`);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  etiquetaUsuarios: async (id) => {
    try {
      const response = await api.get(`/contactos/${id}`);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  editContactosImagen: async (contactId, datos) => {
    try {
      const response = await api.post(`/contacto/imagen/${contactId}`, datos);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editVehiculoImagen: async (id, datos) => {
    try {
      const response = await api.post(`/vehiculo/imagen/${id}`, datos);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  editPropietarioInfo: async (idRegistro, datos) => {
    try {
      const response = await api.post(`/union-vehiculo-propietario/${idRegistro}`, datos);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  editClienteVehiculo: async (idRegistro, datos) => {
    try {
      const response = await api.post(`/union-vehiculo-cliente/${idRegistro}`, datos);
      // Lógica extra o transformación de datos
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

  editVehiculoInfo: async (placa,formData10) => {
    try {
      const response = await api.post(`/vehiculo/${placa}`, formData10);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  // Método para verificar el token
  addContactos: async (datos) => {
    try {
      const response = await api.post("/contactos", datos);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addMantenimiento: async (datos) => {
    try {
      const response = await api.post("/mantenimiento", datos);
      // Lógica extra o transformación de datos
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
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addOdometro: async (datos) => {
    try {
      const response = await api.post("/odometro", datos);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addRol: async (datos) => {
    try {
      const response = await api.post("/roles", datos);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  uploadSoporte: async (datos) => {
    try {
      const response = await api.post("/soportes-ot", datos);
      // Lógica extra o transformación de datos
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
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addCliente: async (datos) => {
    try {
      const response = await api.post("/union-vehiculo-cliente-crear", datos);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  addPlaca: async (datos) => {
    try {
      const response = await api.post("/placa", datos);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addUsuario: async (datos) => {
    try {
      const response = await api.post("/usuarios", datos);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  activarEtiquetaContacto: async (datos) => {
    try {
      const response = await api.post("/union-etiquetas", datos);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addEtiqueta: async (datos) => {
    try {
      const response = await api.post("/etiquetas", datos);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addPermiso: async (datos) => {
    try {
      const response = await api.post("/permisos", datos);
      // Lógica extra o transformación de datos
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Método para obtener permisos del usuario
  getUserPermissions: async (idContacto) => {
    try {
      const response = await api.get(`/permisos-usuarios/${idContacto}`);
      // Aquí podrías transformar la respuesta o aplicar lógica extra
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  desactivarEtiquetaContacto: async (idEtiqueta, contactoID) => {
    try {
      const response = await api.delete(`/union-etiquetas/${idEtiqueta}/${contactoID}`);
      // Aquí podrías transformar la respuesta o aplicar lógica extra
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
  }
  

};
