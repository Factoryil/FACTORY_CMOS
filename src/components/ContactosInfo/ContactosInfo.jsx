import React, { useState, useEffect } from 'react';
import styles from './ContactosInfo.module.css';
import imagen from '../../assets/img/imagen.jpg';
// import ModalEditarContactoInfo from '../ModalEditarContactoInfo/ModalEditarContactoInfo';
// import ModalEditarContactoImagen from '../ModalEditarContactoImagen/ModalEditarContactoImagen';
import { url } from '../../data/url'; // Asegúrate de que la ruta sea la correcta
import { apiManager } from '../../api/apiManager';

const ContactosInfo = ({ id }) => {

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
  
  // Asegúrate de que handleUpdate está correctamente definido y se pasa al ModalEditarContactoImagen
  const handleUpdate = async () => {
    try {
      const response = await api.get(`/contactos/${id}`);
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener la información actualizada:", error);
    }
  };
  

  if (loading) {
    return <div>Cargando información...</div>;
  }

  if (!data) {
    return <div>No se encontró información para este contacto.</div>;
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
          Cambiar Imagen
        </button>
      </div>
      <div className={styles['contenedor-info-contenido']}>
        <div className={styles['contenedor-info-contenido-titulo']}>
          <h2>{data["NOMBRE_COMPLETO"]}</h2>
          <button
            className={styles['boton-editar']}
            onClick={() => setMostrarModal(true)}
          >
            Editar
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
        </div>
      </div>

      {/* Modal de edición de la información */}
      {/* {mostrarModal && (
        <ModalEditarContactoInfo
          cerrarModal={() => setMostrarModal(false)}
          contactData={data}
          onUpdate={handleUpdate} // Llamar a handleUpdate después de la actualización
        />
      )} */}

      {/* Modal para cambiar la imagen */}
      {/* {isImageModalOpen && (
        <ModalEditarContactoImagen
          cerrarModal={() => setIsImageModalOpen(false)}
          contactId={id}
          onUpdate={handleUpdate}  // Asegurar que se pasa el prop correctamente
        />
      )} */}

    </div>
  );
};

export default ContactosInfo;
