import React, { useState, useEffect } from "react";
import styles from "../../../styles/ModalFormulario.module.css";
import Tabla from "../../../components/Tabla/Tabla";
import { transformarDatos } from "../../../utils/transformarDatos"; // Función para transformar datos
import ModalAgregarContacto from "../../../components/ModalAgregarContacto/ModalAgregarContacto";
import Loader from "../../../components/Loader/Loader";
import { useParams } from "react-router-dom";

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

function EtiquetasVer() {
  const { id } = useParams(); // Extraemos el id de la URL (de la etiqueta seleccionada)
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState(""); // Estado para manejar errores

  // Función para obtener los contactos relacionados con la etiqueta
  const obtenerContactos = async () => {
    try {
      setCargando(true);
      const response = await api.get(`/union-etiquetas/etiqueta/${id}`); // Suponiendo que la API tiene este endpoint
      if (response.data.length === 0) {
        // setError("No se encontraron contactos para esta etiqueta.");
      } else {
        setContactos(response.data); // Se guardan los contactos obtenidos
      }
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener contactos:", error);
      setCargando(false);
    }
  };

  // Cargar los contactos al montar el componente
  useEffect(() => {
    obtenerContactos(); // Se obtienen los contactos cada vez que cambia el id de la etiqueta
  }, [id]);

  // Cuando se cierra el modal tras agregar un contacto, refrescamos la lista
  const handleModalClose = () => {
    setMostrarModal(false);
    obtenerContactos(); // Refrescar la lista de contactos
  };

  if (cargando) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>; // Mostrar mensaje de error si ocurre
  }

  // Transformamos los datos usando la función definida
  const datosTransformados = transformarDatos(contactos, mapeoColumnas);

  // Las columnas visibles son los valores mapeados
  const columnasVisibles = Object.values(mapeoColumnas);

  return (
    <div className={styles.contactos}>
      <h2 className={styles.titulo}>Lista de Contactos con la etiqueta {contactos[0]?.nombre_etiqueta}</h2>

      {contactos.length === 0 ? (
       <div>
          <button onClick={() => setMostrarModal(true)} className={styles.addButton3}>
            Agregar Contacto
          </button>
          <p className={styles.sinContactos}>No hay contactos asignados a esta etiqueta.</p> 
       </div>
      ) : (
        <Tabla
          datos={datosTransformados}
          columnasVisibles={columnasVisibles}
          mostrarAcciones={true}
          columnaAccion="id_contacto"
          botonesAccion={botonesAcciones}
          habilitarExportacion={true}
          columnasOmitidas={["id_contacto", "nombre_etiqueta", "id_etiqueta"]}
          nombreExcel={"Lista_contactos"}
          filasPorPagina={5}
        > 
              <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
                Agregar Contacto
              </button>
        </Tabla>
      )}



      {mostrarModal && (
        <ModalAgregarContacto cerrarModal={handleModalClose} />
      )}
    </div>
  );
}

export default EtiquetasVer;
