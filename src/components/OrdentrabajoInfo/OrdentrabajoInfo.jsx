import React, { useState, useEffect } from 'react';
import styles from './OrdentrabajoInfo.module.css';
import { apiManager } from '../../api/apiManager';

const OrdentrabajoInfo = ({ OT }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdenTrabajo = async () => {
      try {
        setLoading(true);
        const response = await apiManager.ordenTrabajoID(OT);
        console.log(response);
        
        // Si response ya es un objeto, asignarlo directamente:
        setData(response);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener la orden de trabajo:', error);
        setLoading(false);
      }
    };
  
    fetchOrdenTrabajo();
  }, [OT]);
  

  // Definimos el orden y la etiqueta de cada campo para mostrarlos ordenadamente
  const orderFields = [
    { label: "Orden Trabajo", key: "ID_OT" },
    { label: "Placa", key: "placa" },
    { label: "Odómetro", key: "odometro" },
    // { label: "ID Vehículo", key: "id_vehiculo" },
    { label: "Fecha Registro", key: "FECHA_REGISTRO" },
    { label: "Fecha Orden", key: "FECHA_ORDEN" },
    { label: "Prioridad", key: "prioridad" },
    { label: "Fecha Programada", key: "FECHA_PROGRAMADA" },
    { label: "Autorización", key: "AUTORIZACION" },
    { label: "Estado", key: "ESTADO" },
    { label: "Observación", key: "observacion" },
    { label: "ID Aprobador", key: "ID_APROBADOR" },
    // { label: "ID Cliente", key: "ID_CLIENTE" },
    // { label: "ID Taller", key: "ID_TALLER" },
    { label: "Motivo Rechazo", key: "MOTIVO_RECHAZO" }
  ];

  const handleVerClick = () => {
    // Abre en nueva pestaña la vista del vehículo asociado, usando la placa obtenida de la API
    window.open(`/gestion/vehiculos/ver/${data.placa}`, '_blank');
  };

  if (loading) {
    return <div>Cargando información de la orden de trabajo...</div>;
  }

  if (!data) {
    return <div>No se encontró información para esta orden de trabajo.</div>;
  }

  return (
    <div className={styles['contenedor-info-vehiculo']}>
      <div className={styles['contenedor-info-contenido']}>
        <div className={styles.headerTop}>
          <div className={styles.invoiceNumber}>
            <button onClick={handleVerClick}>
              <i className="fas fa-eye"></i>
            </button>
            {data.placa} Orden trabajo # {data.ID_OT}
          </div>
        </div>
        <div className={styles['contenedor-info-contenido-detalles']}>
          {orderFields.map(({ label, key }) => (
            <div className={styles['contenedor-info-contenido-detalles-item']} key={key}>
              <span>{label}</span>
              <span>{data[key] !== null && data[key] !== "" ? data[key] : 'Sin información'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdentrabajoInfo;
