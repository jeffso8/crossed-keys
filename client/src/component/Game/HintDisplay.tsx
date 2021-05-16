import React, { useState, useEffect } from 'react';
import socket from '../../socket';
import {Responsive} from '../shared/responsive';
import {RED_CARD, BLUE_CARD} from '../../constants';
import {DataType, HintsType} from '../../types';

export default function HintDisplay() {
  const [hints, setHints] = useState<HintsType>([]);
  const [redTurn, setRedTurn] = useState<boolean>(true);
  const { isMobile } = Responsive();

  const webStyle = {
    hintDisplay: {
      alignContent: 'center',
      width: 100,
      position: 'absolute',
      right:'3.8%'
    }
  };

  const mobileStyle = {
    hintDisplay: {
      alignContent: 'center',
      width: 100,
    }
  };

  const style = isMobile ? mobileStyle : webStyle;
  useEffect(() => {
    socket.on('sendHint', (data: DataType) => {
      setHints(data.hints);
      setRedTurn(data.isRedTurn);
    });
  }, []);

  return (
    <div style={style.hintDisplay}>
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