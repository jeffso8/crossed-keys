import { useState, useEffect } from "react";
import socket from "../../socket";
import { Responsive } from "../shared/responsive";
import { RED_CARD, BLUE_CARD } from "../../constants";
import { DataType, HintsType } from "../../types";

export default function HintDisplay() {
  const [hints, setHints] = useState<HintsType>([]);
  const [redTurn, setRedTurn] = useState<boolean>(true);
  const { isMobile } = Responsive();

  const webStyle = {
    hintDisplay: {
      alignContent: "center" as "center",
      width: 100,
      position: "absolute" as "absolute",
      right: "3.8%",
    },
    title: {
      fontStyle: "italic",
      fontSize: "26px",
      marginBottom: "12px",
    },
  };

  const mobileStyle = {
    hintDisplay: {
      alignContent: "center" as "center",
      width: 100,
    },
    title: {
      fontSize: "24px",
      fontWeight: 700,
      margin: 12,
    },
  };

  const style = isMobile ? mobileStyle : webStyle;
  useEffect(() => {
    socket.on("sendHint", (data: DataType) => {
      setHints(data.hints);
      setRedTurn(data.isRedTurn);
    });
  }, []);

  return (
    <div style={style.hintDisplay}>
      <div style={style.title}>HINTS</div>
      <div style={{ width: 100, position: "absolute", right: "2%" }}>
        {hints.map((hint) => {
          return (
            <div
              style={{
                color: hint.isRedTurn ? RED_CARD : BLUE_CARD,
                marginBottom: "6px",
                right: "20%",
                fontFamily: "Clearface",
              }}
            >
              {hint.hint} for {hint.hintCount}
            </div>
          );
        })}
      </div>
    </div>
  );
}
