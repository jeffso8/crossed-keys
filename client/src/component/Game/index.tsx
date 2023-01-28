import React, { useState, useEffect, useContext } from "react";
import Grid from "./Grid";
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
  const { roomId, isRedTurn, gameOver } = gameData;
  const emptyUser = {
    userID: "",
    team: "",
    role: "",
    isHost: false,
    socketId: "",
  };
  // const [roomID, setRoomID] = useState(props.location.state.data.roomID);
  // const [users, setUsers] = useState<UserType[]>([]);
  const [user, setUser] = useState<UserType>(emptyUser);
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
      display: "flex",
      justifyContent: "center",
      position: "relative" as "relative",
      marginBottom: "20px",
    },
  };

  const mobileStyle = {
    container: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column" as "column",
      position: "relative" as "relative",
      marginTop: 50,
      marginBottom: 50,
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
      console.log("refreshGame", data);
      setGameScore(data.totalGameScore);
      // setGameOver(data.gameOver);
      updateGameData({
        cards: data.cards,
        users: data.users,
        words: data.words,
        redScore: data.redScore,
        blueScore: data.blueScore,
        isRedTurn: data.isRedTurn,
        turnEndTime: data.turnEndTime,
      });
      setUser(
        data.users.find(
          (user) => user.userID === props.location.state.userID
        ) || emptyUser
      );
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
      updateGameData({ users: data.users });
      setUser(
        data.users.find(
          (user) => user.userID === props.location.state.userID
        ) || emptyUser
      );
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
      (user.team === "RED" && isRedTurn) ||
      (user.team === "BLUE" && !isRedTurn)
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
            marginRight: "80px",
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
            <Grid
              gameOver={gameOver}
              handleEndTurn={handleEndTurn}
              user={user}
              gameScore={gameScore}
            />
            <HintDisplay />
          </div>
          <div style={{ height: "100%" }}>
            {user.role === "MASTER" ? (
              <Hint
                roomID={gameData.roomId}
                isRedTurn={isRedTurn}
                user={user}
              />
            ) : null}
            <div style={{ float: "right", marginTop: "40px" }}>
              {renderEndTurn()}
            </div>
            {/* <button
              style={{ position: "absolute", top: "93%", right: "20px" }}
              onMouseEnter={() => setShowModal(true)}
              onMouseLeave={() => setShowModal(false)}
            >
              Show Modal
            </button> */}
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
