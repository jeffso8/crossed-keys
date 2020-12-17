import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const ENDPOINT = "http://127.0.0.1:3001";
const socket = socketIOClient(ENDPOINT);


function Room(props) {
  const [roomID, setRoomID] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [team, setTeam] = useState("");
  const [users, setUsers] = useState([]);
  const usersRef = useRef([]);
  const history = useHistory();
  usersRef.current = users;

  const handleMessageChange = event => setMessage(event.target.value);

  const handleClick = event => setTeam(event.target.value);

  const sendMessage = () => {
    socket.emit('message', {message, roomID});
    setMessage("");
  };

  const startGame = () => {
    axios.post('/start-game', {roomID}).then(
      (response) => { 
        history.push(response.data.redirectUrl)}, 
      (error) => {
        console.log(error);
      })
  };

  const style = {
    columnStyle:{
      margin:"50px",
      height:"auto",
      width:"200px"
    },
    containerStyle:{
      display:"grid",
      position: "absolute",
      left:"20%",
      top:"15%",
      gridGap: "25px",
      gridTemplateColumns:"1fr 1fr 1fr"
    },
    teamButton:{
      display:"grid",
      position: "absolute",
      left:"25%",
      bottom:"10%",
      gridGap: "250px",
      gridTemplateColumns:"1fr 1fr 1fr"
    }
  }

  useEffect(() => {
    setRoomID(props.match.params.roomID);
    socket.emit('joinRoom', {roomID: props.match.params.roomID, userID: props.location.state.userID });

    socket.on('newMessage', (msg) => {
      setMessages((messages) => [...messages, msg]);
    });

    socket.on('newUser', (users) => {
      console.log('newuser', users);
      setUsers(users);
    });

    return () => {
      socket.disconnect();
    };

  }, "");

  return (
    <>
      <h1>Current Room: {roomID}</h1>
      <div className="teamChooseContainer" style={style.containerStyle}>
        <div className="redColumn" style={style.columnStyle}>
          <h1>Red Column</h1>
        </div>
      <div className="mainColumn" style={style.columnStyle}>
        <h1>Pick Team</h1>
        {users.map((user, i) => {
          return (<li key={i}>{user}</li>);
        })}
      </div>
      <div className="blueColumn" style={style.columnStyle}>
        <h1>Blue Column</h1>
      </div>
      </div>
      <div className="pickTeamButtons" style={style.teamButton}>
      <button value="red" onClick={handleClick}>Red Team</button>
      <button value="white" onClick={handleClick}>Default</button>
      <button value="blue" onClick={handleClick}>Blue Team</button>
      </div>
      <button onClick={startGame}>Start Game</button>

      {/* <div>
        {messages.map((msg, i) => {
          return (<li key={i}>{msg}</li>);
        })}
      </div>
      <input value={message} onChange={handleMessageChange}/>
      <button onClick={sendMessage}>Submit</button> */}
    </>
  );
}

export default Room;