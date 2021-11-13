import React from "react";
import { BROWNISH, MUD_BROWN } from "../../constants";

export default function Button(props) {
  const style = {
    height: 50,
    border: "none",
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: 1,
    marginTop: 20,
    margin: 5,
    backgroundColor: BROWNISH,
    color: MUD_BROWN,
    cursor: "pointer",
    ...props.style,
  };

  return (
    <button onClick={props.onClick} style={style}>
      {props.text}
    </button>
  );
}
