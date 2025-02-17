import React, { useState, useEffect } from "react";
import styles from "../../../styles/ModalFormulario.module.css";
import Tabla from "../../../components/Tabla/Tabla";
import { transformarDatos } from "../../../utils/transformarDatos";
import ModalAgregarUsuario from "../../../components/ModalAgregarUsuario/ModalAgregarUsuario";
import { apiManager } from "../../../api/apiManager";

const botonesAcciones = [
  { nombre: "Ver", link: "/gestion/contactos/ver/", icono: "fas fa-eye", color: "blue" }
];

const mapeoColumnas = {
  NOMBRE_CONTACTO: 'Nombre Contacto',
  USERNAME: "Nombre de Usuario",
  CORREO_ELECTRONICO: "Correo Electrónico",
  NOMBRE_ROL: "Rol",
};

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para obtener los usuarios
  const obtenerUsuarios = async () => {
    try {
      const response = await apiManager.usuarios();
      setUsuarios(response);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setError("Error al cargar los usuarios.");
    } finally {
      setCargando(false);
    }
  };

  // Se ejecuta al montar el componente
  useEffect(() => {
    obtenerUsuarios();
  }, []);

  if (cargando) {
    return <div>Cargando usuarios...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const datosTransformados = transformarDatos(usuarios, mapeoColumnas);
  const columnasVisibles = Object.values(mapeoColumnas);

  return (
    <div className={styles.usuarios}>
      <h2 className={styles.titulo}>Lista de Usuarios</h2>
      
      <Tabla
        datos={datosTransformados}
        columnasOmitidas={["ID_USUARIO", "URL_IMAGEN"]}
        columnasVisibles={columnasVisibles}
        mostrarAcciones={true}
        columnaAccion="ID_USUARIO"
        botonesAccion={botonesAcciones}
        habilitarExportacion={true}
        nombreExcel={"Lista_usuarios"}
        filasPorPagina={5}
      >
        <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
          Agregar Usuario
        </button>
      </Tabla>

      {mostrarModal && (
        // Al cerrar el modal, volvemos a llamar a obtenerUsuarios para actualizar la lista.
        <ModalAgregarUsuario 
          cerrarModal={() => {
            setMostrarModal(false);
            obtenerUsuarios();
          }} 
        />
      )}
    </div>
  );
}

export default Usuarios;
