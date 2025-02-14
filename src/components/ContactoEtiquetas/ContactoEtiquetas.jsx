import React, { useState, useEffect } from "react";
import styles from "./ContactoEtiquetas.module.css";
import api from "../../services/apiService"; // Asegúrate de que este archivo API esté configurado

function ContactoEtiquetas({ contactoID }) {
  console.log(contactoID);
  
  const [etiquetas, setEtiquetas] = useState([]); // Todas las etiquetas disponibles
  const [etiquetasUsuario, setEtiquetasUsuario] = useState([]); // Etiquetas asignadas al contacto
  const [cargando, setCargando] = useState(true);

  // Función para obtener todas las etiquetas disponibles
  const obtenerEtiquetas = async () => {
    try {
      const response = await api.get("/etiquetas"); // Endpoint para obtener todas las etiquetas
      setEtiquetas(response.data);
    } catch (error) {
      console.error("Error al obtener las etiquetas:", error);
    }
  };

  // Función para obtener las etiquetas asignadas al usuario/contacto
  const obtenerEtiquetasUsuario = async () => {
    try {
      const response = await api.get(`/union-etiquetas/contacto/${contactoID}`); // Endpoint para obtener las etiquetas de un contacto
      setEtiquetasUsuario(response.data); // Establecer las etiquetas activas para este contacto
    } catch (error) {
      console.error("Error al obtener las etiquetas del usuario:", error);
    }
  };

  // Función para cambiar el estado de una etiqueta para el contacto
  const toggleEtiqueta = async (idEtiqueta) => {
    try {
      const existeEtiqueta = etiquetasUsuario.some((etiqueta) => etiqueta.id_etiqueta === idEtiqueta);
      
      if (existeEtiqueta) {
        // Desactivar etiqueta
        await api.delete(`/union-etiquetas/${idEtiqueta}/${contactoID}`);
      } else {
        // Activar etiqueta usando POST /union-etiquetas con body {id_etiqueta, id_contacto}
        await api.post("/union-etiquetas", { id_etiqueta: idEtiqueta, id_contacto: contactoID });
      }

      // Refrescar las etiquetas del contacto después de la actualización
      obtenerEtiquetasUsuario();
    } catch (error) {
      console.error("Error al cambiar el estado de la etiqueta:", error);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    obtenerEtiquetas(); // Obtener todas las etiquetas
    obtenerEtiquetasUsuario(); // Obtener las etiquetas del contacto
    setCargando(false); // Finaliza el estado de carga
  }, [contactoID]); // Solo se recarga si cambia el contacto

  if (cargando) {
    return <div>Cargando...</div>; // Cargando mientras obtenemos los datos
  }

  return (
    <div className={styles.container}>
      <br />
      <h3 className={styles.title}>Gestión de Etiquetas</h3>
      <br />
      <ul className={styles.lista}>
        {etiquetas.map((etiqueta) => {
          const estaActiva = etiquetasUsuario.some(
            (etiquetaUsuario) => etiquetaUsuario.id_etiqueta === etiqueta.id
          );
          return (
            <li key={etiqueta.id} className={styles.item}>
              {etiqueta.nombre}
              <button
                className={`${styles.toggleButton} ${estaActiva ? styles.on : styles.off}`}
                onClick={() => toggleEtiqueta(etiqueta.id)}
              >
                {estaActiva ? "ON" : "OFF"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ContactoEtiquetas;
