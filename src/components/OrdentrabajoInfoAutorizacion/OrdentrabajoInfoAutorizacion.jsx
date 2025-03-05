import React, { useState } from 'react';
import styles from './OrdentrabajoInfoAutorizacion.module.css';
import { apiManager } from "../../api/apiManager";

// Función para formatear la fecha en la zona de Bogotá en formato "YYYY-MM-DD HH:MM:SS"
const formatFechaBogota = (date) => {
  const dtBogota = new Date(date).toLocaleString("en-US", { timeZone: "America/Bogota" });
  const localDate = new Date(dtBogota);
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutes = String(localDate.getMinutes()).padStart(2, "0");
  const seconds = String(localDate.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const OrdentrabajoInfoAutorizacion = ({ data, onUpdate }) => {
  // Se muestra la autorización en modo solo lectura, salvo los botones para actualizarla.
  const [estadoAutorizacion, setEstadoAutorizacion] = useState(data.AUTORIZACION);

  // Función genérica para actualizar un campo en la API.
  // Si se actualiza "AUTORIZACION", se añade también "FECHA_AUTORIZACION" con la fecha formateada.
  const updateField = async (fieldName, value) => {
    const formData = new FormData();
    formData.append(fieldName, value);
    try {
      await apiManager.updateEstado(data.ID_OT, formData);
    } catch (error) {
      console.error(`Error al actualizar ${fieldName}:`, error);
    }
  };

  // Función para aceptar la autorización (cambia a "Aprobada")
  const handleAceptar = async () => {
    const nuevoEstado = "Aprobada";
    setEstadoAutorizacion(nuevoEstado);
    await updateField("AUTORIZACION", nuevoEstado);
    const now = new Date();
    const fechaAutorizacion = formatFechaBogota(now);
    await updateField("FECHA_AUTORIZACION", fechaAutorizacion);
    if (onUpdate) onUpdate();
  };

  // Función para rechazar la autorización (cambia a "Rechazada")
  const handleRechazar = async () => {
    const nuevoEstado = "Rechazada";
    setEstadoAutorizacion(nuevoEstado);
    await updateField("AUTORIZACION", nuevoEstado);
    const now = new Date();
    const fechaAutorizacion = formatFechaBogota(now);
    await updateField("FECHA_AUTORIZACION", fechaAutorizacion);
    if (onUpdate) onUpdate();
  };

  // Función para obtener la clase CSS según el estado de la OT (solo para visualización)
  const getEstadoClass = (estado) => {
    switch (estado) {
      case "Pendiente":
        return styles.pendiente;
      case "En Ejecucion":
        return styles.enEjecucion;
      case "Ejecutado":
        return styles.ejecutado;
      case "Cerrada":
        return styles.cerrada;
      case "Anulado":
        return styles.anulado;
      default:
        return "";
    }
  };

  if (!data) {
    return <div>Cargando información de la orden de trabajo...</div>;
  }

  return (
    <div className={styles['contenedor-info-vehiculo']}>
      <div className={styles['contenedor-info-contenido']}>
        <div className={styles.headerTop}>
          <div className={styles.invoiceNumber}>
            {/* Botón para ver información del vehículo */}
            <button 
              onClick={() => {
                if(data.placa) window.open(`/gestion/vehiculos/ver/${data.placa}`, '_blank');
              }}
              className={styles.boton_editar1}
            >
              <i className="fas fa-eye"></i>
            </button>
            {data.placa} Orden trabajo # {data.ID_OT} - 
            <span className={getEstadoClass(data.ESTADO)}> {data.ESTADO}</span>
            <div className={styles.moreOptionsButton}>
              {data.AUTORIZACION}
            </div>
          </div>
        </div>
        <div className={styles['contenedor-info-contenido-detalles']}>
          {[
            { label: "Fecha Orden", key: "FECHA_ORDEN" },
            { label: "Prioridad", key: "prioridad" },
            { label: "Odómetro", key: "odometro" },
            { label: "Estado Vehiculo", key: "estado_vehiculo" },
            { label: "Taller", key: "taller" },
            { label: "Fecha Programada", key: "FECHA_PROGRAMADA" },
            { label: "Responsable de Pago", key: "cliente" },
            { label: "OC", key: "OC" }
          ].map(({ label, key }) => (
            <div className={styles['contenedor-info-contenido-detalles-item']} key={key}>
              <span>{label}</span>
              <span>
                {data[key] !== null && data[key] !== "" ? data[key] : 'Sin información'}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.observacion}>
          <span>Observación:</span>
          <p>{data.observacion}</p>
        </div>
        <div className={styles.autorizacionContainer}>
          <div className={styles.botonesAutorizacion}>
            <button onClick={handleAceptar} className={styles.aceptarButton}>
              Aprobar
            </button>
            <button onClick={handleRechazar} className={styles.rechazarButton}>
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdentrabajoInfoAutorizacion;
