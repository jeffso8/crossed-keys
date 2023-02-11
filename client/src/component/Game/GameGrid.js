import React, { useContext, useState, useEffect } from "react";
import Grid from "../shared/Grid";
import Card from "./Card";
import { Responsive } from "../shared/responsive";
import { GameContext } from "../../context/GameContext";

export default function GameGrid(props) {
  const { gameOver, user, timerID, gameScore } = props;

  const { gameData, updateGameData } = useContext(GameContext);

  const { cards, redScore, blueScore } = gameData;
  console.log("cards", cards);
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

  // const handleBombClick = (team) => {
  //   if (team === "RED") {
  //     socket.emit("gameOver", {
  //       roomID: gameData.roomId,
  //       gameScore: [gameScore[0], gameScore[1] + 1],
  //       gameOver: true,
  //       redScore: redScore,
  //       blueScore: blueScore,
  //       timerID,
  //     });
  //   } else {
  //     socket.emit("gameOver", {
  //       roomID: gameData.roomId,
  //       gameScore: [gameScore[0] + 1, gameScore[1]],
  //       gameOver: true,
  //       redScore: redScore,
  //       blueScore: blueScore,
  //       timerID,
  //     });
  //   }
  // };

  const renderCardColumns = (cardColumn, clickedColumn) => {
    return (
      <Grid container direction={"column"} alignItems={"center"}>
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
      </Grid>
    );
  };
  console.log('huh"');

  return (
    <div style={{ width: "70%", margin: "auto" }}>
      <Grid
        container
        // mx={{ xs: 2, sm: 10, md: 10, lg: 20 }}
        columnGap={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 3 }}
      >
        {renderCardColumns(cards1, 0)}
        {renderCardColumns(cards2, 1)}
        {renderCardColumns(cards3, 2)}
        {renderCardColumns(cards4, 3)}
        {renderCardColumns(cards5, 4)}
      </Grid>
    </div>
  );
  // return (
  //   <div style={style.container}>
  //     {renderCardColumns(cards1, 0)}
  //     {renderCardColumns(cards2, 1)}
  //     {renderCardColumns(cards3, 2)}
  //     {renderCardColumns(cards4, 3)}
  //     {renderCardColumns(cards5, 4)}
  //   </div>
  // );
}
