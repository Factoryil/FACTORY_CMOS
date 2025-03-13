import React, { useState, useEffect } from 'react';
import styles from './Operatividad.module.css';
import { apiManager } from "../../../api/apiManager";
import * as XLSX from 'xlsx';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const getVehicleOperatividad = (vehicle, days) => {
  return vehicle.operatividad && vehicle.operatividad.length === days
    ? vehicle.operatividad
    : Array(days).fill('');
};

const Operatividad = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

  const [mesOperativoList, setMesOperativoList] = useState([]);
  const [selectedMesOperativo, setSelectedMesOperativo] = useState("");

  const [isMesModalOpen, setIsMesModalOpen] = useState(false);
  const [isAsignarModalOpen, setIsAsignarModalOpen] = useState(false);
  const [allVehicles, setAllVehicles] = useState([]);
  const [searchVehiculo, setSearchVehiculo] = useState("");
  const [filteredAllVehicles, setFilteredAllVehicles] = useState([]);

  const [vehicles, setVehicles] = useState([]);

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
  const statusKeys = Object.keys(statuses);

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);

  const selectedMesObj = mesOperativoList.find(m => m.id.toString() === selectedMesOperativo);
  const daysInMonth = selectedMesObj 
    ? getDaysInMonth(selectedMesObj.anio, selectedMesObj.mes - 1)
    : getDaysInMonth(selectedYear, selectedMonth);

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
  // console.log(selectedMesOperativo);


  const fetchAllVehicles = async () => {
    try {
      const response = await apiManager.vehiculosContratosActivos();
      const vehiclesArray = response.data ? response.data : response;
      const mappedVehicles = vehiclesArray.map(v => ({
        ...v,
        id_vehiculo: v.ID_VEHICULO,
        id_union_vehiculo_cliente: v.ID_UNION_VEHICULO_Y_CLIENTE,
        placa: v.placa || v.PLACA,
        nombre_completo: v.NOMBRE_COMPLETO || v.nombre_completo
      }));
      setAllVehicles(mappedVehicles);
      setFilteredAllVehicles(mappedVehicles);
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

  // Para el modal se muestran todos los vehículos disponibles
  const availableVehicles = filteredAllVehicles.filter(v =>
    !vehicles.some(assigned => assigned.id_vehiculo === v.id_vehiculo)
  );

  // Función modificada para asignar vehículo de forma optimista
  const asignarVehiculo = async (id_union_vehiculo_cliente) => {
    if (!selectedMesOperativo) {
      alert("Debe seleccionar un mes operativo primero.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("id_mes_operativo", selectedMesOperativo);
      formData.append("id_union_vehiculo_cliente", id_union_vehiculo_cliente);
      await apiManager.asignarVehiculoAMesOperativo(formData);
      
      // Actualización optimista: buscamos el vehículo en allVehicles y lo agregamos a vehicles
      const newVehicle = allVehicles.find(v => v.id_union_vehiculo_cliente === id_union_vehiculo_cliente);
      if (newVehicle) {
        const assignedVehicle = {
          ...newVehicle,
          // Inicializamos la operatividad con celdas vacías según la cantidad de días
          operatividad: Array(daysInMonth).fill('')
        };
        setVehicles(prev => [...prev, assignedVehicle]);
      }
      // Actualizamos los estados de operatividad sin reinicializar toda la lista
      await fetchOperatividad(selectedMesOperativo);
      setIsAsignarModalOpen(false);
    } catch (error) {
      console.error("Error al asignar vehículo:", error);
    }
  };

  const obtenerVehiculosPorMesOperativo = async (idMes) => {
    try {
      const mesObj = mesOperativoList.find(m => m.id.toString() === idMes.toString());
      const days = mesObj ? getDaysInMonth(mesObj.anio, mesObj.mes - 1) : getDaysInMonth(selectedYear, selectedMonth);
      const data = await apiManager.obtenerVehiculosPorMesOperativo(idMes);
      const vehiclesData = data.map(v => {
        const nombre = v.NOMBRE_COMPLETO ||
          (allVehicles.find(av => av.id_vehiculo === (v.ID_VEHICULO || v.id_vehiculo))?.nombre_completo) ||
          "";
        return {
          ...v,
          id_vehiculo: v.ID_VEHICULO || v.id_vehiculo,
          id_union_vehiculo_cliente: v.ID_UNION_VEHICULO_Y_CLIENTE || v.id_union_vehiculo_cliente,
          nombre_completo: nombre,
          operatividad: getVehicleOperatividad(v, days)
        };
      });
      setVehicles(vehiclesData);
    } catch (error) {
      console.error("Error al obtener vehículos asignados:", error);
    }
  };

  const fetchOperatividad = async (idMes) => {
    try {
      const mesObj = mesOperativoList.find(m => m.id.toString() === idMes.toString());
      const days = mesObj ? getDaysInMonth(mesObj.anio, mesObj.mes - 1) : getDaysInMonth(selectedYear, selectedMonth);
      const data = await apiManager.obtenerOperatividadPorMes(idMes);
      setVehicles(prevVehicles =>
        prevVehicles.map(vehicle => {
          const updatedOperatividad = getVehicleOperatividad(vehicle, days);
          data.forEach(change => {
            if (change.id_union_vehiculo_cliente === vehicle.id_union_vehiculo_cliente) {
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

  useEffect(() => {
    if (selectedMesOperativo) {
      const intervalId = setInterval(() => {
        fetchOperatividad(selectedMesOperativo);
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [selectedMesOperativo]);

  // Eliminación optimista (ya explicada previamente)
  const eliminarVehiculo = async (idAsignacion) => {
    try {
      await apiManager.eliminarVehiculoDeMesOperativo(idAsignacion);
      setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== idAsignacion));
      await fetchOperatividad(selectedMesOperativo);
    } catch (error) {
      console.error("Error al eliminar asignación:", error);
    }
  };

  const handleCellMouseDown = (row, col) => {
    setIsSelecting(true);
    setSelectionStart({ row, col });
    setSelectionEnd({ row, col });
  };

  const handleCellMouseEnter = (row, col) => {
    if (isSelecting) setSelectionEnd({ row, col });
  };

  const getSelectionRange = () => {
    if (!selectionStart || !selectionEnd) return null;
    return {
      rowStart: Math.min(selectionStart.row, selectionEnd.row),
      rowEnd: Math.max(selectionStart.row, selectionEnd.row),
      colStart: Math.min(selectionStart.col, selectionEnd.col),
      colEnd: Math.max(selectionStart.col, selectionEnd.col)
    };
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
    const newVehicles = vehicles.map((vehicle, rowIndex) => {
      if (rowIndex >= range.rowStart && rowIndex <= range.rowEnd) {
        const newOperatividad = [...vehicle.operatividad];
        for (let col = range.colStart; col <= range.colEnd; col++) {
          const newValue = selectedStatus === 'L' ? '' : selectedStatus;
          if (vehicle.operatividad[col] !== newValue) {
            newOperatividad[col] = newValue;
            cambios.push({
              id_vehiculo_mes_operativo: vehicle.id,
              dia: col + 1,
              estado: newValue
            });
          }
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
      console.log(cambios);
      
      await apiManager.guardarOperatividad(cambios);
      await fetchOperatividad(selectedMesOperativo);
    } catch (error) {
      console.error("Error al guardar operatividad:", error);
    }
  };

  const isCellInRange = (row, col) => {
    const range = getSelectionRange();
    if (!range) return false;
    return row >= range.rowStart && row <= range.rowEnd && col >= range.colStart && col <= range.colEnd;
  };

  const handleExportXLSX = () => {
    const data = [];
    const header = ["Cliente", "Vehículo", ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    data.push(header);
    vehicles.forEach(vehicle => {
      const row = [vehicle.nombre_completo, vehicle.placa, ...vehicle.operatividad.slice(0, daysInMonth)];
      data.push(row);
    });
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Operatividad");
    XLSX.writeFile(workbook, "operatividad.xlsx");
  };

  const computeReport = () => {
    const counts = {};
    statusKeys.forEach(key => counts[key] = 0);
    vehicles.forEach(vehicle => {
      vehicle.operatividad.slice(0, daysInMonth).forEach(cell => {
        if (cell && counts.hasOwnProperty(cell)) counts[cell]++;
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
      <div className={styles.headerSection}>
        <h1 className={styles.title}>OPERATIVIDAD</h1>
        <div className={styles.actionRow}>
          <button onClick={() => setIsMesModalOpen(true)} className={styles.button}>
            Crear Mes Operativo
          </button>
        </div>
      </div>

      {isMesModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Crear Mes Operativo</h3>
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
                  <option key={`mes-${index}`} value={index} className={styles.option}>
                    {m}
                  </option>
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

      <div className={styles.selectSection}>
        <div className={styles.selectContainer}>
          <h3 className={styles.subtitle}>Meses Operativos Existentes</h3>
          <select
            value={selectedMesOperativo}
            onChange={handleMesOperativoChange}
            className={styles.select}
          >
            <option key="default-option" value="" className={styles.option}>
              Seleccione un mes operativo
            </option>
            {mesOperativoList.map((mesOp) => (
              <option key={`mesOp-${mesOp.id}`} value={mesOp.id} className={styles.option}>
                {mesOp.anio} - {monthNames[mesOp.mes - 1]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isAsignarModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Asignar Vehículo</h3>
            <input
              type="text"
              placeholder="Buscar vehículo..."
              value={searchVehiculo}
              onChange={(e) => setSearchVehiculo(e.target.value)}
              className={styles.searchInput}
            />
            <ul className={styles.optionsList}>
              {filteredAllVehicles.map(vehicle => (
                <li
                  key={`vehiculo-${vehicle.id_union_vehiculo_cliente}`}
                  className={styles.optionItem}
                  onClick={() => asignarVehiculo(vehicle.id_union_vehiculo_cliente)}
                >
                  {vehicle.placa} - {vehicle.nombre_completo}
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

      {selectedMesOperativo && (
        <div className={styles.contentSection}>
          <div className={styles.vehicleActionRow}>
            <button
              onClick={() => { fetchAllVehicles(); setIsAsignarModalOpen(true); }}
              className={styles.button}
            >
              Agregar Vehículo
            </button>
          </div>
          <p className={styles.note}>
            Selecciona un estado en la barra y arrastra desde la celda de inicio hasta la final para asignar o borrar (usando "L").
          </p>
          <div className={styles.toolbar}>
            {statusKeys.map(status => (
              <button
                key={`status-${status}`}
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
              <thead className={styles.tableHead}>
                <tr className={styles.tableRow}>
                  <th className={`${styles.tableHeader} ${styles.stickyFirst}`}>Vehículo</th>
                  <th className={`${styles.tableHeader} ${styles.stickySecond}`}>Cliente</th>
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <th key={`header-${i}`} className={styles.tableHeader}>
                      {i + 1}
                    </th>
                  ))}
                  <th className={styles.tableHeader}>Acciones</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {vehicles.map((vehicle, rowIndex) => {
                  const operatividad = getVehicleOperatividad(vehicle, daysInMonth);
                  // console.log(vehicle);
                  
                  return (
                    <tr key={`vehicle-row-${vehicle.id_vehiculo}-${rowIndex}`} className={styles.tableRow}>
                      <td className={`${styles.vehicleCell} ${styles.stickyFirst}`}>
                        {vehicle.placa}
                      </td>
                      <td className={`${styles.vehicleCell} ${styles.stickySecond}`}>
                        {vehicle.nombre_completo}
                      </td>
                      {operatividad.map((cellStatus, colIndex) => {
                        const inRange = isSelecting && isCellInRange(rowIndex, colIndex);
                        const cellColor = cellStatus ? chartColors[cellStatus] : 'inherit';
                        return (
                          <td
                            key={`cell-${rowIndex}-${colIndex}`}
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
                      <td className={styles.vehicleCell}>
                        <button
                          className={styles.buttonSecondary}
                          onClick={() => eliminarVehiculo(vehicle.id)}
                        >
                          Eliminar
                        </button>
                      </td>
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
