import React from "react";
import { MUD_BROWN } from "../../constants";

export default function TextInput(props) {
  const style = {
    input: {
      background: "transparent",
      border: "none",
      borderBottom: `1px solid ${MUD_BROWN}`,
      height: 30,
      color: `${MUD_BROWN}`,
      fontSize: "16px",
      textTransform: "uppercase",
      ...props.style,
    },
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <input
        className="login-input"
        style={style.input}
        id={props.id}
        type="text"
        placeholder={props.placeholder}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        autoComplete="off"
      />
      {props.error && <div>{props.errorText}</div>}
    </div>
  );
}
