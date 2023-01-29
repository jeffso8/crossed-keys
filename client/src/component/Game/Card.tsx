import React, { useContext, useState, useEffect } from "react";
import { CAMEL, MAIZE } from "../../constants";
import { Responsive } from "../shared/responsive";
import { GameContext } from "../../context/GameContext";

import { NEUTRAL_CARD, BLUE_CARD, RED_CARD, BOMB_CARD } from "../../constants";
import useGameMaster from "../../hooks/useGameMaster";
type CardPropsType = {
  word: string;
  color: string;
  isClicked: boolean;
  user: any;
  clickedColumn: number;
  index: number;
};

function Card(props: CardPropsType) {
  const { gameData } = useContext(GameContext);
  const gameMaster = useGameMaster();
  const { user, isRedTurn } = gameData;
  const { clickedColumn, isClicked, index, color } = props;

  const { isMobile } = Responsive();
  const isMaster = user?.role === "MASTER";

  const webStyle = {
    container: {
      backgroundColor: isClicked || isMaster ? color : CAMEL,
      width: 165,
      height: 80,
      marginTop: 12,
      marginBottom: 12,
      display: "flex",
      justifyContent: "center",
      boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
    },
    word: {
      fontSize: 14,
      textTransform: "uppercase",
      letterSpacing: 2,
      fontWeight: 900,
      textAlign: "center",
      alignSelf: "center",
      color: MAIZE,
    },
  };

  const mobileStyle = {
    container: {
      backgroundColor: isClicked || isMaster ? color : CAMEL,
      width: 68,
      height: 42,
      marginTop: 6,
      marginBottom: 6,
      display: "flex",
      justifyContent: "center",
      boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
    },
    word: {
      fontSize: 7,
      // textTransform: "uppercase",
      letterSpacing: 1,
      fontWeight: 900,
      // textAlign: "center",
      alignSelf: "center",
      color: MAIZE,
    },
  };

  const style = isMobile ? mobileStyle : webStyle;

  const handleBombClick = (team: any) => {
    // if (team === "RED") {
    //   socket.emit("gameOver", {
    //     roomID: gameData.roomId,
    //     gameScore: [gameScore[0], gameScore[1] + 1],
    //     gameOver: true,
    //     redScore: redScore,
    //     blueScore: blueScore,
    //     timerID,
    //   });
    // } else {
    //   socket.emit("gameOver", {
    //     roomID: gameData.roomId,
    //     gameScore: [gameScore[0] + 1, gameScore[1]],
    //     gameOver: true,
    //     redScore: redScore,
    //     blueScore: blueScore,
    //     timerID,
    //   });
  };
  const handleClick = (isClicked: any, index: number, color: string) => {
    console.log("user", user, isRedTurn);
    if (
      isClicked ||
      (user?.team === "RED" && !isRedTurn) ||
      (user?.team === "BLUE" && isRedTurn) ||
      isMaster
    ) {
      return;
    }
    if (color === BOMB_CARD) {
      handleBombClick(user?.team);
    } else {
      gameMaster.handleCardClick({
        index: index + clickedColumn * 5,
      });
    }
  };

  return (
    <div
      className="card-container"
      style={{
        ...style.container,
        opacity: isClicked ? 0.3 : 1,
        cursor: "pointer",
      }}
      onClick={() => handleClick(isClicked, index, "")}
    >
      <div style={style.word}>{props.word}</div>
    </div>
  );
}

export default Card;
