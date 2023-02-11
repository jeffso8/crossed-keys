import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import socket from "../../socket";
import User from "./User";
import { organizeUsers } from "../shared/utils";
import { Responsive } from "../shared/responsive";
import Button from "../shared/Button";
import { DataType, UserType } from "../../types";
import {
  MUD_BROWN,
  MAIZE,
  BLUE_CARD,
  RED_CARD,
  RED,
  BLUE,
  GREEN,
} from "../../constants";
import { useCookies } from "react-cookie";
import { GameContext } from "../../context/GameContext";
import Grid from "../shared/Grid";
import { TextButton } from "../shared/TextButton";

type RoomPropType = {
  location: {
    state: {
      data: DataType;
      userID: string;
    };
  };
  match: {
    params: {
      data: DataType;
      userID: string;
      roomID: string;
    };
  };
};

function Room(props: RoomPropType) {
  const emptyUser = {
    userID: "",
    team: "",
    role: "",
    isHost: false,
    socketId: "",
  };
  const { gameData, updateGameData } = useContext(GameContext);
  const { user } = gameData;
  const [roomID, setRoomID] = useState<String>("");
  // const [user, setUser] = useState<UserType>(emptyUser);
  const [redTeam, setRedTeam] = useState<UserType[]>([]);
  const [blueTeam, setBlueTeam] = useState<UserType[]>([]);
  const [nullTeam, setNullTeam] = useState<UserType[]>([]);
  const [roomData, setRoomData] = useState<DataType>();
  const [error, setError] = useState<Boolean>(false);

  const history = useHistory<any>();
  const [_, setCookie] = useCookies();

  const { isMobile } = Responsive();

  const handleSetRedTeamClick = () => {
    socket.emit("setRedTeam", { roomID, userID: props.location.state.userID });
  };

  const handleSetBlueTeamClick = () => {
    socket.emit("setBlueTeam", { roomID, userID: props.location.state.userID });
  };

  const handleClaimSpyMasterClick = () => {
    socket.emit("claimSpyMaster", {
      roomID,
      userID: props.location.state.userID,
    });
  };

  const startGame = () => {
    if (nullTeam.length > 0) {
      setError(true);
    } else {
      console.log("stargtgame");
      socket.emit("hostStartGame", { roomID });
    }
  };

  const webStyle = {
    title: {
      fontSize: 52,
      // letterSpacing: 3,
      color: GREEN,
      width: "100%",
      textAlign: "center" as "center",
      marginTop: 80,
      fontFamily: "Clearface",
    },
    roomName: {
      fontSize: 50,
      fontWeight: 900,
      fontFamily: "Clearface",
      letterSpacing: 2,
    },
    welcome: {
      fontSize: 34,
    },
    to: {
      textAlign: "center" as "center",
      fontSize: 28,
    },
    body: {
      width: "80%",
      margin: "120px auto",
    },
    columnStyle: {
      height: "auto",
    },
    columnTitle: {
      fontSize: 24,
      fontFamily: "Cleanface",
      textAlign: "center" as "center",
      color: BLUE,
    },
    containerStyle: {
      display: "grid",
      gridGap: "25px",
      gridTemplateColumns: "1fr 1fr 1fr",
    },
    teamButton: {
      display: "grid",
      gridGap: "25px",
      marginTop: 100,
      gridTemplateColumns: "1fr 1fr 1fr",
    },
    button: {
      margin: "auto",
      padding: "12px",
      color: MAIZE,
      fontStyle: "italic",
      fontWeight: 400,
    },
  };

  const mobileStyle = {
    title: {
      fontSize: 46,
      letterSpacing: 3,
      fontWeight: 900,
      color: MUD_BROWN,
      width: "100%",
      textAlign: "center" as "center",
      marginTop: 80,
    },
    roomName: {
      fontSize: 38,
    },
    welcome: {
      fontSize: 28,
    },
    body: {
      width: "100%",
      margin: "0 auto",
      paddingTop: 50,
    },
    columnTitle: {
      fontSize: 16,
      fontWeight: 900,
      letterSpacing: 1,
      textAlign: "center" as "center",
    },
    containerStyle: {
      display: "grid",
      width: "100%",
      position: "absolute" as "absolute",
      gridTemplateColumns: "1fr 1fr 1fr",
    },
    columnStyle: {
      height: "auto",
    },
    teamButton: {
      display: "grid",
      gridGap: "8px",
      marginTop: 100,
      gridTemplateColumns: "1fr 1fr 1fr",
    },
    button: {
      margin: "auto",
      padding: "8px",
      color: MAIZE,
      fontSize: 14,
    },
  };

  useEffect(() => {
    setCookie("name", props.location.state.userID, { path: "/" });
    setCookie("room", props.match.params.roomID, { path: "/" });

    setRoomID(props.match.params.roomID);
    socket.emit("joinRoom", {
      roomID: props.match.params.roomID,
      userID: props.location.state.userID,
    });

    socket.on("startGame", (data: DataType) => {
      history.push(`/game/${data.roomID}`, {
        data,
        userID: props.location.state.userID,
      });
    });
    // @ts-ignore
  }, []);

  useEffect(() => {
    socket.on("updateTeams", (data: DataType) => {
      const { redTeam, blueTeam, nullTeam } = organizeUsers(data.users);
      setRedTeam(redTeam);
      setBlueTeam(blueTeam);
      setNullTeam(nullTeam);
      updateGameData({
        user:
          data.users.find(
            (user) => user.userID === props.location.state.userID
          ) || emptyUser,
      });
      // setUser(
      //   data.users.find(
      //     (user) => user.userID === props.location.state.userID
      //   ) || emptyUser
      // );
      setRoomData(data);
    });
  }, []);

  const showClaimSpyMaster = () => {
    if (roomData && user) {
      if (user.team === "RED" && roomData.redSpy) {
        return false;
      } else if (user.team === "BLUE" && roomData.blueSpy) {
        return false;
      }
      return true;
    }
  };

  const style = webStyle;

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      style={{ minHeight: "100%" }}
    >
      <Grid item>
        <div style={style.title}>
          <div style={style.welcome}>Welcome to</div>
          <div style={style.roomName}>The {roomID} Room</div>
        </div>
      </Grid>
      <Grid item container direction="row" justifyContent="space-around">
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <div
            style={{
              ...style.columnTitle,
              color: RED,
              borderBottom: `1px solid ${RED}`,
            }}
          >
            Red Team
          </div>
          <Grid direction="column" justifyContent="flex-start">
            {redTeam.map((user, i) => {
              return (
                <User
                  i={i}
                  name={user.userID}
                  isSpyMaster={
                    roomData ? roomData.redSpy === user.userID : null
                  }
                />
              );
            })}
          </Grid>
          <Grid>
            <TextButton
              text="Join"
              style={{ color: RED, fontSize: 24, fontFamily: "Cleanface" }}
              onClick={handleSetRedTeamClick}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid
            style={{
              width: "70%",
              border: `1px solid #d6cabc`,
            }}
          >
            {nullTeam.map((user, i) => {
              return <User i={i} name={user.userID} />;
            })}
          </Grid>
          {showClaimSpyMaster() ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "16px",
              }}
            ></div>
          ) : null}
          {/* <Button
            style={{
              ...style.button,
              backgroundColor: "BLACK",
              marginTop: "16px",
            }}
            onClick={handleClaimSpyMasterClick}
            text={"CLAIM SPY"}
          /> */}
          <TextButton
            text="Claim Spy"
            style={{ color: "BLACK", fontSize: 24, fontFamily: "Cleanface" }}
            onClick={handleClaimSpyMasterClick}
          />

          {user?.isHost ? (
            <Button
              style={{
                ...style.button,
                margin: "16px 0",
                backgroundColor: "#496F5D",
              }}
              onClick={startGame}
              text={"START GAME"}
            />
          ) : null}
        </Grid>
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <div
            style={{
              ...style.columnTitle,
              color: BLUE,
              borderBottom: `1px solid ${BLUE}`,
            }}
          >
            Blue Team
          </div>
          <Grid direction="column" justifyContent="flex-start">
            {blueTeam.map((user, i) => {
              return (
                <User
                  i={i}
                  name={user.userID}
                  isSpyMaster={
                    roomData ? roomData.blueSpy === user.userID : null
                  }
                />
              );
            })}
          </Grid>
          <Grid>
            <TextButton
              text="Join"
              style={{ color: BLUE, fontSize: 24, fontFamily: "Cleanface" }}
              onClick={handleSetBlueTeamClick}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container justifyContent={"center"} alignItems={"center"}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ backgroundColor: "white" }}>
            {document.location.href}
          </div>
          <Button
            onClick={() => {
              return navigator.clipboard.writeText(document.location.href);
            }}
            text={"Share Room"}
          />
        </div>
        {error && <div>Everyone must be in teams</div>}
      </Grid>
    </Grid>
  );
}

export default Room;
