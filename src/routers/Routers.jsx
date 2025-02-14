// src/routes/Routers.jsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
import PermissionRoute from "./PermissionRoute";
import Logout from "../pages/Logout/Logout";
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import Contactos from "../pages/GestionConstactos/Contactos/Contactos";
import ContactosVer from "../pages/GestionConstactos/ContactosVer/ContactosVer";
import Etiquetas from "../pages/GestionConstactos/Etiquetas/Etiquetas";
import EtiquetasVer from "../pages/GestionConstactos/EtiquetasVer/EtiquetasVer";

// Carga diferida de las páginas
const Login = lazy(() => import("../pages/Login/Login"));
const Inicio = lazy(() => import("../pages/Inicio/Inicio"));
// const Usuarios = lazy(() => import("../pages/Usuarios/Usuarios")); // Ejemplo de módulo con permiso

// Componente de carga mientras se cargan los componentes diferidos
const Loading = () => (
  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <h2>Cargando...</h2>
  </div>
);

function Routers() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Rutas protegidas: requieren autenticación */}
        <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Inicio />} />
          <Route element={<PermissionRoute requiredPermission="usuarios:lectura" />}>
           <Route path="/gestion/contactos" element={<Contactos />} />
          </Route>
          <Route path="/gestion/contactos/ver/:id" element={<ContactosVer />} />
          <Route path="/gestion/etiquetas" element={<Etiquetas />} />
          <Route path="/gestion/etiquetas/ver/:id" element={<EtiquetasVer />} />
          {/* <Route path="/gestion/contactos/documentos" element={<DocumentosLista />} />

          <Route path="/gestion/vehiculo" element={<Vehiculo />} />
          <Route path="/gestion/vehiculos/ver/:id" element={<VehiculosVer />} />
          <Route path="/gestion/vehiculos/documentos" element={<DocumentosVehiculos />} />
          

          <Route path="/gestion/usuarios" element={<Usuarios />} />
          <Route path="/gestion/permisos" element={<Permisos />} />
          <Route path="/gestion/permisos/ver/:id" element={<PermisosVer />} /> */}

          {/* Rutas que requieren permisos específicos: se valida "usuarios:lectura" */}
        
        </Route>
        </Route>



        {/* Ruta para acceso no autorizado */}
        <Route
          path="/unauthorized"
          element={
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <h1>Acceso no autorizado</h1>
              <p>No tienes permisos para acceder a este módulo.</p>
              <a href="/" style={{ textDecoration: "none", color: "blue" }}>
                Volver al inicio
              </a>
            </div>
          }
        />

        {/* Ruta 404 */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <h1>404 - Página no encontrada</h1>
              <a href="/" style={{ textDecoration: "none", color: "blue" }}>
                Volver al inicio
              </a>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default Routers;
