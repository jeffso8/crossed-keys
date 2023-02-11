import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import socket from "../socket";

const useGameMaster = () => {
  const { gameData, updateGameData } = useContext(GameContext);

  const { roomId, user, isRedTurn } = gameData;
  const handleCardClick = ({ index }: { index: number }) => {
    socket.emit("flipCard", { roomID: roomId, user, index });
  };

  const handleEndTurn = () => {
    socket.emit("updateTurn", { roomID: roomId });
  };

  const submitHint = ({
    hint,
    hintCount,
  }: {
    hint: string;
    hintCount: number;
  }) => {
    socket.emit("newHint", {
      roomID: roomId,
      hint,
      hintCount,
      isRedTurn,
    });
  };

  return {
    handleCardClick,
    handleEndTurn,
    submitHint,
  };
};

export default useGameMaster;
