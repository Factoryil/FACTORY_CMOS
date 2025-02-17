import React, { useState } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalAgregarVehiculo({ cerrarModal }) {
  const [nuevaPlaca, setnuevaPlaca] = useState({
    placa: ""
  });

  const manejarCambio = (e) => {
    setnuevaPlaca({
      ...nuevaPlaca,
      [e.target.name]: e.target.value,
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const response = await apiManager.addPlaca(nuevaPlaca);
      console.log("Nueva placa agregada:", response);
      cerrarModal();
    } catch (error) {
      console.error("Error al agregar placa:", error);
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
        <h2>Agregar Nuevo Vehiculo</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="placa">Placa</label>
          <input
            type="text"
            id="placa"
            name="placa"
            value={nuevaPlaca.placa}
            onChange={manejarCambio}
            required
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

export default ModalAgregarVehiculo;
