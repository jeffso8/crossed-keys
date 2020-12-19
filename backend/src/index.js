import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';

const port = process.env.PORT || 3001;

let app = express();
app.use(cors());
app.use(express.json());

let roomMap = new Map();

let server = http.createServer(app);

let io = socketIO(server, {
  cors: true,
  origins:['http://127.0.0.1:3000'],
});
let interval;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/create-room', (req, res) => {
  return res.status(200).json({
    success: true,
    redirectUrl: `/${req.body.roomName}`
  });
});

app.post('/start-game', (req, res) => {
  return res.status(200).json({
    success: true,
    redirectUrl: `/${req.body.roomID}/game`
  });
});

io.on('connection', (socket) => {
  socket.on('joinRoom', (data) => {
    //data is an object with the roomID and the user that joined the room
    socket.join(data.roomID);
    if (!roomMap.has(data.roomID)) {
      roomMap.set(data.roomID, [(data.userID, socket.id)]);
    } else {
      console.log('SOCKET CLIENT', io.in(data.roomID).allSockets());
      let users = roomMap.get(data.roomID);
      users.push(data.userID, socket.id);
      console.log(users);
      roomMap.set(data.roomID, users)
    }
    io.in(data.roomID).emit('newUser', roomMap.get(data.roomID));
  });

  socket.on('message', (data) => {
    //gives data as an object {message: what message was sent, roomId: has the given room id}
    socket.nsp.in(data.roomID).emit('newMessage', data.message);
    console.log('data', data.roomID);
    console.log(io.sockets.adapter.clients);
  });

  socket.on("disconnect", () => {
    clearInterval(interval);
  });
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);