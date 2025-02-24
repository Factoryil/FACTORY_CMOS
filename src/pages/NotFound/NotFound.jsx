import styles from "./NotFound.module.css";
import imagen from "../../assets/img/page-misc-error-light.png";

const NotFound = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>Página no encontrada :(</h2>
      <p className={styles.p}>
        ¡Ups! 😖 La URL solicitada no se encontró en este servidor.
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

export default NotFound;
