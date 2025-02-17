import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalAgregarUsuario({ cerrarModal }) {
  // Estado para roles obtenidos de la API
  const [roles, setRoles] = useState([]);

  // Opciones de estado según el ENUM de la tabla (Activo, Inactivo)
  const estadosDisponibles = [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
  ];

  const [nuevoUsuario, setNuevoUsuario] = useState({
    USERNAME: "",
    CORREO_ELECTRONICO: "",
    NOMBRE_ROL: "",
    PASSWORD: "",
    ID_CONTACTOS: "",
    URL_IMAGEN: null, // Se enviará a través del FormData
    ESTADO: "Activo",
  });

  const [imagen, setImagen] = useState(null);
  const [contactos, setContactos] = useState([]);

  // Obtiene los contactos para poblar el select de ID_CONTACTOS
  useEffect(() => {
    const obtenerContactos = async () => {
      try {
        const response = await apiManager.contactosSinUsuarios();
        setContactos(response);
      } catch (error) {
        console.error("Error al obtener los contactos:", error);
      }
    };
    obtenerContactos();
  }, []);

  // Obtiene los roles desde la API para poblar el select de NOMBRE_ROL
  useEffect(() => {
    const obtenerRoles = async () => {
      try {
        const response = await apiManager.roles(); // Asegúrate de que este endpoint esté configurado
        setRoles(response);
      } catch (error) {
        console.error("Error al obtener los roles:", error);
      }
    };
    obtenerRoles();
  }, []);

  // Maneja los cambios en los inputs (excepto el de imagen)
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Maneja la selección de imagen
  const manejarCambioImagen = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  // Envía el formulario utilizando FormData
  const manejarEnvio = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("USERNAME", nuevoUsuario.USERNAME);
    formData.append("CORREO_ELECTRONICO", nuevoUsuario.CORREO_ELECTRONICO);
    formData.append("NOMBRE_ROL", nuevoUsuario.NOMBRE_ROL);
    formData.append("PASSWORD", nuevoUsuario.PASSWORD);
    // Convertir a número el ID_CONTACTOS, ya que la tabla espera un INT
    formData.append("ID_CONTACTOS", parseInt(nuevoUsuario.ID_CONTACTOS, 10));
    formData.append("ESTADO", nuevoUsuario.ESTADO);
    if (imagen) {
      formData.append("URL_IMAGEN", imagen);
    }

    try {
      const response = await apiManager.addUsuario(formData);
      console.log("Nuevo usuario agregado:", response);
      cerrarModal();
    } catch (error) {
      console.error("Error al agregar usuario:", error);
    }
  };

  // Cierra el modal cuando se hace clic fuera del contenido
  const manejarCerrarModal = (e) => {
    if (e.target === e.currentTarget) {
      cerrarModal();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={manejarCerrarModal}>
      <div className={styles.modal}>
        <h2>Agregar Nuevo Usuario</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="USERNAME">Nombre de Usuario</label>
          <input
            type="text"
            id="USERNAME"
            name="USERNAME"
            value={nuevoUsuario.USERNAME}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="CORREO_ELECTRONICO">Correo Electrónico</label>
          <input
            type="email"
            id="CORREO_ELECTRONICO"
            name="CORREO_ELECTRONICO"
            value={nuevoUsuario.CORREO_ELECTRONICO}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="NOMBRE_ROL">Rol</label>
          <select
            id="NOMBRE_ROL"
            name="NOMBRE_ROL"
            value={nuevoUsuario.NOMBRE_ROL}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un rol</option>
            {roles.map((rol) => (
              <option key={rol.ID_ROL} value={rol.NOMBRE_ROL}>
                {rol.NOMBRE_ROL}
              </option>
            ))}
          </select>

          <label htmlFor="PASSWORD">Contraseña</label>
          <input
            type="password"
            id="PASSWORD"
            name="PASSWORD"
            value={nuevoUsuario.PASSWORD}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="ID_CONTACTOS">Contacto</label>
          <select
            id="ID_CONTACTOS"
            name="ID_CONTACTOS"
            value={nuevoUsuario.ID_CONTACTOS}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un contacto</option>
            {contactos.map((contacto) => (
              <option key={contacto.ID_CONTACTOS} value={contacto.ID_CONTACTOS}>
                {contacto.NOMBRE_COMPLETO}
              </option>
            ))}
          </select>

          <label htmlFor="ESTADO">Estado</label>
          <select
            id="ESTADO"
            name="ESTADO"
            value={nuevoUsuario.ESTADO}
            onChange={manejarCambio}
            required
          >
            {estadosDisponibles.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>

          <label htmlFor="URL_IMAGEN">Imagen de Perfil (opcional)</label>
          <input
            type="file"
            id="URL_IMAGEN"
            name="URL_IMAGEN"
            accept="image/*"
            onChange={manejarCambioImagen}
          />

          <div className={styles.modalButtons}>
            <button type="submit" className={styles.saveButton}>
              Guardar
            </button>
            <button type="button" className={styles.cancelButton} onClick={cerrarModal}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAgregarUsuario;
