import React, { useState, useEffect } from 'react';
import styles from './VehiculoInfo.module.css';
import imagen from '../../assets/img/imagen.jpg';
// import ModalEditarContactoInfo from '../ModalEditarContactoInfo/ModalEditarContactoInfo';
// import ModalEditarContactoImagen from '../ModalEditarContactoImagen/ModalEditarContactoImagen';
import { url } from '../../data/url'; // Asegúrate de que la ruta sea la correcta
import { apiManager } from '../../api/apiManager';
import ModalEditarVehiculoImagen from '../ModalEditarVehiculoImagen/ModalEditarVehiculoImagen';

const VehiculoInfo = ({ id }) => {
  // data["PLACA"] = "TLL961"
  // data["MARCA"] = "[Marca del vehículo]"
  // data["MODELO"] = "[Modelo del vehículo]"
  // data["SERVICIO"] = "[Servicio del vehículo]"
  // data["IMAGEN"] = "[URL de imagen del vehículo]"
  // data["ULTIMO_PROPIETARIO"] = "[Nombre del último propietario]"
  // data["VENCIMIENTO_PROPIETARIO"] = "[Fecha de vencimiento propietario]"
  // data["ESTADO_PROPIETARIO"] = "[Estado del propietario]"
  // data["ULTIMO_CLIENTE"] = "[Nombre del último cliente]"
  // data["VENCIMIENTO_CLIENTE"] = "[Fecha de vencimiento cliente]"
  // data["ESTADO_CLIENTE"] = "[Estado del cliente]"

  const [mostrarModal, setMostrarModal] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        setLoading(true);
        const response = await apiManager.vehiculoID(id);
        
        setData(response[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener la información del vehículo:', error);
        setLoading(false);
      }
    };

    fetchVehiculo();
  }, [id]);

  // Asegúrate de que handleUpdate está correctamente definido y se pasa al ModalEditarContactoImagen
  const handleUpdate = async () => {
    try {
      const response = await apiManager.vehiculoID(id);
      setData(response[0]);
    } catch (error) {
      console.error("Error al obtener la información actualizada:", error);
    }
  };

  if (loading) {
    return <div>Cargando información...</div>;
  }

  if (!data) {
    return <div>No se encontró información para este vehículo.</div>;
  }

  const imageUrl = data.imagen ? `${url}/${data.imagen}` : imagen;

  return (
    <div className={styles['contenedor-info-vehiculo']}>
      <div className={styles['contenedor-info-vehiculo-imagen']}>
        <img src={imageUrl} alt={data.PLACA} />
        <button
          className={styles['boton-editar-imagen']}
          onClick={() => setIsImageModalOpen(true)}
        >
          Cambiar Imagen
        </button>
      </div>
      <div className={styles['contenedor-info-contenido']}>
        <div className={styles['contenedor-info-contenido-titulo']}>
          <h2>{data.placa}</h2>
          {/* <button
            className={styles['boton-editar']}
            onClick={() => setMostrarModal(true)}
          >
            Editar
          </button> */}
        </div>
        <div className={styles['contenedor-info-contenido-detalles']}>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Marca</span>
            <span>{data.marca || 'Sin información'}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Modelo</span>
            <span>{data.modelo || 'Sin información'}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Servicio</span>
            <span>{data.servicio || 'Sin información'}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Último Propietario</span>
            <span>{data.ultimo_propietario || 'Sin información'}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Vencimiento Propietario</span>
            <span>{data.vencimiento_propietario || 'Sin información'}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Estado Propietario</span>
            <span>{data.estado_propietario || 'Sin información'}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Último Cliente</span>
            <span>{data.ultimo_cliente || 'Sin información'}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Vencimiento Cliente</span>
            <span>{data.vencimiento_cliente || 'Sin información'}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Estado Cliente</span>
            <span>{data.estado_cliente || 'Sin información'}</span>
          </div>
        </div>
      </div>

      {mostrarModal && (
        // <ModalEditarContactoInfo
        //   cerrarModal={() => setMostrarModal(false)}
        //   contactData={data}
        //   onUpdate={handleUpdate}
        // />
        <div>Modal de edición</div>
      )}

      {isImageModalOpen && (
        <ModalEditarVehiculoImagen
          cerrarModal={() => setIsImageModalOpen(false)}
          vehiculoId={data.id}
          onUpdate={handleUpdate}
        />
      )}

    </div>
  );
};

export default VehiculoInfo;
