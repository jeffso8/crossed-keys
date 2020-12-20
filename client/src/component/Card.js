import React, { useState, useEffect } from "react";

function Card(props) {
  const [cardColor, setCardColor] = useState("");
  const [visible, setVisible] = useState(false);
  const [score, setScore] = useState(0);

  const user = props.user;
  const colors = ["red", "blue", "white", "black"];
  const random = Math.floor(Math.random() * colors.length);
  
  useEffect(() => {
    console.log("props.user", props.user);
    if (user.role == "codemaster") {
      setVisible(true);
    }
  })

  const cardStyle = {
    backgroundColor: visible ? props.color : "white",
    width:"90px"
  }

  const handleClick = () => {
    setVisible(true);
    if (user.team == cardColor) {
      setScore(score + 1);
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