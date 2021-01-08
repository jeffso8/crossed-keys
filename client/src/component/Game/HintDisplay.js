import React, { useState, useEffect } from 'react';
import socket from '../../socket';
import {Responsive} from '../shared/responsive';
import {RED_CARD, BLUE_CARD} from '../../constants';

export default function HintDisplay() {
  const [hints, setHints] = useState([]);
  const [redTurn, setRedTurn] = useState(true);
  // const { isMobile } = Responsive();
  
  useEffect(() => {
    socket.on('sendHint', (data) => {
      setHints(data.hints);
      setRedTurn(data.isRedTurn);
    });
  }, []);

  return (
    <div style={{alignContent: 'center', width: 100, position: 'absolute', right:'3.8%'}}>
      <h1>HINTS</h1>
    <div style={{width: 100, position: 'absolute', right: '2%'}}>
      {hints.map(hint => {
        return (
        <div style={{color: redTurn ? RED_CARD : BLUE_CARD, marginBottom:'10px', right:'20%'}}>
          {hint.hint} for {hint.hintCount}
        </div>)
      })}
    </div>
    </div>
  )
}