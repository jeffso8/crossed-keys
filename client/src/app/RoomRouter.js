import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Room from "../component/Room/index";
import { useCookies } from "react-cookie";
import JoinRoom from "../component/JoinRoom";
function RoomRouter(props) {
  const [cookies, _] = useCookies(["room"]);

  if (!cookies.room) {
    return (
      <Redirect
        to={{
          pathname: `/join/${props.match.params.roomID}`,
          state: {
            roomID: props.match.params.roomID,
          },
        }}
      />
    );
  }
  return <Route path="/room/:roomID" component={Room} />;
}

export default RoomRouter;
