"use strict";

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _Rooms = _interopRequireDefault(require("../models/Rooms"));

var _index = _interopRequireDefault(require("../database/index"));

require("regenerator-runtime/runtime.js");

var _utils = require("./utils");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var socketIO = require('socket.io');

var port = process.env.PORT || 3001;
var app = (0, _express["default"])();

var server = _http["default"].Server(app);

var io = socketIO(server);
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../client/build')));
app.options("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});
app.all('*', function (req, res, next) {
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

var colors = ["red", "red", "red", "red", "red", "red", "red", "red", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "white", "white", "white", "white", "white", "white", "white", "white", "black"];
var interval; // app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.get('/words', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var words;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _utils.getWords)();

          case 2:
            words = _context.sent;
            return _context.abrupt("return", res.send(words));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.post('/create-room', function (req, res) {
  return res.status(200).json({
    success: true,
    redirectUrl: "/".concat(req.body.roomName)
  });
});
app.get('/game-stats', function (req, res) {
  _Rooms["default"].findOne({
    roomID: req.roomID
  }, function (err, foundRoom) {
    if (!err) {
      res.send(foundRoom);
    } else {
      console.log(err);
    }
  });
});
io.on('connection', function (socket) {
  socket.on('joinRoom', function (data) {
    console.log('data', data); //data is an object with the roomID and the user that joined the room

    socket.join(data.roomID);

    _Rooms["default"].findOne({
      roomID: data.roomID
    }, function (err, res) {
      if (!res) {
        var newRoom = new _Rooms["default"]({
          roomID: data.roomID,
          totalGameScore: [0, 0],
          users: [{
            userID: data.userID,
            team: null,
            role: null,
            isHost: true
          }]
        });
        if (err) return;
        newRoom.save();
        io["in"](data.roomID).emit('updateTeams', newRoom);
      } else {
        var foundUser = res.users.find(function (user) {
          return user.userID === data.userID;
        });

        if (!foundUser) {
          res.users.push({
            userID: data.userID,
            team: null,
            role: null,
            isHost: false
          });
        }

        if (err) return;
        res.markModified('users');
        res.save();
        io["in"](data.roomID).emit('updateTeams', res);
      }
    });
  });
  socket.on('message', function (data) {
    //gives data as an object {message: what message was sent, roomId: has the given room id}
    socket.nsp["in"](data.roomID).emit('newMessage', data.message);
  });
  socket.on('getWords', function (data) {
    _Rooms["default"].findOneAndUpdate({
      roomID: data.roomID
    }, {
      $set: {
        words: (0, _utils.getWords)()
      }
    }, {
      upsert: true,
      "new": true
    }, function (err, result) {
      if (err) return;
      socket.nsp["in"](data.roomID).emit('sendWords', result);
    });
  });
  socket.on('setRedTeam', function (data) {
    _Rooms["default"].findOne({
      roomID: data.roomID
    }, function (err, res) {
      var foundUser = res.users.find(function (user) {
        return user.userID === data.userID;
      });
      foundUser.team = 'RED';
      foundUser.role = null;

      if (res.blueSpy == data.userID) {
        res.blueSpy = null;
      }

      res.markModified('users', 'blueSpy');
      res.save();
      socket.nsp["in"](data.roomID).emit('updateTeams', res);
    });
  });
  socket.on('setBlueTeam', function (data) {
    _Rooms["default"].findOne({
      roomID: data.roomID
    }, function (err, res) {
      var foundUser = res.users.find(function (user) {
        return user.userID === data.userID;
      });
      foundUser.team = 'BLUE';
      foundUser.role = null;

      if (res.redSpy == data.userID) {
        res.redSpy = null;
      }

      res.markModified('users', 'redSpy');
      res.save();
      socket.nsp["in"](data.roomID).emit('updateTeams', res);
    });
  });
  socket.on('claimSpyMaster', function (data) {
    _Rooms["default"].findOne({
      roomID: data.roomID
    }, function (err, res) {
      var foundUser = res.users.find(function (user) {
        return user.userID === data.userID;
      });
      foundUser.role = "MASTER";

      if (foundUser.team === "RED") {
        res.redSpy = foundUser.userID;
      } else if (foundUser.team === "BLUE") {
        res.blueSpy = foundUser.userID;
      }

      res.markModified('users', 'redSpy', 'blueSpy');
      res.save();
      socket.nsp["in"](data.roomID).emit('updateTeams', res);
    });
  });
  socket.on('joinGame', function (data) {
    socket.join(data.roomID);

    _Rooms["default"].findOne({
      roomID: data.roomID
    }, function (err, res) {
      if (err) return;
      socket.nsp["in"](data.roomID).emit('refreshGame', res);
    });
  });
  socket.on('redScoreChange', function (data) {
    _Rooms["default"].findOne({
      roomID: data.roomID
    }, function (err, res) {
      if (err) return;
      res.redScore = data.redScore;

      if (res.redScore === 0) {
        var totalGameScore = res.totalGameScore;
        res.totalGameScore = [totalGameScore[0] + 1, totalGameScore[1]];
        res.gameOver = true;
        res.markModified('totalGameScore', 'gameOver', 'redScore');
        res.save();
        socket.nsp["in"](data.roomID).emit('gameOver', {
          gameScore: res.totalGameScore,
          gameOver: res.gameOver,
          redScore: res.redScore,
          blueScore: res.blueScore
        });
      } else {
        res.markModified('redScore');
        res.save();
        socket.nsp["in"](data.roomID).emit('updateRedScore', {
          redScore: res.redScore
        });
      }
    });
  });
  socket.on('blueScoreChange', function (data) {
    _Rooms["default"].findOne({
      roomID: data.roomID
    }, function (err, res) {
      if (err) return;
      res.blueScore = data.blueScore;

      if (res.blueScore === 0) {
        var totalGameScore = res.totalGameScore;
        res.totalGameScore = [totalGameScore[0], totalGameScore[1] + 1];
        res.gameOver = true;
        res.markModified('totalGameScore', 'gameOver', 'blueScore');
        res.save();
        socket.nsp["in"](data.roomID).emit('gameOver', {
          gameScore: res.totalGameScore,
          gameOver: res.gameOver,
          redScore: res.redScore,
          blueScore: res.blueScore
        });
      } else {
        res.markModified('blueScore');
        res.save();
        socket.nsp["in"](data.roomID).emit('updateBlueScore', {
          blueScore: res.blueScore
        });
      }
    });
  });
  socket.on('flipCard', function (data) {
    _Rooms["default"].findOne({
      roomID: data.roomID
    }, function (err, res) {
      if (err) return;
      res.clicked[data.index] = true;
      res.isRedTurn = data.isRedTurn;
      res.markModified('clicked', 'isRedTurn');
      res.save();
      socket.nsp["in"](data.roomID).emit('updateFlipCard', {
        isRedTurn: res.isRedTurn,
        clicked: res.clicked
      });
    });
  });
  socket.on('updateTurn', function (data) {
    _Rooms["default"].findOne({
      roomID: data.roomID
    }, function (err, res) {
      if (err) return;
      res.isRedTurn = data.redTurn;
      res.markModified('isRedTurn');
      res.save();
      socket.nsp["in"](data.roomID).emit('redTurn', {
        redTurn: res.isRedTurn
      });
    });
  });
  socket.on('bombClicked', function (data) {
    _Rooms["default"].findOne({
      roomID: data.roomID
    }, function (err, res) {
      if (err) return;

      if (data.bombClicked === "RED") {
        res.totalGameScore = [res.totalGameScore[0] + 1, res.totalGameScore[1]];
        res.gameOver = true;
        res.markModified('totalGameScore', 'gameOver');
        res.save();
        socket.nsp["in"](data.roomID).emit('gameOver', {
          gameScore: res.totalGameScore,
          gameOver: res.gameOver
        });
      } else {
        res.totalGameScore = [res.totalGameScore[0], res.totalGameScore[1] + 1];
        res.gameOver = true;
        res.markModified('totalGameScore', 'gameOver', 'blueScore');
        res.save();
        socket.nsp["in"](data.roomID).emit('gameOver', {
          gameScore: res.totalGameScore,
          gameOver: res.gameOver
        });
      }
    });
  });
  socket.on('hostStartGame', function (data) {
    var colorSorted = colors.sort(function () {
      return Math.random() - 0.5;
    });
    var words = (0, _utils.getWords)();
    var clicked = new Array(25).fill(false);

    _Rooms["default"].findOneAndUpdate({
      roomID: data.roomID
    }, {
      $set: {
        colors: colorSorted,
        words: words,
        clicked: clicked,
        isRedTurn: true,
        redScore: 8,
        blueScore: 8,
        gameOver: false
      }
    }, {
      upsert: true,
      "new": true
    }, function (err, res) {
      if (err) return;
      socket.nsp["in"](data.roomID).emit('startGame', res);
    });
  });
  socket.on("disconnect", function () {
    clearInterval(interval);
  });
}); // Handle React routing, return all requests to React app

app.get('/*', function (req, res) {
  res.sendFile(_path["default"].join(__dirname, '../client/build', 'index.html'));
});
server.listen(port, function () {
  return console.log("Example app listening on port ".concat(port, "!"));
});