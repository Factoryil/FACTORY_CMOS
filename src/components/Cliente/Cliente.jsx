import React, { useState, useEffect } from 'react';
import styles from './Cliente.module.css';
import { apiManager } from '../../api/apiManager';
import Loader from '../Loader/Loader';
import ModalEditarClienteVehiculo from '../ModalEditarClienteVehiculo/ModalEditarClienteVehiculo';
import ModalAgregarCliente from '../ModalAgregarCliente/ModalAgregarCliente';
import { url } from '../../data/url';

const Cliente = ({ id }) => {
  
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModalEditarInfo, setMostrarModalEditarInfo] = useState(false);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const clientesResponse = await apiManager.getClientesVehiculo(id);
        
        setClientes(clientesResponse);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener clientes:', error);
        setLoading(false);
      }
    };

    fetchClientes();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const clientesResponse = await apiManager.getClientesVehiculo(id);
      
      setClientes(clientesResponse);
    } catch (error) {
      console.error("Error al actualizar la información de clientes:", error);
    }
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

  if (loading) return <Loader />;

  return (
    <div className={styles.clientesContainer}>
      <div className={styles.clientesSection}>
        <div className={styles.header}>
          <h3>Historial de Clientes</h3>
          <button
            className={styles.addClienteButton}
            onClick={() => setMostrarModalAgregar(true)}
          >
            <i className="fas fa-plus"></i> Agregar Cliente
          </button>
        </div>
        {clientes.length === 0 ? (
          <p>No se han asignado clientes a este vehículo.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.clientesTable}>
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Estado</th>
                  <th>Fecha Emisión</th>
                  <th>Fecha Vencimiento</th>
                  <th>Período</th>
                  <th>Valor</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.ID_UNION_VEHICULO_Y_CLIENTE}>
                    <td>{cliente.NOMBRE_COMPLETO}</td>
                    <td>{cliente.ESTADO}</td>
                    <td>{cliente.FECHA_EMISION}</td>
                    <td>{cliente.FECHA_VENCIMIENTO}</td>
                    <td>{cliente.PERIODO}</td>
                    <td>{cliente.VALOR}</td>
                    <td className={styles.tbbotones}>
                      <button className={styles.actionButton} onClick={() => handleVerContacto(cliente)} title="Ver Contacto">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className={styles.actionButton} onClick={() => handleVerPdf(cliente)} title="Ver PDF">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className={styles.actionButton} onClick={() => handleEditarInfo(cliente)} title="Editar Información">
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        <ModalAgregarCliente
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