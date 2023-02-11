import React, { useContext, useState, useEffect } from "react";
import Timer from "./Timer";
import ScoreBanner from "./ScoreBanner";
import { GameContext } from "../../context/GameContext";

export default function GameHeader(props) {
  const { gameData } = useContext(GameContext);
  const { blueScore, redScore, isRedTurn, turnEndTime } = gameData;
  const { user } = props;
  return (
    <div style={{ position: "relative" }}>
      <ScoreBanner isRedTeam={true} score={redScore} />
      <div style={{ textAlign: "center" }}>
        {turnEndTime && <Timer turnEndTime={turnEndTime} redTurn={isRedTurn} />}
        <div
          style={{
            marginTop: "10px",
            fontSize: "26px",
          }}
        >
          {isRedTurn ? "Red's Turn" : "Blue's Turn"}
        </div>
        <div style={{ fontFamily: "Clearface" }}>
          {(isRedTurn && user.team === "RED") ||
          (isRedTurn && user.team === "BLUE")
            ? "(aka your turn)"
            : null}
        </div>
      </div>
      <ScoreBanner isRedTeam={false} score={blueScore} />
    </div>
  );
}
