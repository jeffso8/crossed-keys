import React, { useState, useEffect, useContext } from "react";
import GameGrid from "./GameGrid";
import socket from "../../socket";
import GameInfoModal from "./GameInfoModal";
import GameOverModal from "./GameOverModal";
import Hint from "./Hint";
import HintDisplay from "./HintDisplay";
import GameHeader from "./GameHeader";
import { DataType, UserType } from "../../types";
import { Responsive } from "../shared/responsive";
import { GameContext } from "../../context/GameContext";
import useGameMaster from "../../hooks/useGameMaster";
import { TextButton } from "../shared/TextButton";

type GamePropsType = {
  location: {
    state: {
      data: DataType;
      userID: string;
    };
  };
};

function Game(props: GamePropsType) {
  const { gameData, updateGameData } = useContext(GameContext);
  const { handleEndTurn } = useGameMaster();
  const { roomId, isRedTurn, gameOver, user } = gameData;
  const emptyUser = {
    userID: "",
    team: "",
    role: "",
    isHost: false,
    socketId: "",
  };
  // const [roomID, setRoomID] = useState(props.location.state.data.roomID);
  // const [users, setUsers] = useState<UserType[]>([]);
  // const [redTurn, setRedTurn] = useState(props.location.state.data.isRedTurn);
  const [showModal, setShowModal] = useState(false);
  const [gameScore, setGameScore] = useState(
    props.location.state.data.totalGameScore
  );
  // const [gameOver, setGameOver] = useState(props.location.state.data.gameOver);
  const [mounted, setMounted] = useState(false);

  const { isMobile } = Responsive();

  const webStyle = {
    container: {
      justifyContent: "center",
      position: "relative" as "relative",
    },
  };

  const mobileStyle = {
    container: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column" as "column",
      position: "relative" as "relative",
    },
  };

  const style = isMobile ? mobileStyle : webStyle;

  useEffect(() => {
    updateGameData({ roomId: props.location.state.data.roomID });
  }, []);

  useEffect(() => {
    console.log("effect");
    socket.emit("joinGame", {
      roomID: props.location.state.data.roomID,
      user: props.location.state.data.users.find(
        (user) => user.userID === props.location.state.userID
      ),
    });

    socket.on("refreshGame", (data: DataType) => {
      console.log("refreshGame", data, props.location);
      setGameScore(data.totalGameScore);
      // setGameOver(data.gameOver);
      const user =
        data.users.find(
          (user) => user.userID === props.location.state.userID
        ) || emptyUser;

      updateGameData({
        cards: data.cards,
        users: data.users,
        user,
        words: data.words,
        redScore: data.redScore,
        blueScore: data.blueScore,
        isRedTurn: data.isRedTurn,
        turnEndTime: data.turnEndTime,
        hints: data.hints,
      });

      // @ts-ignore
      // setTurnEndTime(data.turnEndTime);

      setMounted(true);
    });

    socket.on("updateFlipCard", (data: DataType) => {
      // @ts-ignore
      const { cards, isRedTurn, blueScore, redScore, turnEndTime } = data;
      if (turnEndTime) {
        updateGameData({ cards, isRedTurn, blueScore, redScore, turnEndTime });
      } else {
        updateGameData({ cards, isRedTurn, blueScore, redScore });
      }
    });

    socket.on("updateTeams", (data: DataType) => {
      const user =
        data.users.find(
          (user) => user.userID === props.location.state.userID
        ) || emptyUser;
      updateGameData({ users: data.users, user });
    });

    socket.on("redTurn", (data: DataType) => {
      updateGameData({
        isRedTurn: data.redTurn,
        turnEndTime: data.turnEndTime,
      });
    });

    socket.on("updateGameOver", (data: DataType) => {
      setGameScore(data.totalGameScore);
      updateGameData({ gameOver: data.gameOver, cards: data.cards });
    });
  }, []);

  const renderEndTurn = () => {
    if (
      (user?.team === "RED" && isRedTurn) ||
      (user?.team === "BLUE" && !isRedTurn)
    ) {
      return (
        <button
          className="hover-underline-animation"
          style={{
            border: "none",
            background: "none",
            color: "black",
            fontFamily: "Clearface",
            fontStyle: "italic",
            fontSize: "20px",
            cursor: "pointer",
          }}
          onClick={() => handleEndTurn()}
        >
          End Turn
        </button>
      );
    }
  };

  return (
    <>
      {mounted && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <GameHeader
            handleEndTurn={handleEndTurn}
            redTurn={isRedTurn}
            user={user}
          />
          <div style={style.container}>
            <GameGrid
              gameOver={gameOver}
              handleEndTurn={handleEndTurn}
              user={user}
              gameScore={gameScore}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <div>
              <HintDisplay />
              {user?.role === "MASTER" ? (
                <Hint
                  roomID={gameData.roomId}
                  isRedTurn={isRedTurn}
                  user={user}
                />
              ) : null}
            </div>
            <div>
              <div style={{}}>{renderEndTurn()}</div>
              <TextButton
                text={"Show Modal"}
                onMouseEnter={() => setShowModal(true)}
                onMouseLeave={() => setShowModal(false)}
                onClick={() => {}}
                style={{}}
              />
            </div>
          </div>
          {showModal ? (
            <GameInfoModal show={showModal} gameScore={gameScore} />
          ) : null}
          {gameOver ? (
            <GameOverModal gameScore={gameScore} user={user} />
          ) : null}
        </div>
      )}
    </>
  );
}

export default Game;
