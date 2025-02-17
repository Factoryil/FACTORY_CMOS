import React, { useState } from "react";
import styles from "./ModalEditarClienteVehiculo.module.css";
import { apiManager } from "../../api/apiManager";

const ModalEditarClienteVehiculo = ({ cerrarModal, clienteData, onUpdate = () => {} }) => {
  const [formData, setFormData] = useState({
    ESTADO: clienteData.ESTADO || "Actual",
    FECHA_EMISION: clienteData.FECHA_EMISION || "",
    FECHA_VENCIMIENTO: clienteData.FECHA_VENCIMIENTO || "",
    PERIODO: clienteData.PERIODO || "Año",
    VALOR: clienteData.VALOR || "",
    URL_PDF: clienteData.URL_PDF || ""
  });

  const [nuevoPdf, setNuevoPdf] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNuevoPdf(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    dataToSend.append("ESTADO", formData.ESTADO);
    dataToSend.append("FECHA_EMISION", formData.FECHA_EMISION);
    dataToSend.append("FECHA_VENCIMIENTO", formData.FECHA_VENCIMIENTO);
    dataToSend.append("PERIODO", formData.PERIODO);
    dataToSend.append("VALOR", formData.VALOR);
    if (nuevoPdf) dataToSend.append("URL_PDF", nuevoPdf);

    try {
      await apiManager.editClienteVehiculo(clienteData.ID_UNION_VEHICULO_Y_CLIENTE, dataToSend);
      onUpdate();
      cerrarModal();
    } catch (error) {
      console.error("Error al actualizar la información del cliente:", error);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) cerrarModal(); }}>
      <div className={styles.modalContainer}>
        <h2 className={styles.title}>Editar Información del Cliente</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Campos del formulario similares al modal de propietarios */}
          <div className={styles.inputGroup}>
            <label htmlFor="ESTADO">Estado</label>
            <select name="ESTADO" id="ESTADO" value={formData.ESTADO} onChange={handleChange} required>
              <option value="Actual">Actual</option>
              <option value="Renovado">Renovado</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="FECHA_EMISION">Fecha de Emisión</label>
            <input type="date" name="FECHA_EMISION" value={formData.FECHA_EMISION} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="FECHA_VENCIMIENTO">Fecha de Vencimiento</label>
            <input type="date" name="FECHA_VENCIMIENTO" value={formData.FECHA_VENCIMIENTO} onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="PERIODO">Período</label>
            <select name="PERIODO" value={formData.PERIODO} onChange={handleChange} required>
              <option value="Día">Día</option>
              <option value="Mes">Mes</option>
              <option value="Año">Año</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="VALOR">Valor</label>
            <input type="number" name="VALOR" value={formData.VALOR} onChange={handleChange} step="0.01" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="URL_PDF">PDF (opcional)</label>
            <input type="file" name="URL_PDF" accept="application/pdf" onChange={handleFileChange} />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>Guardar</button>
            <button type="button" className={styles.cancelButton} onClick={cerrarModal}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarClienteVehiculo;
