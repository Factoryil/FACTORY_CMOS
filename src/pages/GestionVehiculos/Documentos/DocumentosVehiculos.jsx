import React, { useState, useEffect } from "react";
import styles from "./DocumentosVehiculos.module.css";
import { useParams } from "react-router-dom";
import { apiManager } from "../../../api/apiManager";
import Tabla from "../../../components/Tabla/Tabla";

const botonesAcciones = [
  { nombre: "Ver", link: "/gestion/documentos/ver/", icono: "fas fa-eye", color: "blue" }
];

const DocumentosVehiculos = () => {
  const { id } = useParams(); // 🚗 ID del vehículo desde la URL
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoServicio, setTipoServicio] = useState(""); // Pública o Particular
  const [documentosRequeridos, setDocumentosRequeridos] = useState([]);

  const [nuevoDocumento, setNuevoDocumento] = useState({
    NOMBRE: "",
    TIPO: "",
    FECHA_SUBIDA: new Date().toISOString().split("T")[0]
  });
  const [archivo, setArchivo] = useState(null);

  // Documentos por tipo de servicio
  const docsPublicos = [
    "RCC", "RCE", "PÓLIZA TODO RIESGO", "SOAT", "TECNICOMECHANICA", "TECNICOMECHANICA BIMENSUAL", "TARJETA DE OPERACIÓN", "LICENCIA DE TRÁNSITO"
  ];
  const docsParticulares = [
    "PÓLIZA TODO RIESGO", "SOAT", "TECNICOMECHANICA", "TECNICOMECHANICA BIMENSUAL", "LICENCIA DE TRÁNSITO"
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datosVehiculo = await apiManager.vehiculoIDFichaTecnica(id);
        const servicio = datosVehiculo?.servicio?.toUpperCase();
        setTipoServicio(servicio);

        if (servicio === "PUBLICA") {
          setDocumentosRequeridos(docsPublicos);
        } else if (servicio === "PARTICULAR") {
          setDocumentosRequeridos(docsParticulares);
        }

        // También puedes cargar documentos reales del backend si lo deseas
        setDocumentos([]);
      } catch (error) {
        console.error("Error al obtener el vehículo:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  const manejarCambio = (e) => {
    setNuevoDocumento({ ...nuevoDocumento, [e.target.name]: e.target.value });
  };

  const manejarCambioArchivo = (e) => {
    setArchivo(e.target.files[0]);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!archivo) {
      alert("Debe seleccionar un archivo.");
      return;
    }

    const nuevoDoc = {
      ID_DOCUMENTO: documentos.length + 1,
      ...nuevoDocumento,
      ARCHIVO: archivo,
    };

    setDocumentos([...documentos, nuevoDoc]);
    setMostrarModal(false);
    setArchivo(null);
  };

  if (cargando) return <div>Cargando documentos...</div>;

  return (
    <div className={styles.documentos}>
      <h2 className={styles.titulo}>Documentos del Vehículo</h2>

      {documentos.length > 0 ? (
        <Tabla
          datos={documentos}
          columnasOmitidas={["id"]}
          columnasVisibles={["tipo_documento", "numero_documento", "fecha_emision", "fecha_vencimiento", "estado"]}
          mostrarAcciones={true}
          columnaAccion="ID_DOCUMENTO"
          botonesAccion={botonesAcciones}
          filasPorPagina={5}
          habilitarPaginacion={true}
          habilitarBusqueda={true}
          habilitarOrdenamiento={true}
          habilitarExportacion={true}
          nombreExcel={"documentos_vehiculo"}
          habilitarTotalRegistros={true}
        >
          <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
            Agregar Documento
          </button>
        </Tabla>
      ) : (
        <p>No hay documentos aún para este vehículo.</p>
      )}

      {mostrarModal && (
        <div className={styles.modalOverlay} onClick={(e) => {
          if (e.target.classList.contains(styles.modalOverlay)) setMostrarModal(false);
        }}>
          <div className={styles.modal}>
            <h2>Subir Nuevo Documento ({tipoServicio})</h2>
            <form onSubmit={manejarEnvio}>
              <label htmlFor="NOMBRE">Documento</label>
              <select
                id="NOMBRE"
                name="NOMBRE"
                value={nuevoDocumento.NOMBRE}
                onChange={manejarCambio}
                required
              >
                <option value="">Seleccione...</option>
                {documentosRequeridos.map((doc, i) => (
                  <option key={i} value={doc}>{doc}</option>
                ))}
              </select>

              <label htmlFor="TIPO">Tipo de archivo</label>
              <select
                id="TIPO"
                name="TIPO"
                value={nuevoDocumento.TIPO}
                onChange={manejarCambio}
                required
              >
                <option value="">Seleccione...</option>
                <option value="PDF">PDF</option>
                <option value="Imagen">Imagen</option>
                <option value="Word">Word</option>
              </select>

              <label htmlFor="ARCHIVO">Subir archivo</label>
              <input
                type="file"
                id="ARCHIVO"
                name="ARCHIVO"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                onChange={manejarCambioArchivo}
                required
              />

              <div className={styles.modalButtons}>
                <button type="submit" className={styles.saveButton}>Guardar</button>
                <button type="button" className={styles.cancelButton} onClick={() => setMostrarModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentosVehiculos;
