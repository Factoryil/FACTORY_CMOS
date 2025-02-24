import React, { useState, useEffect } from "react";
import styles from "../../../styles/ModalFormulario.module.css";
import Loader from "../../../components/Loader/Loader";
import Tabla from "../../../components/Tabla/Tabla";
import { transformarDatos } from "../../../utils/transformarDatos";
import { apiManager } from "../../../api/apiManager";
import ModalAgregarRol from "../../../components/ModalAgregarRol/ModalAgregarRol";
// import ModalAgregarRol from "../../../components/ModalAgregarRol";
// Mapeo de las claves originales a los nombres que queremos mostrar en la tabla
const mapeoColumnas = {
  NOMBRE_ROL: "Rol",
  DESCRIPCION: "Descripción"
};

// const botonesAcciones = [
//   { nombre: "Ver", link: "/gestion/roles/ver/", icono: "fas fa-eye", color: "blue" },
//   // Puedes descomentar y adaptar los demás botones según necesites
//   // { nombre: "Editar", icono: "fas fa-edit", color: "orange" },
//   // { nombre: "Eliminar", icono: "fas fa-trash", color: "red" }
// ];

function Roles() {
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para obtener los roles desde la API
  const obtenerRoles = async () => {
    try {
      setCargando(true);
      const response = await apiManager.roles(); 
      console.log(response);
      
      setRoles(response);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener roles:", error);
      setCargando(false);
    }
  };

  // Cargar los roles al montar el componente
  useEffect(() => {
    obtenerRoles();
  }, []);

  // Cuando se cierra el modal tras agregar un rol, refrescamos la lista
  const handleModalClose = () => {
    setMostrarModal(false);
    obtenerRoles();
  };

  if (cargando) {
    return <Loader />;
  }

  // Verificar si hay datos para mostrar la tabla
  if (roles.length === 0) {
    return (
      <div className={styles.etiquetas}>
        <h2 className={styles.titulo}>Lista de Roles</h2>
        <button onClick={() => setMostrarModal(true)} className={styles.addButton3}>
          Agregar Rol
        </button>

        {mostrarModal && <ModalAgregarRol cerrarModal={handleModalClose} />}
      </div>
    );
  }

  // Transformamos los datos usando la función definida
  const datosTransformados = transformarDatos(roles, mapeoColumnas);

  // Las columnas visibles son los valores mapeados
  const columnasVisibles = Object.values(mapeoColumnas);

  return (
    <div className="contenedor1">
      <div className="contenedor2">
      <h2 className={styles.titulo}>Lista de Roles</h2>

      <Tabla
        datos={datosTransformados}
        columnasVisibles={columnasVisibles}
        // mostrarAcciones={true}
        columnaAccion="ID_ROL"
        // botonesAccion={botonesAcciones}
        habilitarExportacion={true}
        nombreExcel={"Lista_roles"}
        filasPorPagina={5}
      >
        <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
          Agregar Rol
        </button>
      </Tabla>

      {mostrarModal && <ModalAgregarRol cerrarModal={handleModalClose} />}
    </div>
    </div>
  );
}

export default Roles;
