import React, { useState } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalAgregarContrato({ cerrarModal, contactoID }) {
  console.log(contactoID);
  
  // Opciones de estado según el ENUM de la tabla (Activo, Inactivo)
  const estadosDisponibles = [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
  ];

  const [nuevoContrato, setNuevoContrato] = useState({
    NUMERO_CONTRATO: "",
    OBSERVACION: "",
    FECHA_EMISION: "",
    FECHA_VENCIMIENTO: "",
    ESTADO: "Activo",
    SUBDIVICION: ""  // nuevo campo para subdivisión
  });

  const [contratoFile, setContratoFile] = useState(null);

  // Maneja los cambios en los inputs
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoContrato((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Maneja la selección del archivo PDF del contrato
  const manejarCambioArchivo = (e) => {
    if (e.target.files && e.target.files[0]) {
      setContratoFile(e.target.files[0]);
    }
  };

  // Envía el formulario utilizando FormData
  const manejarEnvio = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("NUMERO_CONTRATO", nuevoContrato.NUMERO_CONTRATO);
    formData.append("ID_CONTACTOS", contactoID);
    formData.append("OBSERVACION", nuevoContrato.OBSERVACION);
    formData.append("FECHA_EMISION", nuevoContrato.FECHA_EMISION);
    formData.append("FECHA_VENCIMIENTO", nuevoContrato.FECHA_VENCIMIENTO);
    formData.append("ESTADO", nuevoContrato.ESTADO);
    formData.append("SUBDIVICION", nuevoContrato.SUBDIVICION);
    if (contratoFile) {
      formData.append("URL_CONTRATO", contratoFile);
    }

    try {
      const response = await apiManager.addContrato(formData);
      console.log("Nuevo contrato agregado:", response);
      cerrarModal();
    } catch (error) {
      console.error("Error al agregar contrato:", error);
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
        <h2>Agregar Nuevo Contrato</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="NUMERO_CONTRATO">Número de Contrato</label>
          <input
            type="number"
            id="NUMERO_CONTRATO"
            name="NUMERO_CONTRATO"
            value={nuevoContrato.NUMERO_CONTRATO}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="OBSERVACION">Observación</label>
          <textarea
            id="OBSERVACION"
            name="OBSERVACION"
            value={nuevoContrato.OBSERVACION}
            onChange={manejarCambio}
            className={styles.texarean1}
          />

          <label htmlFor="FECHA_EMISION">Fecha de Emisión</label>
          <input
            type="date"
            id="FECHA_EMISION"
            name="FECHA_EMISION"
            value={nuevoContrato.FECHA_EMISION}
            onChange={manejarCambio}
          />

          <label htmlFor="FECHA_VENCIMIENTO">Fecha de Vencimiento</label>
          <input
            type="date"
            id="FECHA_VENCIMIENTO"
            name="FECHA_VENCIMIENTO"
            value={nuevoContrato.FECHA_VENCIMIENTO}
            onChange={manejarCambio}
          />

          <label htmlFor="ESTADO">Estado</label>
          <select
            id="ESTADO"
            name="ESTADO"
            value={nuevoContrato.ESTADO}
            onChange={manejarCambio}
            required
          >
            {estadosDisponibles.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>

          <label htmlFor="SUBDIVICION">SUBDIVICION</label>
          <input
            type="text"
            id="SUBDIVICION"
            name="SUBDIVICION"
            value={nuevoContrato.SUBDIVICION}
            onChange={manejarCambio}
            placeholder="Opcional"
          />

          <label htmlFor="URL_CONTRATO">Archivo del Contrato (PDF, opcional)</label>
          <input
            type="file"
            id="URL_CONTRATO"
            name="URL_CONTRATO"
            accept="application/pdf"
            onChange={manejarCambioArchivo}
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

export default ModalAgregarContrato;
