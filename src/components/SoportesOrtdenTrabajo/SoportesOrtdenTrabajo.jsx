import React, { useState, useEffect } from "react";
import styles from "./SoportesOrtdenTrabajo.module.css";
import { apiManager } from "../../api/apiManager"; // Asegúrate de tener definidas las funciones getSoportes, uploadSoporte y deleteSoporte

const GaleriaImagenes = ({ OT }) => {
  const [soportes, setSoportes] = useState([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [esVideo, setEsVideo] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Al cambiar la OT se obtienen los soportes
  useEffect(() => {
    if (OT) {
      fetchSoportes();
    }
  }, [OT]);

  // Función para obtener los soportes y agregar el prefijo a cada URL
  const fetchSoportes = async () => {
    try {
      const response = await apiManager.getSoportes(OT);
      const supportsWithPrefix = response.map((support) => ({
        ...support,
        fullURL: `http://localhost/codevendix/${support.URL_ARCHIVO}`,
      }));
      setSoportes(supportsWithPrefix);
    } catch (error) {
      console.error("Error al obtener los soportes:", error);
    }
  };

  // Función para subir archivos a la API
  const handleFileSelect = async (event) => {
    const archivos = Array.from(event.target.files);
    const archivosValidos = archivos.filter((file) =>
      file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (!OT) {
      console.error("No se proporcionó la OT");
      return;
    }
    if (archivosValidos.length === 0) {
      console.warn("No hay archivos válidos para subir");
      return;
    }
    setUploading(true);
    try {
      const uploadPromises = archivosValidos.map((file) => {
        const formData = new FormData();
        formData.append("ID_OT", OT);
        formData.append("URL_ARCHIVO", file);
        return apiManager.uploadSoporte(formData);
      });
      await Promise.all(uploadPromises);
      console.log("Soportes subidos correctamente");
      fetchSoportes();
    } catch (error) {
      console.error("Error al subir los soportes:", error);
    } finally {
      setUploading(false);
    }
  };

  // Función para eliminar un soporte (realiza la llamada a la API para eliminar)
  const eliminarImagen = async (id) => {
    try {
      console.log(id);
      await apiManager.deleteSoporte(id);
      setSoportes(soportes.filter((img) => img.ID_SOPORTE !== id));
      if (
        imagenSeleccionada !== null &&
        soportes[imagenSeleccionada]?.ID_SOPORTE === id
      ) {
        setImagenSeleccionada(null);
      }
    } catch (error) {
      console.error("Error al eliminar el soporte:", error);
    }
  };

  // Abre el visor modal y define si es video o imagen
  const abrirVisor = (index, isVideo) => {
    setImagenSeleccionada(index);
    setEsVideo(isVideo);
  };

  // Cambia la imagen/video que se muestra en el visor, con navegación circular
  const cambiarImagen = (direccion) => {
    if (imagenSeleccionada === null) return;
    let nuevoIndex = imagenSeleccionada + direccion;
    if (nuevoIndex < 0) nuevoIndex = soportes.length - 1;
    if (nuevoIndex >= soportes.length) nuevoIndex = 0;
    setImagenSeleccionada(nuevoIndex);
    const soporte = soportes[nuevoIndex];
    setEsVideo(!!soporte.fullURL.match(/\.(mp4|mov|avi)$/i));
  };

  // Efecto para manejar la navegación con el teclado cuando el visor está abierto
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (imagenSeleccionada !== null) {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          cambiarImagen(-1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          cambiarImagen(1);
        } else if (event.key === "Escape") {
          event.preventDefault();
          setImagenSeleccionada(null);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [imagenSeleccionada, soportes]);

  return (
    <div className={styles.container}>
      <h2>Soportes de la Orden de Trabajo</h2>

      <div className={styles.uploadArea}>
        <label htmlFor="fileUpload" className={styles.uploadLabel}>
          <i className="fas fa-upload"></i> Arrastra o selecciona imágenes o videos
        </label>
        <input
          id="fileUpload"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
        />
      </div>

      {uploading && <p>Subiendo archivos...</p>}

      <div className={styles.galeria}>
        {soportes.map((img, index) => (
          <div key={img.ID_SOPORTE} className={styles.imagenWrapper}>
            {img.fullURL.match(/\.(mp4|mov|avi)$/i) ? (
              <div
                className={styles.videoPreview}
                onClick={() => abrirVisor(index, true)}
              >
                <video className={styles.imagen}>
                  <source src={img.fullURL} type="video/mp4" />
                </video>
                <div className={styles.playOverlay}>
                  <i className="fas fa-play"></i>
                </div>
              </div>
            ) : (
              <img
                src={img.fullURL}
                alt="Vista previa"
                className={styles.imagen}
                onClick={() => abrirVisor(index, false)}
              />
            )}
            <button
              className={styles.eliminarBtn}
              onClick={() => eliminarImagen(img.ID_SOPORTE)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>

      {imagenSeleccionada !== null && (
        <div
          className={styles.visor}
          onClick={() => setImagenSeleccionada(null)}
        >
          <button
            className={styles.botonIzq}
            onClick={(e) => {
              e.stopPropagation();
              cambiarImagen(-1);
            }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          {esVideo ? (
            <video controls className={styles.visorMedia}>
              <source src={soportes[imagenSeleccionada].fullURL} type="video/mp4" />
            </video>
          ) : (
            <img
              src={soportes[imagenSeleccionada].fullURL}
              alt="Vista ampliada"
              className={styles.visorMedia}
            />
          )}
          <button
            className={styles.botonDer}
            onClick={(e) => {
              e.stopPropagation();
              cambiarImagen(1);
            }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
          <button
            className={styles.eliminarEnVisor}
            onClick={(e) => {
              e.stopPropagation();
              eliminarImagen(soportes[imagenSeleccionada].ID_SOPORTE);
            }}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default GaleriaImagenes;
