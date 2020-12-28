import React, { useState, useEffect } from "react";
import Card from './Card';
import ScoreBanner from './ScoreBanner';
import socket from '../../socket';
import {NEUTRAL_CARD, BLUE_CARD, RED_CARD, BOMB_CARD} from '../../constants';
import Modal from "../Modal";
import {Responsive} from '../shared/responsive';

function Game(props) {
  const [roomID, setRoomID] = useState("");
  const [colors, setColor] = useState([]);
  const [words, setWords] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [redScore, setRedScore] = useState(8);
  const [blueScore, setBlueScore] = useState(8);
  const [redTurn, setRedTurn] = useState(props.location.state.data.isRedTurn);
  const [clicked, setClicked] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bombClicked, setBombClicked] = useState("");
  const [gameScore, setGameScore] = useState(props.location.state.data.totalGameScore);
  const [gameOver, setGameOver] = useState(props.location.state.data.gameOver);
  const {isMobile} = Responsive();

  useEffect(() => {
    socket.emit('joinGame', {roomID: props.location.state.data.roomID});

    socket.on('refreshGame', (data) => {
      setClicked(data.clicked);
      setColor(data.colors);
      setBlueScore(data.blueScore);
      setRedScore(data.redScore);
      setGameScore(data.totalGameScore);
      setGameOver(data.gameOver);
      console.log('refreshusers', data);
    });

    socket.on('updateRedScore', (data) => {
      setRedScore(data.redScore);
    });

    socket.on('redTurn', (data) => {
      setRedTurn(data.redTurn);
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
      setClicked(data.clicked);
      setRedTurn(data.isRedTurn);
    });

    setRoomID(props.location.state.data.roomID);
    setUsers(props.location.state.data.users);
    setWords(props.location.state.data.words);
    setUser(props.location.state.data.users.find(user => user.userID === props.location.state.userID));
    setRedTurn(props.location.state.data.isRedTurn);
  }, []);

  const handleRedScoreChange = (event) => {
    console.log('handleRedScoreChange');
    setRedScore(event);
    let newRedScore = redScore - 1
    socket.emit('redScoreChange', {roomID, redScore: newRedScore})
  }

  const handleBlueScoreChange = (event) => {
    setBlueScore(event)
    let newBlueScore = blueScore - 1
    socket.emit('blueScoreChange', {roomID, blueScore: newBlueScore})
  }

  const handleCardClick = (index, turn) => {
    socket.emit('flipCard', {roomID, index, isRedTurn: turn})
  }

  const handleTurnClick = (turn) => {
    socket.emit('updateTurn', {roomID, redTurn: turn})
  }

  const handleBombClick = (event) => {
    setBombClicked(event);
    socket.emit('bombClicked', {roomID, bombClicked: event});
  };

  const renderEndTurn = () => {
    if ((user.team === 'RED' && redTurn) || (user.team === 'BLUE' && !redTurn)) {
      return (
        <button onClick={() => handleTurnClick(!redTurn)}>End Turn</button>
    )}
  };

  const handleModalHover = () => {
    if (showModal) {
      return (
        <div style={{display: 'flex', width: '100%', height: '100%', justifyContent: 'center'}}>
          <Modal users={users} show={showModal} roomID={roomID} gameScore={gameScore}></Modal>
        </div>
      )};
  };

  const handleGameOver = () => {
    if(gameOver)
      return (
        <div style={{
        display: 'flex',
        top: '5%',
        width:'100%',
        height: '100%',
        justifyContent: 'center'}}>
          <div style={{width: '600px', height: '500px', backgroundColor: 'white', zIndex: '2', 
          position: 'relative', top: '10%', textAlign: 'center', borderRadius: '1em', boxShadow: '5px 15px 20px #686963'}}>
          <div style={{position:'relative', top:'25%', margin:'10px'}}>
          Game Over:
          <h1>{gameScore[0]} - {gameScore[1]}</h1>
          <button>Start Next Game</button>
          <button>Re-Pick SpyMaster</button>
          <button>Re-Shuffle Teams</button>
          </div>
          </div>
        </div>
      )
    };

  const rowColor1 = colors.slice(0,5);
  const rowColor2 = colors.slice(5,10);
  const rowColor3 = colors.slice(10,15);
  const rowColor4 = colors.slice(15,20);
  const rowColor5 = colors.slice(20,25);

  const wordsColumn1 = words.slice(0,5);
  const wordsColumn2 = words.slice(5,10);
  const wordsColumn3 = words.slice(10,15);
  const wordsColumn4 = words.slice(15,20);
  const wordsColumn5 = words.slice(20,25);

  const cardStyle = {
    container : {
      display:"grid",
      position: "fixed",
      left:"50%",
      top:"50%",
      transform:"translate(-50%, -50%)",
      gridGap: 50,
      gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr"
    },
    columns : {
      margin: 0,
    }
  };

  const mobileCardStyle = {
    container : {
      display:"grid",
      position: "fixed",
      left:"50%",
      top:"35%",
      transform:"translate(-50%, -50%)",
      gridGap: 2,
      gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr"
    },
    columns : {
      margin: 0,
    }
  }

  const style = isMobile ? mobileCardStyle : cardStyle;



  const renderColumns = (rowColor, wordColumn, clickedColumn, className) => {
    return (
    <div className={className} style={style.columns}>
      {rowColor.map((color, index) => {
        let realColor = '';
        if (color === 'blue') {
          realColor = BLUE_CARD;
        } else if (color === 'red') {
          realColor = RED_CARD;
        } else if (color === 'black') {
          realColor = BOMB_CARD;
        } else {
          realColor = NEUTRAL_CARD;
        }

        //TODO: clicked and index, figure out a way to store these as states, and emitted to all clients
        const randDeg = (Math.random() + 0.1) * (Math.round(Math.random()) ? 1 : -1);
        const isClicked = clicked[index + (clickedColumn * 5)];

        const isDisabled = ((user.team === 'RED' && !redTurn) || (user.team === 'BLUE' && redTurn) || isClicked || gameOver);
        console.log('gameover', gameOver);
        return (
          <Card
            word={wordColumn[index]}
            idx={index + (clickedColumn * 5)}
            clicked={isClicked}
            handleCardClick={handleCardClick}
            color={realColor}
            user={user}
            isDisabled={isDisabled}
            redScore={redScore}
            setRedScore={handleRedScoreChange}
            blueScore={blueScore}
            setBlueScore={handleBlueScoreChange}
            rotate={randDeg}
            redTurn={redTurn}
            bombClicked={handleBombClick}
          />
        )
      }
      )}
      </div>
    )
  };

  return (
    <div style={{width: '100%', height: '100%'}}>
      <ScoreBanner isRedTeam={true} score={redScore} />
      <div style={{textAlign: 'center'}}>
        <h2>{redTurn ? 'Red\'s Turn' : 'Blue\'s Turn'}</h2>
      </div>
      <ScoreBanner isRedTeam={false} score={blueScore} />
      <div style={style.container}>
        {renderColumns(rowColor1, wordsColumn1, 0, 'Column1')}
        {renderColumns(rowColor2, wordsColumn2, 1, 'Column2')}
        {renderColumns(rowColor3, wordsColumn3, 2, 'Column3')}
        {renderColumns(rowColor4, wordsColumn4, 3, 'Column4')}
        {renderColumns(rowColor5, wordsColumn5, 4, 'Column5')}
      </div>
      <div style={{position:'absolute', top:'90%', right: '20px'}}>
       {renderEndTurn()}
      </div>
      <button style={{position:'absolute', top:'93%', right: '20px'}} onMouseEnter={() => setShowModal(true)} onMouseLeave={()=> setShowModal(false)}>Show Modal</button>
      {handleModalHover()}
      {handleGameOver()}
      </div>
    );
  };

export default Game;