import React, { useEffect } from "react";

function Timer(props) {
  const [countdown, setCountdown] = React.useState(undefined);

  useEffect(() => {
    if (countdown <= 0) {
      props.handleEndTurn(!props.redTurn);
    } else {
      const timeout = setTimeout(() => {
        setCountdown(Math.floor((props.turnEndTime - Date.now()) / 1000));
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [countdown]);

  useEffect(() => {
    setCountdown(Math.floor((props.turnEndTime - Date.now()) / 1000));
  }, [props.turnEndTime]);

  if (!countdown && countdown !== 0) return null;

  return (
    <>
      <div
        style={{ marginTop: "16px" }}
        className={`flip-countdown theme-light size-medium`}
      >
        <span className="flip-countdown-piece">
          {countdown && countdown == -1 ? 0 : countdown}
        </span>
      </div>
    </>
  );
}

export default Timer;
