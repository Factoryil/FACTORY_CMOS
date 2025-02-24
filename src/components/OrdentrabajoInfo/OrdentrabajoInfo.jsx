import React, { useState } from 'react';
import styles from './OrdentrabajoInfo.module.css';

const OrdentrabajoInfo = ({ data, OT }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para asignar una clase según el estado
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

  // Definimos el orden y la etiqueta de cada campo para mostrarlos ordenadamente
  const orderFields = [
    { label: "Orden Trabajo", key: "ID_OT" },
    { label: "Placa", key: "placa" },
    { label: "Odómetro", key: "odometro" },
    { label: "Fecha Registro", key: "FECHA_REGISTRO" },
    { label: "Fecha Orden", key: "FECHA_ORDEN" },
    { label: "Prioridad", key: "prioridad" },
    { label: "Fecha Programada", key: "FECHA_PROGRAMADA" },
    { label: "Autorización", key: "AUTORIZACION" },
    { label: "Observación", key: "observacion" },
    { label: "ID Aprobador", key: "ID_APROBADOR" },
    { label: "Motivo Rechazo", key: "MOTIVO_RECHAZO" },
    { label: "Estado Vehiculo", key: "estado_vehiculo" }
  ];

  const handleVerClick = () => {
    if (data && data.placa) {
      window.open(`/gestion/vehiculos/ver/${data.placa}`, '_blank');
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
            <button onClick={handleVerClick} className={styles.boton_editar1}>
              <i className="fas fa-eye"></i>
            </button>
            {data.placa} Orden trabajo # {data.ID_OT}{" "} -
            <span className={getEstadoClass(data.ESTADO)}>
              {data.ESTADO}
            </span>
            <button
              className={styles.moreOptionsButton}
              onClick={() => setMostrarModal(true)}
            >
              <i className="fas fa-ellipsis-h"></i>
            </button>
          </div>
        </div>
        <div className={styles['contenedor-info-contenido-detalles']}>
          {orderFields.map(({ label, key }) => (
            <div className={styles['contenedor-info-contenido-detalles-item']} key={key}>
              <span>{label}</span>
              <span>
                {data[key] !== null && data[key] !== "" ? data[key] : 'Sin información'}
              </span>
            </div>
          ))}
        </div>
      </div>
      {mostrarModal && (
        <div className={styles.modalOverlay} onClick={() => setMostrarModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Opciones</h2>
            <ul className={styles.optionsList}>
              <li onClick={() => { /* Acción para Editar */ setMostrarModal(false); }}>Cambiar Estado OT</li>
              <li onClick={() => { /* Acción para Eliminar */ setMostrarModal(false); }}>Cambiar Estado Vehiculo</li>
              <li onClick={() => { /* Otra opción */ setMostrarModal(false); }}>Remitir Autorizacion</li>
            </ul>
            <button className={styles.closeModalButton} onClick={() => setMostrarModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdentrabajoInfo;
