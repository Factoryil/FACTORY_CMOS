import React, { useState, useEffect } from "react";
import styles from "../../../styles/ModalFormulario.module.css";
import Tabla from "../../../components/Tabla/Tabla";
import { transformarDatos } from "../../../utils/transformarDatos";
import ModalAgregarUsuario from "../../../components/ModalAgregarUsuario/ModalAgregarUsuario";
import api from "../../../services/apiService"; // Importa el servicio API

const botonesAcciones = [
  { nombre: "Ver", link: "/gestion/contactos/ver/", icono: "fas fa-eye", color: "blue" }
];

// Mapeo de las claves originales a los nombres que queremos mostrar en la tabla
const mapeoColumnas = {
  NOMBRE_CONTACTO: 'Nombre Contacto',
  USERNAME: "Nombre de Usuario",
  CORREO_ELECTRONICO: "Correo Electrónico",
  NOMBRE_ROL: "Rol",
};

function Tablas() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await api.get("/usuarios");
        setUsuarios(response.data);
        
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setError("Error al cargar los usuarios.");
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuarios();
  }, []);

  if (cargando) {
    return <div>Cargando usuarios...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // Transformamos los datos usando la función definida
  const datosTransformados = transformarDatos(usuarios, mapeoColumnas);

  // Definimos las columnas visibles usando los valores mapeados (las claves transformadas)
  const columnasVisibles = Object.values(mapeoColumnas);

  return (
    <div className={styles.usuarios}>
      <h2 className={styles.titulo}>Lista de Tablas</h2>

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
        <ModalAgregarUsuario cerrarModal={() => setMostrarModal(false)} />
      )}
    </div>
  );
}

export default Tablas;
