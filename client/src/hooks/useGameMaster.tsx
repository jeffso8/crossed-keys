import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import socket from "../socket";

const useGameMaster = () => {
  const { gameData, updateGameData } = useContext(GameContext);

  const { roomId, user } = gameData;
  const handleCardClick = ({ index }: { index: number }) => {
    socket.emit("flipCard", { roomID: roomId, user, index });
  };

  const handleEndTurn = () => {
    socket.emit("updateTurn", { roomID: roomId });
  };

  return {
    handleCardClick,
    handleEndTurn,
  };
};

export default useGameMaster;
