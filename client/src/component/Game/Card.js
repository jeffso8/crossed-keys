import React, { useState, useEffect } from "react";
import { CAMEL, MAIZE } from "../../constants";
import { Responsive } from "../shared/responsive";

function Card(props) {
  const [visible, setVisible] = useState(props.clicked);
  // const [isDisabled, setIsDisabled] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  // const redTurn = props.redTurn;

  const { isMobile } = Responsive();

  useEffect(() => {
    // setIsDisabled(props.isDisabled);

    if (props.user.role === "MASTER") {
      setVisible(true);
      // setIsDisabled(true);
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
      display: "flex",
      justifyContent: "center",
      transform: `rotate(${props.rotate}deg)`,
      boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
    },
    word: {
      fontSize: 14,
      textTransform: "uppercase",
      letterSpacing: 2,
      fontWeight: 900,
      textAlign: "center",
      alignSelf: "center",
      color: MAIZE,
    },
  };

  const mobileStyle = {
    container: {
      backgroundColor: props.clicked || visible ? props.color : CAMEL,
      width: 68,
      height: 42,
      marginTop: 6,
      marginBottom: 6,
      display: "flex",
      justifyContent: "center",
      boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
    },
    word: {
      fontSize: 7,
      textTransform: "uppercase",
      letterSpacing: 1,
      fontWeight: 900,
      textAlign: "center",
      alignSelf: "center",
      color: MAIZE,
    },
  };

  const style = isMobile ? mobileStyle : webStyle;

  return (
    <div
      className="card-container"
      style={{
        ...style.container,
        opacity: isMaster && props.clicked ? 0.3 : 1,
      }}
      onClick={props.handleClick}
    >
      <div style={style.word}>{props.word}</div>
    </div>
  );
}

export default Card;
