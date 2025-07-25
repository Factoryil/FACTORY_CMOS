import React, { useState, useEffect } from 'react';
import styles from './Conciliacion.module.css';
import { apiManager } from '../../../api/apiManager';

const daysInMonth = 31;

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const staticConciliacionData = {
  company: {
    name: "FACTORY INTEGRATE SAS",
    nit: "900.453.378 - 7"
  },
  conciliacion: {
    conciliacionNumber: "VZ374",
    facturaNumber: "000",
    id_mes_operativo: "",
    fecha: "2022-03-29",
    contrato: "CABAN SYSTEMS COLOMBIA DOS S.A.S",
    identificacion: "NIT - 901464222",
    subdivision: "MEDELLÍN",
    encargado: "Carlos Arevalo",
    periodoDesde: "2022-01-01",
    periodoHasta: "2022-01-01",
    tipo: "Contrato",
    metodoPago: "Transferencia",
    centroCosto: "CC-001",
    estadoConciliacion: "Facturado"
  },
  detalles: [
    {
      placa: "JRL895",
      marca: "NISSAN",
      fechaInicio: "2022-03-01",
      fechaFinal: "2022-03-31",
      dias: 29,
      valorMes: 3900000,
      valorDia: 130000,
      total: 3900000
    }
  ]
};

