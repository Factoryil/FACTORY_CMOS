import React, { useState, useEffect } from "react";
import styles from "../../../styles/ModalFormulario.module.css";
import Loader from "../../../components/Loader/Loader";
import Tabla from "../../../components/Tabla/Tabla";
import { transformarDatos } from "../../../utils/transformarDatos";
import { apiManager } from "../../../api/apiManager";
import ModalAgregarMantenimiento from "../../../components/ModalAgregarMantenimiento/ModalAgregarMantenimiento";

// Mapeo de las claves originales a los nombres que queremos mostrar en la tabla
const mapeoColumnas = {
  mantenimiento_id: "ID",
  trabajo: "Trabajo",
  tipo_mantenimiento: "Tipo de Mantenimiento"
};

const botonesAcciones = [
  { nombre: "Ver", link: "/gestion/mantenimiento/ver/", icono: "fas fa-eye", color: "blue" },
  // Puedes agregar más botones, por ejemplo para editar o eliminar, según lo requieras.
];

function Mantenimientos() {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para obtener los mantenimientos desde la API
  const obtenerMantenimientos = async () => {
    try {
      setCargando(true);
      // Se asume que apiManager.mantenimientos() retorna los datos de la tabla "mantenimiento"
      const response = await apiManager.mantenimientos(); 
      console.log(response);
      setMantenimientos(response);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener mantenimientos:", error);
      setCargando(false);
    }
  };

  // Cargar los mantenimientos al montar el componente
  useEffect(() => {
    obtenerMantenimientos();
  }, []);

  // Cuando se cierra el modal tras agregar un mantenimiento, refrescamos la lista
  const handleModalClose = () => {
    setMostrarModal(false);
    obtenerMantenimientos();
  };

  if (cargando) {
    return <Loader />;
  }

  // Si no hay datos, mostramos un mensaje con la opción de agregar un mantenimiento
  if (mantenimientos.length === 0) {
    return (
      <div className={styles.etiquetas}>
        <h2 className={styles.titulo}>Lista de Mantenimientos</h2>
        <button onClick={() => setMostrarModal(true)} className={styles.addButton3}>
          Agregar Mantenimiento
        </button>
        {mostrarModal && <ModalAgregarMantenimiento cerrarModal={handleModalClose} />}
      </div>
    );
  }

  // Transformamos los datos usando la función definida
  const datosTransformados = transformarDatos(mantenimientos, mapeoColumnas);
  // Las columnas visibles son los valores mapeados
  const columnasVisibles = Object.values(mapeoColumnas);

  return (
    <div className={styles.etiquetas}>
      <h2 className={styles.titulo}>Lista de Mantenimientos</h2>
      <Tabla
        datos={datosTransformados}
        columnasVisibles={columnasVisibles}
        mostrarAcciones={true}
        columnaAccion="mantenimiento_id" // clave primaria de cada registro
        botonesAccion={botonesAcciones}
        habilitarExportacion={true}
        nombreExcel={"Lista_mantenimientos"}
        filasPorPagina={5}
      >
        <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
          Agregar Mantenimiento
        </button>
      </Tabla>
      {mostrarModal && <ModalAgregarMantenimiento cerrarModal={handleModalClose} />}
    </div>
  );
}

export default Mantenimientos;
