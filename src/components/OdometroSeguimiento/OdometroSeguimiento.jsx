import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import Loader from "../Loader/Loader";
import Tabla from "../Tabla/Tabla";
import { apiManager } from "../../api/apiManager";

// Mapeo de columnas
const mapeoColumnas = {
  FECHA_REGISTRO: "Fecha de Registro",
  LECTURA: "Lectura (Km)",
  REGISTRADO_POR: "Registrado por",
};

// Componente de seguimiento de odómetro
function OdometroSeguimiento({ placa }) {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatosOdometro = async () => {
      try {
        setCargando(true);
        const response = await apiManager.obtenerOdometroPorPlaca(placa); 
        console.log("Datos odómetro:", response);
        setDatos(response);
      } catch (error) {
        console.error("Error al obtener datos del odómetro:", error);
      } finally {
        setCargando(false);
      }
    };

    if (placa) {
      obtenerDatosOdometro();
    }
  }, [placa]);

  if (cargando) return <Loader />;

  if (datos.length === 0) {
    return <p>No hay registros de odómetro para este vehículo.</p>;
  }

  // Transformar los datos para que solo incluyan las columnas necesarias
  const datosTransformados = datos.map(item => ({
    "Fecha de Registro": item.FECHA_REGISTRO,
    "Lectura (Km)": item.LECTURA,
    "Registrado por": item.REGISTRADO_POR,
  }));

  return (
    <div className={styles.etiquetas}>
      <h2 className={styles.titulo}>Historial de Odómetro</h2>
      <Tabla
        datos={datosTransformados}
        columnasVisibles={Object.values(mapeoColumnas)}
        mostrarAcciones={false}
        habilitarExportacion={true}
        nombreExcel={`Historial_Odometro_${placa}`}
        filasPorPagina={5}
      />
    </div>
  );
}

export default OdometroSeguimiento;
