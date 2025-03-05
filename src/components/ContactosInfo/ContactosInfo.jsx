import React, { useState, useEffect } from 'react';
import styles from './ContactosInfo.module.css';
import imagen from '../../assets/img/imagen.jpg';
import ModalEditarContactoInfo from '../ModalEditarContactoInfo/ModalEditarContactoInfo';
import ModalEditarContactoImagen from '../ModalEditarContactoImagen/ModalEditarContactoImagen';
import { url } from '../../data/url'; // Asegúrate de que la ruta sea la correcta
import { apiManager } from '../../api/apiManager';
import { useNavigate } from "react-router-dom";

const ContactosInfo = ({ id }) => {
  const navigate = useNavigate();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const response = await apiManager.contactosID(id);
        setData(response);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener la información del contacto:', error);
        setLoading(false);
      }
    };
  
    fetchContact();
  }, [id]);
  
  // Función para actualizar la información del contacto después de editar
  const handleUpdate = async () => {
    try {
      const response = await apiManager.contactosID(id);
      setData(response);
    } catch (error) {
      console.error("Error al obtener la información actualizada:", error);
    }
  };
  

  if (loading) {
    return <div>Cargando información...</div>;
  }

  if (!data) {
    navigate(`/NotFound`);
    return null;
  }

  const imageUrl = data["URL_IMAGEN"] ? `${url}/${data["URL_IMAGEN"]}` : imagen;

  return (
    <div className={styles['contenedor-info-vehiculo']}>
      <div className={styles['contenedor-info-vehiculo-imagen']}>
        <img src={imageUrl} alt={data["NOMBRE_COMPLETO"]} />
        <button
          className={styles['boton-editar-imagen']}
          onClick={() => setIsImageModalOpen(true)}
        >
          <i className="fas fa-edit"></i> Cambiar Imagen
        </button>
      </div>
      <div className={styles['contenedor-info-contenido']}>
        <div className={styles['contenedor-info-contenido-titulo']}>
          <h2>{data["NOMBRE_COMPLETO"]}</h2>
          <button
            className={styles['boton-editar']}
            onClick={() => setMostrarModal(true)}
          >
            <i className="fas fa-edit"></i> Editar Info
          </button>
        </div>
        <div className={styles['contenedor-info-contenido-detalles']}>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Tipo Identificación</span>
            <span>{data["TIPO_IDENTIFICACION"]}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Número Identificación</span>
            <span>{data["NUMERO_IDENTIFICACION"]}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Correo</span>
            <a href={`mailto:${data["CORREO_ELECTRONICO"]}`}>
              {data["CORREO_ELECTRONICO"]}
            </a>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Teléfono</span>
            <span>{data["TELEFONO"]}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Ubicación</span>
            <span>{data["UBICACION"]}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Dirección</span>
            <span>{data["DIRECCION"]}</span>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <ModalEditarContactoInfo
          cerrarModal={() => setMostrarModal(false)}
          contactData={data}
          onUpdate={handleUpdate} // Llamar a handleUpdate después de la actualización
        />
      )}

      {isImageModalOpen && (
        <ModalEditarContactoImagen
          cerrarModal={() => setIsImageModalOpen(false)}
          contactId={id}
          onUpdate={handleUpdate}  // Asegurar que se pasa el prop correctamente
        />
      )}

    </div>
  );
};

export default ContactosInfo;
