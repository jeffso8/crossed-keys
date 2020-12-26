import React, { useState, useEffect, useLayoutEffect } from "react";
import Card from './Card';
import axios from 'axios';
import {socket} from './Room';
import {MUD_BROWN, NEUTRAL_CARD, BLUE_CARD, RED_CARD, BOMB_CARD} from '../constants';

  // const [messages, setMessages] = useState([]);
  // const [message, setMessage] = useState('');
    // socket.on('newMessage', (msg) => {
    //   setMessages((messages) => [...messages, msg]);
    // });
function Game(props) {
  const [roomID, setRoomID] = useState("");
  const [redTeam, setRedTeam] = useState([]);
  const [blueTeam, setBlueTeam] = useState([]);
  const [colors, setColor] = useState([]);
  const [words, setWords] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [redTurn, setRedTurn] = useState(props.location.state.data.isRedTurn);
  const [clicked, setClicked] = useState([]);


  const organizeUsers = users => {
    const emptyRedTeam = [];
    const emptyBlueTeam = [];
    Object.keys(users).forEach((userID) => {
        if(users[userID].team === "RED") {
          emptyRedTeam.push(userID);
        } else {
          emptyBlueTeam.push(userID);
        }
    });
    setRedTeam(emptyRedTeam);
    setBlueTeam(emptyBlueTeam);
  };


  useEffect(() => {
    console.log('props', props.location.state);
    socket.emit('joinGame', {roomID: props.location.state.data.roomID});

    socket.on('refreshGame', (data) => {
      setClicked(data.clicked);
      setColor(data.colors);
    });

    socket.on('updateRedScore', (data) => {
      setRedScore(data.redScore);
    });

    socket.on('updateBlueScore', (data) => {
      setBlueScore(data.blueScore);
    });

    socket.on('updateFlipCard', (data) => {
      setClicked(data.clicked);
      setRedTurn(data.isRedTurn);
    });

    setRoomID(props.location.state.data.roomID);
    setUsers(props.location.state.data.users);
    organizeUsers(props.location.state.data.users);
    setWords(props.location.state.data.words);
    setUser(props.location.state.data.users.find(user => user.userID === props.location.state.userID));
    setRedTurn(props.location.state.data.isRedTurn);
  }, []);


  const handleRedScoreChange = (event) => {
    setRedScore(event);
    socket.emit('redScoreChange', {roomID, gameScore: redScore + 1})
  }

  const handleBlueScoreChange = (event) => {
    setBlueScore(event)
    socket.emit('blueScoreChange', {roomID, gameScore: blueScore + 1})
  }

  const handleRedTurn = (event) => {
    socket.emit('updateTurn', {roomID, redTurn: event})
  }

  const handleCardClick = (index, turn) => {
    socket.emit('flipCard', {roomID, index, isRedTurn: turn})
  }

  const rowColor1 = colors.slice(0,5);
  const rowColor2 = colors.slice(5,10);
  const rowColor3 = colors.slice(10,15);
  const rowColor4 = colors.slice(15,20);
  const rowColor5 = colors.slice(20,25);

  const wordsColumn1 = words.slice(0,5);
  const wordsColumn2 = words.slice(5,10);
  const wordsColumn3 = words.slice(10,15);
  const wordsColumn4 = words.slice(15,20);
  const wordsColumn5 = words.slice(20,25);

   //   const sendMessage = () => {
  //   socket.emit('message', {message, roomID});
  //   setMessage("");
  // };

  const cardStyle = {
    container : {
      display:"grid",
      position: "fixed",
      left:"50%",
      top:"50%",
      transform:"translate(-50%, -50%)",
      gridGap: 50,
      gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr"
    },
    columns : {
      margin: 0,
    }
  };

  const style = {
    score: {
      color: MUD_BROWN,
      fontSize: 40,
      textAlign: 'center',
      marginTop: 20,
      fontWeight: 900,
    }
  };


  //   const sendMessage = () => {
  //   socket.emit('message', {message, roomID});
  //   setMessage("");
  // };

  const renderColumns = (rowColor, wordColumn, clickedColumn, className) => {
    return (
    <div className={className} style={cardStyle.columns}>
      {rowColor.map((color, index) => {
        let realColor = '';
        if (color === 'blue') {
          realColor = BLUE_CARD;
        } else if (color === 'red') {
          realColor = RED_CARD;
        } else if (color === 'black') {
          realColor = BOMB_CARD;
        } else {
          realColor = NEUTRAL_CARD;
        }

        //TODO: clicked and index, figure out a way to store these as states, and emitted to all clients
        const randDeg = (Math.random() + 0.1) * (Math.round(Math.random()) ? 1 : -1);
        const isClicked = clicked[index + (clickedColumn * 5)];

        const isDisabled = ((user.team === 'RED' && !redTurn) || (user.team === 'BLUE' && redTurn) || isClicked);
        return (
          <Card
            word={wordColumn[index]}
            idx={index + (clickedColumn * 5)}
            clicked={isClicked}
            handleCardClick={handleCardClick}
            color={realColor}
            user={user}
            isDisabled={isDisabled}
            redScore={redScore}
            setRedScore={handleRedScoreChange}
            blueScore={blueScore}
            setBlueScore={handleBlueScoreChange}
            rotate={randDeg}
            redTurn={redTurn}
            handleRedTurn={handleRedTurn}
          />
        )
      }
      )}
      </div>
    )
  };

  return (
    <>
    {/* <div className="Column1">
      <h1>Red Team</h1>
      {redTeam.map((user, i) => {
        return (
        <li key={i}>
          {user}
          {props.location.state.data.redSpy === user && <div>spymaster</div>}
        </li>);
      })}
    </div> */}
    <div className="red-flag">
      <div style={style.score}>{redScore}</div>
    </div>
    <div>
      <h2>{redTurn ? 'Red\'s Turn' : 'Blue\'s Turn'}</h2>
    </div>
    <div className="blue-flag">
      <div style={style.score}>{blueScore}</div>
    </div>
    <div style={cardStyle.container}>
      {renderColumns(rowColor1, wordsColumn1, 0, 'Column1')}
      {renderColumns(rowColor2, wordsColumn2, 1, 'Column2')}
      {renderColumns(rowColor3, wordsColumn3, 2, 'Column3')}
      {renderColumns(rowColor4, wordsColumn4, 3, 'Column4')}
      {renderColumns(rowColor5, wordsColumn5, 4, 'Column5')}
    </div>
    {/* <div classname="Column5">
      <h1>Blue Team</h1>
      {blueTeam.map((user, i) => {
        return (
        <li key={i}>
          {user}
          {props.location.state.data.blueSpy === user && <div>spymaster</div>}
        </li>);
      })}
    </div>
  */}
          {/* <div>
        {messages.map((msg, i) => {
          return (<li key={i}>{msg}</li>);
        })}
      </div>
      <input value={message} onChange={handleMessageChange}/>
      <button onClick={sendMessage}>Submit</button> */}
    </>
  );
};

export default Game;