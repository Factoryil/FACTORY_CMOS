// src/routes/PermissionRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { datosToken } from "../utils/authUtils";
import { apiManager } from "../api/apiManager";

const PermissionRoute = ({ requiredPermission }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const token = datosToken();

  useEffect(() => {
    async function checkPermission() {
      const permisos = await apiManager.getUserPermissions(token.usuario.ID_USUARIO);
      // Se verifica combinando el módulo y el tipo: "MODULO:TIPO"
      const permitido = permisos.some(p => `${p.MODULO}:${p.TIPO}` === requiredPermission);
      setHasPermission(permitido);
    }
    checkPermission();
  }, [requiredPermission, token]);

  // Mientras se comprueba la verificación, se muestra un mensaje de carga
  if (hasPermission === null) {
    return <div>Cargando permisos...</div>;
  }

  // Si no tiene permiso, redirige a una ruta "No autorizado"
  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si tiene el permiso, renderiza los componentes hijos
  return <Outlet />;
};

export default PermissionRoute;
