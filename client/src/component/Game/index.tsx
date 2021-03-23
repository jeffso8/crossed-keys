import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import ScoreBanner from './ScoreBanner';
import socket from '../../socket';
import GameInfoModal from './GameInfoModal';
import GameOverModal from './GameOverModal';
import Timer from './Timer';
import Hint from './Hint';
import HintDisplay from './HintDisplay';
import {DataType, UserType} from '../../types';

type GamePropsType = {
  location: {
    state: {
      data: DataType,
      userID: string,
    },
  },
};

function Game(props: GamePropsType) {
  let [redScore, setRedScore] = useState(8);
  let [blueScore, setBlueScore] = useState(8);
  const emptyUser = {
    userID: '',
    team: '',
    role: '',
    isHost: false,
    socketId: ''
  };
  const [roomID, setRoomID] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [user, setUser] = useState<UserType>(emptyUser);
  const [redTurn, setRedTurn] = useState(props.location.state.data.isRedTurn);
  const [showModal, setShowModal] = useState(false);
  const [gameScore, setGameScore] = useState(props.location.state.data.totalGameScore);
  const [gameOver, setGameOver] = useState(props.location.state.data.gameOver);
  const [timerID, setTimerID] = useState(0);
  const [timerEnd, setTimerEnd] = useState(false);

  useEffect(() => {
    socket.emit('joinGame', {roomID: props.location.state.data.roomID, user: props.location.state.data.users.find((user) => user.userID === props.location.state.userID)});

    setRoomID(props.location.state.data.roomID);
    setUsers(props.location.state.data.users);
    setRedTurn(props.location.state.data.isRedTurn);


    socket.on('refreshGame', (data: DataType) => {
      setBlueScore(data.blueScore);
      setRedScore(data.redScore);
      setGameScore(data.totalGameScore);
      setGameOver(data.gameOver);
      setRedTurn(data.isRedTurn);
      setUsers(data.users);
      setUser(data.users.find((user) => user.userID === props.location.state.userID) || emptyUser);
    });

    socket.on('updateTeams', (data: DataType) => {
      setUsers(data.users);
      setUser(data.users.find((user) => user.userID === props.location.state.userID) || emptyUser);
    });

    socket.on('redTurn', (data: DataType) => {
      setRedTurn(data.redTurn);
    });

    socket.on('updateRedScore', (data: DataType) => {
      setRedScore(data.redScore);
    });

    socket.on('updateBlueScore', (data: DataType) => {
      setBlueScore(data.blueScore);
    });

    socket.on('updateGameOver', (data: DataType) => {
      setGameScore(data.totalGameScore);
      setGameOver(data.gameOver);
      setRedScore(data.redScore);
      setBlueScore(data.blueScore);
    });

    socket.on('updateFlipCard', (data: DataType) => {
      setRedTurn(data.isRedTurn);
    });

    setRoomID(props.location.state.data.roomID);

    socket.on('timerDone', (data: DataType) => {
      setRedTurn(data.redTurn);
      // @ts-ignore
      if (data.users.find((user) => user.userID === props.location.state.userID).isHost){
        socket.emit('startTimer', {roomID: data.roomID});
      }
    });

    socket.on('startGame', (data: DataType) => {
      setGameScore(data.totalGameScore);
      setGameOver(data.gameOver);
      setRedScore(data.redScore);
      setBlueScore(data.blueScore);
      setRedTurn(data.isRedTurn);
      setUsers(data.users);
      setUser(data.users.find((user) => user.userID === props.location.state.userID) || emptyUser);
      socket.emit('startTimer', {roomID: data.roomID});
    });

  }, []);

  const handleRedScoreChange = (score: number) => {
    socket.emit('redScoreChange', {roomID, redScore: score});
    if (score === 0) {
      socket.emit('gameOver', {roomID, gameScore: [gameScore[0] + 1, gameScore[1]], gameOver: true, redScore: score, blueScore: blueScore});
    }
  };

  const handleBlueScoreChange = (score: number) => {
    socket.emit('blueScoreChange', {roomID, blueScore: score});
    if (score === 0) {
      socket.emit('gameOver', {gameScore: [gameScore[0], gameScore[1] + 1], gameOver: true, redScore: redScore, blueScore: score, timerID});
    }
  };

  const handleTurnClick = (turn: boolean) => {
    socket.emit('updateTurn', {roomID, redTurn: turn});
    socket.emit('startTimer', {roomID, currentTimer: timerID});
  };

  const renderEndTurn = () => {
    if ((user.team === 'RED' && redTurn) || (user.team === 'BLUE' && !redTurn)) {
      return (
        <button onClick={() => handleTurnClick(!redTurn)}>End Turn</button>
      );
    }
  };

  return (
    <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
      <div>
        <ScoreBanner isRedTeam={true} score={redScore} />
        <div style={{textAlign: 'center'}}>
          <Timer setTimerID={setTimerID}/>
          <h2>{redTurn ? 'Red\'s Turn' : 'Blue\'s Turn'}</h2>
        </div>
        <ScoreBanner isRedTeam={false} score={blueScore} />
      </div>
      <div style={{display: 'flex', justifyContent: 'center', position: 'relative', marginTop: 50, marginBottom: 50}}>
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
          gameScore={gameScore}
        />
        <HintDisplay />
        </div>
      {user.role === 'MASTER' ? <Hint roomID={roomID}/> : null}
      <div style={{position:'absolute', top:'90%', right: '20px'}}>
        {renderEndTurn()}
      </div>
      <button style={{position:'absolute', top:'93%', right: '20px'}} onMouseEnter={() => setShowModal(true)} onMouseLeave={()=> setShowModal(false)}>Show Modal</button>
      {showModal ? <GameInfoModal  users={users} show={showModal} roomID={roomID} gameScore={gameScore} /> : null}
      {gameOver ? <GameOverModal gameScore={gameScore} user={user} roomID={roomID} /> : null}
    </div>
  );
}

export default Game;