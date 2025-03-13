import React, { useState, useEffect } from 'react';
import styles from './Conciliacion.module.css';
import { apiManager } from '../../../api/apiManager';

// Número de días en el mes (para futuros usos)
const daysInMonth = 31;

// Definición de monthNames para mostrar el nombre de los meses
const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Datos estáticos para la conciliación (por ahora)
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
  // Data de conciliación (estática por ahora)
  const [conciliacionData, setConciliacionData] = useState(staticConciliacionData);

  // Estados para Mes Operativo
  // Ahora se guarda el objeto completo del mes operativo
  const [mesOperativoList, setMesOperativoList] = useState([]);
  const [selectedMesOperativo, setSelectedMesOperativo] = useState(null);
  const [searchMes, setSearchMes] = useState('');
  const [filteredMeses, setFilteredMeses] = useState([]);

  // Estados para Contactos
  const [allContacts, setAllContacts] = useState([]);
  const [searchContact, setSearchContact] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  // Estados para Vehículos asignados (lista local)
  const [vehicles, setVehicles] = useState([]);
  // Lista completa de vehículos disponibles (según API) para asignar
  const [allVehicles, setAllVehicles] = useState([]);
  const [searchVehicle, setSearchVehicle] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  // Estados para los modales (trabajando de forma independiente)
  const [isMesModalOpen, setIsMesModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isVehiculoModalOpen, setIsVehiculoModalOpen] = useState(false);

  // Función de ayuda para inicializar la propiedad "operatividad" de un vehículo
  const getVehicleOperatividad = (vehicle) =>
    vehicle.operatividad ? vehicle.operatividad : Array(daysInMonth).fill('');

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

  const selectMesOperativo = (mes) => {
    setSelectedMesOperativo(mes);
    console.log("Mes Operativo seleccionado:", mes);
    setConciliacionData(prev => ({
      ...prev,
      conciliacion: { ...prev.conciliacion, id_mes_operativo: mes.id }
    }));
    setIsMesModalOpen(false);
    // Aquí podrías cargar los vehículos asignados si lo requieres
  };

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

  // --- Vehículos ---
  // En este flujo, para el modal de "Agregar Vehículo" obtenemos los vehículos vinculados al mes operativo
  const openVehiculoModal = async () => {
    if (!selectedMesOperativo) {
      alert("Seleccione un mes operativo primero.");
      return;
    }
    try {
      const data = await apiManager.obtenerVehiculosPorMesOperativo(selectedMesOperativo.id);
      setAllVehicles(data);
      setFilteredVehicles(data);
      setIsVehiculoModalOpen(true);
    } catch (error) {
      console.error("Error al obtener vehículos relacionados al mes:", error);
    }
  };

  // Al seleccionar un vehículo en el modal, se agrega a la lista local (sin asignación en backend)
  const assignVehicle = (idVehiculo) => {
    const vehicle = allVehicles.find(v => v.id_vehiculo === idVehiculo);
    if (vehicle && !vehicles.some(v => v.id_vehiculo === vehicle.id_vehiculo)) {
      // Inicializamos la propiedad operatividad si no existe
      vehicle.operatividad = getVehicleOperatividad(vehicle);
      setVehicles([...vehicles, vehicle]);
    }
    console.log("Vehículo agregado a la tabla:", vehicle);
    setIsVehiculoModalOpen(false);
  };

  useEffect(() => {
    setFilteredVehicles(
      allVehicles.filter(v =>
        v.placa.toLowerCase().includes(searchVehicle.toLowerCase())
      )
    );
  }, [searchVehicle, allVehicles]);

  // Función para contar los días operativos ("O") de un vehículo
  const countOperativeDays = (operatividad) =>
    operatividad.filter(day => day === 'O').length;

  // Función para eliminar un vehículo de la tabla
  const removeVehicle = (idVehiculo) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id_vehiculo !== idVehiculo));
  };

  return (
    <div className={styles.container}>
      {/* Contenedor superior exclusivo para los botones */}
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

      {/* Cabecera con información de la compañía */}
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

      {/* Modal para Agregar Vehículo */}
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
              {filteredVehicles.map(vehicle => (
                <li
                  key={vehicle.id_vehiculo}
                  className={styles.optionItem}
                  onClick={() => assignVehicle(vehicle.id_vehiculo)}
                >
                  {vehicle.placa}
                </li>
              ))}
            </ul>
            <button onClick={() => setIsVehiculoModalOpen(false)} className={styles.buttonSecondary}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Tabla de Vehículos asignados con sus días operativos y mes operativo */}
      {selectedMesOperativo && vehicles.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Días</th>
                <th>Mes</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(vehicle => (
                <tr key={vehicle.id_vehiculo} className={styles.vehicleRow}>
                  <td className={styles.vehicleCell}>
                    <span>{vehicle.placa}</span>
                    {/* Botón de eliminar, el estilo puede hacerlo visible solo al hacer hover */}
                    <button 
                      className={styles.deleteButton} 
                      onClick={() => removeVehicle(vehicle.id_vehiculo)}
                    >
                      Eliminar
                    </button>
                  </td>
                  <td>{countOperativeDays(vehicle.operatividad)}</td>
                  <td>{`${selectedMesOperativo.anio} - ${monthNames[selectedMesOperativo.mes - 1]}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Conciliacion;
