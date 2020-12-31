import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import socket from '../../socket';
import User from './User';
import { organizeUsers } from '../shared/utils';
import { Responsive } from '../shared/responsive';
import { Button } from '../shared/Button';
import {MUD_BROWN} from '../../constants';
import ReactArcText from 'react-arc-text-fix';

function Room(props) {
  const [roomID, setRoomID] = useState('');
  const [user, setUser] = useState({});
  const [redTeam, setRedTeam] = useState([]);
  const [blueTeam, setBlueTeam] = useState([]);
  const [nullTeam, setNullTeam] = useState([]);
  const [roomData, setRoomData] = useState({});
  const history = useHistory();
  const { isMobile } = Responsive();

  const handleSetRedTeamClick = () => {
    socket.emit('setRedTeam', { roomID, userID: props.location.state.userID });
  };

  const handleSetBlueTeamClick = () => {
    socket.emit('setBlueTeam', { roomID, userID: props.location.state.userID });
  };

  const handleClaimSpyMasterClick = () => {
    socket.emit('claimSpyMaster', {
      roomID,
      userID: props.location.state.userID,
    });
  };

  const startGame = () => {
    socket.emit('hostStartGame', {roomID});
    socket.emit('startTimer', {roomID});
  };

  const webStyle = {
    title: {
      fontSize: 52,
      letterSpacing: 3,
      fontWeight: 900,
      color: MUD_BROWN,
      width: '100%',
      textAlign: 'center',
      marginTop: 80,
    },
    body: {
      width: '100%',
      paddingTop: 50,
    },
    columnStyle: {
      height: 'auto',
    },
    columnTitle: {
      fontSize: 20,
      fontWeight: 900,
      letterSpacing: 1,
      textAlign: 'center',
    },
    containerStyle: {
      display: 'grid',
      gridGap: '25px',
      gridTemplateColumns: '1fr 1fr 1fr',
    },
    teamButton: {
      display: 'grid',
      gridGap: '25px',
      marginTop: 100,
      gridTemplateColumns: '1fr 1fr 1fr',
    },
    button: {
      margin: 'auto',
    }
  };

  const mobileStyle = {
    title: {
      fontSize: 52,
      letterSpacing: 3,
      fontWeight: 900,
      color: MUD_BROWN,
      width: '100%',
      textAlign: 'center',
      marginTop: 80,
    },
    body: {
      width: '100%',
      paddingTop: 50,
    },
    columnTitle: {
      fontSize: 20,
      fontWeight: 900,
      letterSpacing: 1,
      textAlign: 'center',
    },
    containerStyle: {
      display: 'grid',
      width: '100%',
      position: 'absolute',
      gridTemplateColumns: '1fr 1fr 1fr',
    },
    columnStyle: {
      height: 'auto',
    },
    teamButton: {
      display: 'grid',
      gridGap: '25px',
      marginTop: 100,
      gridTemplateColumns: '1fr 1fr 1fr',
    },
    button: {
      margin: 'auto',
    }
  };

  useEffect(() => {
    setRoomID(props.match.params.roomID);
    socket.emit('joinRoom', {
      roomID: props.match.params.roomID,
      userID: props.location.state.userID,
    });

    socket.on('startGame', (data) => {
      console.log('data', data);
      history.push(`/${data.roomID}/game`, {
        data,
        userID: props.location.state.userID,
      });
    });
  }, '');

  useEffect(() => {
    socket.on('updateTeams', (data) => {
      const { redTeam, blueTeam, nullTeam } = organizeUsers(data.users);
      setRedTeam(redTeam);
      setBlueTeam(blueTeam);
      setNullTeam(nullTeam);
      setUser(
        data.users.find((user) => user.userID === props.location.state.userID)
      );
      setRoomData(data);
    });
  }, []);

  const showClaimSpyMaster = () => {
    if (user.team === 'RED' && roomData.redSpy) {
      return false;
    } else if (user.team === 'BLUE' && roomData.blueSpy) {
      return false;
    }
    return true;
  };

  const style = isMobile ? mobileStyle : webStyle;
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={style.title}>
        <div style={{fontSize: 34}}>WELCOME</div>
        <div style={{textAlign: 'center', fontSize: 28}}>TO</div>
        <ReactArcText
          text={`THE ${roomID} HOTEL`}
          direction={1}
          arc={420}
        />
      </div>
      <div className="body" style={style.body}>
        <div className="teamChooseContainer" style={style.containerStyle}>
          <div className="redColumn" style={style.columnStyle}>
            <div style={style.columnTitle}>RED TEAM</div>
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
            <div style={style.columnTitle}></div>
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
            <div style={style.columnTitle}>BLUE TEAM</div>
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
          <Button style={style.button} onClick={handleSetRedTeamClick} text={'Red Team'} />
          {user.isHost ? (
            <Button style={style.button} onClick={startGame} text={'Start Game'} />
          ) : null}
          <Button style={style.button} onClick={handleSetBlueTeamClick} text={'Blue Team'} />
          {showClaimSpyMaster() ? (
            <Button style={style.button} onClick={handleClaimSpyMasterClick} text={'Claim Spy'} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Room;
