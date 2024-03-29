import React, { useState, useEffect, useContext } from "react";
import { organizeUsers } from "../shared/utils";
import { BLUE_CARD, RED_CARD } from "../../constants";
import Modal from "../shared/Modal";
import { GameContext } from "../../context/GameContext";

function GameInfoModal(props) {
  const style = {
    container: {
      width: 600,
      height: 500,
      backgroundColor: "white",
      zIndex: 1,
      position: "absolute",
      top: "5%",
      textAlign: "center",
      borderRadius: "1em",
      boxShadow: "5px 15px 20px #686963",
    },
    teamContainer: {
      width: 550,
      height: 450,
      top: "5%",
      display: "grid",
      gridGap: "10px",
      gridTemplateColumns: "1fr 1fr 1fr",
      margin: "10px",
    },
    columns: {
      margin: "2px",
      height: "auto",
      width: "auto",
    },
  };
  const [redTeam, setRedTeam] = useState([]);
  const [blueTeam, setBlueTeam] = useState([]);
  const { gameData, updateGameData } = useContext(GameContext);

  useEffect(() => {
    const { redTeam, blueTeam } = organizeUsers(gameData.users);
    setRedTeam(redTeam);
    setBlueTeam(blueTeam);
  }, [gameData.users]);

  const blueTeamColumn = () => {
    return blueTeam.map((user) => {
      return (
        <div
          style={{ color: BLUE_CARD, marginTop: "5px", marginBottom: "10px" }}
        >
          {user.userID}
        </div>
      );
    });
  };

  const redTeamColumn = () => {
    return redTeam.map((user) => {
      return (
        <div
          style={{ color: RED_CARD, marginTop: "5px", marginBottom: "10px" }}
        >
          {user.userID}
        </div>
      );
    });
  };

  //Currently the score is hard coded, so we need to update that with the total game score stored in the database
  return (
    <Modal title={`Your Current Room: ${gameData.roomId}`}>
      <div>
        <div className="redTeam" style={style.columns}>
          <div
            style={{
              position: "relative",
              top: "35%",
              fontSize: "30px",
              fontWeight: "880",
              alignItems: "center",
            }}
          >
            <h1>
              {props.gameScore[0]} - {props.gameScore[1]}
            </h1>
          </div>
          <h2 style={{ color: RED_CARD }}>Red Team</h2>
          {redTeamColumn()}
        </div>
        <div className="middleColumn" style={style.columns} />
        <div className="blueTeam" style={style.columns}>
          <h2 style={{ color: BLUE_CARD }}>Blue Team</h2>
          {blueTeamColumn()}
        </div>
      </div>
    </Modal>
  );
}

export default GameInfoModal;
