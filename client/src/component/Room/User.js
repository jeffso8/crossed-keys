import React from 'react';
import { BROWNISH } from '../../constants';
import { Responsive } from '../shared/responsive';

export default function User(props) {
  const { isMobile } = Responsive();

  const webStyle = {
    name: {
      fontSize: 24,
      margin: 12,
      textTransform: 'uppercase',
      fontWeight: 900,
      textAlign: 'center',
      alignSelf: 'center',
      color: BROWNISH,
    },
  };

  const mobileStyle = {
    name: {
      fontSize: 16,
      margin: 12,
      textTransform: 'uppercase',
      fontWeight: 900,
      textAlign: 'center',
      alignSelf: 'center',
      color: BROWNISH,
    },
  };

  const style = isMobile ? mobileStyle : webStyle;


  return (
    <div key={props.i} style={style.name}>
      {props.name}
      {props.isSpyMaster && <span> - spy</span>}
    </div>
  );
}
