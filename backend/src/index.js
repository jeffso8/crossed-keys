import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import cors from 'cors';

const port = process.env.PORT || 3001;

let app = express();
app.use(cors());


let server = http.createServer(app);
let io = socketIO(server, {
  cors: true,
  origins:['http://127.0.0.1:3000'],
});
let interval;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on("connection", (socket) => {
  socket.join('room');
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  io.to('room').emit("FromAPI", response);
};

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);