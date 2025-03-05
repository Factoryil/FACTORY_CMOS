import React, { useState, useEffect } from 'react';
import styles from './Operatividad.module.css';
import * as XLSX from 'xlsx';
import { apiManager } from "../../../api/apiManager";

// Para el gráfico
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const Operatividad = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

  // Estados para Mes Operativo
  const [mesOperativoList, setMesOperativoList] = useState([]);
  const [selectedMesOperativo, setSelectedMesOperativo] = useState("");

  // Modal para crear Mes Operativo
  const [isMesModalOpen, setIsMesModalOpen] = useState(false);

  // Modal para asignar vehículo
  const [isAsignarModalOpen, setIsAsignarModalOpen] = useState(false);
  const [allVehicles, setAllVehicles] = useState([]);
  const [searchVehiculo, setSearchVehiculo] = useState("");
  const [filteredAllVehicles, setFilteredAllVehicles] = useState([]);

  // Vehículos asignados al mes operativo (se obtienen dinámicamente)
  const [vehicles, setVehicles] = useState([]);

  // Estados disponibles para asignación (incluye "L" para borrar)
  const [statuses] = useState({
    O: 'Activo Operativo',
    M: 'Detenido por Mantenimiento',
    S: 'Sale de Operación',
    T: 'Taller',
    A: 'Afectación',
    N: 'Novedad',
    L: 'Borrador'
  });
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Para este ejemplo se usa 31 días en la grilla
  const daysInMonth = 31;

  // Si el vehículo no tiene "operatividad", se crea un array de 31 celdas vacías.
  const getVehicleOperatividad = (vehicle) => {
    return vehicle.operatividad ? vehicle.operatividad : Array(daysInMonth).fill('');
  };

  // --- Métodos para Mes Operativo y Asignación de Vehículos ---

  const createMesOperativo = async () => {
    try {
      const formData = new FormData();
      formData.append("anio", selectedYear);
      formData.append("mes", selectedMonth + 1);
      await apiManager.crearMesOperativo(formData);
      obtenerMesOperativos();
      setIsMesModalOpen(false);
    } catch (error) {
      console.error("Error al crear mes operativo:", error);
    }
  };

  const obtenerMesOperativos = async () => {
    try {
      const data = await apiManager.obtenerMesOperativos();
      setMesOperativoList(data);
    } catch (error) {
      console.error("Error al obtener meses operativos:", error);
    }
  };

  useEffect(() => {
    obtenerMesOperativos();
  }, []);

  const fetchAllVehicles = async () => {
    try {
      const response = await apiManager.vehiculos();
      const vehiclesArray = response.data ? response.data : response;
      setAllVehicles(vehiclesArray);
      setFilteredAllVehicles(vehiclesArray);
    } catch (error) {
      console.error("Error al obtener todos los vehículos:", error);
    }
  };

  useEffect(() => {
    setFilteredAllVehicles(
      allVehicles.filter(v =>
        v.placa.toLowerCase().includes(searchVehiculo.toLowerCase())
      )
    );
  }, [searchVehiculo, allVehicles]);

  const asignarVehiculo = async (idVehiculo) => {
    if (!selectedMesOperativo) {
      alert("Debe seleccionar un mes operativo primero.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("id_mes_operativo", selectedMesOperativo);
      formData.append("id_vehiculo", idVehiculo);
      await apiManager.asignarVehiculoAMesOperativo(formData);
      await obtenerVehiculosPorMesOperativo(selectedMesOperativo);
      await fetchOperatividad(selectedMesOperativo);
      setIsAsignarModalOpen(false);
    } catch (error) {
      console.error("Error al asignar vehículo:", error);
    }
  };

  const obtenerVehiculosPorMesOperativo = async (idMes) => {
    try {
      const data = await apiManager.obtenerVehiculosPorMesOperativo(idMes);
      const vehiclesData = data.map(v => ({
        ...v,
        operatividad: getVehicleOperatividad(v)
      }));
      setVehicles(vehiclesData);
    } catch (error) {
      console.error("Error al obtener vehículos asignados:", error);
    }
  };

  const fetchOperatividad = async (idMesOperativo) => {
    try {
      const data = await apiManager.obtenerOperatividadPorMes(idMesOperativo);
      setVehicles(prevVehicles =>
        prevVehicles.map(vehicle => {
          const updatedOperatividad = getVehicleOperatividad(vehicle);
          data.forEach(change => {
            if (change.id_vehiculo === vehicle.id_vehiculo) {
              updatedOperatividad[change.dia - 1] = change.estado;
            }
          });
          return { ...vehicle, operatividad: updatedOperatividad };
        })
      );
    } catch (error) {
      console.error("Error al obtener operatividad:", error);
    }
  };

  const handleMesOperativoChange = async (e) => {
    const id = e.target.value;
    setSelectedMesOperativo(id);
    if (id) {
      await obtenerVehiculosPorMesOperativo(id);
      await fetchOperatividad(id);
    } else {
      setVehicles([]);
    }
  };

  // Polling: cada 5 segundos, se actualiza la operatividad
  useEffect(() => {
    if (selectedMesOperativo) {
      const intervalId = setInterval(() => {
        fetchOperatividad(selectedMesOperativo);
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [selectedMesOperativo]);

  // Filtrar para no mostrar vehículos ya asignados en el modal de asignación
  const availableVehicles = filteredAllVehicles.filter(v =>
    !vehicles.some(assigned => assigned.id_vehiculo === v.id_vehiculo)
  );

  // --- Funcionalidad de Asignación de Estado (Grilla Interactiva) ---

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null); // { row, col }
  const [selectionEnd, setSelectionEnd] = useState(null);     // { row, col }

  const statusKeys = Object.keys(statuses);

  const handleCellMouseDown = (row, col) => {
    setIsSelecting(true);
    setSelectionStart({ row, col });
    setSelectionEnd({ row, col });
  };

  const handleCellMouseEnter = (row, col) => {
    if (isSelecting) {
      setSelectionEnd({ row, col });
    }
  };

  const getSelectionRange = () => {
    if (!selectionStart || !selectionEnd) return null;
    const rowStart = Math.min(selectionStart.row, selectionEnd.row);
    const rowEnd = Math.max(selectionStart.row, selectionEnd.row);
    const colStart = Math.min(selectionStart.col, selectionEnd.col);
    const colEnd = Math.max(selectionStart.col, selectionEnd.col);
    return { rowStart, rowEnd, colStart, colEnd };
  };

  const finalizeSelection = async () => {
    const range = getSelectionRange();
    if (!range || !selectedStatus) {
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }
    const cambios = [];
    const newVehicles = vehicles.map((vehicle, index) => {
      if (index >= range.rowStart && index <= range.rowEnd) {
        const newOperatividad = [...vehicle.operatividad];
        for (let col = range.colStart; col <= range.colEnd; col++) {
          newOperatividad[col] = selectedStatus === 'L' ? '' : selectedStatus;
          cambios.push({
            id_mes_operativo: selectedMesOperativo,
            id_vehiculo: vehicle.id_vehiculo,
            dia: col + 1,
            estado: newOperatividad[col]
          });
        }
        return { ...vehicle, operatividad: newOperatividad };
      }
      return vehicle;
    });
    setVehicles(newVehicles);
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);

    try {
      await apiManager.guardarOperatividad(cambios);
      await fetchOperatividad(selectedMesOperativo);
    } catch (error) {
      console.error("Error al guardar operatividad en la base de datos:", error);
    }
  };

  const isCellInRange = (row, col) => {
    const range = getSelectionRange();
    if (!range) return false;
    return row >= range.rowStart && row <= range.rowEnd && col >= range.colStart && col <= range.colEnd;
  };

  // Exportar la grilla a XLSX
  const handleExportXLSX = () => {
    const data = [];
    const header = ["Vehículo", ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    data.push(header);
    vehicles.forEach(vehicle => {
      const row = [vehicle.placa, ...vehicle.operatividad.slice(0, daysInMonth)];
      data.push(row);
    });
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Operatividad");
    XLSX.writeFile(workbook, "operatividad.xlsx");
  };

  // --- Reporte gráfico ---
  const computeReport = () => {
    const counts = {};
    statusKeys.forEach(key => counts[key] = 0);
    vehicles.forEach(vehicle => {
      vehicle.operatividad.slice(0, daysInMonth).forEach(cell => {
        if (cell && counts.hasOwnProperty(cell)) {
          counts[cell]++;
        }
      });
    });
    return counts;
  };

  const report = computeReport();
  const chartColors = {
    O: 'rgba(75, 192, 192, 0.6)',
    M: 'rgba(255, 159, 64, 0.6)',
    S: 'rgba(153, 102, 255, 0.6)',
    T: 'rgba(255, 206, 86, 0.6)',
    A: 'rgba(54, 162, 235, 0.6)',
    N: 'rgba(255, 99, 132, 0.6)',
    L: 'rgba(200, 200, 200, 0.6)'
  };

  const chartData = {
    labels: statusKeys,
    datasets: [
      {
        label: 'Cantidad de celdas',
        data: statusKeys.map(key => report[key]),
        backgroundColor: statusKeys.map(key => chartColors[key] || 'rgba(100,100,100,0.6)'),
        borderColor: statusKeys.map(key =>
          (chartColors[key] || 'rgba(100,100,100,1)').replace('0.6', '1')
        ),
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Reporte de Operatividad' },
      datalabels: {
        color: '#000',
        anchor: 'end',
        align: 'end',
        formatter: (value) => value
      }
    },
  };

  return (
    <div className={styles.container}>

      {/* Sección de creación y selección de Mes Operativo */}
      <div className={styles.section}>
        <h1 className={styles.title}>OPERATIVIDAD</h1>
        <div className={styles.actionRow}>
          <button onClick={() => setIsMesModalOpen(true)} className={styles.button}>
            Crear Mes Operativo
          </button>
        </div>
        {isMesModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Crear Mes Operativo</h3>
              <div className={styles.formRow}>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  placeholder="Año"
                  className={styles.input}
                />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className={styles.select}
                >
                  {monthNames.map((m, index) => (
                    <option key={index} value={index}>{m}</option>
                  ))}
                </select>
              </div>
              <div className={styles.modalActions}>
                <button onClick={createMesOperativo} className={styles.button}>
                  Guardar
                </button>
                <button onClick={() => setIsMesModalOpen(false)} className={styles.buttonSecondary}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        <div className={styles.contenedorBtnes}> 
          <div className={styles.contenerselectmeses}>
          <h3>Meses Operativos Existentes</h3>
          <select
            value={selectedMesOperativo}
            onChange={handleMesOperativoChange}
            className={styles.select}
          >
            <option value="">Seleccione un mes operativo</option>
            {mesOperativoList.map((mesOp) => (
              <option key={mesOp.id} value={mesOp.id}>
                {mesOp.anio} - {monthNames[mesOp.mes - 1]}
              </option>
            ))}
          </select>
          </div>

        </div>
      </div>


      {isAsignarModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Asignar Vehículo</h3>
            <input
              type="text"
              placeholder="Buscar vehículo..."
              value={searchVehiculo}
              onChange={(e) => setSearchVehiculo(e.target.value)}
              className={styles.searchInput}
            />
            <ul className={styles.optionsList}>
              {availableVehicles.map((vehicle) => (
                <li
                  key={vehicle.id_vehiculo}
                  className={styles.optionItem}
                  onClick={() => asignarVehiculo(vehicle.id_vehiculo)}
                >
                  {vehicle.placa}
                </li>
              ))}
            </ul>
            <div className={styles.modalActions}>
              <button onClick={() => setIsAsignarModalOpen(false)} className={styles.buttonSecondary}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grilla interactiva y reporte */}
      {selectedMesOperativo &&  (
        <div className={styles.section}>
          {selectedMesOperativo && (
            <div className={styles.contenedorBtnVehiculo}>
              <button
                onClick={() => { fetchAllVehicles(); setIsAsignarModalOpen(true); }}
                className={styles.button}
              >
                Agregar Vehículo
              </button>
            </div>
          )}
          <p className={styles.note}>
            Selecciona un estado en la barra y arrastra desde la celda de inicio hasta la final para asignar o borrar (usando "L").
          </p>
          <div className={styles.toolbar}>
            {statusKeys.map(status => (
              <button
                key={status}
                className={`${styles.toolbarButton} ${selectedStatus === status ? styles.active : ''}`}
                onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
              >
                {status} <span className={styles.tooltip}>{statuses[status]}</span>
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            <button className={styles.actionButton} onClick={handleExportXLSX}>
              Export XLSX
            </button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>Vehículo</th>
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <th key={i} className={styles.tableHeader}>{i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle, rowIndex) => {
                  const operatividad = getVehicleOperatividad(vehicle);
                  return (
                    <tr key={vehicle.id_vehiculo} className={styles.tableRow}>
                      <td className={styles.vehicleCell}>{vehicle.placa}</td>
                      {operatividad.slice(0, daysInMonth).map((cellStatus, colIndex) => {
                        const inRange = isSelecting && isCellInRange(rowIndex, colIndex);
                        const cellColor = cellStatus ? chartColors[cellStatus] : 'inherit';
                        return (
                          <td
                            key={colIndex}
                            className={`${styles.cell} ${inRange ? styles.selected : ''}`}
                            style={{ backgroundColor: cellColor }}
                            onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                            onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                            onMouseUp={finalizeSelection}
                          >
                            {cellStatus}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          

          <div className={styles.chartContainer}>
            <Bar data={chartData} options={chartOptions} />
          </div>

         
        </div>
      )}
    </div>
  );
};

export default Operatividad;
