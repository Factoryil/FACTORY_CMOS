import React, { useState, useEffect } from "react";
import styles from "./DocumentosVehiculos.module.css";
import { useNavigate } from "react-router-dom";
import Tabla from "../../../components/Tabla/Tabla";

// Datos estáticos de ejemplo
const documentosEstaticos = [
  { id: 1, tipo_documento: "RUT", numero_documento: "213242342", fecha_emision: "2024-01-10", fecha_vencimiento: "", estado: "Vigente" },
  { id: 2, tipo_documento: "CERTIFICADO BANCARIO", numero_documento: "1231233321", fecha_emision: "2024-01-10", fecha_vencimiento: "", estado: "Vigente" },
  
];

const botonesAcciones = [
  { nombre: "Ver", link: "/gestion/documentos/ver/", icono: "fas fa-eye", color: "blue" }
];

function DocumentosVehiculos() {
  const navigate = useNavigate();
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoDocumento, setNuevoDocumento] = useState({
    NOMBRE: "",
    TIPO: "",
    FECHA_SUBIDA: new Date().toISOString().split("T")[0], // Fecha actual
  });
  const [archivo, setArchivo] = useState(null); // Estado para el archivo

  useEffect(() => {
    setDocumentos(documentosEstaticos);
    setCargando(false);
  }, []);

  if (cargando) {
    return <div>Cargando documentos...</div>;
  }

  const manejarCambio = (e) => {
    setNuevoDocumento({
      ...nuevoDocumento,
      [e.target.name]: e.target.value
    });
  };

  const manejarCambioArchivo = (e) => {
    setArchivo(e.target.files[0]); // Guardar el archivo seleccionado
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
    setArchivo(null); // Resetear el archivo
  };

  return (
    <div className={styles.documentos}>
      <h2 className={styles.titulo}>Lista de Documentos De Vehiculos</h2>

      {documentos.length > 0 ? (
        <Tabla
          datos={documentos}
          columnasOmitidas={["id"]}
          columnasVisibles={["tipo_documento", "numero_documento", "fecha_emision", "fecha_vencimiento","estado"]}
          mostrarAcciones={true}
          columnaAccion="ID_DOCUMENTO"
          botonesAccion={botonesAcciones}
          filasPorPagina={3}
          habilitarPaginacion={true}
          habilitarBusqueda={true}
          habilitarOrdenamiento={true}
          habilitarExportacion={true}
          nombreExcel={"datos_tabla"}
          habilitarTotalRegistros={true}
        >
          <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
            Agregar Documento
          </button>
        </Tabla>
      ) : (
        <p>No hay documentos disponibles.</p>
      )}

      {mostrarModal && (
        <div className={styles.modalOverlay} onClick={(e) => {
          if (e.target.classList.contains(styles.modalOverlay)) {
            setMostrarModal(false);
          }
        }}>
          <div className={styles.modal}>
            <h2>Subir Nuevo Documento</h2>
            <form onSubmit={manejarEnvio}>
              <label htmlFor="NOMBRE">Nombre</label>
              <input
                type="text"
                id="NOMBRE"
                name="NOMBRE"
                value={nuevoDocumento.NOMBRE}
                onChange={manejarCambio}
                required
              />
              <label htmlFor="TIPO">Tipo</label>
              <select
                id="TIPO"
                name="TIPO"
                value={nuevoDocumento.TIPO}
                onChange={manejarCambio}
                required
              >
                <option value="">Seleccione un tipo</option>
                <option value="PDF">PDF</option>
                <option value="Imagen">Imagen</option>
                <option value="Word">Word</option>
              </select>
              <label htmlFor="ARCHIVO">Subir Archivo</label>
              <input
                type="file"
                id="ARCHIVO"
                name="ARCHIVO"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                onChange={manejarCambioArchivo}
                required
              />
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.saveButton}>
                  Guardar
                </button>
                <button type="button" className={styles.cancelButton} onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentosVehiculos;
