import React from "react";
import Modal from '../shared/Modal';

function GameOverModal(props) {
  const style = {
    content: {
      position:'relative',
      top:'25%',
      margin:'10px'
    }
  };

  return(
    <Modal
      title={`New Game`}
    >
      <div>
        <div style={style.content}>
        Game Over:
        <h1>{props.gameScore[0]} - {props.gameScore[1]}</h1>
        <button>Start Next Game</button>
        <button>Re-Pick SpyMaster</button>
        <button>Re-Shuffle Teams</button>
        </div>
      </div>
    </Modal>
  );
};

export default GameOverModal;