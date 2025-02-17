import React, { useState, useEffect } from 'react';
import styles from './FichaTecnica.module.css';
import { apiManager } from '../../api/apiManager';
import Loader from '../Loader/Loader';
import ModalEditarVehiculoInfo from '../ModalEditarVehiculoInfo/ModalEditarVehiculoInfo';

const FichaTecnica = ({ id }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        setLoading(true);
        // Asegúrate de que el API retorne los datos del vehículo con los campos indicados
        const response = await apiManager.vehiculoIDFichaTecnica(id);
        
        setData(response);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener la información del vehículo:', error);
        setLoading(false);
      }
    };

    fetchVehiculo();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await apiManager.vehiculoIDFichaTecnica(id);
      setData(response);
    } catch (error) {
      console.error("Error al obtener la información actualizada:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!data) {
    return <div>No se encontró información para este vehículo.</div>;
  }

  return (
    <div className={styles['contenedor-info-vehiculo']}>
      <div className={styles['contenedor-info-contenido']}>
        <div className={styles['contenedor-info-contenido-titulo']}>
          <h2>Ficha Técnica</h2>
          <button 
            className={styles['boton-editar']} 
            onClick={() => setMostrarModal(true)}
          >
            Editar
          </button>
        </div>
        <div className={styles['contenedor-info-contenido-detalles']}>
          {/* Información Básica */}
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Placa</span>
            <span>{data.placa}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Licencia de Tránsito</span>
            <span>{data.licencia_transito}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Propietario</span>
            <span>{data.propietario}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Tipo Identificación</span>
            <span>{data.tipo_identificacion}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Identificación</span>
            <span>{data.identificacion}</span>
          </div>

          {/* Características del Vehículo */}
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Marca</span>
            <span>{data.marca}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Línea</span>
            <span>{data.linea}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Modelo</span>
            <span>{data.modelo}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Color</span>
            <span>{data.color}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Servicio</span>
            <span>{data.servicio}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Clase de Vehículo</span>
            <span>{data.clase_vehiculo}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Tipo de Carrocería</span>
            <span>{data.tipo_carroceria}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Combustible</span>
            <span>{data.combustible}</span>
          </div>

          {/* Detalles Técnicos */}
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Cilindrada (cc)</span>
            <span>{data.cilindrada_cc}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Capacidad</span>
            <span>{data.capacidad}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Número de Motor</span>
            <span>{data.numero_motor}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>VIN</span>
            <span>{data.vin}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Número de Chasis</span>
            <span>{data.numero_chasis}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Puertas</span>
            <span>{data.puertas}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Fecha de Expedición</span>
            <span>{data.fecha_expedicion}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Fecha de Matrícula</span>
            <span>{data.fecha_matricula}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Organismo de Tránsito</span>
            <span>{data.organismo_transito}</span>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <ModalEditarVehiculoInfo
          cerrarModal={() => setMostrarModal(false)}
          vehiculoData={data}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default FichaTecnica;
