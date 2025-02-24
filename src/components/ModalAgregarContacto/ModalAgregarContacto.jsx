import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";
import { useNavigate } from "react-router-dom";

function ModalAgregarContacto({ cerrarModal }) {

  const navigate = useNavigate();

  const tiposIdentificacion = [
    { value: "CC", label: "Cédula" },
    { value: "NIT", label: "Número de Identificación Tributaria" },
  ];

  // Cargar datos desde localStorage (si existen)
  const cargarDatosGuardados = () => {
    const datosGuardados = localStorage.getItem("nuevoContacto");
    return datosGuardados ? JSON.parse(datosGuardados) : {
      NOMBRE_COMPLETO: "",
      CORREO_ELECTRONICO: "",
      TELEFONO: "",
      TIPO_IDENTIFICACION: "",
      NUMERO_IDENTIFICACION: "",
      URL_IMAGEN: "",
    };
  };

  const [nuevoContacto, setNuevoContacto] = useState(cargarDatosGuardados());
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    // Guardar los cambios del formulario en localStorage cada vez que se actualice el estado
    localStorage.setItem("nuevoContacto", JSON.stringify(nuevoContacto));
  }, [nuevoContacto]);

  const manejarCambio = (e) => {
    setNuevoContacto({
      ...nuevoContacto,
      [e.target.name]: e.target.value,
    });
  };

  const manejarCambioImagen = (e) => {
    setImagen(e.target.files[0]);
  };

  // Función para agregar el contacto a través de la API
  const agregarContacto = async (data) => {
    try {
      const formData = new FormData();
      formData.append("NOMBRE_COMPLETO", data.NOMBRE_COMPLETO);
      formData.append("CORREO_ELECTRONICO", data.CORREO_ELECTRONICO);
      formData.append("TELEFONO", data.TELEFONO);
      formData.append("TIPO_IDENTIFICACION", data.TIPO_IDENTIFICACION);
      formData.append("NUMERO_IDENTIFICACION", data.NUMERO_IDENTIFICACION);
      if (imagen) {
        formData.append("URL_IMAGEN", imagen); // Aquí se maneja el archivo de imagen
      }

      // Llamada a la API para agregar el nuevo contacto
      const response = await apiManager.addContactos(formData);

       // Si la respuesta contiene error
       if (response.error) {
        console.error("Error al agregar el contacto:", response.error);
        // Aquí puedes mostrar un mensaje de error o hacer otro manejo
        return;
      }
      
      // Si la creación fue exitosa, se espera que response contenga { mensaje, ID_CONTACTOS }
      if (response.ID_CONTACTOS) {
        navigate(`/gestion/contactos/ver/${response.ID_CONTACTOS}`);
      }
      

    } catch (error) {
      console.error("Error al agregar el contacto:", error);
    }
  };



  const manejarEnvio = (e) => {
    e.preventDefault();

    // Llamar a la función para agregar el contacto a la API
    agregarContacto(nuevoContacto);

    // Limpiar los datos del formulario en localStorage y estado
    localStorage.removeItem("nuevoContacto");

    // Cerrar el modal después de guardar
    cerrarModal();
  };

  // Cerrar el modal al hacer clic en el overlay
  const manejarCerrarModal = (e) => {
    if (e.target === e.currentTarget) {
      // Limpiar los datos del formulario si el modal se cierra sin guardar
      localStorage.removeItem("nuevoContacto");
      cerrarModal();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={manejarCerrarModal}>
      <div className={styles.modal}>
        <h2>Agregar Nuevo Contacto</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="NOMBRE_COMPLETO">Nombre Completo</label>
          <input
            type="text"
            id="NOMBRE_COMPLETO"
            name="NOMBRE_COMPLETO"
            value={nuevoContacto.NOMBRE_COMPLETO}
            onChange={manejarCambio}
            required
          />
          <label htmlFor="CORREO_ELECTRONICO">Correo Electrónico</label>
          <input
            type="email"
            id="CORREO_ELECTRONICO"
            name="CORREO_ELECTRONICO"
            value={nuevoContacto.CORREO_ELECTRONICO}
            onChange={manejarCambio}
            required
          />
          <label htmlFor="TELEFONO">Teléfono</label>
          <input
            type="text"
            id="TELEFONO"
            name="TELEFONO"
            value={nuevoContacto.TELEFONO}
            onChange={manejarCambio}
            required
          />
          <label htmlFor="TIPO_IDENTIFICACION">Tipo de Identificación</label>
          <select
            id="TIPO_IDENTIFICACION"
            name="TIPO_IDENTIFICACION"
            value={nuevoContacto.TIPO_IDENTIFICACION}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un tipo</option>
            {tiposIdentificacion.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
          <label htmlFor="NUMERO_IDENTIFICACION">Número de Identificación</label>
          <input
            type="text"
            id="NUMERO_IDENTIFICACION"
            name="NUMERO_IDENTIFICACION"
            value={nuevoContacto.NUMERO_IDENTIFICACION}
            onChange={manejarCambio}
            required
          />
          <label htmlFor="URL_IMAGEN">Imagen (opcional)</label>
          <input
            type="file"
            id="URL_IMAGEN"
            name="URL_IMAGEN"
            onChange={manejarCambioImagen}
          />
          <div className={styles.modalButtons}>
            <button type="submit" className={styles.saveButton}>
              Guardar
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={cerrarModal}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAgregarContacto;
