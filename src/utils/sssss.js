import { jwtDecode } from "jwt-decode";
import { url } from "../data/url";

export const verificarPermisos = async (requiredPermissions) => {
    const token = localStorage.getItem("token");

    if (!token) return false;

    // Decodificar el token JWT
    const user = jwtDecode(token);

    // Verificar si el token ha expirado
    if (user.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        return false;
    }

    try {
        // Llamar a la API para obtener los permisos del usuario
        const response = await fetch(`${api}/permisos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id: user.usuario.ID_USUARIO })
        });

        if (!response.ok) {
            console.error("Error al obtener permisos:", response.statusText);
            return false;
        }

        const data = await response.json();
        const userPermissions = data.permisos || [];

        // Verificar si el usuario tiene al menos uno de los permisos requeridos
        let tienePermiso = false;

        for (const permission of requiredPermissions) {
            for (const userPermission of userPermissions) {
                    if (userPermission.COMBINADO === permission) {
                    tienePermiso = true;
                    break; // Salir del bucle interno si se encuentra el permiso
                }
            }
            if (tienePermiso) break; // Salir del bucle externo si ya se encontró un permiso válido
        }

        return tienePermiso;

    } catch (error) {
        console.error("Error en la verificación de permisos:", error);
        return false;
    }
};
