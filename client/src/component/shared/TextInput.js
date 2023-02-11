import React from "react";
import { GREEN } from "../../constants";

export default function TextInput(props) {
  const style = {
    input: {
      background: "transparent",
      border: "none",
      borderBottom: `1px solid ${GREEN}`,
      height: 30,
      color: GREEN,
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
      {props.error && (
        <div
          style={{
            marginTop: "2px",
            fontSize: "14px",
            fontStyle: "italic",
            color: `${GREEN}`,
          }}
        >
          {props.errorText}
        </div>
      )}
    </div>
  );
}
