import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const ENDPOINT = "http://127.0.0.1:3001";
const socket = socketIOClient(ENDPOINT);


function Room(props) {
  const [roomID, setRoomID] = useState('');
  const [redTeam, setRedTeam] = useState([]);
  const [blueTeam, setBlueTeam] = useState([]);
  const [nullTeam, setNullTeam] = useState([]);
  const history = useHistory();

  const organizeUsers = users => {
    const emptyRedTeam = [];
    const emptyBlueTeam = [];
    const emptyNullTeam = [];
    Object.keys(users).forEach((userID) => {
        if(users[userID].team === "RED") {
          emptyRedTeam.push(userID);
        } else if (users[userID].team === "BLUE") {
          emptyBlueTeam.push(userID);
        } else {
          emptyNullTeam.push(userID);
        }
    });
    setRedTeam(emptyRedTeam);
    setBlueTeam(emptyBlueTeam);
    setNullTeam(emptyNullTeam);
  };

  const handleSetRedTeamClick = event => {
    socket.emit('setRedTeam', {roomID, userID: props.location.state.userID});
  };

  const handleSetBlueTeamClick = event => {
    socket.emit('setBlueTeam', {roomID, userID: props.location.state.userID});
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

    return () => {
      socket.disconnect();
    };
  }, "");

  useEffect(() => {
    socket.on('updateTeams', (users) => {
      organizeUsers(users);
    });
  }, [nullTeam, redTeam, blueTeam]);

  return (
    <>
      <h1>Current Room: {roomID}</h1>
      <div className="teamChooseContainer" style={style.containerStyle}>
        <div className="redColumn" style={style.columnStyle}>
          <h1>Red Team</h1>
          {redTeam.map((user, i) => {
            return (<li key={i}>{user}</li>);
          })}
        </div>
      <div className="mainColumn" style={style.columnStyle}>
        <h1>Pick Team</h1>
        {nullTeam.map((user, i) => {
          return (<li key={i}>{user}</li>);
        })}
      </div>
      <div className="blueColumn" style={style.columnStyle}>
        <h1>Blue Team</h1>
        {blueTeam.map((user, i) => {
          return (<li key={i}>{user}</li>);
        })}
      </div>
      </div>
      <div className="pickTeamButtons" style={style.teamButton}>
      <button value="red" onClick={handleSetRedTeamClick}>Red Team</button>
      <button onClick={startGame}>Start Game</button>
      <button value="blue" onClick={handleSetBlueTeamClick}>Blue Team</button>
      </div>
    </>
  );
}

export default Room;