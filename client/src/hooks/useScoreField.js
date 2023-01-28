import React, { useState, useEffect } from "react";
import socket from "../../socket";

function useScoreField(initial) {
  const [score, setScore] = useState(initial);

  const handleRedScoreChange = (score) => {
    socket.emit("redScoreChange", { roomID, redScore: score });
    if (score === 0) {
      socket.emit("gameOver", {
        roomID,
        gameScore: [gameScore[0] + 1, gameScore[1]],
        gameOver: true,
        redScore: score,
        blueScore: blueScore,
      });
    }
  };

  return [score, setScore];
}

export default useScoreField;
