import React, { useState, useEffect} from "react";
import { useHistory } from 'react-router-dom';
import socket from '../../socket';
import User from './User';
import {organizeUsers} from '../shared/utils';
import {Responsive} from '../shared/responsive';
import {Button} from '../shared/Button';

function Room(props) {
  const [roomID, setRoomID] = useState('');
  const [user, setUser] = useState({});
  const [redTeam, setRedTeam] = useState([]);
  const [blueTeam, setBlueTeam] = useState([]);
  const [nullTeam, setNullTeam] = useState([]);
  const [onTeam, setOnTeam] = useState(false);
  const [roomData, setRoomData] = useState({});
  const history = useHistory();
  const {isMobile} = Responsive();

  const handleSetRedTeamClick = event => {
    setOnTeam(true);
    socket.emit('setRedTeam', {roomID, userID: props.location.state.userID});
  };

  const handleSetBlueTeamClick = event => {
    setOnTeam(true);
    socket.emit('setBlueTeam', {roomID, userID: props.location.state.userID});
  };

  const handleClaimSpyMasterClick = event => {
    socket.emit('claimSpyMaster', {roomID, userID: props.location.state.userID});
  };

  const startGame = () => {
    socket.emit('hostStartGame', {roomID});
    socket.emit('startTimer', {roomID});
  };

  const webStyle = {
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
  };

  const mobileStyle = {
    containerStyle:{
      display:"grid",
      width: '100%',
      position: "absolute",
      gridTemplateColumns:"1fr 1fr 1fr"
    },
    columnStyle:{
      height:"auto",
    },
    teamButton:{
      display:"grid",
      position: "absolute",
      bottom:"10%",
      gridTemplateColumns:"1fr 1fr 1fr"
    }
  };

  useEffect(() => {
    setRoomID(props.match.params.roomID);
    socket.emit('joinRoom', {roomID: props.match.params.roomID, userID: props.location.state.userID });

    socket.on('startGame', (data) => {
      console.log('data', data);
      history.push(`/${data.roomID}/game`, {data, userID:props.location.state.userID });
    });
  }, "");

  useEffect(() => {
    socket.on('updateTeams', (data) => {
      const {redTeam, blueTeam, nullTeam } = organizeUsers(data.users);
      setRedTeam(redTeam);
      setBlueTeam(blueTeam);
      setNullTeam(nullTeam);
      setUser(data.users.find((user) => user.userID === props.location.state.userID));
      setRoomData(data);
    });
  }, []);

  const showClaimSpyMaster = () => {
    if(user.team === "RED" && roomData.redSpy) {
      return false;
    } else if (user.team === "BLUE" && roomData.blueSpy) {
      return false;
    }
    return true;
  };

  const style = isMobile ? mobileStyle : webStyle;
  return (
    <div style={{width: '100%', height: '100%'}}>
      <h1>Current Room: {roomID}</h1>
      <div className="teamChooseContainer" style={style.containerStyle}>
        <div className="redColumn" style={style.columnStyle}>
          <div>Red Team</div>
          {redTeam.map((user, i) => {
            return (
              <User
                i={i}
                name={user.userID}
                isSpyMaster={roomData.redSpy === user}
              />
          );
          })}
        </div>
        <div className="mainColumn" style={style.columnStyle}>
          <div>Pick Team</div>
          {nullTeam.map((user, i) => {
            return (
              <User
                i={i}
                name={user.userID}
                isSpyMaster={roomData.redSpy === user}
              />
            );
          })}
        </div>
        <div className="blueColumn" style={style.columnStyle}>
          <div>Blue Team</div>
          {blueTeam.map((user, i) => {
            return (
              <User
                i={i}
                name={user.userID}
                isSpyMaster={roomData.blueSpy === user}
              />
              );
            })}
        </div>
      </div>
      <div className="pickTeamButtons" style={style.teamButton}>
      <Button onClick={handleSetRedTeamClick} text={'Red Team'}/>
      {user.isHost ?
        // <button onClick={startGame}>Start Game</button>
        <Button onClick={startGame} text={'Start Game'}/>
        : null
      }
      <Button onClick={handleSetBlueTeamClick} text={'Blue Team'}/>
      {showClaimSpyMaster() ?
        <Button onClick={handleClaimSpyMasterClick} text={'Claim Spy'}/>
        : null
      }
      </div>
    </div>
  );
}

export default Room;