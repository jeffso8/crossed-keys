import React, { useState } from "react";
import { GameData } from "./types";

export const GameContext = React.createContext<{
  gameData: GameData;
  // updateGameData: React.Dispatch<React.SetStateAction<GameData>>;
  updateGameData: (updateData: Partial<GameData>) => void;
}>({
  gameData: {
    roomId: "",
    redScore: 8,
    blueScore: 8,
    words: [],
    users: [],
    user: null,
    cards: [],
    isRedTurn: false,
    turnEndTime: new Date().getTime(),
    gameOver: false,
  },
  updateGameData: () => {},
});

export const GameContextProvider: React.FC = ({ children }) => {
  const [gameData, setGameData] = useState<GameData>({
    roomId: "",
    redScore: 8,
    blueScore: 8,
    cards: [],
    words: [],
    users: [],
    user: null,
    isRedTurn: false,
    turnEndTime: new Date().getTime(),
    gameOver: false,
  });

  return (
    <GameContext.Provider
      value={{
        gameData,
        updateGameData: (updateData: Partial<GameData>) => {
          setGameData((prevData: GameData) => {
            const updatedData = { ...prevData, ...updateData };
            return updatedData;
          });
        },
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
