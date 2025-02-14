import React, { useState } from "react";
import styles from "../../styles/ModalFormulario.module.css";

function ModalAgregarDocumentoContacto({ cerrarModal }) {

  const tiposIdentificacion = [
    { value: "cedula", label: "Cédula" },
    { value: "pasaporte", label: "Pasaporte" },
    { value: "ruc", label: "RUC" },
    { value: "otro", label: "Otro" },
  ];
  
    // Función que se pasará al modal para agregar un nuevo contacto
    const agregarContacto = (data) => {
      const nuevoContacto = {
        ID_CONTACTO: contactos.length + 1, // ID simulado
        ...data,
      };
      setContactos([...contactos, nuevoContacto]);
      // Redirigimos al detalle del contacto recién creado (si se desea)
      navigate(`/gestion/contactos/ver/${nuevoContacto.ID_CONTACTO}`);
    };

  const [nuevoContacto, setNuevoContacto] = useState({
    NOMBRE_COMPLETO: "",
    CORREO_ELECTRONICO: "",
    TELEFONO: "",
    TIPO_IDENTIFICACION: "",
    NUMERO_IDENTIFICACION: "",
    URL_IMAGEN: ""
  });
  const [imagen, setImagen] = useState(null);

  const manejarCambio = (e) => {
    setNuevoContacto({
      ...nuevoContacto,
      [e.target.name]: e.target.value,
    });
  };

  const manejarCambioImagen = (e) => {
    setImagen(e.target.files[0]);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    // Creamos el objeto que representa el nuevo contacto. Si hay imagen, la procesamos.
    const data = {
      ...nuevoContacto,
      URL_IMAGEN: imagen ? URL.createObjectURL(imagen) : null,
    };

    // Llamamos a la función que se pasó como prop para agregar el contacto.
    agregarContacto(data);

    // Cerramos el modal.
    cerrarModal();
  };

  // Cerrar el modal al hacer clic en el overlay (si se clickea fuera del modal)
  const manejarCerrarModal = (e) => {
    if (e.target === e.currentTarget) {
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

export default ModalAgregarDocumentoContacto;
