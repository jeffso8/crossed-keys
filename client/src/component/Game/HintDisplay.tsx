import { useEffect, useContext } from "react";
import socket from "../../socket";
import { Responsive } from "../shared/responsive";
import { RED_CARD, BLUE_CARD } from "../../constants";
import { DataType } from "../../types";
import { GameContext } from "../../context/GameContext";

export default function HintDisplay() {
  const { isMobile } = Responsive();
  const { gameData, updateGameData } = useContext(GameContext);

  const { hints } = gameData;
  const webStyle = {
    hintDisplay: {
      alignContent: "center" as "center",
    },
    title: {
      fontSize: "26px",
      marginBottom: "12px",
    },
  };

  const mobileStyle = {
    hintDisplay: {
      alignContent: "center" as "center",
      width: 100,
    },
    title: {
      fontSize: "24px",
      fontWeight: 700,
      margin: 12,
    },
  };

  const style = isMobile ? mobileStyle : webStyle;
  useEffect(() => {
    socket.on("sendHint", (data: DataType) => {
      updateGameData({ hints: data.hints });
    });
  }, []);

  return (
    <div style={style.hintDisplay}>
      <div style={style.title}>Hints</div>
      <div>
        {hints.map((hint) => {
          return (
            <div
              style={{
                color: hint.isRedTurn ? RED_CARD : BLUE_CARD,
                marginBottom: "6px",
                fontFamily: "Clearface",
              }}
            >
              {hint.hint} for {hint.hintCount}
            </div>
          );
        })}
      </div>
    </div>
  );
}
