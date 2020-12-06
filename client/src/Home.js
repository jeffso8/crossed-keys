import React, { useState } from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Home() {
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const history = useHistory();

  const handleUsernameChange = (event)  => setUsername(event.target.value);
  const handleRoomNameChange = (event)  => setRoomName(event.target.value);

  const createRoom = () => {
    axios.post('/create-room', {username, roomName}).then(
      res => {
        history.push(res.data.redirectUrl, {userID: username})
      });
  };

  return (
    <>
      <input type="text" name="username" value={username} onChange={handleUsernameChange} />
      <input type="text" name="roomName" value={roomName} onChange={handleRoomNameChange}/>
      <button onClick={createRoom}>Submit</button>
    </>
  );
}

export default Home;