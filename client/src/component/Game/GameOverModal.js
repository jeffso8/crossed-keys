import React, { useContext, useState, useEffect } from "react";
import Modal from "../shared/Modal";
import socket from "../../socket";
import { GameContext } from "../../context/GameContext";

function GameOverModal(props) {
  const style = {
    content: {
      position: "relative",
      top: "25%",
      margin: "10px",
    },
  };
  const { gameScore, user } = props;
  const [claimVisible, setClaimVisible] = useState(false);
  const { gameData, updateGameData } = useContext(GameContext);

  const handleNextGame = () => {
    socket.emit("hostStartGame", { roomID: gameData.roomId });
  };

  const handleClaimSpyMasterClick = () => {
    socket.emit("claimSpyMaster", {
      roomID: gameData.roomId,
      userID: user.userID,
    });
    if (user.team === "RED") {
      setClaimVisible(false);
    } else if (user.team === "BLUE") {
      setClaimVisible(false);
    }
  };

  const handleSpyChange = () => {
    setClaimVisible(true);
  };

  return (
    <Modal title={"New Game"}>
      <div>
        <div style={style.content}>
          Game Over:
          <h1>
            {gameScore[0]} - {gameScore[1]}
          </h1>
          <button onClick={() => handleNextGame()}>Start Next Game</button>
          <button onClick={() => handleSpyChange()}>Re-Pick SpyMaster</button>
          {claimVisible ? (
            <button onClick={handleClaimSpyMasterClick}>Claim Spy</button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

export default GameOverModal;
