import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:3001";
const socket = socketIOClient(ENDPOINT);

function Room(props) {
  const [roomID, setRoomID] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const [users, setUsers] = useState([]);

  const handleMessageChange = event => setMessage(event.target.value);

  const sendMessage = () => {
    socket.emit('message', {message, roomID});
  };

  useEffect(() => {
    setRoomID(props.match.params.roomID);
    socket.emit('joinRoom', {roomID: props.match.params.roomID, userID: props.location.state.userID });

    socket.on('newMessage', (msg) => {
      setMessages((messages) => [...messages, msg]);
    });

    socket.on('newUser', (userID) => {
      console.log('newuser', userID);
      setUsers([...users, userID]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <p>New Room</p>
      <div>
        {users.map((user, i) => {
          return (<li key={i}>{user}</li>);
        })}
      </div>
      <div>
        {messages.map((msg, i) => {
          return (<li key={i}>{msg}</li>);
        })}
      </div>
      <input value={message} onChange={handleMessageChange}/>
      <button onClick={sendMessage}>Submit</button>
    </>
  );
}

export default Room;