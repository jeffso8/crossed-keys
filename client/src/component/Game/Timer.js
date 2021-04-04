import React, { useState, useEffect, useRef } from 'react';
import socket from '../../socket';
import './Timer.scss';

function Timer(props) {
  const [time, setTime] = useState(0);
  const [prevTime, setPrevTime] = useState(0);

  useEffect(() => {
    socket.on('timer', (data) => {
      if(data.time === 19) {
        setPrevTime(0);
      } else {
        setPrevTime(data.time + 1);
      }
      setTime((time) => data.time);
      processClock(time, prevTime);
      props.setTimerID(data.currentTimer);
    });
  }, []);

  const clockRef = useRef(null);
  const processClock = (aTime, aPrevTime) => {
    if (
      parseInt(time / 10) !==
          parseInt(prevTime / 10) &&
      clockRef.current
    ) {
      const section = clockRef.current.querySelector(
          '.flip-countdown-card-sec.one'
      );
      section.classList.remove('flip');
      void section.offsetWidth;
      section.classList.add('flip');
    }

    if (
      parseInt(time % 10) !==
          parseInt(prevTime % 10) &&
      clockRef.current
    ) {
      const section = clockRef.current.querySelector(
          '.flip-countdown-card-sec.two'
      );
      section.classList.remove('flip');
      void section.offsetWidth;
      section.classList.add('flip');
  }
};



  const part1 = parseInt(time / 10);
  const part2 = parseInt(time % 10);
  let prev1 = parseInt(prevTime / 10);
  let prev2 = parseInt(prevTime % 10);

  return(
    <>
      <div style={{marginTop: '16px'}} className={`flip-countdown theme-light size-medium`}>
        <span className='flip-countdown-piece' ref={clockRef}>
          <span className='flip-countdown-card'>
            <span className={`flip-countdown-card-sec one`}>
                  <span className='card__top'>{part1}</span>
                  <span className='card__bottom' data-value={prev1} />
                  <span className='card__back' data-value={prev1}>
                      <span className='card__bottom' data-value={part1} />
                  </span>
              </span>
              <span className={`flip-countdown-card-sec two`}>
                  <span className='card__top'>{part2}</span>
                  <span className='card__bottom' data-value={prev2} />
                  <span className='card__back' data-value={prev2}>
                      <span className='card__bottom' data-value={part2} />
                  </span>
              </span>
          </span>
        </span>
      </div>
    </>
  );
}

export default Timer;