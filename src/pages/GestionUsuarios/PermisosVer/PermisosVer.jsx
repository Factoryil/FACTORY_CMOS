import React, { useState, useEffect } from "react";
import styles from "../../../styles/ModalFormulario.module.css";
import Tabla from "../../../components/Tabla/Tabla";
import { transformarDatos } from "../../../utils/transformarDatos"; 
import ModalAgregarUsuario from "../../../components/ModalAgregarUsuario/ModalAgregarUsuario";
import api from "../../../services/apiService"; 
import Loader from "../../../components/Loader/Loader";
import { useParams } from "react-router-dom";

// Mapeo de las claves originales a los nombres que queremos mostrar en la tabla
const mapeoColumnas = {
  NOMBRE_COMPLETO: "Nombre Completo",
  CORREO_ELECTRONICO: "Correo Electrónico",
  NOMBRE_ROL: "Rol",
  USERNAME: "Usuario"
};

const botonesAcciones = [
  { nombre: "Ver", link: "/gestion/contactos/ver/", icono: "fas fa-eye", color: "blue" }
];

function PermisosVer() {
  const { id } = useParams(); // Extraemos el ID del permiso desde la URL
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState(""); 

  // Función para obtener los usuarios relacionados con el permiso
  const obtenerUsuarios = async () => {
    try {
      setCargando(true);
      const response = await api.get(`/union-usuarios-permisos/permiso/${id}`); // API para obtener usuarios con este permiso
      if (response.data.length === 0) {
        setError("No se encontraron usuarios con este permiso.");
      } else {
        setUsuarios(response.data);
        console.log(response.data);
        
      }
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setError("Hubo un error al obtener los usuarios.");
      setCargando(false);
    }
  };

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    obtenerUsuarios(); 
  }, [id]);

  // Cuando se cierra el modal tras agregar un usuario, refrescamos la lista
  const handleModalClose = () => {
    setMostrarModal(false);
    obtenerUsuarios(); 
  };

  if (cargando) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // Transformamos los datos usando la función definida
  const datosTransformados = transformarDatos(usuarios, mapeoColumnas);

  // Las columnas visibles son los valores mapeados
  const columnasVisibles = Object.values(mapeoColumnas);

  return (
    <div className={styles.usuarios}>
      <h2 className={styles.titulo}>Usuarios con el permiso {usuarios[0]?.nombre_permiso}</h2>

      {usuarios.length === 0 ? (
       <div>
          <button onClick={() => setMostrarModal(true)} className={styles.addButton3}>
            Agregar Usuario
          </button>
          <p className={styles.sinUsuarios}>No hay usuarios asignados a este permiso.</p> 
       </div>
      ) : (
        <Tabla
          datos={datosTransformados}
          columnasVisibles={columnasVisibles}
          mostrarAcciones={true}
          columnaAccion="ID_CONTACTOS"
          botonesAccion={botonesAcciones}
          habilitarExportacion={true}
          columnasOmitidas={["ID_CONTACTOS", "nombre_permiso", "id_permiso"]}
          nombreExcel={"Lista_usuarios_permiso"}
          filasPorPagina={5}
        > 
          <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
            Agregar Usuario
          </button>
        </Tabla>
      )}

      {mostrarModal && (
        <ModalAgregarUsuario cerrarModal={handleModalClose} />
      )}
    </div>
  );
}

export default PermisosVer;
