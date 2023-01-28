import React, { useState } from "react";
import { GameData } from "./types";

export const GameContext = React.createContext<{
  gameData: GameData;
  // updateGameData: React.Dispatch<React.SetStateAction<GameData>>;
  updateGameData: (updateData: Partial<GameData>) => void;
}>({
  gameData: {
    roomId: "",
    gameScore: [0, 0],
    words: [],
    users: [],
    user: null,
    cards: [],
  },
  updateGameData: () => {},
});

export const GameContextProvider: React.FC = ({ children }) => {
  const [gameData, setGameData] = useState<GameData>({
    roomId: "",
    gameScore: [0, 0],
    cards: [],
    words: [],
    users: [],
    user: null,
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
