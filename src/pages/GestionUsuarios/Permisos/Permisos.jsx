import React, { useState, useEffect } from "react";
import styles from "../../../styles/ModalFormulario.module.css";
import Loader from "../../../components/Loader/Loader";
import ModalAgregarPermiso from "../../../components/ModalAgregarPermiso/ModalAgregarPermiso";
import Tabla from "../../../components/Tabla/Tabla";
import { transformarDatos } from "../../../utils/transformarDatos";
import { apiManager } from "../../../api/apiManager";

// Mapeo de las claves originales a los nombres que queremos mostrar en la tabla
const mapeoColumnas = {
  MODULO: "Modulo",
  TIPO: "Tipo",
  DESCRIPCION: "Descripción"
};

// const botonesAcciones = [
//   { nombre: "Ver", link: "/gestion/permisos/ver/", icono: "fas fa-eye", color: "blue" }
// ];

function Permisos() {
  const [permisos, setPermisos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para obtener los permisos desde la API
  const obtenerPermisos = async () => {
    try {
      setCargando(true);
      const response = await apiManager.permisos();
      console.log(response);
      
      setPermisos(response);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener permisos:", error);
      setCargando(false);
    }
  };

  // Cargar los permisos al montar el componente
  useEffect(() => {
    obtenerPermisos();
  }, []);

  // Cuando se cierra el modal tras agregar un permiso, refrescamos la lista
  const handleModalClose = () => {
    setMostrarModal(false);
    obtenerPermisos();
  };

  if (cargando) {
    return <Loader />;
  }

  // Verificar si hay datos para mostrar la tabla
  if (permisos.length === 0) {
    return (
      <div className={styles.permisos}>
        <h2 className={styles.titulo}>Lista de Permisos</h2>
        <button onClick={() => setMostrarModal(true)} className={styles.addButton3}>
          Agregar Permiso
        </button>

        {mostrarModal && <ModalAgregarPermiso cerrarModal={handleModalClose} />}
      </div>
    );
  }

  // Transformamos los datos usando la función definida
  const datosTransformados = transformarDatos(permisos, mapeoColumnas);

  // Las columnas visibles son los valores mapeados
  const columnasVisibles = Object.values(mapeoColumnas);

  return (
    <div className="contenedor1">
      <div className="contenedor2">
      <h2 className={styles.titulo}>Lista de Permisos</h2>

      <Tabla
        datos={datosTransformados}
        columnasVisibles={columnasVisibles}
        // mostrarAcciones={true}
        columnaAccion="ID_PERMISO"
        // botonesAccion={botonesAcciones}
        habilitarExportacion={true}
        nombreExcel={"Lista_permisos"}
        filasPorPagina={5}
      >
        <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
          Agregar Permiso
        </button>
      </Tabla>

      {mostrarModal && <ModalAgregarPermiso cerrarModal={handleModalClose} />}
    </div>
    </div>
  );
}

export default Permisos;
