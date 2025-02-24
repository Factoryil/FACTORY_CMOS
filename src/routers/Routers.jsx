import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layout/DashboardLayout/DashboardLayout";
import Logout from "../pages/Logout/Logout";
import Loader from "../components/Loader/Loader";
import NotFound from "../pages/NotFound/NotFound";
import PermissionRoute from "./PermissionRoute";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

// Carga diferida de las páginas
const Login = lazy(() => import("../pages/Login/Login"));
const Inicio = lazy(() => import("../pages/Inicio/Inicio"));
const Contactos = lazy(() => import("../pages/GestionConstactos/Contactos/Contactos"));
const Permisos = lazy(() => import("../pages/GestionUsuarios/Permisos/Permisos"));
const ContactosVer  = lazy(() => import("../pages/GestionConstactos/ContactosVer/ContactosVer"));

import Etiquetas from "../pages/GestionConstactos/Etiquetas/Etiquetas";
import EtiquetasVer from "../pages/GestionConstactos/EtiquetasVer/EtiquetasVer";
import Usuarios from "../pages/GestionUsuarios/Usuarios/Usuarios";
import Roles from "../pages/GestionUsuarios/Roles/Roles";
import Vehiculo from "../pages/GestionVehiculos/Vehiculo/Vehiculo";
import VehiculosVer from "../pages/GestionVehiculos/VehiculosVer/VehiculosVer";
import OrdenesTrabajos from "../pages/GestionTrabajos/OrdenesTrabajos/OrdenesTrabajos";
import Autorizaciones from "../pages/GestionTrabajos/Autorizaciones/Autorizaciones";
import Mediciones from "../pages/GestionVehiculos/Mediciones/Mediciones";
import Mantenimientos from "../pages/GestionMantenimientos/Mantenimietos/Mantenimientos";
import PlanesMantenimiento from "../pages/GestionMantenimientos/PlanesMantenimiento/PlanesMantenimiento";
import PlanMantenimientoVer from "../pages/GestionMantenimientos/PlanMantenimientoVer/PlanMantenimientoVer";
import VerOrdenTrabajo from "../pages/GestionTrabajos/VerOrdenTrabajo/VerOrdenTrabajo";


// Componente de carga mientras se cargan los componentes diferidos

function Routers() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Inicio />} />

            <Route element={<PermissionRoute requiredPermission="contactos_lista:ver" />}>
              <Route path="/gestion/contactos" element={<Contactos />} />
            </Route> 
            <Route path="/gestion/contactos/ver/:id" element={<ContactosVer />} />
            {/* <Route element={<PermissionRoute requiredPermission="usuarios:lectura" />}>
            </Route> */}
            <Route path="/gestion/etiquetas" element={<Etiquetas />} />
            <Route path="/gestion/etiquetas/ver/:id" element={<EtiquetasVer />} />
            <Route path="/gestion/usuarios" element={<Usuarios />} />
            <Route path="/gestion/roles" element={<Roles />} />
            <Route path="/gestion/permisos" element={<Permisos />} />
            <Route path="/gestion/vehiculos" element={<Vehiculo />} />
            <Route path="/gestion/vehiculos/ver/:id" element={<VehiculosVer />} />
            <Route path="/gestion/vehiculos/mediciones" element={<Mediciones />} />
            <Route path="/gestion/trabajos/ordenes-trabajo" element={<OrdenesTrabajos />} />
            <Route path="/gestion/trabajos/ordenes-trabajo/ver/:OT" element={<VerOrdenTrabajo />} />
            <Route path="/gestion/trabajos/autorizaciones" element={<Autorizaciones />} />


            <Route path="/gestion/mantenimientos/trabajos" element={<Mantenimientos />} />
            <Route path="/gestion/mantenimientos/planes" element={<PlanesMantenimiento />} />
            <Route path="/gestion/plan-mantenimiento/ver/:planId" element={<PlanMantenimientoVer />} />
            
            
            {/* <Route path="/gestion/contactos/documentos" element={<DocumentosLista />} />

            <Route path="/gestion/vehiculos/documentos" element={<DocumentosVehiculos />} />
            

            <Route path="/gestion/usuarios" element={<Usuarios />} />
            <Route path="/gestion/permisos/ver/:id" element={<PermisosVer />} /> */}

            {/* Rutas que requieren permisos específicos: se valida "usuarios:lectura" */}
        
          </Route>
        </Route>


        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={ <Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default Routers;
