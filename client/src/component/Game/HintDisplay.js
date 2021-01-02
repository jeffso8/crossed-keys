import React, { useState, useEffect } from 'react';
import socket from '../../socket';

export default function HintDisplay() {
  const [hints, setHints] = useState([]);

  useEffect(() => {
    socket.on('sendHint', (data) => {
      setHints(data.hints);
    });
  }, []);

  return (
    <div>
      {hints.map(hint => {
        return (
        <div>
          {hint.hint} for {hint.hintCount}
        </div>)
      })}
    </div>
  )
}