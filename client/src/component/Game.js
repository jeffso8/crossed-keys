import React, { useState, useEffect } from "react";
import Card from './Card';
import axios from 'axios';
import {socket} from './Room';
import {BEIGE} from '../constants';

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



  const organizeUsers = users => {
    const emptyRedTeam = [];
    const emptyBlueTeam = [];
    console.log("usersGame", users);
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
    socket.emit('joinGame', {roomID: props.location.state.data.roomID});
  
    socket.on('updateRedScore', (data) => {
      console.log("scoreUpdated", data);
      setRedScore(data.redScore);
    });
    socket.on('updateBlueScore', (data) => {
      console.log("scoreUpdated");
      setBlueScore(data.blueScore);
    });
    setRoomID(props.location.state.data.roomID);
    setUsers(props.location.state.data.users);
    organizeUsers(props.location.state.data.users);
    setWords(props.location.state.data.words);
    setColor(props.location.state.data.colors)
    setUser(props.location.state.data.users[props.location.state.userID])
  }, []);


  const handleRedScoreChange = (event) => {
    setRedScore(event);
    socket.emit('redScoreChange', {roomID, gameScore: redScore + 1})
  }

  const handleBlueScoreChange = (event) => {
    setBlueScore(event)
    socket.emit('blueScoreChange', {roomID, gameScore: blueScore + 1})
  }

  const rowColor1 = colors.slice(0,5);
  const rowColor2 = colors.slice(5,10);
  const rowColor3 = colors.slice(10,15);
  const rowColor4 = colors.slice(15,20);
  const rowColor5 = colors.slice(20,25);
  // const blackCardIndex = Math.random() * 25;
  // const handleMessageChange = event => setMessage(event.target.value);

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
  }


  //   const sendMessage = () => {
  //   socket.emit('message', {message, roomID});
  //   setMessage("");
  // };

  // const onCardsClicked={}
  // renderCards() {
  //   return (
  //     words.map((word, index) => {


  //       const color = colors[Math.random() * 3];
  //       if(color === red) redCount++;
  //       if(color === blue) blueCount++;


  //       if (index === blackCardIndex) {
  //         color = black;
  //       }

  //       return (
  //         <Card
  //          text={word}
  //          color={color}
  //          onClick=
  //         />
  //       );
  //     })
  //   );
  // };

  const renderColumns = (rowColor, wordColumn, className) => {
    return (
    <div className={className} style={cardStyle.columns}>
      {rowColor.map((color, index) => {

        const randDeg = (Math.random() + 0.2) * (Math.round(Math.random()) ? 1 : -1);
       return  <Card word={wordColumn[index]} color={color} user={user} redScore={redScore} setRedScore={handleRedScoreChange}
        blueScore={blueScore} setBlueScore={handleBlueScoreChange} rotate={randDeg}/>
        }
      )}
      </div>
    )
  };

  return (
    <>
    <div className="gameScore">

    </div>

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
    <div style={cardStyle.container}>

      {renderColumns(rowColor1, wordsColumn1, 'Column1')}
      {renderColumns(rowColor2, wordsColumn2, 'Column2')}
      {renderColumns(rowColor3, wordsColumn3, 'Column3')}
      {renderColumns(rowColor4, wordsColumn4, 'Column4')}
      {renderColumns(rowColor5, wordsColumn5, 'Column5')}
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
    <div classname="Column5">
      <h1>Red Score: {redScore} </h1>
    </div>
    <div classname="Column5">
      <h1>Blue Score: {blueScore} </h1>
    </div> */}
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