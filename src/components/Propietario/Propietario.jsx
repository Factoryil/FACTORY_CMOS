import React, { useState, useEffect } from 'react';
import styles from './Propietario.module.css';
import { apiManager } from '../../api/apiManager';
import Loader from '../Loader/Loader';
import ModalEditarPropietarioVehiculo from '../ModalEditarPropietarioVehiculo/ModalEditarPropietarioVehiculo';
import ModalAgregarPropietario from '../ModalAgregarPropietario/ModalAgregarPropietario';
import { url } from '../../data/url';

const Propietario = ({ id }) => {
  const [propietarios, setPropietarios] = useState([]); // Historial de propietarios
  const [loading, setLoading] = useState(true);
  const [mostrarModalEditarInfo, setMostrarModalEditarInfo] = useState(false);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState(null);

  useEffect(() => {
    const fetchPropietarios = async () => {
      try {
        setLoading(true);
        const propietariosResponse = await apiManager.getPropietariosVehiculo(id);
        console.log(propietariosResponse);
        setPropietarios(propietariosResponse);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener propietarios:', error);
        setLoading(false);
      }
    };

    fetchPropietarios();
  }, [id]);

  // Función para refrescar el listado después de editar o agregar
  const handleUpdate = async () => {
    try {
      const propietariosResponse = await apiManager.getPropietariosVehiculo(id);
      setPropietarios(propietariosResponse);
    } catch (error) {
      console.error("Error al actualizar la información de propietarios:", error);
    }
  };

  // Abre PDF en una nueva pestaña (si existe)
  const handleVerPdf = (propietario) => {
    if (propietario.URL_PDF) {
      window.open(url + "/" + propietario.URL_PDF, '_blank', 'noopener,noreferrer');
    } else {
      alert("No hay PDF disponible para este registro.");
    }
  };

  // Abre la información del contacto en una nueva pestaña
  const handleVerContacto = (propietario) => {
    if (propietario.ID_CONTACTOS) {
      window.open("/gestion/contactos/ver/" + propietario.ID_CONTACTOS, '_blank', 'noopener,noreferrer');
    } else {
      alert("No se encontró contacto.");
    }
  };

  // Abre el modal para editar información del registro
  const handleEditarInfo = (propietario) => {
    setPropietarioSeleccionado(propietario);
    setMostrarModalEditarInfo(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.propietariosContainer}>
      <div className={styles.propietariosSection}>
        <div className={styles.header}>
          <h3>Historial de Propietarios</h3>
          <button
            className={styles.addPropietarioButton}
            onClick={() => setMostrarModalAgregar(true)}
          >
            <i className="fas fa-plus"></i> Agregar Propietario
          </button>
        </div>
        {propietarios.length === 0 ? (
          <p>No se han asignado propietarios a este vehículo.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.propietariosTable}>
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
                {propietarios.map((propietario) => (
                  <tr key={propietario.ID_UNION_VEHICULO_Y_PROPIETARIO}>
                    <td>{propietario.NOMBRE_COMPLETO}</td>
                    <td>{propietario.ESTADO}</td>
                    <td>{propietario.FECHA_EMISION}</td>
                    <td>{propietario.FECHA_VENCIMIENTO}</td>
                    <td>{propietario.PERIODO}</td>
                    <td>{propietario.VALOR}</td>
                    <td className={styles.tbbotones}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleVerContacto(propietario)}
                        title="Ver Contacto"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleVerPdf(propietario)}
                        title="Ver PDF"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleEditarInfo(propietario)}
                        title="Editar Información"
                      >
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

      {mostrarModalEditarInfo && propietarioSeleccionado && (
        <ModalEditarPropietarioVehiculo
          cerrarModal={() => {
            setMostrarModalEditarInfo(false);
            handleUpdate();
          }}
          propietarioData={propietarioSeleccionado}
        />
      )}

      {mostrarModalAgregar && (
        <ModalAgregarPropietario
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

export default Propietario;
