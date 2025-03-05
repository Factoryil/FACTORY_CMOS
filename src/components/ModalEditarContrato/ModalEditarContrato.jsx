import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalEditarContrato({ cerrarModal, contratoData, handleUpdate }) {
  
  console.log("Datos recibidos:", contratoData);

  // Opciones de estado según el ENUM de la tabla (Activo, Inactivo)
  const estadosDisponibles = [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
  ];

  // Estado local con los datos iniciales del contrato
  const [contrato, setContrato] = useState({
    NUMERO_CONTRATO: "",
    OBSERVACION: "",
    FECHA_EMISION: "",
    FECHA_VENCIMIENTO: "",
    ESTADO: "Activo",
    SUBDIVICION: "",
  });
  const [contratoFile, setContratoFile] = useState(null);

  // Cargar datos del contrato al montar el componente
  useEffect(() => {
    if (contratoData) {
      setContrato({
        // Asumiendo que en contratoData la clave para número de contrato es "Contrato"
        NUMERO_CONTRATO: contratoData["Contrato"] || "",
        OBSERVACION: contratoData["Obervacion"] || "",
        FECHA_EMISION: contratoData["Fecha de Inicio"]
          ? contratoData["Fecha de Inicio"].slice(0, 10)
          : "",
        FECHA_VENCIMIENTO: contratoData["Fecha de Finalización"]
          ? contratoData["Fecha de Finalización"].slice(0, 10)
          : "",
        ESTADO: contratoData["ESTADO"] || "Activo",
        // Se asume que el backend devuelve la subdivisión en la clave "SUBDIVICION"
        SUBDIVICION: contratoData["Subdivision"] || "",
      });
    }
  }, [contratoData]);

  // Maneja los cambios en los inputs
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setContrato((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Maneja la selección del nuevo archivo PDF para actualizar
  const manejarCambioArchivo = (e) => {
    if (e.target.files && e.target.files[0]) {
      setContratoFile(e.target.files[0]);
    }
  };

  // Envía el formulario utilizando FormData para actualizar el contrato
  const manejarEnvio = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("NUMERO_CONTRATO", contrato.NUMERO_CONTRATO);
    formData.append("OBSERVACION", contrato.OBSERVACION);
    formData.append("FECHA_EMISION", contrato.FECHA_EMISION);
    formData.append("FECHA_VENCIMIENTO", contrato.FECHA_VENCIMIENTO);
    formData.append("ESTADO", contrato.ESTADO);
    formData.append("SUBDIVICION", contrato.SUBDIVICION);
    if (contratoFile) {
      formData.append("URL_CONTRATO", contratoFile);
    }

    try {
      // Se asume que el método updateContrato de apiManager envía el FormData al endpoint correspondiente
      const response = await apiManager.updateContrato(
        contratoData.ID_CONTRATO,
        formData
      );
      console.log("Contrato actualizado:", response);
      // Actualiza la lista de contratos en el componente padre
      handleUpdate();
      cerrarModal();
    } catch (error) {
      console.error("Error al actualizar contrato:", error);
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
        <h2>Editar Contrato</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="NUMERO_CONTRATO">Número de Contrato</label>
          <input
            type="number"
            id="NUMERO_CONTRATO"
            name="NUMERO_CONTRATO"
            value={contrato.NUMERO_CONTRATO}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="OBSERVACION">Observación</label>
          <textarea
            id="OBSERVACION"
            name="OBSERVACION"
            value={contrato.OBSERVACION}
            onChange={manejarCambio}
            className={styles.texarean1}
          />

          <label htmlFor="FECHA_EMISION">Fecha de Emisión</label>
          <input
            type="date"
            id="FECHA_EMISION"
            name="FECHA_EMISION"
            value={contrato.FECHA_EMISION}
            onChange={manejarCambio}
          />

          <label htmlFor="FECHA_VENCIMIENTO">Fecha de Vencimiento</label>
          <input
            type="date"
            id="FECHA_VENCIMIENTO"
            name="FECHA_VENCIMIENTO"
            value={contrato.FECHA_VENCIMIENTO}
            onChange={manejarCambio}
          />

          <label htmlFor="ESTADO">Estado</label>
          <select
            id="ESTADO"
            name="ESTADO"
            value={contrato.ESTADO}
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
            value={contrato.SUBDIVICION}
            onChange={manejarCambio}
            placeholder="Opcional"
          />

          <label htmlFor="URL_CONTRATO">
            Actualizar Archivo del Contrato (PDF, opcional)
          </label>
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

export default ModalEditarContrato;
