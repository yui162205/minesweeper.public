import { useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';

const directions = [
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
];

const Home = () => {
  // const [isGameOverBotan, setIsGameOverBotan] = useState(false);

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
  const [userInput, setUserInput] = useState([
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

  const checkAround = (board: number[][], x: number, y: number) => {
    let bombCount = 0;
    for (const [dy, dx] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx < 0 || nx >= 9 || ny < 0 || ny >= 9) continue;

      if (bombMap[ny][nx] === 1) {
        bombCount += 1;
      }
      board[y][x] = bombMap[y][x] === 1 ? 11 : bombCount;
    }

    if (bombMap[y][x] === 1) return;
    for (const [dy, dx] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx < 0 || nx >= 9 || ny < 0 || ny >= 9) continue;
      if (bombCount === 0 && board[ny][nx] === -1 && bombMap[ny][nx] === 0) {
        checkAround(board, nx, ny);
      }
    }
  };

  const board = bombMap.map((row) => row.map(() => -1));

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (userInput[y][x] === 1) {
        checkAround(board, x, y);
      }
    }
  }

  let setIsGameOver = false;
  const isGameOver = (x: number, y: number) => {
    if (userInput[y][x] === 1 && bombMap[y][x] === 1) {
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          if (bombMap[y][x] === 1 && userInput[y][x] !== 2) {
            board[y][x] = 11;
          }
        }
      }
      setIsGameOver = true;
    }
    return setIsGameOver;
  };

  const isGameClear = useCallback(() => {
    let bombCount2 = 0;
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (board[y][x] !== -1 && bombMap[y][x] !== 1) {
          bombCount2++;
        }
      }
    }
    return bombCount2 === 71;
  }, [board, bombMap]);

  // タイマーの状態と管理
  const [time, setTime] = useState(0);
  // ゲームが終了したかのフラグ
  const [isGameStarted, setIsGameStarted] = useState(false);
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isGameStarted) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (setIsGameOver === true || isGameClear()) {
      setIsGameStarted(false);
    }
    return () => clearInterval(interval);
  }, [isGameStarted, time, setIsGameOver, isGameClear]);

  console.log('bomb');
  console.table(bombMap);

  const clickHandler = (x: number, y: number) => {
    if (setIsGameOver || isGameClear() || userInput[y][x] === 2) {
      return;
    }
    if (!isGameStarted) setIsGameStarted(true); // ゲーム開始時にタイマーをスタート

    let bombCount = 0;
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (bombMap[y][x] === 1) {
          bombCount += 1;
        }
      }
    }

    if (bombCount === 0) {
      const newBombMap = structuredClone(bombMap);
      setBombMap(bombSet(x, y, newBombMap));
    }
    const newUserInputs = structuredClone(userInput);
    newUserInputs[y][x] = 1;
    setUserInput(newUserInputs);
  };

  const rightClickHandler = (x: number, y: number, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (board[y][x] === -1) {
      userInput[y][x] = 2;
      const newUserInputs = structuredClone(userInput);
      setUserInput(newUserInputs);
    }
    if (board[y][x] === 10) {
      userInput[y][x] = 0;
      const newUserInputs = structuredClone(userInput);
      setUserInput(newUserInputs);
    } else {
      return;
    }
  };

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (userInput[y][x] === 2 && board[y][x] === -1) {
        board[y][x] = 10;
      }
      if (userInput[y][x] === 0 && board[y][x] === 10) {
        board[y][x] = -1;
      }
    }
  }
  console.table(userInput);
  console.table(board);

  const bombSet = (x: number, y: number, bombMap: number[][]) => {
    const bombPos: number[][] = [];
    // 確認するときはこの下からコメントアウト
    while (bombPos.length < 10) {
      const bombX = Math.floor(Math.random() * 9);
      const bombY = Math.floor(Math.random() * 9);
      if (x === bombX && y === bombY) {
        continue;
      }
      // ボムの配置の条件付け
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
    // 確認用（bombの左寄せ）
    // for (let i = 0; i < 9; i++) {
    //   bombPos.push([0, i]);
    // }
    // bombPos.push([1, 1]);

    for (const i of bombPos) {
      bombMap[i[1]][i[0]] = 1;
    }
    return bombMap;
  };

  if (isGameClear()) {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (bombMap[y][x] === 1) {
          board[y][x] = 10;
        }
      }
    }
  }
  const resetHandler = () => {
    // setIsGameOverBotan(false);
    setIsGameStarted(false);
    setTime(0);
    const newBombMap = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    setBombMap(newBombMap);

    const newUserInputs = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    setUserInput(newUserInputs);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board2}>
        <div className={styles.board3}>
          <div className={styles.bombCountStyle} />
          <div className={styles.nicoStyle}>
            {board.map((row, y) =>
              row.map((color, x) => (
                <div
                  className={styles.imageStyle}
                  key={`${x}-${y}`}
                  style={{
                    backgroundPosition: isGameOver(x, y)
                      ? `${13 * -30}px 0px`
                      : isGameClear()
                        ? `${12 * -30}px 0px`
                        : `${11 * -30}px 0px`,
                  }}
                  onClick={() => resetHandler()}
                />
              )),
            )}
          </div>
          <div className={styles.timeStyle}>{time}</div>
        </div>

        <div className={styles.boardStyle}>
          {board.map((row, y) =>
            row.map((color, x) => (
              <div
                className={styles.cellStyle}
                onContextMenu={(event) => {
                  rightClickHandler(x, y, event);
                }}
                onClick={() => clickHandler(x, y)}
                key={`${x}-${y}`}
                style={{
                  borderColor:
                    board[y][x] >= 0 && board[y][x] !== 10
                      ? '#909090'
                      : '#fff #909090 #909090 #fff',
                  backgroundColor:
                    bombMap[y][x] && userInput[y][x] && isGameOver(x, y) ? '#ffaaaa' : '#c6c6c6',
                }}
                // 赤い表示をリセットしたい
              >
                <div
                  className={styles.imageStyle}
                  style={{
                    backgroundPosition: `${(board[y][x] - 1) * -30}px 0px`,
                  }}
                />
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
