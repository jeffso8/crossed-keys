import React, { useContext, useState, useEffect } from "react";
import { CAMEL, MAIZE } from "../../constants";
import GameMaster from "../../hooks/useGameMaster";
import { Responsive } from "../shared/responsive";
import socket from "../../socket";
import { GameContext } from "../../context/GameContext";

import { NEUTRAL_CARD, BLUE_CARD, RED_CARD, BOMB_CARD } from "../../constants";
import useGameMaster from "../../hooks/useGameMaster";

function Card(props: any) {
  const { gameData, updateGameData } = useContext(GameContext);
  const gameMaster = useGameMaster();
  const { user } = gameData;
  const [visible, setVisible] = useState(props.clicked);
  // const [isDisabled, setIsDisabled] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  // const redTurn = props.redTurn;

  const { isMobile } = Responsive();

  const { clickedColumn, isClicked, index } = props;
  useEffect(() => {
    // setIsDisabled(props.isDisabled);

    if (props.user.role === "MASTER") {
      setVisible(true);
      // setIsDisabled(true);
      setIsMaster(true);
    }
  }, [props.isDisabled, props.user.role]);

  const webStyle = {
    container: {
      backgroundColor: props.clicked || visible ? props.color : CAMEL,
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
      backgroundColor: props.clicked || visible ? props.color : CAMEL,
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
    if (isClicked) {
      return;
    }
    if (color === BOMB_CARD) {
      handleBombClick(user?.team);
    } else {
      if (true) {
        if (color === RED_CARD) {
          // handleRedScoreChange(redScore - 1);
          gameMaster.handleCardClick(index + clickedColumn * 5, true);
        } else {
          if (color === BLUE_CARD) {
            // handleBlueScoreChange(blueScore - 1);
            // handleEndTurn(!redTurn);
          }
          gameMaster.handleCardClick(index + clickedColumn * 5, false);
          // handleEndTurn(!redTurn);
        }
      } else {
        if (color === BLUE_CARD) {
          // handleBlueScoreChange(blueScore - 1);
          gameMaster.handleCardClick(index + clickedColumn * 5, false);
        } else {
          if (color === RED_CARD) {
            // handleRedScoreChange(redScore - 1);
            // handleEndTurn(!redTurn);
          }
          gameMaster.handleCardClick(index + clickedColumn * 5, true);
          // handleEndTurn(!redTurn);
        }
      }
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
