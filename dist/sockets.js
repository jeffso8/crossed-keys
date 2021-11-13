"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadSockets = loadSockets;

var _Rooms = _interopRequireDefault(require("../models/Rooms"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var socketIO = require("socket.io");

function loadSockets(server) {
  var io = socketIO(server);
  var colors = ["red", "red", "red", "red", "red", "red", "red", "red", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "white", "white", "white", "white", "white", "white", "white", "white", "black"];
  io.on("connection", function (socket) {
    socket.on("joinRoom", function (data) {
      //data is an object with the roomID and the user that joined the room
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
              isHost: true,
              socketId: socket.id
            }]
          });

          if (err) {
            return;
          }

          newRoom.save();
          io["in"](data.roomID).emit("updateTeams", newRoom);
        } else {
          var foundUser = res.users.find(function (user) {
            return user.userID === data.userID;
          });

          if (!foundUser) {
            res.users.push({
              userID: data.userID,
              team: null,
              role: null,
              isHost: false,
              socketId: socket.id
            });
          }

          if (err) {
            (0, _utils.logErrors)(err);
            return;
          }

          res.markModified("users");
          res.save();
          io["in"](data.roomID).emit("updateTeams", res);
        }
      });
    });
    socket.on("newHint", function (data) {
      _Rooms["default"].findOneAndUpdate({
        roomID: data.roomID
      }, {
        $addToSet: {
          hints: {
            hint: data.hint,
            hintCount: data.hintCount
          }
        }
      }, {
        upsert: true,
        "new": true
      }, function (err, res) {
        if (err) return;
        socket.nsp["in"](data.roomID).emit("sendHint", res);
      });
    });
    socket.on("setRedTeam", function (data) {
      _Rooms["default"].findOne({
        roomID: data.roomID
      }, function (err, res) {
        var foundUser = res.users.find(function (user) {
          return user.userID === data.userID;
        });
        foundUser.team = "RED";
        foundUser.role = null;

        if (res.blueSpy == data.userID) {
          res.blueSpy = null;
        }

        res.markModified("users", "blueSpy");
        res.save();
        socket.nsp["in"](data.roomID).emit("updateTeams", res);
      });
    });
    socket.on("setBlueTeam", function (data) {
      _Rooms["default"].findOne({
        roomID: data.roomID
      }, function (err, res) {
        var foundUser = res.users.find(function (user) {
          return user.userID === data.userID;
        });
        foundUser.team = "BLUE";
        foundUser.role = null;

        if (res.redSpy == data.userID) {
          res.redSpy = null;
        }

        res.markModified("users", "redSpy");
        res.save();
        socket.nsp["in"](data.roomID).emit("updateTeams", res);
      });
    });
    socket.on("claimSpyMaster", function (data) {
      _Rooms["default"].findOne({
        roomID: data.roomID
      }, function (err, res) {
        var foundUser = res.users.find(function (user) {
          return user.userID === data.userID;
        });
        var prevUser = res.users.find(function (user) {
          return user.role === "MASTER";
        });

        if (prevUser) {
          prevUser.role = null;
        }

        foundUser.role = "MASTER";

        if (foundUser.team === "RED") {
          res.redSpy = foundUser.userID;
        } else if (foundUser.team === "BLUE") {
          res.blueSpy = foundUser.userID;
        }

        res.markModified("users", "redSpy", "blueSpy");
        res.save();
        socket.nsp["in"](data.roomID).emit("updateTeams", res);
      });
    });
    socket.on("joinGame", function (data) {
      socket.join(data.roomID); // socket.userID = data.user.userID;
      // socket.roomID = data.roomID;

      _Rooms["default"].findOneAndUpdate({
        roomID: data.roomID,
        "users.userID": data.user.userID
      }, {
        $set: {
          "users.$.socketId": socket.id
        }
      }, {
        upsert: true,
        "new": true
      }, function (err, res) {
        if (err) return;
        socket.nsp["in"](data.roomID).emit("refreshGame", res);
      });
    });
    socket.on("redScoreChange", function (data) {
      _Rooms["default"].findOne({
        roomID: data.roomID
      }, function (err, res) {
        if (err) return;
        res.redScore = data.redScore;
        res.markModified("redScore");
        res.save();
        socket.nsp["in"](data.roomID).emit("updateRedScore", {
          redScore: res.redScore
        });
      });
    });
    socket.on("blueScoreChange", function (data) {
      _Rooms["default"].findOne({
        roomID: data.roomID
      }, function (err, res) {
        if (err) return;
        res.blueScore = data.blueScore;
        res.markModified("blueScore");
        res.save();
        socket.nsp["in"](data.roomID).emit("updateBlueScore", {
          blueScore: res.blueScore
        });
      });
    });
    socket.on("updateTurn", function (data) {
      _Rooms["default"].findOne({
        roomID: data.roomID
      }, function (err, res) {
        if (err) return;
        res.isRedTurn = data.redTurn;
        res.turnEndTime = new Date().getTime() + 10000 + 1000;
        res.markModified("isRedTurn", "turnEndTime");
        res.save();
        socket.nsp["in"](data.roomID).emit("redTurn", {
          redTurn: res.isRedTurn,
          turnEndTime: res.turnEndTime
        });
      });
    });
    socket.on("gameOver", function (data) {
      _Rooms["default"].findOne({
        roomID: data.roomID
      }, function (err, res) {
        if (err) return;
        clearInterval(data.timerID);
        res.totalGameScore = data.gameScore;
        res.gameOver = data.gameOver;
        res.redScore = data.redScore;
        res.blueScore = data.blueScore;
        res.markModified("gameScore", "gameOver", "redScore", "blueScore");
        res.save();
        socket.nsp["in"](data.roomID).emit("updateGameOver", res);
      });
    });
    socket.on("hostStartGame", function (data) {
      var colorSorted = colors.sort(function () {
        return Math.random() - 0.5;
      });
      var words = (0, _utils.getWords)();
      var clicked = new Array(25).fill(false);
      socket.roomID = data.roomID;

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
          gameOver: false,
          hints: [],
          turnEndTime: new Date().getTime() + 10000 + 1000
        }
      }, {
        upsert: true,
        "new": true
      }, function (err, res) {
        if (err) return;
        socket.nsp["in"](data.roomID).emit("startGame", res);
      });
    });
    socket.on("flipCard", function (data) {
      _Rooms["default"].findOne({
        roomID: data.roomID
      }, function (err, res) {
        if (err) return;
        res.clicked[data.index] = true;
        res.isRedTurn = data.isRedTurn;
        res.markModified("clicked", "isRedTurn");
        res.save();
        socket.nsp["in"](data.roomID).emit("updateFlipCard", {
          isRedTurn: res.isRedTurn,
          clicked: res.clicked
        });
      });
    });
    socket.on("getWords", function (data) {
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
        socket.nsp["in"](data.roomID).emit("sendWords", result);
      });
    });
  });
}