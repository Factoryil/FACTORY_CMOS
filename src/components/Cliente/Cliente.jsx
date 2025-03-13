import React, { useState, useEffect } from 'react';
import styles from '../../styles/ModalFormulario.module.css';
import { apiManager } from '../../api/apiManager';
import Loader from '../Loader/Loader';
import ModalEditarClienteVehiculo from '../ModalEditarClienteVehiculo/ModalEditarClienteVehiculo';
import ModalAgregarClienteEnVehiculo from '../ModalAgregarClienteEnVehiculo/ModalAgregarClienteEnVehiculo';
import { url } from '../../data/url';
import Tabla from '../Tabla/Tabla';

const mapeoColumnas = {
  NOMBRE_COMPLETO: "Nombre Completo",
  ESTADO: "Estado",
  FECHA_EMISION: "Fecha Emision",
  FECHA_VENCIMIENTO: "Fecha Vencimiento",
  PERIODO: "Período",
  VALOR: "Valor"
};

const Cliente = ({ id }) => {
  const [activeTab, setActiveTab] = useState("actual");
  const [clientesActuales, setClientesActuales] = useState([]);
  const [clientesHistoricos, setClientesHistoricos] = useState([]);
  const [paginaActualActual, setPaginaActualActual] = useState(1);
  const [paginaHistorico, setPaginaHistorico] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mostrarModalEditarInfo, setMostrarModalEditarInfo] = useState(false);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const handleTabClick = (tab) => setActiveTab(tab);

  const obtenerClientesActuales = async () => {
    try {
      setLoading(true);
      const response = await apiManager.getClientesVehiculo(id);
      // Si fuese necesario filtrar clientes actuales:
      // const actuales = response.filter(cliente => cliente.tipo === 'actual');
      setClientesActuales(Array.isArray(response) ? response : []);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener clientes actuales:", error);
      setLoading(false);
    }
  };

  const obtenerClientesHistoricos = async () => {
    try {
      setLoading(true);
      const response = await apiManager.getClientesVehiculo(id);
      // Si hubiese que filtrar históricos, se podría hacer aquí:
      setClientesHistoricos(Array.isArray(response) ? response : []);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener clientes históricos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerClientesActuales();
    obtenerClientesHistoricos();
  }, [id]);

  const handleUpdate = () => {
    obtenerClientesActuales();
    obtenerClientesHistoricos();
  };

  const handleVerPdf = (cliente) => {
    if (cliente.URL_PDF) {
      window.open(url + "/" + cliente.URL_PDF, '_blank', 'noopener,noreferrer');
    } else {
      alert("No hay PDF disponible para este registro.");
    }
  };

  const handleVerContacto = (cliente) => {
    if (cliente.ID_CONTACTOS) {
      window.open("/gestion/contactos/ver/" + cliente.ID_CONTACTOS, '_blank', 'noopener,noreferrer');
    } else {
      alert("No se encontró contacto.");
    }
  };

  const handleEditarInfo = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarModalEditarInfo(true);
  };

  const botonesAcciones = [
    {
      nombre: "Ver Contacto",
      icono: "fas fa-eye",
      color: "blue",
      funcionAccion: (fila) => handleVerContacto(fila),
    },
    {
      nombre: "Ver PDF",
      icono: "fas fa-eye",
      color: "blue",
      funcionAccion: (fila) => handleVerPdf(fila),
    },
    {
      nombre: "Editar",
      icono: "fas fa-edit",
      color: "blue",
      funcionAccion: (fila) => handleEditarInfo(fila),
    },
  ];

  return (
    <div className={styles.propietariosContainer}>
      <h3 className={styles.titulo}>Clientes</h3>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "actual" ? styles.activeTab : ""}`}
          onClick={() => handleTabClick("actual")}
        >
          Actuales
        </button>
        <button
          className={`${styles.tab} ${activeTab === "historico" ? styles.activeTab : ""}`}
          onClick={() => handleTabClick("historico")}
        >
          Históricos
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === "actual" ? (
          <>
            {loading ? (
              <Loader />
            ) : clientesActuales.length > 0 ? (
              <Tabla
                datos={clientesActuales}
                mapeoColumnas={mapeoColumnas}
                columnasVisibles={Object.values(mapeoColumnas)}
                habilitarExportacion={true}
                nombreExcel={"Clientes_Actuales"}
                filasPorPagina={5}
                incluirPaginacionEnURL={false}
                paginaActualInicial={paginaActualActual}
                onCambiarPagina={setPaginaActualActual}
                mostrarAcciones={true}
                botonesAccion={botonesAcciones}
              >
                <button className={styles.addButton2} onClick={() => setMostrarModalAgregar(true)}>
                  Agregar Cliente
                </button>
              </Tabla>
            ) : (
              <div>
                <p>No hay clientes actuales.</p>
                <button className={styles.addButton3} onClick={() => setMostrarModalAgregar(true)}>
                  Agregar Cliente
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {loading ? (
              <Loader />
            ) : clientesHistoricos.length > 0 ? (
              <Tabla
                datos={clientesHistoricos}
                mapeoColumnas={mapeoColumnas}
                columnasVisibles={Object.values(mapeoColumnas)}
                habilitarExportacion={true}
                nombreExcel={"Clientes_Historicos"}
                filasPorPagina={5}
                incluirPaginacionEnURL={false}
                paginaActualInicial={paginaHistorico}
                onCambiarPagina={setPaginaHistorico}
                mostrarAcciones={true}
                botonesAccion={botonesAcciones}
              />
            ) : (
              <div>
                <p>No hay clientes históricos.</p>
              </div>
            )}
          </>
        )}
      </div>

      {mostrarModalEditarInfo && clienteSeleccionado && (
        <ModalEditarClienteVehiculo
          cerrarModal={() => {
            setMostrarModalEditarInfo(false);
            handleUpdate();
          }}
          clienteData={clienteSeleccionado}
        />
      )}

      {mostrarModalAgregar && (
        <ModalAgregarClienteEnVehiculo
          cerrarModal={() => {
            setMostrarModalAgregar(false);
            handleUpdate();
          }}
          vehiculoId={id}
        />
      )}
    </div>
  );
};

export default Cliente;
