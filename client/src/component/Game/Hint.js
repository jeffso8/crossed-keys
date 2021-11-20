import React, { useState } from "react";
import TextInput from "../shared/TextInput";
import Button from "../shared/Button";
import socket from "../../socket";

export default function Hint(props) {
  console.log(props.user);
  const [hint, setHint] = useState("");
  const [hintCount, setHintCount] = useState(1);

  const handleHintChange = (event) => setHint(event.target.value.toUpperCase());
  const handleHintCountChange = (event) => {
    setHintCount(event.target.value);
  };

  const handleSubmit = () => {
    socket.emit("newHint", {
      roomID: props.roomID,
      hint,
      hintCount,
      isRedTurn: props.isRedTurn,
    });
  };

  const isSubmitDisabled = !(
    (props.isRedTurn && props.user.team === "RED") ||
    (!props.isRedTurn && props.user.team === "BLUE")
  );

  return (
    <div style={{ alignSelf: "center", display: "inherit" }}>
      <TextInput value={hint} onChange={handleHintChange} />
      <select value={hintCount} onChange={handleHintCountChange}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
      </select>
      <Button
        disabled={isSubmitDisabled}
        onClick={handleSubmit}
        text={"SEND"}
        style={{ width: 100 }}
      />
    </div>
  );
}
