import React, { useEffect, useContext } from "react";
import useGameMaster from "../../hooks/useGameMaster";
import { GameContext } from "../../context/GameContext";

function Timer(props) {
  const { gameData, updateGameData } = useContext(GameContext);

  const [countdown, setCountdown] = React.useState(undefined);
  const { handleEndTurn } = useGameMaster();
  useEffect(() => {
    if (!gameData.gameOver && countdown <= 0) {
      handleEndTurn();
    } else {
      const timeout = setTimeout(() => {
        setCountdown(Math.floor((props.turnEndTime - Date.now()) / 1000));
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [countdown]);

  useEffect(() => {
    if (!gameData.gameOver) {
      setCountdown(Math.floor((props.turnEndTime - Date.now()) / 1000));
    }
  }, [props.turnEndTime]);

  if (!countdown && countdown !== 0) return null;

  return (
    <>
      <div
        style={{ marginTop: "28px" }}
        className={`flip-countdown theme-light size-medium`}
      >
        <span style={{ fontSize: "30px", fontFamily: "Clearface" }}>
          {countdown && countdown == -1 ? 0 : countdown}
        </span>
      </div>
    </>
  );
}

export default Timer;
