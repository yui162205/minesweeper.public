import { useState } from 'react';
import styles from './index.module.css';

export const Home = () => {
  const [samplePos, setSamplePos] = useState(0);
  console.log('sample', samplePos);
  return (
    <div className={styles.container}>
      <div className={styles.boardStyle}>
        <div
          className={styles.sampleStyle}
          style={{ backgroundPosition: `${-30 * samplePos}px 0px` }}
        />
      </div>
      <button onClick={() => setSamplePos((p) => (p + 1) % 14)}>sample</button>
    </div>
  );
};
