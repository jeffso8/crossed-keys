import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';

const port = process.env.PORT || 3001;

let app = express();
app.use(cors());
app.use(express.json());


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

io.on('connection', (socket) => {
  socket.on('joinRoom', (data) => {
    socket.join(data.roomID);
    io.in(data.roomID).emit('newUser', data.userID);
  });

  socket.on('message', (data) => {
    socket.nsp.in(data.roomID).emit('newMessage', data.message);
  });

  socket.on("disconnect", () => {
    clearInterval(interval);
  });
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);