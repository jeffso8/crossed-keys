import React, { useState, useEffect, useRef } from 'react';
import socket from '../../socket';
import './Timer.scss';
import moment from 'moment';


function Timer(props) {
    const [completed, setCompleted] = useState(false);
    const clock = {
        second: {
            title: 'Second',
            value: useState(0),
            prevValue: useState(0),
            ref: useRef(null)
        }
    };
    const {endAt} = props;
    console.log('endat', endAt);
    let interval = null;
    let prev = moment.duration(moment().diff(moment()));

    useEffect(() => {
        processClock();
        interval = setInterval(() => {
            processClock();
        }, 1000);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [endAt]);
    const processClock = () => {
        const then = moment(endAt);
        let value = moment.duration(then.diff(moment()));
        console.log('value', value.seconds());
        console.log('prev', prev.seconds());
        
        if (value.milliseconds() < 0) {
            setCompleted(true);
            clearInterval(interval);
            return;
        }

            clock.second.value[1](value.seconds());
            clock.second.prevValue[1](prev.seconds());
            if (
                parseInt(value.seconds() / 10) !==
                    parseInt(prev.seconds() / 10) &&
                clock.second.ref.current
            ) {
                const section = clock.second.ref.current.querySelector(
                    '.flip-countdown-card-sec.one'
                );
                section.classList.remove('flip');
                void section.offsetWidth;
                section.classList.add('flip');
            }

            if (
                parseInt(value.seconds() % 10) !==
                    parseInt(prev.seconds() % 10) &&
                clock.second.ref.current
            ) {
                const section = clock.second.ref.current.querySelector(
                    '.flip-countdown-card-sec.two'
                );
                section.classList.remove('flip');
                void section.offsetWidth;
                section.classList.add('flip');
            }

        prev = value;
    };

    const data = clock['second'];
    const [value] = data.value;
    const [prevValue] = data.prevValue;
    const part1 = parseInt(value / 10);
    const part2 = parseInt(value % 10);
    let prev1 = parseInt(prevValue / 10);
    let prev2 = parseInt(prevValue % 10);

  return(
    <>
      <div className={`flip-countdown theme-light size-medium`}>
        <span className='flip-countdown-piece' ref={data.ref}>
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
    // <div>
    //   <h1>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
    // </div>
  );
}

export default Timer;