import React, { useEffect } from 'react';
 

function getTimeRemaining(endTime) {
  const diff = endTime - Date.now();
  return Math.floor(diff / 1000);
}
function Timer(props) {
  const endTime = new Date(props.turnStartedAt).getTime() + 10000 + 1000;

  const [time, setTime] = React.useState(undefined);

  
  useEffect(() => {
    const countdown = Math.floor((endTime - Date.now())/1000);
    if (countdown < 0) {
      props.handleEndTurn(!props.redTurn);
    }
    const timeout = setTimeout(() => {
      setTime(countdown);
    }, 1000);


    return () => {
      clearTimeout(timeout);
    };
  }, [time]);




  return(
    <>
      <div style={{marginTop: '16px'}} className={`flip-countdown theme-light size-medium`}>
        <span className='flip-countdown-piece'>
          {time}
        </span>
      </div>
    </>
  );
}

export default Timer;