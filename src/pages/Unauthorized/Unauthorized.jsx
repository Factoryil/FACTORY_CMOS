import styles from "./Unauthorized.module.css";
import imagen from "../../assets/img/page-misc-error-light.png";

const Unauthorized = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>Acceso no autorizado</h2>
      <p className={styles.p}>
        No tienes permisos para acceder a este módulo.
      </p>
      <a href="/" className={styles.a}>
        Volver al inicio
      </a>
      <div className={styles.imageContainer}>
        <img
          src={imagen}
          alt="page-misc-error-light"
          className={styles.img}
        />
      </div>
    </div>
  );
};

export default Unauthorized;
