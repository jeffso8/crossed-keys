import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import socket from "../socket";

const useGameMaster = () => {
  const { gameData, updateGameData } = useContext(GameContext);

  const { roomId } = gameData;
  const handleCardClick = (index: any, turn: any) => {
    socket.emit("flipCard", { roomID: roomId, index, isRedTurn: turn });
  };

  return {
    handleCardClick,
  };
};

export default useGameMaster;
