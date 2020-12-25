import React, { useState, useEffect } from "react";
import {CAMEL, MAIZE, BLUE_CARD, RED_CARD} from '../constants';

function Card(props) {
  const [cardColor, setCardColor] = useState("");
  const [visible, setVisible] = useState(false);
  const user = props.user;
  const redTurn = props.redTurn;
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (user.role === "MASTER") {
      setVisible(true);
    }
  })

  const style = {
    container: {
      backgroundColor: visible ? props.color : CAMEL,
      opacity: props.isSelected ? 0.5 : 1,
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
    console.log("redTurn", redTurn);
      if (user.team === "RED" && redTurn && !disabled) {
        setVisible(true);
        if (RED_CARD === props.color) {
          props.setRedScore(props.redScore + 1);
          console.log("props.redScore", props.redScore);
          setDisabled(true);
        } else {
          props.setRedTurn(false);
          console.log('redturn', redTurn);
          setDisabled(true);
        }
      } else if (user.team === "BLUE" && !redTurn && !disabled) {
          setVisible(true);
          if (BLUE_CARD === props.color) {
            props.setBlueScore(props.blueScore + 1);
            setDisabled(true);
          } else {
            props.setRedTurn(true);
          }
      } else {
        props.setRedTurn(false);
      }
    }

  return (
    <div className="card-container" style={style.container} onClick={handleClick}>
      <div style={style.word}>
        {props.word}
      </div>
    </div>
  );
}

export default Card;