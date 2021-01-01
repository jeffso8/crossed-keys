import React, { useState } from 'react';
import TextInput from '../shared/TextInput';
import Button from '../shared/Button';
import socket from '../../socket';

export default function Hint(props) {
  const [hint, setHint] = useState('');
  const [hintCount, setHintCount] = useState(0);

  const handleHintChange = (event)  => setHint(event.target.value);
  const handleHintCountChange = (event)  => setHintCount(event.target.value);

  const handleSubmit = () => {
    socket.emit('sendHint', {hint, hintCount});
  };

  return (
    <div>
      <TextInput
        value={hint}
        onChange={handleHintChange}
      />
      <select value={hintCount} onChange={handleHintCountChange}>
        <option value='1'>1</option>
        <option value='2'>2</option>
        <option value='3'>3</option>
        <option value='4'>4</option>
        <option value='5'>5</option>
        <option value='6'>6</option>
        <option value='7'>7</option>
        <option value='8'>8</option>
    </select>
    <Button onClick={handleSubmit} text={'SEND'}/>
    </div>
  )
}