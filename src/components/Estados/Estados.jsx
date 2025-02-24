import React, { useState } from "react";
import { apiManager } from "../../api/apiManager"; // Asegúrate de tener implementadas estas funciones en apiManager
import styles from "./Estados.module.css";
const Estados = ({
  otNumber,
  estado_vehiculo,
  estado_ot,
  estado_autorizacion,
  onUpdate, // Función de callback para actualizar los datos en el padre
}) => {
  // Estados locales para cada select
  const [estadoOT, setEstadoOT] = useState(estado_ot);
  const [estadoVehiculo, setEstadoVehiculo] = useState(estado_vehiculo);
  const [estadoAutorizacion, setEstadoAutorizacion] = useState(estado_autorizacion);

  // Actualiza un campo enviando un FormData con ese único valor
  const updateField = async (fieldName, value) => {
    const formData = new FormData();
    formData.append(fieldName, value);
    try {
      const response = await apiManager.updateEstado(otNumber, formData);
      console.log(`${fieldName} actualizado:`, response);
      if (onUpdate) onUpdate(); // Notifica al padre para que refresque los datos
    } catch (error) {
      console.error(`Error al actualizar ${fieldName}:`, error);
    }
  };

  const handleEstadoOTChange = async (e) => {
    const nuevoEstado = e.target.value;
    setEstadoOT(nuevoEstado);
    await updateField("ESTADO", nuevoEstado);
  };

  const handleEstadoVehiculoChange = async (e) => {
    const nuevoEstado = e.target.value;
    setEstadoVehiculo(nuevoEstado);
    await updateField("estado_vehiculo", nuevoEstado);
  };

  const handleEstadoAutorizacionChange = async (e) => {
    const nuevoEstado = e.target.value;
    setEstadoAutorizacion(nuevoEstado);
    await updateField("AUTORIZACION", nuevoEstado);
  };

  return (
    <div className={styles.estadosContainer}>
      <h2 className={styles.header}>Estados</h2>
      <div className={styles.row}>
        <label htmlFor="estadoOT" className={styles.label}>
          Estado OT:
        </label>
        <select
          id="estadoOT"
          value={estadoOT}
          onChange={handleEstadoOTChange}
          className={styles.select}
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En Ejecucion">En Ejecucion</option>
          <option value="Ejecutado">Ejecutado</option>
          <option value="Cerrada">Cerrada</option>
          <option value="Anulado">Anulado</option>
        </select>
      </div>
      <div className={styles.row}>
        <label htmlFor="estadoVehiculo" className={styles.label}>
          Estado Vehículo:
        </label>
        <select
          id="estadoVehiculo"
          value={estadoVehiculo}
          onChange={handleEstadoVehiculoChange}
          className={styles.select}
        >
          <option value="Operativo">Operativo</option>
          <option value="Taller">Taller</option>
        </select>
      </div>
      <div className={styles.row}>
        <label htmlFor="estadoAutorizacion" className={styles.label}>
          Estado Autorización:
        </label>
        <select
          id="estadoAutorizacion"
          value={estadoAutorizacion}
          onChange={handleEstadoAutorizacionChange}
          className={styles.select}
        >
          <option value="Sin Enviar">Sin Enviar</option>
          <option value="Aprobada">Aprobada</option>
          <option value="Rechazada">Rechazada</option>
          <option value="Enviada">Enviada</option>
        </select>
      </div>
    </div>
  );
};

export default Estados;
