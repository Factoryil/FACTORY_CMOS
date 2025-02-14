// src/hooks/usePermission.js
import { useState, useEffect } from "react";
import { datosToken } from "../utils/authUtils";
import { apiManager } from "../api/apiManager";

const usePermission = (requiredPermission) => {
  const [hasPermission, setHasPermission] = useState(null);
  const token = datosToken();

  useEffect(() => {
    async function checkPermission() {
      const permisos = await apiManager.getUserPermissions(token.usuario.ID_USUARIO);
      const permitido = permisos.some(p => `${p.MODULO}:${p.TIPO}` === requiredPermission);
      setHasPermission(permitido);
    }
    checkPermission();
  }, [requiredPermission, token]);

  return hasPermission;
};

export default usePermission;
