import React, { useState, useEffect } from "react";
import styles from "../../../styles/ModalFormulario.module.css";
import Loader from "../../../components/Loader/Loader";
import Tabla from "../../../components/Tabla/Tabla";
import { transformarDatos } from "../../../utils/transformarDatos";
import { apiManager } from "../../../api/apiManager";
import ModalAgregarPlanMantenimiento from "../../../components/ModalAgregarPlanMantenimiento/ModalAgregarPlanMantenimiento";

// Mapeo de las claves de la BD a nombres legibles en la tabla
const mapeoColumnas = {
  nombre_rutina: "Nombre de Rutina",
  comentario: "Comentario",
  autor: "Autor",
  fecha_registro: "Fecha de Registro"
};

const botonesAcciones = [
  { nombre: "Ver", link: "/gestion/plan-mantenimiento/ver/", icono: "fas fa-eye", color: "blue" },
  // Puedes agregar botones para editar o eliminar según tus necesidades.
];

function PlanesMantenimiento() {
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para obtener los planes de mantenimiento desde la API
  const obtenerPlanes = async () => {
    try {
      setCargando(true);
      // Se asume que apiManager.planesMantenimiento() realiza la petición GET a /plan-mantenimiento
      const response = await apiManager.planesMantenimiento();
      console.log("Planes:", response);
      setPlanes(response);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener los planes de mantenimiento:", error);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerPlanes();
  }, []);

  // Se refresca la lista al cerrar el modal
  const handleModalClose = () => {
    setMostrarModal(false);
    obtenerPlanes();
  };

  if (cargando) {
    return <Loader />;
  }

  if (planes.length === 0) {
    return (
      <div className="contenedor1">
        <div className="contenedor2">
        <h2 className={styles.titulo}>Lista de Planes de Mantenimiento</h2>
        <button onClick={() => setMostrarModal(true)} className={styles.addButton3}>
          Agregar Plan de Mantenimiento
        </button>
        {mostrarModal && <ModalAgregarPlanMantenimiento cerrarModal={handleModalClose} />}
      </div>
      </div>
    );
  }

  const datosTransformados = transformarDatos(planes, mapeoColumnas);
  const columnasVisibles = Object.values(mapeoColumnas);

  return (
    <div className="contenedor1">
      <div className="contenedor2">
      <h2 className={styles.titulo}>Lista de Planes de Mantenimiento</h2>
      <Tabla
        datos={datosTransformados}
        columnasVisibles={columnasVisibles}
        mostrarAcciones={true}
        columnaAccion="plan_mantenimiento_id"  // Clave primaria del plan
        botonesAccion={botonesAcciones}
        habilitarExportacion={true}
        nombreExcel={"Lista_planes_mantenimiento"}
        filasPorPagina={5}
      >
        <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
          Agregar Plan de Mantenimiento
        </button>
      </Tabla>
      {mostrarModal && <ModalAgregarPlanMantenimiento cerrarModal={handleModalClose} />}
    </div>
    </div>
  );
}

export default PlanesMantenimiento;