const Conciliacion = () => {
  const [conciliacionData, setConciliacionData] = useState(staticConciliacionData);

  // Estados para Mes Operativo
  const [mesOperativoList, setMesOperativoList] = useState([]);
  const [selectedMesOperativo, setSelectedMesOperativo] = useState("");
  const [searchMes, setSearchMes] = useState('');
  const [filteredMeses, setFilteredMeses] = useState([]);

  // Estados para Contactos
  const [allContacts, setAllContacts] = useState([]);
  const [searchContact, setSearchContact] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  // Estado para almacenar la operatividad para el mes seleccionado
  const [operativeData, setOperativeData] = useState([]);

  // Estados para Vehículos Disponibles y Seleccionados
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchVehicle, setSearchVehicle] = useState('');
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  // Estados para los modales
  const [isMesModalOpen, setIsMesModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isVehiculoModalOpen, setIsVehiculoModalOpen] = useState(false);

  // Si el vehículo no tiene operatividad válida, se inicializa un array de 31 elementos vacíos
  const getVehicleOperatividad = (vehicle) => {
    if (vehicle.operatividad && vehicle.operatividad.length === daysInMonth) {
      return vehicle.operatividad;
    }
    return Array(daysInMonth).fill('');
  };

  // --- Mes Operativo ---
  const obtenerMesOperativos = async () => {
    try {
      const data = await apiManager.obtenerMesOperativos();
      setMesOperativoList(data);
      setFilteredMeses(data);
    } catch (error) {
      console.error("Error al obtener meses operativos:", error);
    }
  };

  const openMesModal = async () => {
    await obtenerMesOperativos();
    setIsMesModalOpen(true);
  };

  useEffect(() => {
    setFilteredMeses(
      mesOperativoList.filter(mes =>
        `${mes.anio} ${monthNames[mes.mes - 1]}`.toLowerCase().includes(searchMes.toLowerCase())
      )
    );
  }, [searchMes, mesOperativoList]);

  // Al seleccionar un mes, se actualiza el estado y se carga la operatividad de ese mes
  const selectMesOperativo = async (mes) => {
    setSelectedMesOperativo(mes.id);
    setConciliacionData(prev => ({
      ...prev,
      conciliacion: { ...prev.conciliacion, id_mes_operativo: mes.id }
    }));
    setIsMesModalOpen(false);
    try {
      const data = await apiManager.obtenerOperatividadPorMes(mes.id);
      setOperativeData(data);
    } catch (error) {
      console.error("Error al obtener operatividad:", error);
    }
  };

  // Efecto para actualizar la información de vehículos seleccionados cuando cambia el mes operativo
  useEffect(() => {
    if (selectedMesOperativo && operativeData.length > 0) {
      const mesSeleccionado = mesOperativoList.find(m => m.id === selectedMesOperativo);
      const updatedVehicles = selectedVehicles.map(vehicle => {
        let updatedOperatividad = getVehicleOperatividad(vehicle);
        operativeData.forEach(change => {
          if (change.id_vehiculo === vehicle.id_vehiculo) {
            if (change.dia - 1 >= 0 && change.dia - 1 < daysInMonth) {
              updatedOperatividad[change.dia - 1] = change.estado;
            }
          }
        });
        const operativeDays = updatedOperatividad.filter(day => day === 'O').length;
        return { ...vehicle, operatividad: updatedOperatividad, operativeDays, selectedMonth: mesSeleccionado };
      });
      setSelectedVehicles(updatedVehicles);
    }
  }, [selectedMesOperativo, operativeData]); // Se actualiza cada vez que cambia el mes u operatividad

  // --- Contactos ---
  const fetchContacts = async () => {
    try {
      const response = await apiManager.contactos();
      const contactsArray = response.data ? response.data : response;
      setAllContacts(contactsArray);
      setFilteredContacts(contactsArray);
    } catch (error) {
      console.error("Error al obtener contactos:", error);
    }
  };

  const openContactModal = async () => {
    await fetchContacts();
    setIsContactModalOpen(true);
  };

  const assignContact = (idContacto) => {
    const contact = allContacts.find(c => c.ID_CONTACTOS === idContacto);
    console.log("Contacto asignado:", contact);
    setIsContactModalOpen(false);
  };

  useEffect(() => {
    setFilteredContacts(
      allContacts.filter(c =>
        c.NOMBRE_COMPLETO.toLowerCase().includes(searchContact.toLowerCase())
      )
    );
  }, [searchContact, allContacts]);

  // --- Vehículos Disponibles y Seleccionados ---
  // Al abrir el modal, se cargan los vehículos disponibles
  const openVehiculoModal = async () => {
    if (!selectedMesOperativo) {
      alert("Seleccione un mes operativo primero.");
      return;
    }
    try {
      const response = await apiManager.vehiculos();
      const vehiclesArray = response.data ? response.data : response;
      // Filtramos: se descarta solo si el vehículo ya fue seleccionado para el mismo mes operativo
      const disponibles = vehiclesArray.filter(v => {
        const yaSeleccionadoEnMesActual = selectedVehicles.some(
          sv => sv.id_vehiculo === v.id_vehiculo && sv.selectedMonth?.id === selectedMesOperativo
        );
        return !yaSeleccionadoEnMesActual;
      });
      setAllVehicles(disponibles);
      setFilteredVehicles(disponibles);
      setSearchVehicle('');
      setIsVehiculoModalOpen(true);
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
    }
  };

  useEffect(() => {
    setFilteredVehicles(
      allVehicles.filter(v =>
        v.placa.toLowerCase().includes(searchVehicle.toLowerCase())
      )
    );
  }, [searchVehicle, allVehicles]);

  // Función para agregar un vehículo seleccionado, congelando la información del mes y la operatividad
  const seleccionarVehiculo = (vehiculo) => {
    let updatedOperatividad = getVehicleOperatividad(vehiculo);
    if (operativeData && operativeData.length > 0) {
      operativeData.forEach(change => {
        if (change.id_vehiculo === vehiculo.id_vehiculo) {
          if (change.dia - 1 >= 0 && change.dia - 1 < daysInMonth) {
            updatedOperatividad[change.dia - 1] = change.estado;
          }
        }
      });
    }
    const operativeDays = updatedOperatividad.filter(day => day === 'O').length;
    const mesSeleccionado = mesOperativoList.find(m => m.id === selectedMesOperativo);
    const vehicleSelected = {
      ...vehiculo,
      operatividad: updatedOperatividad,
      operativeDays,
      selectedMonth: mesSeleccionado
    };
    setSelectedVehicles(prev => [...prev, vehicleSelected]);
    setFilteredVehicles(prev => prev.filter(v => v.id_vehiculo !== vehiculo.id_vehiculo));
  };

  const eliminarVehiculo = (idVehiculo) => {
    setSelectedVehicles(prev => prev.filter(v => v.id_vehiculo !== idVehiculo));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.companyInfo}>
          <h1>{conciliacionData.company.name}</h1>
          <p>NIT: {conciliacionData.company.nit}</p>
        </div>
        <div className={styles.conciliacionInfo}>
          <h2>Conciliación #{conciliacionData.conciliacion.conciliacionNumber}</h2>
          <p>Factura #{conciliacionData.conciliacion.facturaNumber}</p>
        </div>
      </header>

      <div className={styles.topButtons}>
        <button className={styles.button} onClick={openMesModal}>
          Seleccionar Mes
        </button>
        <button className={styles.button} onClick={openContactModal}>
          Agregar Contacto
        </button>
        <button className={styles.button} onClick={openVehiculoModal}>
          Agregar Vehículo
        </button>
      </div>

      {/* Modal para Seleccionar Mes Operativo */}
      {isMesModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Seleccionar Mes Operativo</h3>
            <input
              type="text"
              placeholder="Filtrar mes..."
              value={searchMes}
              onChange={(e) => setSearchMes(e.target.value)}
              className={styles.searchInput}
            />
            <ul className={styles.optionsList}>
              {filteredMeses.map(mesOp => (
                <li
                  key={mesOp.id}
                  className={styles.optionItem}
                  onClick={() => selectMesOperativo(mesOp)}
                >
                  {mesOp.anio} - {monthNames[mesOp.mes - 1]}
                </li>
              ))}
            </ul>
            <button onClick={() => setIsMesModalOpen(false)} className={styles.buttonSecondary}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal para Agregar Contacto */}
      {isContactModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Agregar Contacto</h3>
            <input
              type="text"
              placeholder="Buscar contacto..."
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              className={styles.searchInput}
            />
            <ul className={styles.optionsList}>
              {filteredContacts.length === 0 ? (
                <p>No se encontraron contactos</p>
              ) : (
                filteredContacts.map(contact => (
                  <li
                    key={contact.ID_CONTACTOS}
                    className={styles.optionItem}
                    onClick={() => assignContact(contact.ID_CONTACTOS)}
                  >
                    {contact.NOMBRE_COMPLETO}
                  </li>
                ))
              )}
            </ul>
            <button onClick={() => setIsContactModalOpen(false)} className={styles.buttonSecondary}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal para Agregar Vehículo (vehículos disponibles) */}
      {isVehiculoModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Agregar Vehículo</h3>
            <input
              type="text"
              placeholder="Buscar vehículo..."
              value={searchVehicle}
              onChange={(e) => setSearchVehicle(e.target.value)}
              className={styles.searchInput}
            />
            <ul className={styles.optionsList}>
              {filteredVehicles.length === 0 ? (
                <p>No hay vehículos disponibles</p>
              ) : (
                filteredVehicles.map(vehicle => (
                  <li key={vehicle.id_vehiculo} className={styles.optionItem}>
                    {vehicle.placa}
                    <button
                      className={styles.buttonSecondary}
                      onClick={() => seleccionarVehiculo(vehicle)}
                      style={{ marginLeft: '10px' }}
                    >
                      Seleccionar
                    </button>
                  </li>
                ))
              )}
            </ul>
            <button onClick={() => setIsVehiculoModalOpen(false)} className={styles.buttonSecondary}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Tabla de Vehículos Seleccionados */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>N°</th>
              <th>Placa</th>
              <th>Mes y Año</th>
              <th>Día</th>
            </tr>
          </thead>
          <tbody>
            {selectedVehicles.map((vehicle, index) => {
              const mesObj = vehicle.selectedMonth;
              const mesAño = mesObj
                ? `${mesObj.anio} - ${monthNames[mesObj.mes - 1]}`
                : '-';
              return (
                <tr key={vehicle.id_vehiculo} className={styles.vehicleRow}>
                  <td style={{ position: 'relative' }}>
                    {index + 1}
                    <button
                      className={styles.deleteButton}
                      onClick={() => eliminarVehiculo(vehicle.id_vehiculo)}
                    >
                      Eliminar
                    </button>
                  </td>
                  <td className={styles.vehicleCell}>{vehicle.placa}</td>
                  <td>{mesAño}</td>
                  <td>{vehicle.operativeDays}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Conciliacion;
