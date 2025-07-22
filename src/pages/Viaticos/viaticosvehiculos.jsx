
import './viaticos.module.css';

const Viaticosvehiculos = () => {
  const [gastos, setGastos] = useState([
    { tipo: '', nombrePeaje: '', valor: '', soporte: null }
  ]);

  const handleChangeGasto = (index, e) => {
    const nuevos = [...gastos];
    if (e.target.name === 'soporte') {
      nuevos[index][e.target.name] = e.target.files[0];
    } else {
      nuevos[index][e.target.name] = e.target.value;
    }
    setGastos(nuevos);
  };

  const agregarGasto = () => {
    setGastos([...gastos, { tipo: '', nombrePeaje: '', valor: '', soporte: null }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Gastos:', gastos);
    alert('Gastos enviados correctamente');
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <h2><i className="fas fa-file-invoice-dollar icono"></i> Registrar Gastos</h2>

      {gastos.map((gasto, index) => (
        <div className="subgrupo" key={index}>
          <label>Selecciona el tipo de gasto</label>
          <select
            name="tipo"
            value={gasto.tipo}
            onChange={(e) => handleChangeGasto(index, e)}
            required
          >
            <option value="">-- Selecciona --</option>
            <option value="peaje">Peaje</option>
            <option value="combustible">Combustible</option>
            <option value="hospedaje">Hospedaje</option>
            <option value="alimentacion">Alimentación</option>
          </select>

          {gasto.tipo === 'peaje' && (
            <>
              <label>Nombre del peaje</label>
              <input
                type="text"
                name="nombrePeaje"
                value={gasto.nombrePeaje}
                onChange={(e) => handleChangeGasto(index, e)}
                required
              />
            </>
          )}

          <label>Valor</label>
          <input
            type="number"
            name="valor"
            value={gasto.valor}
            onChange={(e) => handleChangeGasto(index, e)}
            required
          />

          <label>Soporte (imagen)</label>
          <input
            type="file"
            name="soporte"
            accept="image/*"
            onChange={(e) => handleChangeGasto(index, e)}
            required
          />

          {gasto.soporte && (
            <p><i className="fas fa-image icono"></i> {gasto.soporte.name}</p>
          )}
          <hr />
        </div>
      ))}

      <div style={{ textAlign: 'left', marginBottom: '20px' }}>
        <button type="button" onClick={agregarGasto}>
          <i className="fas fa-plus-circle icono"></i> Agregar otro gasto
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button type="submit"><i className="fas fa-paper-plane icono"></i> Enviar</button>
      </div>
    </form>
  );
};

export default Viaticosvehiculos;
