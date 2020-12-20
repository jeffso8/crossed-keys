import React, { useState, useEffect } from "react";

function Card(props) {
  const [cardColor, setCardColor] = useState("");
  const [visible, setVisible] = useState(false);
  const user = props.user;
  const redScore = props.redScore;
  const blueScore = props.blueScore;
  const colors = ["red", "blue", "white", "black"];
  let redTurn = true;
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    console.log("props.user", user);
    if (user.role === "MASTER") {
      setVisible(true);
    }
  })

  const cardStyle = {
    backgroundColor: visible ? props.color : "white",
    width:"auto"
  }

  console.log("color", props.color.toUpperCase());

  const handleClick = () => {
    setVisible(true);
      if (user.team == "RED" && redTurn && !disabled) {
        if (user.team == props.color.toUpperCase()) {
          props.setRedScore(redScore + 1);
          setDisabled(true);
        }
        redTurn = false;
      }
      else if (user.team == "BLUE" && !redTurn && !disabled) {
        if (user.team == props.color.toUpperCase()) {
          props.setBlueScore(blueScore + 1);
          setDisabled(true);
        }
        redTurn = true;
      } else {
        setDisabled(true);
      }
    }

  return (
    <div className="card-container" style={cardStyle} onClick={handleClick}>
      <h1>
        {props.word}
      </h1>
    </div>
  );
}

export default Card;