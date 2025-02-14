import React from 'react';
import styles from './TituloN1.module.css';

const TituloN1 = ({titulo, parrafo}) => {


  return (
    <div className={styles.contenedor}>
      <h1 className={styles.title}> {titulo} </h1>

      <p className={styles.parrafo}> {parrafo} </p>
    </div>
  );
};

export default TituloN1;
