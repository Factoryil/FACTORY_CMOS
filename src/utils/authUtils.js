import { jwtDecode } from "jwt-decode";

/**
 * Obtiene el token del localStorage
 * @returns {string | null} Token si existe, null si no.
 */
export const obtenerToken = () => localStorage.getItem("token");

/**
 * Guarda el token en localStorage
 * @param {string} token - Token a guardar
 */
export const guardarToken = (token) => localStorage.setItem("token", token);

/**
 * Elimina el token del localStorage
 */
export const eliminarToken = () => localStorage.removeItem("token");

/**
 * Decodifica el token y verifica si ha expirado
 * @returns {boolean} `true` si es válido, `false` si ha expirado o es inválido.
 */
export const esTokenValido = () => {
  const token = obtenerToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const expiracion = decoded.exp * 1000; // Convertir a milisegundos
    return Date.now() < expiracion; // Devuelve `true` si el token es válido
  } catch (error) {
    return false; // Token inválido
  }
};

/**
 * Decodifica el token 
 * 
 */
export const datosToken = () => {
  const token = obtenerToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded; // Devuelve los datos
  } catch (error) {
    eliminarToken()
    return false; // Token inválido
  }
};



/**
 * Verifica el token y lo elimina si es inválido
 */
export const verificarYEliminarToken = async () => {
  const esValido = await validarTokenEnServidor();
  if (!esValido) {
    eliminarToken();
    window.location.href = "/login"; // Redirigir a login
  }
};
