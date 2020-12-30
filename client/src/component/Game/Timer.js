import React, { useState, useEffect } from 'react';
import socket from '../../socket';


function Timer(props) {
  const [time, setTime] = useState(180);

  useEffect(() => {
    socket.on('timer', (data) => {
      console.log('clint side timer', data);
      setTime(data.time);
      props.setTimerID(data.currentTimer);
    });
  }, []);
  

  var seconds = time % 60;
  var minutes = Math.floor(time / 60) % 60;

  return(
    <div>
      <h1>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
    </div>
  );
}

export default Timer;