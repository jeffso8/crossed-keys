import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import socket from '../../socket';
import User from './User';
import { organizeUsers } from '../shared/utils';
import { Responsive } from '../shared/responsive';
import Button from '../shared/Button';
import {DataType, UserType} from '../../types';
import { MUD_BROWN, MAIZE, BLUE_CARD, RED_CARD } from '../../constants';

type RoomPropType = {
  location: {
    state: {
      data: DataType,
      userID: string,
    },
  }, 
  match: {
    params: {
      data: DataType,
      userID: string,
      roomID: string
    },
  }
};

function Room(props: RoomPropType) {
  const emptyUser = {
    userID: '',
    team: '',
    role: '',
    isHost: false,
    socketId: ''
  };

  const [roomID, setRoomID] = useState<String>('');
  const [user, setUser] = useState<UserType>(emptyUser);
  const [redTeam, setRedTeam] = useState<UserType[]>([]);
  const [blueTeam, setBlueTeam] = useState<UserType[]>([]);
  const [nullTeam, setNullTeam] = useState<UserType[]>([]);
  const [roomData, setRoomData] = useState<DataType>();
  const history = useHistory<any>();
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
      textAlign: "center" as "center",
      marginTop: 80,
    },
    roomName: {
      fontSize: 50,
    },
    welcome: {
      fontSize: 34,
    },
    to: {
      textAlign: "center" as "center",
      fontSize: 28
    },
    body: {
      width: '80%',
      margin: '120px auto',
    },
    columnStyle: {
      height: 'auto',
    },
    columnTitle: {
      fontSize: 20,
      fontWeight: 900,
      letterSpacing: 1,
      textAlign: "center" as "center",
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
      padding: '12px',
      color: MAIZE,
    }
  };

  const mobileStyle = {
    title: {
      fontSize: 46,
      letterSpacing: 3,
      fontWeight: 900,
      color: MUD_BROWN,
      width: '100%',
      textAlign: "center" as "center",
      marginTop: 80,
    },
    roomName: {
      fontSize: 38,
    },
    welcome: {
      fontSize: 28,
    },
    to: {
      textAlign: "center" as "center",
      fontSize: 22,
    },
    body: {
      width: '100%',
      margin: '0 auto',
      paddingTop: 50,
    },
    columnTitle: {
      fontSize: 16,
      fontWeight: 900,
      letterSpacing: 1,
      textAlign: "center" as "center"
    },
    containerStyle: {
      display: 'grid',
      width: '100%',
      position: "absolute" as "absolute",
      gridTemplateColumns: '1fr 1fr 1fr',
    },
    columnStyle: {
      height: 'auto',
    },
    teamButton: {
      display: 'grid',
      gridGap: '8px',
      marginTop: 100,
      gridTemplateColumns: '1fr 1fr 1fr',
    },
    button: {
      margin: 'auto',
      padding: '8px',
      color: MAIZE,
      fontSize: 14,
    },

  };

  useEffect(() => {
    setRoomID(props.match.params.roomID);
    socket.emit('joinRoom', {
      roomID: props.match.params.roomID,
      userID: props.location.state.userID,
    });

    socket.on('startGame', (data: DataType) => {
      history.push(`/${data.roomID}/game`, {
        data,
        userID: props.location.state.userID,
      });
    });
    // @ts-ignore
  }, "");

  useEffect(() => {
    socket.on('updateTeams', (data: DataType) => {
      const { redTeam, blueTeam, nullTeam } = organizeUsers(data.users);
      setRedTeam(redTeam);
      setBlueTeam(blueTeam);
      setNullTeam(nullTeam);
      setUser(
        data.users.find((user) => user.userID === props.location.state.userID) || emptyUser
      );
      setRoomData(data);
    });
  }, []);

  const showClaimSpyMaster = () => {
    if (roomData) {
      if (user.team === 'RED' && roomData.redSpy){
        return false;
      } else if (user.team === 'BLUE' && roomData.blueSpy) {
        return false;
      }
    return true;
    }
  };

  const style = isMobile ? mobileStyle : webStyle;
  
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={style.title}>
        <div style={style.welcome}>WELCOME</div>
        <div style={style.to}>TO</div>
        <div style={style.roomName}>THE {roomID} HOTEL</div>

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
                  isSpyMaster={roomData ? roomData.redSpy === user.userID : null}
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
                  isSpyMaster={roomData ? roomData.blueSpy === user.userID : null}
                />
              );
            })}
          </div>
        </div>

        <div className="pickTeamButtons" style={style.teamButton}>
          <Button style={{...style.button, backgroundColor: RED_CARD}} onClick={handleSetRedTeamClick} text={'Red Team'} />
          {user.isHost ? (
            <Button style={{...style.button, backgroundColor: '#496F5D'}} onClick={startGame} text={'Start Game'} />
          ) : null}
          <Button style={{...style.button, backgroundColor: BLUE_CARD}} onClick={handleSetBlueTeamClick} text={'Blue Team'} />
        </div>
        <div> 
          {showClaimSpyMaster() ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px',
            }}> 
              <Button style={{...style.button, backgroundColor: 'BLACK', marginTop: '16px'}} onClick={handleClaimSpyMasterClick} text={'Claim Spy'} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Room;
