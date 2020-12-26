import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';
import Rooms from '../models/Rooms';
import database from '../database/index';
import "regenerator-runtime/runtime.js";
import {getWords, newUser} from './utils';

const port = process.env.PORT || 3001;

let app = express();
app.use(cors());
app.use(express.json());

app.options("/*", function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

/*
 roomMap: {
  roomID: {
    spymasterHints: String[],
    colors: String[],
    words: String[],
    clicked: Boolean[],
    isRedTurn: Boolean,
    totalGameScore: [int, int],
    redScore: int
    blueScore: int,
    redSpy: String,
    blueSpy: String,
    users: {
      userID[]: {
        team: String,
        role: String,
        isHost: Boolean,
      }
    }
  }
 }
*/
let roomMap = {};

const colors = ["red", "red", "red", "red", "red", "red", "red", "red", "blue", "blue", "blue", "blue",
"blue", "blue", "blue", "blue", "white", "white", "white", "white", "white", "white", "white", "white", "black"];

const clicked = new Array(25).fill(false);

let server = http.createServer(app);

let io = socketIO(server, {
  cors: true,
  origins:['http://127.0.0.1:3000'],
});
let interval;


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/words', async (req, res) => {
  const words = await getWords();
  return res.send(words);
});

app.post('/create-room', (req, res) => {
  return res.status(200).json({
    success: true,
    redirectUrl: `/${req.body.roomName}`
  });
});

io.on('connection', (socket) => {
  socket.on('joinRoom', (data) => {
    //data is an object with the roomID and the user that joined the room
    socket.join(data.roomID);
    Rooms.findOne({roomID: data.roomID}, function(err, res) {
      if (!res) {
        const newRoom = new Rooms(
          {
            roomID: data.roomID,
            users: [{
              userID: data.userID,
              team: null,
              role: null,
              isHost: true
            }]
          }
        )
        newRoom.save();
        io.in(data.roomID).emit('updateTeams', newRoom);
      }
      const foundUser = res.users.find(user => user.userID === data.userID);
      if (!foundUser) {
      res.users.push({
        userID: data.userID,
        team: null,
        role: null,
        isHost: false
      })}
      if (err) return;
      res.markModified('users')
      res.save();
      io.in(data.roomID).emit('updateTeams', res);
    });
  });

    // if (!roomMap[data.roomID]) {
    //   // Create new room with new user
    //   roomMap[data.roomID] = {users:
    //     newUser(data.userID, true)
    //   };
    // } else {
    //   // adding new users to the room
    //   let users = roomMap[data.roomID]['users'];
    //   if (!users[data.userID]) {
    //     const newUserObj = newUser(data.userID);
    //     let updatedUsers = {
    //       ...users,
    //       ...newUserObj,
    //     };
    //     roomMap[data.roomID]['users'] = updatedUsers;
    //   }
    // }
    // io.in(data.roomID).emit('updateTeams', roomMap[data.roomID]);

  socket.on('message', (data) => {
    //gives data as an object {message: what message was sent, roomId: has the given room id}
    socket.nsp.in(data.roomID).emit('newMessage', data.message);
  });

  socket.on('getWords', (data) => {
    Rooms.findOneAndUpdate({roomID: data.roomID}, {$set : {words: getWords()}}, {upsert: true, new: true}, function(err, result) {
      if (err) return;
      socket.nsp.in(data.roomID).emit('sendWords', result);
      })
    // if (!roomMap[data.roomID].words) {
    //   roomMap[data.roomID].words = getWords();
    // };
    // socket.nsp.in(data.roomID).emit('sendWords', roomMap[data.roomID].words);
  });

  socket.on('setRedTeam', (data) => {
    Rooms.findOne({roomID: data.roomID}, function(err, res) {
      const foundUser = res.users.find(user => user.userID === data.userID);
      foundUser.team = 'RED';
      foundUser.role = null;
      if (res.blueSpy == data.userID) {
        res.blueSpy = null;
      }
      res.markModified('users', 'blueSpy');
      res.save();
      socket.nsp.in(data.roomID).emit('updateTeams', res);
    })
  });

  socket.on('setBlueTeam', (data) => {
    Rooms.findOne({roomID: data.roomID}, function(err, res) {
      const foundUser = res.users.find(user => user.userID === data.userID);
      foundUser.team = 'BLUE';
      foundUser.role = null;
      if (res.redSpy == data.userID) {
        res.redSpy = null;
      }
      res.markModified('users', 'redSpy');
      res.save();
      socket.nsp.in(data.roomID).emit('updateTeams', res);
    })
  });

  socket.on('claimSpyMaster', (data) => {
    roomMap[data.roomID]['users'][data.userID]["role"] = "MASTER";
    if (roomMap[data.roomID]['users'][data.userID]["team"] === "RED") {
      roomMap[data.roomID]["redSpy"] = data.userID;
    } else if (roomMap[data.roomID]['users'][data.userID]["team"] === "BLUE"){
      roomMap[data.roomID]["blueSpy"] = data.userID;
    }
    socket.nsp.in(data.roomID).emit('updateTeams', roomMap[data.roomID]);
  });

  socket.on('joinGame', (data) => {
    socket.join(data.roomID);
     socket.nsp.in(data.roomID).emit('refreshGame',
      {
        isRedTurn: roomMap[data.roomID]['isRedTurn'],
        roomID: data.roomID,
        users: roomMap[data.roomID]['users'],
        clicked: roomMap[data.roomID]['clicked'],
        colors: roomMap[data.roomID]['colors'],
        words: roomMap[data.roomID]['words'],
        redSpy: roomMap[data.roomID]['redSpy'],
        blueSpy: roomMap[data.roomID]['blueSpy']
      });
  });

  socket.on('redScoreChange', (data) => {
    socket.nsp.in(data.roomID).emit('updateRedScore', {redScore: data.gameScore})
  });

  socket.on('blueScoreChange', (data) => {
    socket.nsp.in(data.roomID).emit('updateBlueScore', {blueScore: data.gameScore})
  });

  socket.on('flipCard', (data) => {
    roomMap[data.roomID]['clicked'][data.index] = true;
    roomMap[data.roomID]['isRedTurn'] = data.isRedTurn;
    socket.nsp.in(data.roomID).emit('updateFlipCard', {isRedTurn: roomMap[data.roomID]['isRedTurn'], clicked: roomMap[data.roomID]['clicked']})
  });

  socket.on('hostStartGame', async (data) => {
    const colorSorted = colors.sort(() => Math.random() - 0.5);
    const words = await getWords();
    const clicked = new Array(25).fill(false);

    roomMap[data.roomID]['clicked'] = clicked;
    roomMap[data.roomID]['isRedTurn'] = true;
    roomMap[data.roomID]['colors'] = colorSorted;
    roomMap[data.roomID]['words'] = words;

    socket.nsp.in(data.roomID).emit('startGame',
      {
        isRedTurn: roomMap[data.roomID]['isRedTurn'],
        roomID: data.roomID,
        users: roomMap[data.roomID]['users'],
        clicked: roomMap[data.roomID]['clicked'],
        colors: roomMap[data.roomID]['colors'],
        words: roomMap[data.roomID]['words'],
        redSpy: roomMap[data.roomID]['redSpy'],
        blueSpy: roomMap[data.roomID]['blueSpy']
      });
  });

  socket.on("disconnect", () => {
    clearInterval(interval);
  });
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);