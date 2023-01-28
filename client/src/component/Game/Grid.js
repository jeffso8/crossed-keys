import React, { useContext, useState, useEffect } from "react";
import { NEUTRAL_CARD, BLUE_CARD, RED_CARD, BOMB_CARD } from "../../constants";
import Card from "./Card";
import { Responsive } from "../shared/responsive";
import socket from "../../socket";
import { GameContext } from "../../context/GameContext";

export default function Grid(props) {
  const {
    gameOver,
    user,
    // roomID,
    timerID,
    gameScore,
  } = props;

  const { gameData, updateGameData } = useContext(GameContext);

  const { cards, redScore, blueScore } = gameData;
  const { isMobile } = Responsive();

  const cards1 = cards.slice(0, 5);
  const cards2 = cards.slice(5, 10);
  const cards3 = cards.slice(10, 15);
  const cards4 = cards.slice(15, 20);
  const cards5 = cards.slice(20, 25);

  const cardStyle = {
    container: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
      gridGap: 40,
      justifyContent: "center",
      maxWidth: "min-content",
    },
    columns: {
      margin: 0,
    },
  };

  const mobileCardStyle = {
    container: {
      display: "grid",
      gridGap: 6,
      gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
      maxWidth: "min-content",
      margin: "auto",
    },
    columns: {
      margin: 0,
    },
  };

  const style = isMobile ? mobileCardStyle : cardStyle;

  const handleBombClick = (team) => {
    if (team === "RED") {
      socket.emit("gameOver", {
        roomID: gameData.roomId,
        gameScore: [gameScore[0], gameScore[1] + 1],
        gameOver: true,
        redScore: redScore,
        blueScore: blueScore,
        timerID,
      });
    } else {
      socket.emit("gameOver", {
        roomID: gameData.roomId,
        gameScore: [gameScore[0] + 1, gameScore[1]],
        gameOver: true,
        redScore: redScore,
        blueScore: blueScore,
        timerID,
      });
    }
  };

  const renderCardColumns = (cardColumn, clickedColumn) => {
    return (
      <div style={style.columns}>
        {cardColumn.map((card, index) => {
          const { isClicked, color, word } = card;
          return (
            <Card
              word={word}
              isClicked={isClicked}
              color={color}
              user={user}
              clickedColumn={clickedColumn}
              index={index}
            />
          );
        })}
      </div>
    );
  };
  return (
    <div style={style.container}>
      {renderCardColumns(cards1, 0)}
      {renderCardColumns(cards2, 1)}
      {renderCardColumns(cards3, 2)}
      {renderCardColumns(cards4, 3)}
      {renderCardColumns(cards5, 4)}
    </div>
  );
}
