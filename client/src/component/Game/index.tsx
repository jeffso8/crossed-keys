import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import ScoreBanner from "./ScoreBanner";
import socket from "../../socket";
import GameInfoModal from "./GameInfoModal";
import GameOverModal from "./GameOverModal";
import Timer from "./Timer";
import Hint from "./Hint";
import HintDisplay from "./HintDisplay";
import { DataType, UserType } from "../../types";
import { Responsive } from "../shared/responsive";

type GamePropsType = {
  location: {
    state: {
      data: DataType;
      userID: string;
    };
  };
};

function Game(props: GamePropsType) {
  let [redScore, setRedScore] = useState(8);
  let [blueScore, setBlueScore] = useState(8);
  const emptyUser = {
    userID: "",
    team: "",
    role: "",
    isHost: false,
    socketId: "",
  };
  const [roomID, setRoomID] = useState(props.location.state.data.roomID);
  const [users, setUsers] = useState<UserType[]>([]);
  const [user, setUser] = useState<UserType>(emptyUser);
  const [redTurn, setRedTurn] = useState(props.location.state.data.isRedTurn);
  const [showModal, setShowModal] = useState(false);
  const [gameScore, setGameScore] = useState(
    props.location.state.data.totalGameScore
  );
  const [gameOver, setGameOver] = useState(props.location.state.data.gameOver);
  const [turnEndTime, setTurnEndTime] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [words, setWords] = useState([]);
  const [colors, setColors] = useState([]);
  const [clicked, setClicked] = useState([]);

  const { isMobile } = Responsive();

  const webStyle = {
    container: {
      display: "flex",
      justifyContent: "center",
      position: "relative" as "relative",
      marginTop: 50,
      marginBottom: 50,
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
    socket.emit("joinGame", {
      roomID: props.location.state.data.roomID,
      user: props.location.state.data.users.find(
        (user) => user.userID === props.location.state.userID
      ),
    });

    socket.on("refreshGame", (data: DataType) => {
      console.log("refreshGame", data.turnEndTime);

      setBlueScore(data.blueScore);
      setRedScore(data.redScore);
      setGameScore(data.totalGameScore);
      setGameOver(data.gameOver);
      setRedTurn(data.isRedTurn);
      setUsers(data.users);
      setUser(
        data.users.find(
          (user) => user.userID === props.location.state.userID
        ) || emptyUser
      );
      // @ts-ignore
      setTurnEndTime(data.turnEndTime);
      // @ts-ignore
      setWords(data.words);
      // @ts-ignore
      setColors(data.colors);
      // @ts-ignore
      setClicked(data.clicked);

      setMounted(true);
    });

    socket.on("updateFlipCard", (data: DataType) => {
      // @ts-ignore
      setClicked(data.clicked);
    });

    socket.on("updateTeams", (data: DataType) => {
      setUsers(data.users);
      setUser(
        data.users.find(
          (user) => user.userID === props.location.state.userID
        ) || emptyUser
      );
    });

    socket.on("redTurn", (data: DataType) => {
      setRedTurn(data.redTurn);
      // @ts-ignore
      setTurnEndTime(data.turnEndTime);
    });

    socket.on("updateRedScore", (data: DataType) => {
      setRedScore(data.redScore);
    });

    socket.on("updateBlueScore", (data: DataType) => {
      setBlueScore(data.blueScore);
    });

    socket.on("updateGameOver", (data: DataType) => {
      setGameScore(data.totalGameScore);
      setGameOver(data.gameOver);
      setRedScore(data.redScore);
      setBlueScore(data.blueScore);
    });

    socket.on("updateFlipCard", (data: DataType) => {
      setRedTurn(data.isRedTurn);
    });

    socket.on("startGame", (data: DataType) => {
      setGameScore(data.totalGameScore);
      setGameOver(data.gameOver);
      setRedScore(data.redScore);
      setBlueScore(data.blueScore);
      setRedTurn(data.isRedTurn);
      setUsers(data.users);
      // @ts-ignore
      setTurnEndTime(data.turnEndTime);
      setUser(
        data.users.find(
          (user) => user.userID === props.location.state.userID
        ) || emptyUser
      );
      // socket.emit('startTimer', {roomID: data.roomID});
    });

    // setMounted(true);
  }, []);

  const handleRedScoreChange = (score: number) => {
    socket.emit("redScoreChange", { roomID, redScore: score });
    if (score === 0) {
      socket.emit("gameOver", {
        roomID,
        gameScore: [gameScore[0] + 1, gameScore[1]],
        gameOver: true,
        redScore: score,
        blueScore: blueScore,
      });
    }
  };

  const handleBlueScoreChange = (score: number) => {
    socket.emit("blueScoreChange", { roomID, blueScore: score });
    if (score === 0) {
      socket.emit("gameOver", {
        gameScore: [gameScore[0], gameScore[1] + 1],
        gameOver: true,
        redScore: redScore,
        blueScore: score,
      });
    }
  };

  const handleEndTurn = (turn: boolean) => {
    socket.emit("updateTurn", { roomID, redTurn: turn });
    // socket.emit('startTimer', {roomID, currentTimer: timerID});
  };

  const renderEndTurn = () => {
    if (
      (user.team === "RED" && redTurn) ||
      (user.team === "BLUE" && !redTurn)
    ) {
      return <button onClick={() => handleEndTurn(!redTurn)}>End Turn</button>;
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
          <div>
            <ScoreBanner isRedTeam={true} score={redScore} />
            <div style={{ textAlign: "center" }}>
              {turnEndTime && (
                <Timer
                  turnEndTime={turnEndTime}
                  handleEndTurn={handleEndTurn}
                  redTurn={redTurn}
                />
              )}
              <h2>{redTurn ? "Red's Turn" : "Blue's Turn"}</h2>
            </div>
            <ScoreBanner isRedTeam={false} score={blueScore} />
          </div>
          <div style={style.container}>
            <Grid
              gameOver={gameOver}
              redTurn={redTurn}
              handleEndTurn={handleEndTurn}
              roomID={roomID}
              redScore={redScore}
              blueScore={blueScore}
              user={user}
              handleRedScoreChange={handleRedScoreChange}
              handleBlueScoreChange={handleBlueScoreChange}
              gameScore={gameScore}
              words={words}
              colors={colors}
              clicked={clicked}
            />
            <HintDisplay />
          </div>
          {user.role === "MASTER" ? <Hint roomID={roomID} /> : null}
          <div style={{ position: "absolute", top: "90%", right: "20px" }}>
            {renderEndTurn()}
          </div>
          <button
            style={{ position: "absolute", top: "93%", right: "20px" }}
            onMouseEnter={() => setShowModal(true)}
            onMouseLeave={() => setShowModal(false)}
          >
            Show Modal
          </button>
          {showModal ? (
            <GameInfoModal
              users={users}
              show={showModal}
              roomID={roomID}
              gameScore={gameScore}
            />
          ) : null}
          {gameOver ? (
            <GameOverModal gameScore={gameScore} user={user} roomID={roomID} />
          ) : null}
        </div>
      )}
    </>
  );
}

export default Game;
