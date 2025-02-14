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
  contactosID: async (id) => {
    try {
      const response = await api.get(`/contactos/${id}`);
      // Lógica extra o transformación de datos
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

};
