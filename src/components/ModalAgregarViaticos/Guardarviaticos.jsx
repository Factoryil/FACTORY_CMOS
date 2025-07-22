import React, { useState } from 'react';
import styles from './Guardarviaticos.module.css';
import { apiManager } from "../../api/apiManager";

const Guardarviaticos = ({ onClose }) => {
  const [formulario, setFormulario] = useState({ nombre: '' });
  const [gastos, setGastos] = useState([
    { tipo: '', valor: '', soporte_imagen: null, fecha_soporte: '' }
  ]);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleGastoChange = (index, e) => {
    const nuevos = [...gastos];
    const { name, value, files } = e.target;
    nuevos[index][name] = name === 'soporte_imagen' ? files[0] : value;
    setGastos(nuevos);
  };

  const agregarGasto = () => {
    setGastos([
      ...gastos,
      { tipo: '', valor: '', soporte_imagen: null, fecha_soporte: '' }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (let gasto of gastos) {
        const formData = new FormData();
        formData.append("nombre", formulario.nombre);
        formData.append("tipo", gasto.tipo);
        formData.append("valor", gasto.valor);
        formData.append("fecha_soporte", gasto.fecha_soporte);
        if (gasto.soporte_imagen) {
          formData.append("soporte_imagen", gasto.soporte_imagen);
        }
        await apiManager.viaticosAgregar(formData);
      }

      alert("Viáticos enviados correctamente.");
      onClose(); // cerrar modal
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Error al enviar viáticos.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>✖</button>
        <h2>Solicitud de Viáticos</h2>

        <form onSubmit={handleSubmit}>
          <label>Nombre completo</label>
          <input
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={handleChange}
            required
          />

          <label>Gastos</label>
          {gastos.map((g, i) => (
            <div key={i} className={styles.gastoItem}>
              <select
                name="tipo"
                value={g.tipo}
                onChange={(e) => handleGastoChange(i, e)}
                required
              >
                <option value="">-- Tipo de gasto --</option>
                <option value="combustible">Combustible</option>
                <option value="hospedaje">Hospedaje</option>
                <option value="alimentacion">Alimentación</option>
              </select>

              <input
                type="number"
                name="valor"
                placeholder="Valor $"
                value={g.valor}
                onChange={(e) => handleGastoChange(i, e)}
                required
              />

              <input
                type="date"
                name="fecha_soporte"
                value={g.fecha_soporte}
                onChange={(e) => handleGastoChange(i, e)}
                required
              />

              <input
                type="file"
                name="soporte_imagen"
                accept="image/*,application/pdf"
                onChange={(e) => handleGastoChange(i, e)}
                required
              />
              <hr />
            </div>
          ))}

          <button type="button" onClick={agregarGasto}>
            + Agregar otro gasto
          </button>

          <button type="submit" className={styles.saveButton}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Guardarviaticos;
