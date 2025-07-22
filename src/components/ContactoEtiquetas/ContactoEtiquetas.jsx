import React, { useState, useEffect } from "react";
import styles from "./ContactoEtiquetas.module.css";
import { apiManager } from "../../api/apiManager";

function ContactoEtiquetas({ contactoID, onEtiquetasUpdate }) {
  const [etiquetas, setEtiquetas] = useState([]); // Todas las etiquetas disponibles
  const [etiquetasUsuario, setEtiquetasUsuario] = useState([]); // Etiquetas asignadas al contacto
  const [cargando, setCargando] = useState(true);

  const obtenerEtiquetas = async () => {
    try {
      const response = await apiManager.etiquetas();
      setEtiquetas(response);
    } catch (error) {
      console.error("Error al obtener las etiquetas:", error);
    }
  };

  const obtenerEtiquetasUsuario = async () => {
    try {
      const response = await apiManager.unionDeEtiquetaContactoID(contactoID);
      setEtiquetasUsuario(response);
      // Notificamos al padre con la lista actualizada
      if (onEtiquetasUpdate) onEtiquetasUpdate(response);
    } catch (error) {
      console.error("Error al obtener las etiquetas del usuario:", error);
    }
  };

  const toggleEtiqueta = async (idEtiqueta) => {
    try {
      const existeEtiqueta = etiquetasUsuario.some(
        (etiqueta) => etiqueta.id_etiqueta === idEtiqueta
      );

      if (existeEtiqueta) {
        await apiManager.desactivarEtiquetaContacto(idEtiqueta, contactoID);
      } else {
        await apiManager.activarEtiquetaContacto({ id_etiqueta: idEtiqueta, id_contacto: contactoID });
      }
      // Obtenemos las etiquetas actualizadas y notificamos al padre
      const nuevasEtiquetasUsuario = await apiManager.unionDeEtiquetaContactoID(contactoID);
      setEtiquetasUsuario(nuevasEtiquetasUsuario);
      if (onEtiquetasUpdate) onEtiquetasUpdate(nuevasEtiquetasUsuario);
    } catch (error) {
      console.error("Error al cambiar el estado de la etiqueta:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "Etiquetas") {
      obtenerEtiquetas();
      obtenerEtiquetasUsuario();
      setCargando(false);
    }
  }, [contactoID, location.search]);

  if (cargando) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.container}>
      <br />
      <h3 className={styles.title}>FUNCION</h3>
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
