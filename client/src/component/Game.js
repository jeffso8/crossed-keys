import React, { useState, useEffect } from "react";
import Card from './Card';

  // const [messages, setMessages] = useState([]);
  // const [message, setMessage] = useState('');
    // socket.on('newMessage', (msg) => {
    //   setMessages((messages) => [...messages, msg]);
    // });
function Game() {
  const colors = ["red", "red", "red", "red", "red", "red", "red", "red", "blue", "blue", "blue", "blue",
  "blue", "blue", "blue", "blue", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "white", "black"];
  const colorSorted = colors.sort(() => Math.random() - 0.5)
  const rowColor1 = colorSorted.slice(0,5);
  const rowColor2 = colorSorted.slice(5,10);
  const rowColor3 = colorSorted.slice(10,15);
  const rowColor4 = colorSorted.slice(15,20);
  const rowColor5 = colorSorted.slice(20,25);
  console.log("rowColor", rowColor5);

  // const blackCardIndex = Math.random() * 25;
  // const handleMessageChange = event => setMessage(event.target.value);


  const cardStyle = {
    container : {
      display:"grid",
      position: "absolute",
      left:"20%",
      top:"20%",
      gridGap: "10px",
      gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr"
    },
    columns : {
      margin:"45px",
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

  return (
    <>
    <div className="gameScore">

    </div>
    <div style={cardStyle.container}>
      <div className="Column1" style={cardStyle.columns}>
      {rowColor1.map((color) => <Card color={color} />)}
      </div>
      <div className="Column2" style={cardStyle.columns}>
      {rowColor2.map((color) => <Card color={color} />)}
      </div>
      <div className="Column3" style={cardStyle.columns}>
      {rowColor3.map((color) => <Card color={color} />)}
      </div>
      <div className="Column4" style={cardStyle.columns}>
      {rowColor4.map((color) => <Card color={color} />)}
      </div>
      <div className="Column5" style={cardStyle.columns}>
      {rowColor5.map((color) => <Card color={color} />)}
      </div>
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