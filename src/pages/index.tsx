import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [userInPut, setUserInPut] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const bombSet = (x: number, y: number, bombMap: number[][]) => {
    const bombPos = [];
    while (bombPos.length < 10) {
      const bombX = Math.floor(Math.random() * 8);
      const bombY = Math.floor(Math.random() * 8);
      const double = [0];
      for (const i of bombPos) {
        if (i[1] === bombX && i[0] === bombY) {
          double[0]++;
          break;
        }
      }
      if (double[0] === 1) {
        continue;
      }
      if (x === bombX && y === bombY) {
        continue;
      }
      bombPos.push([bombY, bombX]);
    }
    console.log(bombPos);
    for (const i of bombPos) {
      bombMap[i[1]][i[0]] = 11;
    }
    return bombMap;
  };
  const clickHandler = (x: number, y: number) => {
    const newBombMap = structuredClone(bombMap);
    setBombMap(bombSet(x, y, newBombMap));
  };
  return (
    <div className={styles.container}>
      <div className={styles.boardStyle}>
        {bombMap.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cellStyle} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              <div
                className={styles.imageStyle}
                style={{ backgroundPosition: `${-30 * bombMap[y][x] + 30}px 0px` }}
              />
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
