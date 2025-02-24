import React, { useState, useEffect } from "react";
import styles from "../../../styles/ModalFormulario.module.css";
import Loader from "../../../components/Loader/Loader";
import Tabla from "../../../components/Tabla/Tabla";
import { transformarDatos } from "../../../utils/transformarDatos";
import { apiManager } from "../../../api/apiManager";
import ModalAgregarVehiculo from "../../../components/ModalAgregarVehiculo/ModalAgregarVehiculo";

// Mapeo de las claves originales a los nombres que queremos mostrar en la tabla
const mapeoColumnas = {
  placa: "placa",
  ultimo_cliente: "cliente",
  marca: "marca",
 modelo: "modelo",
 servicio: "servicio",
  ultimo_propietario: "propietario",
  vencimiento_cliente: "vencimiento cliente",
  vencimiento_propietario: "vencimiento propietario",
  estado_propietario: "estado propietario",
  estado_cliente: "estado cliente"
};

const botonesAcciones = [
  { nombre: "Ver", link: "/gestion/vehiculos/ver/", icono: "fas fa-eye", color: "blue" },
  // { nombre: "Editar", icono: "fas fa-edit", color: "orange" },
  // { nombre: "Eliminar", icono: "fas fa-trash", color: "red" }
];

function Vehiculo() {
  const [etiquetas, setEtiquetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para obtener las etiquetas desde la API
  const obtenerEtiquetas = async () => {
    try {
      setCargando(true);
      const response = await apiManager.vehiculos();
      console.log(response);
      
      setEtiquetas(response);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener etiquetas:", error);
      setCargando(false);
    }
  };

  // Cargar las etiquetas al montar el componente
  useEffect(() => {
    obtenerEtiquetas();
  }, []);

  // Cuando se cierra el modal tras agregar una etiqueta, refrescamos la lista
  const handleModalClose = () => {
    setMostrarModal(false);
    obtenerEtiquetas();
  };

  if (cargando) {
    return <Loader />;
  }

  // Verificar si hay datos para mostrar la tabla
  if (etiquetas.length === 0) {
    return (
      <div className={styles.etiquetas}>
        <h2 className={styles.titulo}>Lista de Vehiculos</h2>
        <button onClick={() => setMostrarModal(true)} className={styles.addButton3}>
          Agregar Etiqueta
        </button>

        {mostrarModal && <ModalAgregarVehiculo cerrarModal={handleModalClose} />}
      </div>
    );
  }

  // Transformamos los datos usando la función definida
  const datosTransformados = transformarDatos(etiquetas, mapeoColumnas);

  // Las columnas visibles son los valores mapeados
  const columnasVisibles = Object.values(mapeoColumnas);

  return (
    <div className="contenedor1">
      <div className="contenedor2">
      <h2 className={styles.titulo}>Lista de Vehiculos</h2>


      <Tabla
        datos={datosTransformados}
        columnasVisibles={columnasVisibles}
        mostrarAcciones={true}
        columnaAccion="placa"
        botonesAccion={botonesAcciones}
        habilitarExportacion={true}
        nombreExcel={"Lista_etiquetas"}
        filasPorPagina={5}
      >
        <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
          Agregar Vehiculo
        </button>
      </Tabla>

      {mostrarModal && <ModalAgregarVehiculo cerrarModal={handleModalClose} />}
    </div>
    </div>
  );
}

export default Vehiculo;
