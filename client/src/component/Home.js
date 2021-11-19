import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { BEIGE, BROWNISH, MUD_BROWN } from "../constants";
import TextInput from "./shared/TextInput";
import { Responsive } from "./shared/responsive";
import Button from "./shared/Button";

function Home() {
  const style = {
    container: {
      height: "100%",
      backgroundColor: BEIGE,
      display: "flex",
      justifyContent: "center",
    },
    content: {
      width: 650,
      alignSelf: "center",
      textAlign: "center",
    },
    by: {
      color: MUD_BROWN,
      fontSize: 20,
      fontWeight: 500,
      textAlign: "center",
      marginBottom: 40,
      letterSpacing: 2,
    },
    title: {
      color: MUD_BROWN,
      fontFamily: "Clearface",
      fontSize: 62,
      fontWeight: 500,
      marginBottom: 20,
      textAlign: "center",
      letterSpacing: 4,
    },
    button: {
      width: 120,
      marginTop: 20,
    },
  };

  const mobileStyle = {
    content: {
      width: "100%",
      alignSelf: "center",
      textAlign: "center",
    },
    title: {
      color: MUD_BROWN,
      fontSize: 48,
      fontWeight: 900,
      marginBottom: 20,
      textAlign: "center",
      letterSpacing: 4,
    },
  };

  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [roomnameError, setRoomNameError] = useState(false);

  const history = useHistory();
  const { isMobile } = Responsive();

  const handleUsernameChange = (event) => {
    if (usernameError) {
      setUsernameError(false);
    }
    setUsername(event.target.value.toUpperCase());
  };
  const handleRoomNameChange = (event) => {
    if (roomnameError) {
      setRoomNameError(false);
    }
    setRoomName(event.target.value.toUpperCase());
  };

  const createRoom = () => {
    if (username === "") {
      setUsernameError(true);
    }

    if (roomName === "") {
      setRoomNameError(true);
    }

    if (roomName && username) {
      //this potentially needs a join room name, gotta figure out when to emit which
      axios.post("/create-room", { username, roomName }).then((res) => {
        history.push(res.data.redirectUrl, { userID: username });
      });
    }
  };

  useEffect(() => {
    fetch("/words").then((res) => {
      res.json().then((data) => {
        setRoomName(data[0] + "-" + data[5]);
      });
    });
  }, []);

  return (
    <div style={style.container}>
      <div
        className="content"
        style={isMobile ? mobileStyle.content : style.content}
      >
        <div style={{ marginBottom: "40px" }}>
          <div style={style.by}>
            <div
              style={{
                marginBottom: "2px",
                fontFamily: "Clearface",
              }}
            >
              A Codename Inspired
            </div>
            <div style={{ fontFamily: "Clearface" }}>Card Game</div>
          </div>
          <div style={isMobile ? mobileStyle.title : style.title}>
            CROSSED KEYS
          </div>
        </div>
        <div>
          <TextInput
            name="username"
            value={username}
            placeholder={"Username"}
            onChange={handleUsernameChange}
            style={isMobile ? { width: "90%" } : {}}
            error={usernameError}
            errorText={"Username can't be empty"}
          />
          <TextInput
            id="roomName"
            name="roomName"
            value={roomName}
            placeholder={"Room Name"}
            onChange={handleRoomNameChange}
            style={isMobile ? { width: "90%" } : {}}
            error={roomnameError}
            errorText={"Room name can't be empty"}
          />
        </div>
        <div>
          <Button style={style.button} onClick={createRoom} text={"SUBMIT"} />
        </div>
      </div>
    </div>
  );
}

export default Home;
