import React, { useState } from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {BEIGE, BROWNISH, MUD_BROWN} from '../constants';
import TextInput from './shared/input';
import ReactArcText from 'react-arc-text-fix';

function Home() {

  const style = {
    container: {
      height: '100%',
      backgroundColor: BEIGE,
      display: 'flex',
      justifyContent: 'center',
    },
    content: {
      width: 800,
      alignSelf:'center',
      textAlign: 'center',
    },
    box: {
      alignSelf:'center',
      border: `1px solid ${MUD_BROWN}`,
      height: 'min-content',
      padding: 10,
    },
    boxinner: {
      border: `4px solid ${MUD_BROWN}`,
      padding: 120,
    },
    by: {
      color: MUD_BROWN,
      fontFamily: 'Helvetica',
      fontSize: 20,
      fontWeight: 500,
      textAlign: 'center',
      marginBottom: 40,
      letterSpacing: 2,
    },
    title: {
      color: MUD_BROWN,
      fontFamily: 'Helvetica',
      fontSize: 62,
      fontWeight: 900,
      marginBottom: 20,
      textAlign: 'center',
      letterSpacing: 4,
    },
    button: {
      width: 120,
      height: 50,
      border: 'none',
      fontSize: 18,
      fontWeight: 900,
      letterSpacing: 2,
      marginTop: 20,
      backgroundColor: BROWNISH,
      color: MUD_BROWN,
    }
  };

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
    <div style={style.container}>
      <div style={style.box}>
      <div style={style.boxinner}>
      <div class='content' style={style.content}>
        <div style={{marginBottom: '40px'}}>
          <div style={style.by}>
            <div style={{marginBottom: '4px'}}>
            A
            </div>
            <div style={{fontWeight: 900}}>
             <ReactArcText
                text={"CODENAME INSPIRED"}
                direction={1}
                arc={360}
                class={''}
              />
            </div>
            <div style={{marginTop: '-10px'}}>
            CARD GAME
            </div>
          </div>
          <div style={style.title}>
            PROTECT YA CODE
          </div>

        </div>
        <div>
          <TextInput name='username' value={username} placeholder={'Username'} onChange={handleUsernameChange} />
        </div>
        <div>
          <TextInput name="roomName" value={roomName} placeholder={'Room Name'} onChange={handleRoomNameChange} />
        </div>
        <button style={style.button} onClick={createRoom}>SUBMIT</button>
      </div>
      </div>
      </div>
    </div>
  );
}

export default Home;