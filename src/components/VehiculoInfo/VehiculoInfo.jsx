import React, { useState } from 'react';
import styles from './VehiculoInfo.module.css';
import imagen from '../../assets/img/imagen.jpg';

const VehiculoInfo = ({ data, onUpdate = () => {} }) => {

  data["PLACA"] = "TLL961"
  data["PROVEEDORCONTRATO"] = "[Fecha o 'Sin contrato']"
  data["CLIENTE"] = "[Nombre del cliente] (Si está alquilado, si no 'Disponible')"
  data["CLIENTECONTRATO"] = "[Fecha o 'No alquilado']"
  data["ESTADOOPERATIVIDAD"] = "[Disponible / En Taller / En Afectación]"

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);  // Nuevo estado para el modal de imagen
  const [formData, setFormData] = useState({
    nombre: data["NOMBRE_COMPLETO"] || "",
    tipoIdentificacion: data["TIPO_IDENTIFICACION"] || "",
    numeroIdentificacion: data["NUMERO_IDENTIFICACION"] || "",
    correo: data["CORREO_ELECTRONICO"] || "",
    telefono: data["TELEFONO"] || ""
  });

  const [imageFile, setImageFile] = useState(null);  // Estado para la imagen

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);  // Al seleccionar una imagen, guardamos el archivo en el estado
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí no realizamos ninguna llamada a la API, simplemente actualizamos los datos localmente
    console.log('Datos actualizados:', formData);
    onUpdate(formData); // Se simula la actualización de datos
    setIsModalOpen(false); // Cierra el modal luego de la actualización
  };

  return (
    <div className={styles['contenedor-info-vehiculo']}>
      <div className={styles['contenedor-info-vehiculo-imagen']}>
        <img src={data["URL_IMAGEN"] || imagen } alt={data["PLACA"]} />
        <button className={styles['boton-editar-imagen']} onClick={() => setIsImageModalOpen(true)}>
          Cambiar Imagen
        </button>
      </div>
      <div className={styles['contenedor-info-contenido']}>
        <div className={styles['contenedor-info-contenido-titulo']}>
          <h2>{data["PLACA"]}</h2>
          <button className={styles['boton-editar']} onClick={() => setIsModalOpen(true)}>
            Editar
          </button>
        </div>
        <div className={styles['contenedor-info-contenido-detalles']}>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Proveedor</span>
            <span>{data["Proveedor"]}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Vence Contrato Proveedor</span>
            <span>{data["PROVEEDORCONTRATO"]}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Cliente</span>
            <span>{data["CLIENTE"]}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Vence Alquiler</span>
            <span>{data["CLIENTECONTRATO"]}</span>
          </div>
          <div className={styles['contenedor-info-contenido-detalles-item']}>
            <span>Estado Operativo</span>
            <span>{data["ESTADOOPERATIVIDAD"]}</span>
          </div>
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Editar Usuario</h2>
            <form onSubmit={handleSubmit}>
              <label>Nombre Completo:</label>
              <input 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleInputChange} 
                required 
              />

              <label>Tipo Identificación:</label>
              <input 
                type="text" 
                name="tipoIdentificacion" 
                value={formData.tipoIdentificacion} 
                onChange={handleInputChange} 
                required 
              />

              <label>Número Identificación:</label>
              <input 
                type="text" 
                name="numeroIdentificacion" 
                value={formData.numeroIdentificacion} 
                onChange={handleInputChange} 
                required 
              />

              <label>Correo Electrónico:</label>
              <input 
                type="email" 
                name="correo" 
                value={formData.correo} 
                onChange={handleInputChange} 
                required 
              />

              <label>Teléfono:</label>
              <input 
                type="text" 
                name="telefono" 
                value={formData.telefono} 
                onChange={handleInputChange} 
                required 
              />

              <div className={styles.modalButtons}>
                <button type="submit" className={styles.saveButton}>Guardar</button>
                <button type="button" className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CAMBIO DE IMAGEN */}
      {isImageModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Cambiar Imagen de Usuario</h2>
            <form>
              <label>Cargar Nueva Imagen:</label>
              <input 
                type="file" 
                name="URL_IMAGEN" 
                onChange={handleImageChange} 
                accept="image/jpeg, image/png" 
              />
              <div className={styles.modalButtons}>
                <button type="button" className={styles.saveButton} onClick={() => setIsImageModalOpen(false)}>Guardar Imagen</button>
                <button type="button" className={styles.cancelButton} onClick={() => setIsImageModalOpen(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiculoInfo;
