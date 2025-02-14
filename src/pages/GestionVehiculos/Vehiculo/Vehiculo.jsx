import React, { useState, useEffect } from "react";
import styles from "./Vehiculo.module.css";
import { useNavigate } from "react-router-dom";  // Importamos useNavigate para la redirección
import Tabla from "../../../components/Tabla/Tabla";

// Datos estáticos de ejemplo
const contactosEstaticos = [
  {
    ID_VEHICULO: 1,
    PLACA: "TLL961",
    PROPIETARIO: "JAVIER GONZALEZ",
    CLIENTE: "IMEL",
    URL_IMAGEN: "https://via.placeholder.com/150"
  },
];

const botonesAcciones = [
  { nombre: "Ver", link: "/gestion/vehiculos/ver/", icono: "fas fa-eye", color: "blue" }
];

function Vehiculo() {
  const navigate = useNavigate();  // Usamos useNavigate para la redirección
  const [contactos, setContactos] = useState([]);  // Estado de los contactos
  const [cargando, setCargando] = useState(true);  // Estado de carga
  const [mostrarModal, setMostrarModal] = useState(false);  // Estado para el modal
  const [nuevoContacto, setNuevoContacto] = useState({
    PLACA: "",
    PROPIETARIO: "",
    PROPIETARIO: "",
    CLIENTE: "",
    URL_IMAGEN: "",  
  });
  const [imagen, setImagen] = useState(null);  // Estado para la imagen

  const tiposIdentificacion = [
    { value: "cedula", label: "Cédula" },
    { value: "pasaporte", label: "Pasaporte" },
    { value: "ruc", label: "RUC" },
    { value: "otro", label: "Otro" },
  ];

  useEffect(() => {
    // Simulamos la carga de datos estáticos
    setContactos(contactosEstaticos);
    setCargando(false);
  }, []);

  if (cargando) {
    return <div>Cargando contactos...</div>;
  }

  const manejarCambio = (e) => {
    setNuevoContacto({
      ...nuevoContacto,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar la carga de la imagen
  const manejarCambioImagen = (e) => {
    setImagen(e.target.files[0]);
  };

  // Función para enviar los datos del formulario a la API y crear el contacto
  const manejarEnvio = async (e) => {
    e.preventDefault();

    const formData = new FormData();  // Usamos FormData para enviar los datos con la imagen
    formData.append("NOMBRE_COMPLETO", nuevoContacto.NOMBRE_COMPLETO);
    formData.append("CORREO_ELECTRONICO", nuevoContacto.CORREO_ELECTRONICO);
    formData.append("TELEFONO", nuevoContacto.TELEFONO);
    formData.append("TIPO_IDENTIFICACION", nuevoContacto.TIPO_IDENTIFICACION);
    formData.append("NUMERO_IDENTIFICACION", nuevoContacto.NUMERO_IDENTIFICACION);

    if (imagen) {
      formData.append("URL_IMAGEN", imagen);  // Añadimos la imagen al FormData
    }
    console.log(formData);

    // Simulamos la creación del contacto y redirigimos
    const data = {
      ID_CONTACTO: contactos.length + 1,  // ID simulado
      ...nuevoContacto,
      URL_IMAGEN: imagen ? URL.createObjectURL(imagen) : null,
    };

    setContactos([...contactos, data]);
    setMostrarModal(false);  // Cerrar el modal después de agregar el contacto
    navigate(`/gestion/contactos/ver/${data.ID_CONTACTO}`);  // Redirigimos al detalle del contacto recién creado
  };

  const manejarCerrarModal = (e) => {
    if (e.target === e.currentTarget) {
      setMostrarModal(false);
    }
  };

  return (
    <div className={styles.contactos}>
      <h2 className={styles.titulo}>Lista de Vehiculos</h2>

      {contactos.length > 0 ? (
        <Tabla
          datos={contactos}
          columnasOmitidas={["ID_VEHICULO"]}
          columnasVisibles={['PLACA', 'PROPIETARIO', 'CLIENTE']}
          mostrarAcciones={true}    
          columnaAccion="ID_VEHICULO"   
          botonesAccion={botonesAcciones}  
          habilitarExportacion={true}
          nombreExcel={"datos_tabla"}
          filasPorPagina={5}
        >
          <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
            Agregar Contacto
          </button>
        </Tabla>
      ) : (
        <p>No hay contactos disponibles.</p>
      )}

      {mostrarModal && (
        <div className={styles.modalOverlay} onClick={manejarCerrarModal}>
          <div className={styles.modal}>
            <h2>Agregar Nuevo Contacto</h2>
            <form onSubmit={manejarEnvio}>
              <label htmlFor="NOMBRE_COMPLETO">Nombre Completo</label>
              <input
                type="text"
                id="NOMBRE_COMPLETO"
                name="NOMBRE_COMPLETO"
                value={nuevoContacto.NOMBRE_COMPLETO}
                onChange={manejarCambio}
                required
              />
              <label htmlFor="CORREO_ELECTRONICO">Correo Electrónico</label>
              <input
                type="email"
                id="CORREO_ELECTRONICO"
                name="CORREO_ELECTRONICO"
                value={nuevoContacto.CORREO_ELECTRONICO}
                onChange={manejarCambio}
                required
              />
              <label htmlFor="TELEFONO">Teléfono</label>
              <input
                type="text"
                id="TELEFONO"
                name="TELEFONO"
                value={nuevoContacto.TELEFONO}
                onChange={manejarCambio}
                required
              />
              <label htmlFor="TIPO_IDENTIFICACION">Tipo de Identificación</label>
              <select
                id="TIPO_IDENTIFICACION"
                name="TIPO_IDENTIFICACION"
                value={nuevoContacto.TIPO_IDENTIFICACION}
                onChange={manejarCambio}
                required
              >
                <option value="">Seleccione un tipo</option>
                {tiposIdentificacion.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
              <label htmlFor="NUMERO_IDENTIFICACION">Número de Identificación</label>
              <input
                type="text"
                id="NUMERO_IDENTIFICACION"
                name="NUMERO_IDENTIFICACION"
                value={nuevoContacto.NUMERO_IDENTIFICACION}
                onChange={manejarCambio}
                required
              />
              <label htmlFor="URL_IMAGEN">Imagen (opcional)</label>
              <input
                type="file"
                id="URL_IMAGEN"
                name="URL_IMAGEN"
                onChange={manejarCambioImagen}
              />
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.saveButton}>
                  Guardar
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vehiculo;
