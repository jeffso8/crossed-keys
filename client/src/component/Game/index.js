import React, { useState, useEffect } from "react";
import Grid from './Grid';
import ScoreBanner from './ScoreBanner';
import socket from '../../socket';
import GameInfoModal from './GameInfoModal';
import GameOverModal from './GameOverModal';
import Timer from "./Timer";

function Game(props) {
  let [redScore, setRedScore] = useState(8);
  let [blueScore, setBlueScore] = useState(8);

  const [roomID, setRoomID] = useState('');
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [redTurn, setRedTurn] = useState(props.location.state.data.isRedTurn);
  const [showModal, setShowModal] = useState(false);
  const [gameScore, setGameScore] = useState(props.location.state.data.totalGameScore);
  const [gameOver, setGameOver] = useState(props.location.state.data.gameOver);
  const [timerID, setTimerID] = useState(0);

  useEffect(() => {
    socket.emit('joinGame', {roomID: props.location.state.data.roomID});

    setRoomID(props.location.state.data.roomID);
    setUsers(props.location.state.data.users);
    setRedTurn(props.location.state.data.isRedTurn);


    socket.on('refreshGame', (data) => {
      setBlueScore(data.blueScore);
      setRedScore(data.redScore);
      setGameScore(data.totalGameScore);
      setGameOver(data.gameOver);
      setRedTurn(data.isRedTurn);
      setUsers(data.users);
      setUser(data.users.find((user) => user.userID === props.location.state.userID));
    });

    socket.on('updateTeams', (data) => {
      setUsers(data.users);
      setUser(data.users.find((user) => user.userID === props.location.state.userID));
    });

    socket.on('updateRedScore', (data) => {
      setRedScore(data.redScore);
    });

    socket.on('redTurn', (data) => {
      setRedTurn(data.redTurn);
    });

    socket.on('updateRedScore', (data) => {
      setRedScore(data.redScore);
    });

    socket.on('updateBlueScore', (data) => {
      setBlueScore(data.blueScore);
    });

    socket.on('gameOver', (data) => {
      setGameScore(data.gameScore);
      setGameOver(data.gameOver);
      setRedScore(data.redScore);
      setBlueScore(data.blueScore);
    });

    socket.on('updateFlipCard', (data) => {
      setRedTurn(data.isRedTurn);
    });

    setRoomID(props.location.state.data.roomID);
 
    socket.on('nextGameStart', (data) => {
      console.log("nextGameStart", data);
      setGameScore(data.totalGameScore);
      setGameOver(data.gameOver);
      setRedScore(data.redScore);
      setBlueScore(data.blueScore);
      setRedTurn(data.isRedTurn);
      setUsers(data.users);
      setUser(data.users.find((user) => user.userID === props.location.state.userID));
    });

  }, []);

  const handleRedScoreChange = (score) => {
    socket.emit('redScoreChange', {roomID, redScore: score})
  }

  const handleRedTurnChange = (bool) => {
    socket.emit('updateTurn', {roomID, redTurn: bool})
  }

  const handleBlueScoreChange = (score) => {
    socket.emit('blueScoreChange', {roomID, blueScore: score})
  }

  const handleTurnClick = (turn) => {
    socket.emit('updateTurn', {roomID, redTurn: turn});
    socket.emit('startTimer', {roomID, currentTimer: timerID});
  }

  const renderEndTurn = () => {
    if ((user.team === 'RED' && redTurn) || (user.team === 'BLUE' && !redTurn)) {
      return (
        <button onClick={() => handleTurnClick(!redTurn)}>End Turn</button>
    )}
  };

  return (
    <div style={{width: '100%', height: '100%'}}>
      <ScoreBanner isRedTeam={true} score={redScore} />
      <div style={{textAlign: 'center'}}>
        <Timer redTurn={redTurn} setTimerID={setTimerID}/>
        <h2>{redTurn ? 'Red\'s Turn' : 'Blue\'s Turn'}</h2>
      </div>
      <ScoreBanner isRedTeam={false} score={blueScore} />
      <Grid
        gameOver={gameOver}
        redTurn={redTurn}
        roomID={roomID}
        redScore={redScore}
        blueScore={blueScore}
        user={user}
        handleRedScoreChange={handleRedScoreChange}
        handleBlueScoreChange={handleBlueScoreChange}
        timerID={timerID}
      />
      <div style={{position:'absolute', top:'90%', right: '20px'}}>
        {renderEndTurn()}
      </div>
      <button style={{position:'absolute', top:'93%', right: '20px'}} onMouseEnter={() => setShowModal(true)} onMouseLeave={()=> setShowModal(false)}>Show Modal</button>
      {showModal ? <GameInfoModal  users={users} show={showModal} roomID={roomID} gameScore={gameScore} /> : null}
      {gameOver ? <GameOverModal gameScore={gameScore} user={user} roomID={roomID} /> : null}
    </div>
  );
};

export default Game;