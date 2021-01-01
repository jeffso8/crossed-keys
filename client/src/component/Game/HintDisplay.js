import React, { useState, useEffect } from 'react';
import socket from '../../socket';

export default function HintDisplay() {
  const [hints, setHints] = useState([]);

  useEffect(() => {
    socket.on('sendHint', (data) => {
      setHints([...hints, data.hint]);
    });
  }, []);

  return (
    <div>
      {hints.map(hint => {
        return (
        <div>
          {hint.hint} for {hint.hintCount.toString()}
        </div>)
      })}
    </div>
  )
}