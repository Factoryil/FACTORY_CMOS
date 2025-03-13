import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalAgregarPropietarioContacto({ cerrarModal, ContactoID, onUpdate }) {
  
  
  // Opciones de estado según la definición en la tabla
  const estadosDisponibles = [
    { value: "Actual", label: "Actual" },
    { value: "Renovado", label: "Renovado" },
  ];

  // Opciones para el período de cobro
  const periodosDisponibles = [
    { value: "Día", label: "Día" },
    { value: "Mes", label: "Mes" },
    { value: "Año", label: "Año" },
  ];

  // Inicializamos el estado con las claves que coinciden exactamente con los nombres de columna de la tabla
  const [nuevoRegistro, setNuevoRegistro] = useState({
    ID_VEHICULO: "",
    ID_CONTACTOS: ContactoID,
    ESTADO: "Actual",
    FECHA_EMISION: "",
    FECHA_VENCIMIENTO: "",
    PERIODO: "Mes",
    VALOR: "",
  });

  const [vehiculo, setvehiculo] = useState([]);
  const [pdf, setPdf] = useState(null);

  // Obtiene los vehiculo (puedes ajustar el endpoint para que retorne solo los vehiculo sin usuario, si es lo deseado)
  useEffect(() => {
    const obtenervehiculo = async () => {
      try {
        const response = await apiManager.vehiculos();
        setvehiculo(response);
      } catch (error) {
        console.error("Error al obtener vehiculo:", error);
      }
    };
    obtenervehiculo();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoRegistro((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejarCambioPdf = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPdf(e.target.files[0]);
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // Agregamos cada campo utilizando los mismos nombres definidos en la tabla
    formData.append("PLACA", nuevoRegistro.ID_VEHICULO);
    formData.append("ID_CONTACTOS", nuevoRegistro.ID_CONTACTOS);
    formData.append("ESTADO", nuevoRegistro.ESTADO);
    formData.append("FECHA_EMISION", nuevoRegistro.FECHA_EMISION);
    formData.append("FECHA_VENCIMIENTO", nuevoRegistro.FECHA_VENCIMIENTO);
    formData.append("PERIODO", nuevoRegistro.PERIODO);
    formData.append("VALOR", nuevoRegistro.VALOR);
    if (pdf) {
      formData.append("URL_PDF", pdf);
    }
    try {
      const response = await apiManager.addPropietario(formData);
      console.log("Propietario asignado:", response);
      cerrarModal();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error al asignar propietario:", error);
    }
  };

  const manejarCerrarModal = (e) => {
    if (e.target === e.currentTarget) {
      cerrarModal();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={manejarCerrarModal}>
      <div className={styles.modal}>
        <h2>Agregar Propietario</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="ID_VEHICULO">Vehiculos</label>
          <select
            id="ID_VEHICULO"
            name="ID_VEHICULO"
            value={nuevoRegistro.ID_VEHICULO}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un contacto</option>
            {vehiculo.map((vehiculo) => (
              <option key={vehiculo.placa} value={vehiculo.placa}>
                {vehiculo.placa}
              </option>
            ))}
          </select>

          <label htmlFor="ESTADO">Estado</label>
          <select
            id="ESTADO"
            name="ESTADO"
            value={nuevoRegistro.ESTADO}
            onChange={manejarCambio}
            required
          >
            {estadosDisponibles.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>

          <label htmlFor="FECHA_EMISION">Fecha de Emisión</label>
          <input
            type="date"
            id="FECHA_EMISION"
            name="FECHA_EMISION"
            value={nuevoRegistro.FECHA_EMISION}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="FECHA_VENCIMIENTO">Fecha de Vencimiento</label>
          <input
            type="date"
            id="FECHA_VENCIMIENTO"
            name="FECHA_VENCIMIENTO"
            value={nuevoRegistro.FECHA_VENCIMIENTO}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="PERIODO">Período de Cobro</label>
          <select
            id="PERIODO"
            name="PERIODO"
            value={nuevoRegistro.PERIODO}
            onChange={manejarCambio}
            required
          >
            {periodosDisponibles.map((periodo) => (
              <option key={periodo.value} value={periodo.value}>
                {periodo.label}
              </option>
            ))}
          </select>

          <label htmlFor="VALOR">Valor</label>
          <input
            type="number"
            id="VALOR"
            name="VALOR"
            value={nuevoRegistro.VALOR}
            onChange={manejarCambio}
            required
            step="0.01"
          />

          <label htmlFor="URL_PDF">PDF (opcional)</label>
          <input
            type="file"
            id="URL_PDF"
            name="URL_PDF"
            accept="application/pdf"
            onChange={manejarCambioPdf}
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

export default ModalAgregarPropietarioContacto;
