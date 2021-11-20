import React from "react";
import { BROWNISH, MUD_BROWN } from "../../constants";

export default function Button(props) {
  const style = {
    height: 50,
    border: "none",
    fontSize: 18,
    fontStyle: "italic",
    fontWeight: 400,
    letterSpacing: 2,
    marginTop: 20,
    margin: 5,
    backgroundColor: BROWNISH,
    color: MUD_BROWN,
    cursor: "pointer",
    ...props.style,
  };

  return (
    <button
      onClick={!props.disabled && props.onClick}
      style={props.disabled ? { ...style, opacity: 0.5 } : style}
    >
      {props.text}
    </button>
  );
}
