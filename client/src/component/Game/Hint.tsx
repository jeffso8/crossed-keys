import React, { useContext, useState } from "react";
import TextInput from "../shared/TextInput";
import Button from "../shared/Button";
import socket from "../../socket";
import { GameContext } from "../../context/GameContext";
import useGameMaster from "../../hooks/useGameMaster";

export default function Hint(props: any) {
  const [hint, setHint] = useState("");
  const [hintCount, setHintCount] = useState(1);
  const { gameData, updateGameData } = useContext(GameContext);
  const { submitHint } = useGameMaster();
  const handleHintChange = (event: any) =>
    setHint(event.target.value.toUpperCase());
  const handleHintCountChange = (event: any) => {
    setHintCount(event.target.value);
  };

  const { isRedTurn, user } = gameData;

  // const handleSubmit = () => {
  //   socket.emit("newHint", {
  //     roomID: props.roomID,
  //     hint,
  //     hintCount,
  //     isRedTurn: props.isRedTurn,
  //   });
  // };

  const isSubmitDisabled = !(
    (isRedTurn && user?.team === "RED") ||
    (!isRedTurn && user?.team === "BLUE")
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
        onClick={() => submitHint({ hint, hintCount })}
        text={"SEND"}
        style={{ width: 100 }}
      />
    </div>
  );
}
