import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "../../../styles/ModalFormulario.module.css";
import Loader from "../../../components/Loader/Loader";
import Tabla from "../../../components/Tabla/Tabla";
import { transformarDatos } from "../../../utils/transformarDatos";
import { apiManager } from "../../../api/apiManager";
import ModalAsignarMantenimiento from "../../../components/ModalAsignarMantenimiento/ModalAsignarMantenimiento";

// Mapeo de claves para la tabla
const mapeoColumnas = {
  periodicidad_km: "Periodicidad (km)",
  trabajo: "Trabajo"
};

function PlanMantenimientoVer() {
  // Obtenemos el ID del plan desde la URL
  const { planId } = useParams();
  const [asignaciones, setAsignaciones] = useState([]);
  const [planInfo, setPlanInfo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para obtener la información del plan y sus asignaciones
  const obtenerAsignaciones = async () => {
    try {
      setCargando(true);
      // Se asume que apiManager.obtenerAsignacionesPlan llama a GET /plan-mantenimiento/ver/:planId
      // y retorna un objeto con { planInfo, asignaciones }
      const response = await apiManager.obtenerAsignacionesPlan(planId);
      setPlanInfo(response.planInfo);
      // Si no hay asignaciones, se establece un arreglo vacío para evitar errores
      setAsignaciones(response.asignaciones || []);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener asignaciones:", error);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerAsignaciones();
  }, [planId]);

  const handleModalClose = () => {
    setMostrarModal(false);
    obtenerAsignaciones();
  };

  if (cargando) {
    return <Loader />;
  }

  // Si no hay datos, se usa un arreglo vacío
  const datosTransformados =
    asignaciones && asignaciones.length > 0
      ? transformarDatos(asignaciones, mapeoColumnas)
      : [];

  return (
    <div className={styles.etiquetas}>
      {/* Información del plan para usar en el título */}
      {planInfo && (
        <div className={styles.planInfo}>
          <h2 className={styles.titulo}>{planInfo.nombre_rutina}</h2>
          {planInfo.comentario && <p>{planInfo.comentario}</p>}
          <p>
            <strong>Autor:</strong> {planInfo.autor} |{" "}
            <strong>Fecha de Registro:</strong> {planInfo.fecha_registro}
          </p>
        </div>
      )}

      {/* Si existen asignaciones, se muestra la tabla; de lo contrario, se muestra un mensaje */}
      {datosTransformados.length > 0 ? (
        <Tabla
          datos={datosTransformados}
          columnasVisibles={Object.values(mapeoColumnas)}
          habilitarExportacion={true}
          nombreExcel={`Asignaciones_Plan_${planId}`}
          filasPorPagina={5}
        >
          <button
            onClick={() => setMostrarModal(true)}
            className={styles.addButton2}
          >
            Asignar Mantenimiento
          </button>
        </Tabla>
      ) : (
        <div>
          <button
            onClick={() => setMostrarModal(true)}
            className={styles.addButton3}
            >
            Asignar Mantenimiento
          </button>
            <p className={styles.pcentro}>No hay asignaciones registradas.</p>
        </div>
      )}

      {mostrarModal && (
        <ModalAsignarMantenimiento
          cerrarModal={handleModalClose}
          planId={planId}
        />
      )}
    </div>
  );
}

export default PlanMantenimientoVer;
