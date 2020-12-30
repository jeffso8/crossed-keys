import React, { useState, useEffect } from 'react';
import { BOMB_CARD, CAMEL, MAIZE, BLUE_CARD, RED_CARD } from '../../constants';
import { Responsive } from '../shared/responsive';
import socket from '../../socket';

function Card(props) {
  const [visible, setVisible] = useState(props.clicked);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const redTurn = props.redTurn;

  const { isMobile } = Responsive();

  useEffect(() => {
    setIsDisabled(props.isDisabled);

    if (props.user.role === 'MASTER') {
      setVisible(true);
      setIsDisabled(true);
      setIsMaster(true);
    }
  }, [props.isDisabled, props.user.role]);

  const webStyle = {
    container: {
      backgroundColor: props.clicked || visible ? props.color : CAMEL,
      width: 165,
      height: 80,
      marginTop: 12,
      marginBottom: 12,
      display: 'flex',
      justifyContent: 'center',
      transform: `rotate(${props.rotate}deg)`,
      boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
    },
    word: {
      fontSize: 14,
      textTransform: 'uppercase',
      letterSpacing: 2,
      fontWeight: 900,
      textAlign: 'center',
      alignSelf: 'center',
      color: MAIZE,
    },
  };

  const mobileStyle = {
    container: {
      backgroundColor: props.clicked || visible ? props.color : CAMEL,
      width: 90,
      height: 46,
      marginTop: 10,
      marginBottom: 10,
      display: 'flex',
      justifyContent: 'center',
      boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
    },
    word: {
      fontSize: 8,
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontWeight: 900,
      textAlign: 'center',
      alignSelf: 'center',
      color: MAIZE,
    },
  };

  const style = isMobile ? mobileStyle : webStyle;

  const handleClick = () => {
    if (isDisabled) {
      return;
    }

    if (props.color === BOMB_CARD) {
      console.log('GAME OVER');
      props.bombClicked(props.user.team);
      console.log('bombclicked', props.user.team);
    } else {
      if (redTurn) {
        if (props.color === RED_CARD) {
          props.setRedScore(props.redScore - 1);
          props.handleCardClick(props.idx, true);
        } else {
          if (props.color === BLUE_CARD) {
            props.setBlueScore(props.blueScore - 1);
            socket.emit('startTimer', {roomID: props.roomID, currentTimer: props.timerID});
          }
          props.handleCardClick(props.idx, false);
          socket.emit('startTimer', {roomID: props.roomID, currentTimer: props.timerID});
        }
      } else {
        if (BLUE_CARD === props.color) {
          props.setBlueScore(props.blueScore - 1);
          props.handleCardClick(props.idx, false);
        } else {
          if (props.color === RED_CARD) {
            props.setRedScore(props.redScore - 1);
            socket.emit('startTimer', {roomID: props.roomID, currentTimer: props.timerID});
          }
          props.handleCardClick(props.idx, true);
          socket.emit('startTimer', {roomID: props.roomID, currentTimer: props.timerID});
        }
      }
    }
  };

  return (
    <div
      className="card-container"
      style={{
        ...style.container,
        opacity: isMaster && props.clicked ? 0.3 : 1,
      }}
      onClick={handleClick}
    >
      <div style={style.word}>{props.word}</div>
    </div>
  );
}

export default Card;
