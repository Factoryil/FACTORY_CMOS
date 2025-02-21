import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalAgregarOdometro({ cerrarModal }) {
  // Estado para almacenar los datos del nuevo registro de odómetro.
  // No se recibe el id del vehículo por props, ya que se seleccionará desde el select.
  const [nuevoOdometro, setNuevoOdometro] = useState({
    id_vehiculo: "",
    lectura: ""
  });
  
  // Estado para el archivo de imagen (opcional)
  const [imagen, setImagen] = useState(null);

  // Estado para almacenar la lista de vehículos consultados desde la API
  const [vehiculos, setVehiculos] = useState([]);

  // Consultar vehículos al montar el componente
  useEffect(() => {
    const obtenerVehiculos = async () => {
      try {
        // Se asume que apiManager.vehiculos() retorna la lista de vehículos
        const response = await apiManager.vehiculos();
        console.log(response);
        
        setVehiculos(response);
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      }
    };

    obtenerVehiculos();
  }, []);

  // Manejo de cambios en los inputs de texto y número.
  const manejarCambio = (e) => {
    setNuevoOdometro({
      ...nuevoOdometro,
      [e.target.name]: e.target.value,
    });
  };

  // Manejo del cambio en el input de archivo para la imagen.
  const manejarCambioImagen = (e) => {
    setImagen(e.target.files[0]);
  };

  // Manejo del envío del formulario.
  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Validar campos requeridos.
    if (!nuevoOdometro.lectura || !nuevoOdometro.id_vehiculo) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }
    
    // Utilizamos FormData para enviar los datos junto con el archivo (si existe).
    const formData = new FormData();
    formData.append("id_vehiculo", nuevoOdometro.id_vehiculo);
    formData.append("lectura", nuevoOdometro.lectura);
    if (imagen) {
      formData.append("URL_IMAGEN", imagen);
    }
    
    try {
      const response = await apiManager.addOdometro(formData);
      console.log("Registro de odómetro agregado:", response);
      cerrarModal();
    } catch (error) {
      console.error("Error al agregar registro de odómetro:", error);
    }
  };

  // Permite cerrar el modal si se hace clic fuera de la caja del modal.
  const manejarCerrarModal = (e) => {
    if (e.target === e.currentTarget) {
      cerrarModal();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={manejarCerrarModal}>
      <div className={styles.modal}>
        <h2>Agregar Registro de Odómetro</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="id_vehiculo">Vehículo</label>
          <select
            id="id_vehiculo"
            name="id_vehiculo"
            value={nuevoOdometro.id_vehiculo}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un vehículo</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                {vehiculo.placa}
              </option>
            ))}
          </select>

          <label htmlFor="lectura">Lectura</label>
          <input
            type="number"
            id="lectura"
            name="lectura"
            value={nuevoOdometro.lectura}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="URL_IMAGEN">Imagen (opcional)</label>
          <input
            type="file"
            id="URL_IMAGEN"
            name="URL_IMAGEN"
            accept="image/*"
            onChange={manejarCambioImagen}
          />

          <div className={styles.modalButtons}>
            <button type="submit" className={styles.saveButton}>
              Guardar
            </button>
            <button type="button" className={styles.cancelButton} onClick={cerrarModal}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAgregarOdometro;
