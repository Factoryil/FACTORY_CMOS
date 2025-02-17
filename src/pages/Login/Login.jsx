import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import logo_login from "../../assets/img/logo_login.png";
import { apiManager } from "../../api/apiManager";
import { guardarToken } from "../../utils/authUtils";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados para el login y recuperación
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [emailRecovery, setEmailRecovery] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState("");

  // Determina si se muestra la sección de recuperación según la query string
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setShowForgot(queryParams.get("recuperar") === "true");
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!showForgot) {
      // Modo login
      try {
        const repuesta = await apiManager.login({ email: correo, password });
        if (repuesta.error) {
          console.error("Error en el login:", repuesta.error);
          setError("Error en el login. Verifica tus credenciales.");
          return;
        }
        guardarToken(repuesta.token);
        navigate("/");
      } catch (err) {
        console.error("Error en el login:", err);
        setError("Error en el login. Inténtalo de nuevo.");
      }
    } else {
      // Modo recuperación (placeholder)
      console.log("Recuperación de contraseña no implementada");
      setError("La recuperación de contraseña aún no está implementada.");
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.formContainer}>
        <div className={styles.contenedorLogoCmos}>
          <img src={logo_login} alt="Logo" />
        </div>
        <div className={styles.formCard}>
          <h2 className={styles.h2}>
            {showForgot ? "Recuperar Contraseña" : "Iniciar Sesión"}
          </h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit}>
            {!showForgot ? (
              <div className={styles.formSection}>
                <label className={styles.label} htmlFor="email">
                  Correo Electrónico
                </label>
                <input
                  className={styles.input}
                  type="email"
                  id="email"
                  placeholder="Ingresa tu correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
                <label className={styles.label} htmlFor="password">
                  Contraseña
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    className={styles.input}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i className="fas fa-eye-slash"></i>
                    ) : (
                      <i className="fas fa-eye"></i>
                    )}
                  </span>
                </div>
                <button className={styles.button} type="submit">
                  Iniciar Sesión
                </button>
                <p className={styles.formSwitch}>
                  <Link to="/login?recuperar=true">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </p>
              </div>
            ) : (
              <div className={styles.formSection}>
                <label className={styles.label} htmlFor="recovery-email">
                  Correo Electrónico
                </label>
                <input
                  className={styles.input}
                  type="email"
                  id="recovery-email"
                  placeholder="Ingresa tu correo para recuperar tu cuenta"
                  value={emailRecovery}
                  onChange={(e) => setEmailRecovery(e.target.value)}
                  required
                />
                <button className={styles.button} type="submit">
                  Recuperar Contraseña
                </button>
                <p className={styles.formSwitch}>
                  <Link to="/login">Iniciar Sesión</Link>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
