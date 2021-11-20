import Timer from "./Timer";
import ScoreBanner from "./ScoreBanner";

export default function GameHeader(props) {
  const { redScore, blueScore, turnEndTime, handleEndTurn, redTurn, user } =
    props;
  return (
    <div style={{ height: "100%" }}>
      <ScoreBanner isRedTeam={true} score={redScore} />
      <div style={{ textAlign: "center" }}>
        {turnEndTime && (
          <Timer
            turnEndTime={turnEndTime}
            handleEndTurn={handleEndTurn}
            redTurn={redTurn}
          />
        )}
        <div
          style={{
            marginTop: "10px",
            fontSize: "26px",
          }}
        >
          {redTurn ? "Red's Turn" : "Blue's Turn"}
        </div>
        <div style={{ fontFamily: "Clearface" }}>
          {(redTurn && user.team === "RED") || (redTurn && user.team === "BLUE")
            ? "(aka your turn)"
            : null}
        </div>
      </div>
      <ScoreBanner isRedTeam={false} score={blueScore} />
    </div>
  );
}
