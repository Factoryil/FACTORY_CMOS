import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import Loader from "../Loader/Loader";
import Tabla from "../Tabla/Tabla";
import { transformarDatos } from "../../utils/transformarDatos";
import { apiManager } from "../../api/apiManager";
import ModalAgregarMantenimientoEjecutar from "../ModalAgregarMantenimientoEjecutar/ModalAgregarMantenimientoEjecutar";

// Mapeo de claves para mostrar en la tabla
const mapeoColumnas = {
  trabajo: "trabajo",
  tipo_mantenimiento: "tipo mantenimiento",
  // mantenimiento_id: "Mantenimiento",
  // vehiculo_id: "Vehículo",
  periodicidad_km: "Periodicidad (km)",
  odometro_ultima: "Odómetro Último"
};

function MantenimientosEjecutar({ placa }) {
  const [ejecuciones, setEjecuciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para obtener las ejecuciones (ya retornadas filtradas por la API)
  const obtenerEjecuciones = async () => {
    try {
      setCargando(true);
      // Se asume que apiManager.ejecucionesMantenimiento(placa) ya retorna los registros correspondientes a esa placa
      const response = await apiManager.ejecucionesMantenimiento(placa);
      console.log(response);
      
      setEjecuciones(response);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener ejecuciones de mantenimiento:", error);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerEjecuciones();
  }, [placa]);

  const handleModalClose = () => {
    setMostrarModal(false);
    obtenerEjecuciones();
  };

  if (cargando) {
    return <Loader />;
  }

  const datosTransformados = transformarDatos(ejecuciones, mapeoColumnas);
  const columnasVisibles = Object.values(mapeoColumnas);

  return (
    <div className={styles.ordenes}>
      <h2 className={styles.titulo}>Plan de Mantenimientos del Vehículo</h2>
      {ejecuciones.length === 0 ? (
        <div>
          <p>No hay ejecuciones registradas.</p>
          <button onClick={() => setMostrarModal(true)} className={styles.addButton3}>
            Agregar Ejecución de Mantenimiento
          </button>
        </div>
      ) : (
        <Tabla
          datos={datosTransformados}
          columnasVisibles={columnasVisibles}
          habilitarExportacion={true}
          nombreExcel={"Ejecucion_Mantenimiento"}
          filasPorPagina={5}
        >
          <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
            Agregar Ejecución de Mantenimiento
          </button>
        </Tabla>
      )}
      {mostrarModal && (
        <ModalAgregarMantenimientoEjecutar cerrarModal={handleModalClose} placa={placa} />
      )}
    </div>
  );
}

export default MantenimientosEjecutar;
