import React, { useState, useEffect } from "react";
import axios from "axios";
import TextInput from "./shared/TextInput";
import Button from "./shared/Button";
import { useCookies } from "react-cookie";
import { BLUE_CARD, MUD_BROWN } from "../constants";
import useTextField from "../hooks/useTextField";
import { useHistory } from "react-router-dom";

function JoinRoom(props) {
  const style = {
    button: {
      width: 120,
      marginTop: 20,
    },
  };
  const [_, setCookie] = useCookies();
  const history = useHistory();

  const [username, usernameError, handleUsernameChange, setUsernameError] =
    useTextField("");

  const roomName = props.location.state.roomID;

  const joinRoom = () => {
    if (username === "") {
      setUsernameError(true);
    }

    axios.post("/create-room", { username, roomName }).then((res) => {
      setCookie("room", roomName, { path: "/" });
      history.push(res.data.redirectUrl, { userID: username });
    });
  };

  return (
    <div>
      <div>{roomName}</div>
      <TextInput
        name="username"
        value={username}
        placeholder={"Username"}
        onChange={handleUsernameChange}
        style={{}}
        error={usernameError}
        errorText={"Username can't be empty"}
      />
      <Button onClick={joinRoom} text={"JOIN"} />
    </div>
  );
}

export default JoinRoom;
