import React from 'react';

function Modal(props) {
  const style = {
    container: {
      width: 600,
      height: 500,
      backgroundColor: 'white',
      zIndex: 1,
      position: 'relative',
      top: '5%',
      textAlign: 'center',
      borderRadius: '1em',
      boxShadow: '5px 15px 20px #686963',
    },
    body: {
      width: 550,
      height: 450,
      top: '5%',
      margin: '10px',
    },
    columns: {
      margin: '2px',
      height: 'auto',
      width: 'auto',
    },
    ...props.style,
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <div style={style.container}>
        <h1>{props.title}</h1>
        <div style={style.body}>{props.children}</div>
      </div>
    </div>
  );
}

export default Modal;
