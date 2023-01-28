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
    redTurn,
    // roomID,
    redScore,
    handleEndTurn,
    handleRedScoreChange,
    handleBlueScoreChange,
    blueScore,
    timerID,
    gameScore,
    clicked,
    colors,
  } = props;

  const { gameData, updateGameData } = useContext(GameContext);

  const { words, cards } = gameData;
  // console.log("words", words);
  const { isMobile } = Responsive();

  const cards1 = cards.slice(0, 5);
  const cards2 = cards.slice(5, 10);
  const cards3 = cards.slice(10, 15);
  const cards4 = cards.slice(15, 20);
  const cards5 = cards.slice(20, 25);

  const rowColor1 = colors.slice(0, 5);
  const rowColor2 = colors.slice(5, 10);
  const rowColor3 = colors.slice(10, 15);
  const rowColor4 = colors.slice(15, 20);
  const rowColor5 = colors.slice(20, 25);

  const wordsColumn1 = words.slice(0, 5);
  const wordsColumn2 = words.slice(5, 10);
  const wordsColumn3 = words.slice(10, 15);
  const wordsColumn4 = words.slice(15, 20);
  const wordsColumn5 = words.slice(20, 25);

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

  const handleCardClick = (index, turn) => {
    socket.emit("flipCard", {
      roomID: gameData.roomId,
      index,
      isRedTurn: turn,
    });
  };

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
    // const handleClick = (isClicked, idx, color) => {
    //   if (isClicked) {
    //     return;
    //   }
    //   if (color === BOMB_CARD) {
    //     handleBombClick(user.team);
    //   } else {
    //     if (redTurn) {
    //       if (color === RED_CARD) {
    //         handleRedScoreChange(redScore - 1);
    //         handleCardClick(idx + clickedColumn * 5, true);
    //       } else {
    //         if (color === BLUE_CARD) {
    //           handleBlueScoreChange(blueScore - 1);
    //           handleEndTurn(!redTurn);
    //         }
    //         handleCardClick(idx + clickedColumn * 5, false);
    //         handleEndTurn(!redTurn);
    //       }
    //     } else {
    //       if (color === BLUE_CARD) {
    //         handleBlueScoreChange(blueScore - 1);
    //         handleCardClick(idx + clickedColumn * 5, false);
    //       } else {
    //         if (color === RED_CARD) {
    //           handleRedScoreChange(redScore - 1);
    //           handleEndTurn(!redTurn);
    //         }
    //         handleCardClick(idx + clickedColumn * 5, true);
    //         handleEndTurn(!redTurn);
    //       }
    //     }
    //   }
    // };

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
              // handleClick={handleClick}
              // handleClick={handleClick}
            />
          );
        })}
      </div>
    );
  };

  const renderColumns = (rowColor, wordColumn, clickedColumn, className) => {
    return (
      <div className={className} style={style.columns}>
        {rowColor.map((color, index) => {
          let realColor = "";
          if (color === "blue") {
            realColor = BLUE_CARD;
          } else if (color === "red") {
            realColor = RED_CARD;
          } else if (color === "black") {
            realColor = BOMB_CARD;
          } else {
            realColor = NEUTRAL_CARD;
          }

          //TODO: clicked and index, figure out a way to store these as states, and emitted to all clients
          const isClicked = clicked[index + clickedColumn * 5];
          const isDisabled =
            (user.team === "RED" && !redTurn) ||
            (user.team === "BLUE" && redTurn) ||
            user.role === "MASTER" ||
            isClicked ||
            gameOver;

          const handleClick = () => {
            if (isDisabled) {
              return;
            }
            if (realColor === BOMB_CARD) {
              handleBombClick(user.team);
            } else {
              if (redTurn) {
                if (realColor === RED_CARD) {
                  handleRedScoreChange(redScore - 1);
                  handleCardClick(index + clickedColumn * 5, true);
                } else {
                  if (realColor === BLUE_CARD) {
                    handleBlueScoreChange(blueScore - 1);
                    handleEndTurn(!redTurn);
                  }
                  handleCardClick(index + clickedColumn * 5, false);
                  handleEndTurn(!redTurn);
                }
              } else {
                if (BLUE_CARD === realColor) {
                  handleBlueScoreChange(blueScore - 1);
                  handleCardClick(index + clickedColumn * 5, false);
                } else {
                  if (realColor === RED_CARD) {
                    handleRedScoreChange(redScore - 1);
                    handleEndTurn(!redTurn);
                  }
                  handleCardClick(index + clickedColumn * 5, true);
                  handleEndTurn(!redTurn);
                }
              }
            }
          };

          return (
            <Card
              word={wordColumn[index]}
              clicked={isClicked}
              color={realColor}
              user={user}
              handleClick={handleClick}
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

      {/* {renderColumns(rowColor1, wordsColumn1, 0, "Column1")}
      {renderColumns(rowColor2, wordsColumn2, 1, "Column2")}
      {renderColumns(rowColor3, wordsColumn3, 2, "Column3")}
      {renderColumns(rowColor4, wordsColumn4, 3, "Column4")}
      {renderColumns(rowColor5, wordsColumn5, 4, "Column5")} */}
    </div>
  );
}
