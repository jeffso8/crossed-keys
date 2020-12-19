import React, { useState, useEffect } from "react";
import Card from './Card';
import axios from 'axios';

  // const [messages, setMessages] = useState([]);
  // const [message, setMessage] = useState('');
    // socket.on('newMessage', (msg) => {
    //   setMessages((messages) => [...messages, msg]);
    // });
function Game(props) {
  const [redTeam, setRedTeam] = useState([]);
  const [blueTeam, setBlueTeam] = useState([]);

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

  const colors = ["red", "red", "red", "red", "red", "red", "red", "red", "blue", "blue", "blue", "blue",
  "blue", "blue", "blue", "blue", "white", "white", "white", "white", "white", "white", "white", "white", "black"];
  const colorSorted = colors.sort(() => Math.random() - 0.5);
  console.log('colorSorted', colorSorted);
  const rowColor1 = colorSorted.slice(0,5);
  const rowColor2 = colorSorted.slice(5,10);
  const rowColor3 = colorSorted.slice(10,15);
  const rowColor4 = colorSorted.slice(15,20);
  const rowColor5 = colorSorted.slice(20,25);
  const [users, setUsers] = useState({});
  // const blackCardIndex = Math.random() * 25;
  const [words, setWords] = useState([]);
  // const handleMessageChange = event => setMessage(event.target.value);

  useEffect(() => {
    axios.get('/words').then(
      (response) => {
        console.log('RESPONSE', response);
        setWords(response.data);
      },
      (error) => {
        console.log(error);
      })
  }, []);

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
      gridGap: "10px",
      gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr"
    },
    columns : {
      margin:"45px",
    }
  }

  useEffect(() => {
    setUsers(props.location.state.users);
    organizeUsers(props.location.state.users);
  }, [])

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

  return (
    <>
    <div className="gameScore">

    </div>

    <div className="Column1">
      <h1>Red Team</h1>
      {redTeam.map((user, i) => {
        return (<li key={i}>{user}</li>);
      })}
    </div>
    <div style={cardStyle.container}>
      <div className="Column1" style={cardStyle.columns}>
      {rowColor1.map((color, index) => <Card word={wordsColumn1[index]} color={color} />)}
      </div>
      <div className="Column2" style={cardStyle.columns}>
      {rowColor2.map((color, index) => <Card word={wordsColumn2[index]} color={color} />)}
      </div>
      <div className="Column3" style={cardStyle.columns}>
      {rowColor3.map((color, index) => <Card word={wordsColumn3[index]} color={color} />)}
      </div>
      <div className="Column4" style={cardStyle.columns}>
      {rowColor4.map((color, index) => <Card word={wordsColumn4[index]} color={color} />)}
      </div>
      <div className="Column5" style={cardStyle.columns}>
      {rowColor5.map((color, index) => <Card word={wordsColumn5[index]} color={color} />)}
      </div>
    </div>
    <div classname="Column5">
      <h1>Blue Team</h1>
      {blueTeam.map((user, i) => {
        return (<li key={i}>{user}</li>);
      })}
    </div>
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