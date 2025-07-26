import { useState } from 'react';
import Guardarviaticos from '../../components/ModalAgregarViaticos/Guardarviaticos';
import Guardarviaticosvehiculos from '../../components/ModalAgregarViaticos/Guardarviaticosvehiculos';

const IngresoPublico = () => {
  const [tipo, setTipo] = useState(""); // persona o vehiculo
  const [showModal, setShowModal] = useState(false);

  const handleTipoChange = (e) => {
    setTipo(e.target.value);
    setShowModal(!!e.target.value); // Mostrar modal solo si selecciona algo
  };

  const handleClose = () => {
    setShowModal(false);
    setTipo(""); // Opcional: limpiar selección
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>Ingreso de Viáticos</h2>
      <select value={tipo} onChange={handleTipoChange}>
        <option value="">Seleccione tipo de viático</option>
        <option value="persona">Persona</option>
        <option value="vehiculo">Vehículo</option>
      </select>
      <div style={{ marginTop: 20 }}>
        {showModal && tipo === "persona" && (
          <Guardarviaticos esPublico onClose={handleClose} />
        )}
        {showModal && tipo === "vehiculo" && (
          <Guardarviaticosvehiculos esPublico onClose={handleClose} />
        )}
      </div>
    </div>
  );
};

export default IngresoPublico;