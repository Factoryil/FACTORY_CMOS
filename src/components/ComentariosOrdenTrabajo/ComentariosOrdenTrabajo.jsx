import React, { useState } from "react";
import styles from "./ComentariosOrdenTrabajo.module.css";

const ComentariosOrdenTrabajo = () => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");

  const agregarComentario = () => {
    if (nuevoComentario.trim() === "") return;

    const comentario = {
      id: Date.now(),
      texto: nuevoComentario,
      fecha: new Date().toLocaleString(),
    };

    setComentarios([comentario, ...comentarios]);
    setNuevoComentario("");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Comentarios </h2>

      <div className={styles.comentariosContainer}>
        <textarea
          className={styles.textarea}
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          placeholder="Agregar un comentario..."
        />
        <button className={styles.boton} onClick={agregarComentario}>
          Agregar Comentario
        </button>
      </div>

      <div className={styles.historial}>
        <h3 className={styles.historialTitulo}>Historial de Comentarios</h3>
        {comentarios.length === 0 ? (
          <p className={styles.sinComentarios}>No hay comentarios aún.</p>
        ) : (
          <ul className={styles.listaComentarios}>
            {comentarios.map((comentario) => (
              <li key={comentario.id} className={styles.comentario}>
                <strong className={styles.fecha}>{comentario.fecha}</strong>
                <p className={styles.textoComentario}>{comentario.texto}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ComentariosOrdenTrabajo;
