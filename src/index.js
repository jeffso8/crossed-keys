import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import Rooms from '../models/Rooms';
import ErrorLog from '../models/ErrorLog';
import database from '../database/index';
import "regenerator-runtime/runtime.js";
import {getWords, logErrors, newUser} from './utils';
import path from 'path';
import sslRedirect from 'heroku-ssl-redirect';

const socketIO = require('socket.io');
const port = process.env.PORT || 3001;

let app = express();
let server = http.Server(app);
let io = socketIO(server);


  app.use((req, res, next) => {   
     if (process.env.NODE_ENV === 'production') {

    console.log('req header', req.header('x-forwarded-proto'));
    console.log('req.header(host)', req.header('host'));
    console.log(req.header('x-forwarded-proto'));

    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`)
    } else {
      next();
    }
     } else {
       next();
     }
  })
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

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
console.log('process.env.NODE_ENV', process.env.NODE_ENV);


// enable ssl redirect
app.use(sslRedirect());

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

const colors = ["red", "red", "red", "red", "red", "red", "red", "red", "blue", "blue", "blue", "blue",
"blue", "blue", "blue", "blue", "white", "white", "white", "white", "white", "white", "white", "white", "black"];

// let interval;

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

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

app.get('/game-stats', function(req,res){
  Rooms.findOne({roomID: req.roomID}, function(err, foundRoom) {
    if (!err) {
      res.send(foundRoom);
    } else {
      console.log(err);
    }
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
            totalGameScore: [0,0],
            users: [{
              userID: data.userID,
              team: null,
              role: null,
              isHost: true,
              socketId: socket.id
            }]
          });
        if (err){
          return;
        };
        newRoom.save();
        io.in(data.roomID).emit('updateTeams', newRoom);
      } else {
      const foundUser = res.users.find(user => user.userID === data.userID);
      if (!foundUser) {
      res.users.push({
        userID: data.userID,
        team: null,
        role: null,
        isHost: false,
        socketId: socket.id
      })};
      if (err) {
        logErrors(err);
        return;
      }
      res.markModified('users');
      res.save();
      io.in(data.roomID).emit('updateTeams', res);
    }
    });
  });

  socket.on('newHint', (data) => {
    Rooms.findOneAndUpdate({roomID: data.roomID}, {$addToSet: {hints: {hint: data.hint, hintCount: data.hintCount}}}, {upsert: true, new: true}, function(err, res) {
      if (err) return;
      socket.nsp.in(data.roomID).emit('sendHint', res);
    //gives data as an object {message: what message was sent, roomId: has the given room id}
    });
  });

  socket.on('getWords', (data) => {
    Rooms.findOneAndUpdate({roomID: data.roomID}, {$set : {words: getWords()}}, {upsert: true, new: true}, function(err, result) {
      if (err) return;
      socket.nsp.in(data.roomID).emit('sendWords', result);
      })
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
    });
  });

  socket.on('claimSpyMaster', (data) => {
    Rooms.findOne({roomID: data.roomID}, function(err, res) {
      const foundUser = res.users.find(user => user.userID === data.userID);
      const prevUser = res.users.find(user => user.role === "MASTER");
      if (prevUser) {
        prevUser.role = null;
      }
      foundUser.role = "MASTER";
      if (foundUser.team === "RED") {
        res.redSpy = foundUser.userID;
      } else if (foundUser.team === "BLUE") {
        res.blueSpy = foundUser.userID;
      }
      res.markModified('users', 'redSpy', 'blueSpy');
      res.save();
      socket.nsp.in(data.roomID).emit('updateTeams', res);
    });
  });

  socket.on('joinGame', (data) => {
    socket.join(data.roomID);
    socket.userID = data.user.userID;
    socket.roomID = data.roomID;
    Rooms.findOneAndUpdate({roomID: data.roomID, 'users.userID': data.user.userID}, {$set : {'users.$.socketId': socket.id}}, {upsert: true, new: true},  function(err, res) {
      if (err) return;
      socket.nsp.in(data.roomID).emit('refreshGame', res);
    })
  });

  socket.on('redScoreChange', (data) => {
    Rooms.findOne({roomID: data.roomID}, function(err, res) {
      if (err) return;
        res.redScore = data.redScore;
        res.markModified('redScore');
        res.save();
        socket.nsp.in(data.roomID).emit('updateRedScore', {redScore: res.redScore});
      }
    );
  });

  socket.on('blueScoreChange', (data) => {
    Rooms.findOne({roomID: data.roomID}, function(err, res) {
      if (err) return;
      res.blueScore =  data.blueScore;
      res.markModified('blueScore');
      res.save();
      socket.nsp.in(data.roomID).emit('updateBlueScore', {blueScore: res.blueScore});
      }
    );
  });

  socket.on('flipCard', (data) => {
    Rooms.findOne({roomID: data.roomID}, function(err, res) {
      if (err) return;
      res.clicked[data.index] = true;
      res.isRedTurn = data.isRedTurn;
      res.markModified('clicked', 'isRedTurn');
      res.save();
      socket.nsp.in(data.roomID).emit('updateFlipCard', {isRedTurn: res.isRedTurn, clicked: res.clicked});
    });
  });

  socket.on('updateTurn', (data) => {
    Rooms.findOne({roomID: data.roomID}, function(err, res) {
      if (err) return;
      // console.log("redTurn: ", res.isRedTurn);
      res.isRedTurn = data.redTurn;
      res.markModified('isRedTurn');
      res.save();
      socket.nsp.in(data.roomID).emit('redTurn', {redTurn: res.isRedTurn});
    });
  });

  socket.on('startTimer', (data) => {
      if (data.currentTimer) {
        clearInterval(data.currentTimer);
      }
      let time = 20;
      let currentTimer = setInterval(() => {
        const timerID = currentTimer[Symbol.toPrimitive]();
        if (time === 0) {
          Rooms.findOne({roomID: data.roomID},function(err, res) {
          if (err) return;
          res.isRedTurn = (!res.isRedTurn);
          res.markModified('isRedTurn');
          res.save();
          socket.nsp.in(data.roomID).emit('timerDone', {roomID: res.roomID, redTurn: res.isRedTurn, users:res.users});
          });
          clearInterval(timerID);
        } else {
        time--;
        socket.nsp.in(data.roomID).emit('timer', {time:time, currentTimer: timerID});
        }
      }, 1000);
  });

  socket.on('gameOver', (data) => {
    Rooms.findOne({roomID: data.roomID}, function(err, res) {
      if (err) return;
      clearInterval(data.timerID);
      res.totalGameScore = data.gameScore;
      res.gameOver = data.gameOver;
      res.redScore = data.redScore;
      res.blueScore = data.blueScore;
      res.markModified('gameScore', 'gameOver', 'redScore', 'blueScore');
      res.save();
      socket.nsp.in(data.roomID).emit('updateGameOver', res);
    });
  });
  
  socket.on('hostStartGame', (data) => {
    const colorSorted = colors.sort(() => Math.random() - 0.5);
    const words = getWords();
    const clicked = new Array(25).fill(false);
    socket.roomID = data.roomID;
    Rooms.findOneAndUpdate({roomID: data.roomID}, {$set : {colors: colorSorted, words: words, clicked: clicked, isRedTurn: true, redScore: 8, blueScore: 8, gameOver: false, hints:[]}},
      {upsert:true, new:true}, function(err, res) {
        if (err) return;
        socket.nsp.in(data.roomID).emit('startGame', res);
    })
  });
  
  // socket.on('disconnect', () => {
  //   setTimeout(() => {
  //     if (socket.userID && socket.roomID){
  //       Rooms.findOne({roomID: socket.roomID}, function(err, res) {
  //         if (err) return;
  //         const foundUser = res.users.find(user => user.userID === socket.userID);
  //         const foundUserIdx = res.users.indexOf(foundUser);

  //         if(foundUser.socketId === socket.id) {
  //           const users = res.users;
  //           users.splice(foundUserIdx, 1);
  //           res.users = users;
  //           res.markModified('users');
  //           res.save();
  //           if(res && res.users.length === 0) {
  //             console.log('no users left');
  //             Rooms.findOneAndDelete({roomID: socket.roomID}, function(err, res) {
  //               if (err) return;
  //               console.log("Room deleted!");
  //             });
  //           }
  //         }
  //       });
  //     }
  //   }, 5000);
  // });
});

// Handle React routing, return all requests to React app
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });

server.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
);
