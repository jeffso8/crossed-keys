import React, { useState, useEffect } from 'react';
import { NEUTRAL_CARD, BLUE_CARD, RED_CARD, BOMB_CARD } from '../../constants';
import Card from './Card';
import { Responsive } from '../shared/responsive';
import socket from '../../socket';

export default function Grid(props) {
  const [words, setWords] = useState([]);
  const [colors, setColors] = useState([]);
  const [clicked, setClicked] = useState([]);

  const {
    gameOver,
    user,
    redTurn,
    roomID,
    redScore,
    handleRedScoreChange,
    handleBlueScoreChange,
    blueScore,
    timerID,
    gameScore
  } = props;

  const { isMobile } = Responsive();

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
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
      gridGap: 40,
      justifyContent: 'center',
      maxWidth: 'min-content'
    },
    columns: {
      margin: 0,
    },
  };

  const mobileCardStyle = {
    container: {
      display: 'grid',
      position: 'fixed',
      left: '50%',
      top: '35%',
      transform: 'translate(-50%, -50%)',
      gridGap: 2,
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    },
    columns: {
      margin: 0,
    },
  };

  const style = isMobile ? mobileCardStyle : cardStyle;

  useEffect(() => {
    socket.on('refreshGame', (data) => {
      console.log('data', data);
      setWords(data.words);
      setColors(data.colors);
      setClicked(data.clicked);
    });

    socket.on('updateFlipCard', (data) => {
      setClicked(data.clicked);
    });

    socket.on('nextGameStart', (data) => {
      setClicked(data.clicked);
      setColors(data.colors);
      setWords(data.words);
    });

    socket.on('nextGameStart', (data) => {
      setClicked(data.clicked);
    });
  }, []);

  const handleCardClick = (index, turn) => {
    socket.emit('flipCard', {roomID, index, isRedTurn: turn});
  };

  const handleBombClick = (team) => {
    if (team === 'RED') {
      socket.emit('gameOver', {roomID, gameScore: [gameScore[0], gameScore[1] + 1], gameOver: true, redScore:redScore, blueScore:blueScore, timerID});
    } else {
      socket.emit('gameOver', {roomID, gameScore: [gameScore[0] + 1, gameScore[1]], gameOver: true, redScore:redScore, blueScore:blueScore, timerID});
    }
  };



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
          const randDeg =
            (Math.random() + 0.09) * (Math.round(Math.random()) ? 1 : -1);
          const isClicked = clicked[index + clickedColumn * 5];

          const isDisabled =
            (user.team === 'RED' && !redTurn) ||
            (user.team === 'BLUE' && redTurn) ||
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
                  handleCardClick((index + clickedColumn * 5), true);
                } else {
                  if (realColor === BLUE_CARD) {
                    handleBlueScoreChange(blueScore - 1);
                    socket.emit('startTimer', {roomID: roomID, currentTimer: timerID});
                  }
                  handleCardClick((index + clickedColumn * 5), false);
                  socket.emit('startTimer', {roomID: roomID, currentTimer: timerID});
                }
              } else {
                if (BLUE_CARD === realColor) {
                  handleBlueScoreChange(blueScore - 1);
                  handleCardClick((index + clickedColumn * 5), false);
                } else {
                  if (realColor === RED_CARD) {
                    handleRedScoreChange(redScore - 1);
                    socket.emit('startTimer', {roomID: roomID, currentTimer: timerID});
                  }
                  handleCardClick((index + clickedColumn * 5), true);
                  socket.emit('startTimer', {roomID: roomID, currentTimer: timerID});
                }
              }
            }
          }

          return (
            <Card
              // roomID={roomID}
              word={wordColumn[index]}
              // idx={index + clickedColumn * 5}
              clicked={isClicked}
              // handleCardClick={handleCardClick}
              color={realColor}
              user={user}
              // isDisabled={isDisabled}
              // redScore={redScore}
              // setRedScore={handleRedScoreChange}
              // blueScore={blueScore}
              // setBlueScore={handleBlueScoreChange}
              rotate={randDeg}
              // redTurn={redTurn}
              // bombClicked={handleBombClick}
              // timerID={timerID}
              handleClick={handleClick}
            />
          );
        })}
      </div>
    );
  };

  return (
      <div style={style.container}>
        {renderColumns(rowColor1, wordsColumn1, 0, 'Column1')}
        {renderColumns(rowColor2, wordsColumn2, 1, 'Column2')}
        {renderColumns(rowColor3, wordsColumn3, 2, 'Column3')}
        {renderColumns(rowColor4, wordsColumn4, 3, 'Column4')}
        {renderColumns(rowColor5, wordsColumn5, 4, 'Column5')}
      </div>
  );
}
