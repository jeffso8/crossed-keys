import React, { useState, useEffect } from "react";
import {BOMB_CARD, CAMEL, MAIZE, BLUE_CARD, RED_CARD} from '../constants';

function Card(props) {
  const [visible, setVisible] = useState(props.clicked);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const user = props.user;
  const redTurn = props.redTurn;

  useEffect(() => {
    setIsDisabled(props.isDisabled);
    if (user.role === "MASTER") {
      setVisible(true);
      setIsDisabled(true);
      setIsMaster(true);
    }
  });

  const style = {
    container: {
      backgroundColor: props.clicked || visible ? props.color : CAMEL,
      width: 185,
      height: 90,
      marginTop: 20,
      marginBottom: 20,
      display: 'flex',
      justifyContent: 'center',
      transform: `rotate(${props.rotate}deg)`,
      boxShadow: `0 4px 8px 0 rgba(0,0,0,0.2)`,
    },
    word: {
      fontSize: 16,
      textTransform: 'uppercase',
      letterSpacing: 2,
      fontWeight: 900,
      textAlign: 'center',
      alignSelf: 'center',
      color: MAIZE,
    }
  }

  const handleClick = () => {
      if(isDisabled) {
        return;
      }

      if(props.color === BOMB_CARD) {
        console.log('GAME OVER');
      }

      if (redTurn) {
        if (props.color === RED_CARD) {
          props.setRedScore(props.redScore + 1);
          props.handleCardClick(props.idx, true);
        } else {
          if (props.color === BLUE_CARD) {
            props.setBlueScore(props.blueScore + 1);
          }
          props.handleCardClick(props.idx, false);
        }
      } else {
        if (BLUE_CARD === props.color) {
          props.setBlueScore(props.blueScore + 1);
          props.handleCardClick(props.idx, false);
        } else {
          if (props.color === RED_CARD) {
            props.setRedScore(props.redScore + 1);
          }
          props.handleCardClick(props.idx, true);
        }
      }
    }

  return (
    <div className="card-container" style={{...style.container, opacity: (isMaster && props.clicked) ? 0.3 : 1}} onClick={handleClick}>
      <div style={style.word}>
        {props.word}
      </div>
    </div>
  );
}

export default Card;