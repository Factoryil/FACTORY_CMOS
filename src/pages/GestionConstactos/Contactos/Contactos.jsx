import React, { useState, useEffect } from "react";
import styles from "../../../styles/ModalFormulario.module.css";
import Tabla from "../../../components/Tabla/Tabla";
import { transformarDatos } from "../../../utils/transformarDatos"; // Función para transformar datos
import ModalAgregarContacto from "../../../components/ModalAgregarContacto/ModalAgregarContacto";
import Loader from "../../../components/Loader/Loader";
import { apiManager } from "../../../api/apiManager";

// Mapeo de las claves originales a los nombres que queremos mostrar en la tabla
const mapeoColumnas = {
  NOMBRE_COMPLETO: "Nombre Completo",
  CORREO_ELECTRONICO: "Correo Electrónico",
  TELEFONO: "Teléfono",
  TIPO_IDENTIFICACION: "Tipo de ID",
  NUMERO_IDENTIFICACION: "Número de Identificación"
};

const botonesAcciones = [
  { nombre: "Ver", link: "/gestion/contactos/ver/", icono: "fas fa-eye", color: "blue" }
];

function Contactos() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para obtener los contactos desde la API
  const obtenerContactos = async () => {
    try {
      setCargando(true);
      const response = await apiManager.contactos();
      
      // Suponiendo que la API retorna un array de contactos en response.data
      setContactos(response);
      
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener contactos:", error);
      
      setCargando(false);
    }
  };

  // Cargar los contactos al montar el componente
  useEffect(() => {
    obtenerContactos();
  }, []);

  // Cuando se cierra el modal tras agregar un contacto, refrescamos la lista
  const handleModalClose = () => {
    setMostrarModal(false);
    obtenerContactos();
  };

  if (cargando) {
    return <Loader />;
  }

  // Transformamos los datos usando la función definida
  const datosTransformados = transformarDatos(contactos, mapeoColumnas);

  // Las columnas visibles son los valores mapeados
  const columnasVisibles = Object.values(mapeoColumnas);

  if (contactos.length === 0) {
    return (
      <div className={styles.contactos}>
        <h2 className={styles.titulo}>Lista de Contactos</h2>
        <button onClick={() => setMostrarModal(true)} className={styles.addButton3}>
          Agregar Contacto
        </button>

        {mostrarModal && (<ModalAgregarContacto cerrarModal={handleModalClose} /> )}
      </div>
    );
  }

  return (
    <div className={styles.contactos}>
      <h2 className={styles.titulo}>Lista de Contactos</h2>

      <Tabla
        datos={datosTransformados}
        columnasVisibles={columnasVisibles}
        mostrarAcciones={true}
        columnaAccion="ID_CONTACTOS"
        botonesAccion={botonesAcciones}
        habilitarExportacion={true}
        columnasOmitidas={["ID_CONTACTOS", "URL_IMAGEN"]}
        nombreExcel={"Lista_contactos"}
        filasPorPagina={5}
      >
        <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
          Agregar Contacto
        </button>
      </Tabla>


      {mostrarModal && (
        <ModalAgregarContacto cerrarModal={handleModalClose} />
      )}
    </div>
  );
}

export default Contactos;
